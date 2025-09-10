import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import 'echarts-wordcloud';

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
    const container = this.el.nativeElement.querySelector('.wordcloud-container');
    if (container) {
      this.chartInstance = echarts.init(container);
    }
  }

  private renderChart(): void {
    if (!this.chartInstance) {
      return;
    }
    const data = Array.isArray(this.chartsColumnData) ? [...this.chartsColumnData] : [];
    const maxWords = this.customOptions?.maxWords;
    const seriesData = maxWords ? data.slice(0, maxWords) : data;

    const option: echarts.EChartsOption = {
      series: [{
        type: 'wordCloud',
        shape: this.customOptions?.shape || 'circle',
        sizeRange: this.customOptions?.fontSizeRange || [12, 60],
        rotationRange: this.customOptions?.rotationRange || [-90, 90],
        textStyle: {
          color: this.customOptions?.color || (() => {
            const colors = ['#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
            return colors[Math.floor(Math.random() * colors.length)];
          })
        },
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

