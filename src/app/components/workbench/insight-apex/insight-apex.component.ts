import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedModule } from '../../../shared/sharedmodule';

@Component({
  selector: 'app-insight-apex',
  standalone: true,
  imports: [SharedModule, NgxEchartsModule, NgSelectModule,NgbModule,
    NgApexchartsModule
    ],
  templateUrl: './insight-apex.component.html',
  styleUrl: './insight-apex.component.scss'
})
export class InsightApexComponent {
  @Input() chartsRowData: any; 
  @Input() isZoom: any;
  @Input() chartsColumnData: any;
  @ViewChild('barChart') chartInstance!: ChartComponent;
  series: any[] = [];
  chartOptions: any = {};

  ngOnInit(){
    this.barChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.updateChart();
    }
  }

  updateChart(){
    if (this.chartInstance) {
      this.chartInstance.updateOptions(
        {
          chart: {
            zoom: { enabled: this.isZoom },
          },
        },
        true // Redraw chart immediately
      );
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy(); // Dispose of the chart instance to avoid memory leaks
    }
  }

  barChart(){
      const self = this;
        this.chartOptions = {
          series: [
            {
              name: "",
              data: this.chartsRowData 
            }
          ],
         
          chart: {
           
            type: 'bar',
            height: 320,
           
          },
          title: {
            text: "",
            offsetY: 10,
            align: 'center',
           
          },
          xaxis: {
            categories: this.chartsColumnData.map((category : any)  => category === null ? 'null' : category),
            
          },
          yaxis:{
            show: true,
            labels: {
           
              style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 12,
              },
              
            },
           
          },
          grid: {
            show: true,
            borderColor: '#90A4AE',
            xaxis: {
              lines: {
              
              }
            },
            yaxis: {
              lines: {
                
              }
            },
          },
          plotOptions: {
            bar: {
              dataLabels: {
                hideOverflowingLabels:false,
             
              },
            },
          },
          dataLabels: {
            enabled: true,
            // formatter: this.formatNumber.bind(this),
            offsetY: -20,
            style: {
              fontSize: '12px',
              // colors: [this.color],
            },
          },
          // fill: {
          //   type: 'gradient',
          // },
          // colors: [this.color]
        };
    }
  }
// }

// }
