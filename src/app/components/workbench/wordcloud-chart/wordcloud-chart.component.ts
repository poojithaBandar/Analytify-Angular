import {
  AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges
} from '@angular/core';

import * as echarts from 'echarts';
import 'echarts-wordcloud'; // registers the series

// Minimal local type for the wordcloud series (covers fields you use)
type MyWordCloudSeries = {
  type: 'wordCloud';
  shape?: string;
  sizeRange?: [number, number];
  rotationRange?: [number, number];
  gridSize?: number;
  textStyle?: { color?: string | ((...args: any[]) => string) };
  data: { name: string; value: number }[];
};

type MyOption = {
  tooltip?: Record<string, unknown>;
  series: MyWordCloudSeries[];
};

@Component({
  selector: 'app-wordcloud-chart',
  standalone: true,
  templateUrl: './wordcloud-chart.component.html',
  styleUrl: './wordcloud-chart.component.scss'
})
export class WordcloudChartComponent implements AfterViewInit, OnChanges {
  @Input() chartsColumnData: any[] = [];
  @Input() chartsRowData: any[] = [];
  @Input() customOptions: any = {};

  private chartInstance?: echarts.ECharts;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initChart();
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartsColumnData'] || changes['chartsRowData'] || changes['customOptions']) {
      this.renderChart();
    }
  }

  private initChart(): void {
    const container: HTMLDivElement | null =
      this.el.nativeElement.querySelector('.wordcloud-container');

    if (container) {
      // Force canvas to avoid getImageData errors
      this.chartInstance = echarts.init(container, undefined, { renderer: 'canvas' });
    }
  }

  private renderChart(): void {
    if (!this.chartInstance) return;
  
    // Helpers to normalize inputs (accept arrays or "a,b,c" strings)
    const toStrArray = (input: any): string[] =>
      Array.isArray(input) ? input.map(String)
      : typeof input === 'string' ? input.split(',').map(s => s.trim()).filter(Boolean)
      : [];
  
    const toNumArray = (input: any): number[] =>
      Array.isArray(input) ? input.map(v => Number(v))
      : typeof input === 'string' ? input.split(',').map(s => Number(s.trim()))
      : [];
  
    // Categories + values
    const names  = toStrArray(this.chartsColumnData);  // e.g., ['furniture','mobile']
    const values = toNumArray(this.chartsRowData);     // e.g., [2000, 5000]
  
    // Zip -> [{name, value}]
    const len = Math.min(names.length, values.length);
    let seriesData = Array.from({ length: len }).map((_, i) => ({
      name: names[i],
      value: values[i]
    }))
    // keep valid, positive numbers only
    .filter(d => d.name && Number.isFinite(d.value) && d.value > 0);
  
    // (Optional) sort by value desc or limit top N
    if (this.customOptions?.sortByValueDesc) {
      seriesData = seriesData.sort((a, b) => b.value - a.value);
    }
    if (Number.isFinite(this.customOptions?.maxWords)) {
      seriesData = seriesData.slice(0, Number(this.customOptions.maxWords));
    }
  
    // (Optional) compress big ranges for nicer sizing
    // const maxV = Math.max(...seriesData.map(d => d.value));
    // seriesData = seriesData.map(d => ({ ...d, value: Math.log1p(d.value) }));
  
    // Safe numeric fallbacks
    const sizeRange: [number, number] =
      Array.isArray(this.customOptions?.fontSizeRange) &&
      this.customOptions.fontSizeRange.length === 2
        ? [Number(this.customOptions.fontSizeRange[0]) || 12,
           Number(this.customOptions.fontSizeRange[1]) || 60]
        : [12, 60];
  
    const rotationRange: [number, number] =
      Array.isArray(this.customOptions?.rotationRange) &&
      this.customOptions.rotationRange.length === 2
        ? [Number(this.customOptions.rotationRange[0]) || -90,
           Number(this.customOptions.rotationRange[1]) || 90]
        : [-90, 90];
  
    const gridSize = Number(this.customOptions?.gridSize) || 8;
  
    const colorOpt = this.customOptions?.color;
    const color =
      typeof colorOpt === 'function' ? colorOpt
      : (typeof colorOpt === 'string' && colorOpt) ? colorOpt
      : (() => {
          const pal = ['#91c7ae','#749f83','#ca8622','#bda29a','#6e7074','#546570','#c4ccd3'];
          return pal[Math.floor(Math.random()*pal.length)];
        });
  
    const option: any = {
      tooltip: {},
      series: [{
        type: 'wordCloud',
        shape:  'circle',
        sizeRange,
        rotationRange,
        gridSize,
        textStyle: { color },
        data: seriesData
      }]
    };
  
    this.chartInstance.setOption(option, true);
  }
  

  @HostListener('window:resize')
  onResize(): void {
    this.chartInstance?.resize();
  }
}
