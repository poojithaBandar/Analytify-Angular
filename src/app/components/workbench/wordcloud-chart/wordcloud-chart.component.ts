import {
  AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild
} from '@angular/core';

import * as echarts from 'echarts';
import 'echarts-wordcloud'; // registers the series
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
  width: string = '400px'; // Width of the chart
  height: string = '400px'; // Height of the chart
  private chartInstance?: echarts.ECharts;
  @Input() isSheetSaveOrUpdate : any;
  chartOptions: any;
  @Output() saveOrUpdateChart = new EventEmitter<object>();
  @ViewChild('wordcloudcontainer', { static: true }) chartContainer!: ElementRef;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initChart();
    if (!(this.customOptions && Object.keys(this.customOptions).length)) {
    this.renderChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartsColumnData'] || changes['chartsRowData']) {
      this.renderChart();
    } else if(changes['customOptions'] && changes['customOptions'].currentValue){
      this.initChart();
      this.setWordCloudOption(changes['customOptions'].currentValue);
    }
    if(this.isSheetSaveOrUpdate){
      let object = {
        chartOptions : this.chartOptions
      }
      this.saveOrUpdateChart.emit(object);
    }
  }

  private initChart(): void {
    if (this.chartContainer?.nativeElement) {
      // Force canvas to avoid getImageData errors
      this.chartInstance = echarts.init(this.chartContainer.nativeElement);
    }
  }
  // }

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
 
    const colorOpt = this.customOptions?.color;
    const color =
      typeof colorOpt === 'function' ? colorOpt
      : (typeof colorOpt === 'string' && colorOpt) ? colorOpt
      : (() => {
          const pal = ['#91c7ae','#749f83','#ca8622','#bda29a','#6e7074','#546570','#c4ccd3'];
          return pal[Math.floor(Math.random()*pal.length)];
        });
  
    const option: any = {
  tooltip: {
    formatter: (p: any) => `${p.name}: ${p.value}` // runtime (lost in JSON)
  },
            series: [{
        type: 'wordCloud',
        shape:  'rectangle',
        textStyle: {
          color,                  
          // fontFamily,             
        },
        data: seriesData
      }]
    };
  
    this.chartOptions = option;
    this.chartInstance.setOption(option, true);
  }

  setWordCloudOption(option: any){
    if (!this.chartInstance) return;
  option.tooltip= {
    formatter: (p: any) => `${p.name}: ${p.value}` // runtime (lost in JSON)
  };
    const rebuildSeriesColor = (s: any) => {
      if (!s || s.type !== 'wordCloud') return;

      // Prefer root-level hint, fallback to textStyle stashes
      const hint = option.__wordColor || {};
      const t = s.textStyle || (s.textStyle = {});

      const mode = hint.mode || t.__mode;
      const pal  = hint.palette || t.__palette ||
                   ['#91c7ae','#749f83','#ca8622','#bda29a','#6e7074','#546570','#c4ccd3'];
      const single = hint.singleColor;

      if (mode === 'single' && typeof single === 'string') {
        t.color = single;   // fixed color
      } else {
        t.color = function () {   // revive palette function
          return pal[Math.floor(Math.random() * pal.length)];
        };
      }
    };

    if (Array.isArray(option.series)) {
      option.series.forEach(rebuildSeriesColor);
    }
    this.chartInstance.setOption(option, true);
  }

}
