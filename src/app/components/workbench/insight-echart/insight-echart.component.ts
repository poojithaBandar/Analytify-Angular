import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import * as echarts from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedModule } from '../../../shared/sharedmodule';

@Component({
  selector: 'app-insight-echart',
  standalone: true,
  imports: [SharedModule, NgxEchartsModule, NgSelectModule,NgbModule,
    NgxEchartsModule
    ],
  templateUrl: './insight-echart.component.html',
  styleUrl: './insight-echart.component.scss'
})
export class InsightEchartComponent {
  @Input() chartsRowData: any; 
  @Input() isZoom: any;
  @Input() chartsColumnData: any;
  width: string = '100%'; // Width of the chart
  height: string = '400px'; // Height of the chart
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  private chartInstance!: echarts.ECharts;
  // @ViewChild('NgxEchartsDirective', { static: true }) chartDirective!: NgxEchartsDirective; 
   
  series: any[] = [];
  chartOptions: any = {};

 
  // ngAfterViewInit() {
  //   this.chartInstance = echarts.init(this.chartContainer.nativeElement);
  //   this.updateChart();
  // }

  ngAfterViewInit(): void {
    this.initChart(); // Initialize the chart after the view is loaded
  }

  private initChart(): void {
    if (this.chartContainer?.nativeElement) {
      // Initialize the ECharts instance
      this.chartInstance = echarts.init(this.chartContainer.nativeElement);

      // Apply initial options
      this.updateChartTest();
    }
    // const container = document.querySelector('.chart-container') as HTMLElement;
    // this.chartInstance = echarts.init(container);
    // this.updateChart();
  }

  updateChartTest(){
    this.chartInstance.setOption(
      this.chartOptions,true);
  }

  updateChart() {
    if (this.chartInstance) {
      let obj = this.isZoom ? [{
        type: 'slider',
        show: true
      }] : [{
        type: 'slider',
        show: false
      }]
      this.chartOptions['dataZoom'] = obj;
      this.chartInstance.setOption(
        this.chartOptions,true);
    }
  }
  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.dispose(); // Dispose of the chart instance to avoid memory leaks
    }
  }

  barChart(){
    this.chartOptions = {
      xAxis: {
        type: 'category', // or 'value' based on your data
        data: this.chartsColumnData// x-axis labels
      },
      yAxis: {
        type: 'value' // Continuous numerical axis
      },
      color: "red",
      series: [
        {
          type: 'bar', // or 'line', etc.
          data: this.chartsRowData
        }
      ]
    }
}

private updateChartOptions(): void {
  if (this.chartInstance) {
    this.chartInstance.setOption(this.chartOptions, true); // Update chart options dynamically
  }
}

ngOnInit(){
  this.barChart();
}
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isZoom'] && this.chartInstance) {
      this.updateChart();
    }
  }
}
