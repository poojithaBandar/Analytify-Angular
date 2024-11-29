import { ChangeDetectorRef, Component, ElementRef, input, Input, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import * as echarts from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedModule } from '../../../shared/sharedmodule';
import _ from 'lodash';
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';
interface Dimension {
  name: string;
  values: string[];
}
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
  @Input() chartType!:string;
  @Input() dualAxisColumnData:any;
  @Input() dualAxisRowData:any;
  @Input() donutSize:any;
  @Input() radarRowData:any;
  @Input() displayUnits:any;
  @Input() decimalPlaces:any;

  @Input() backgroundColor:any
  @Input() xlabelAlignment:any;
  @Input() xGridColor:any;
  @Input() xGridSwitch:any;
  @Input() xLabelColor:any;
  @Input() xLabelSwitch:any;
  @Input() xLabelFontFamily:any;
  @Input() xLabelFontSize:any;
  @Input() xlabelFontWeight:any;
  @Input() yLabelColor:any;
  @Input() yLabelSwitch:any;
  @Input() yGridColor:any;
  @Input() yGridSwitch:any;
  @Input() color:any;
  @Input() dataLabels:any;
  @Input() legendSwitch:any
  @Input() ylabelFontWeight:any;
  @Input() yLabelFontSize:any;
  @Input() yLabelFontFamily:any;
  @Input() dataLabelsFontSize:any;
  @Input() dataLabelsFontFamily:any;
  @Input() dataLabelsColor:any;
  @Input() barColor:any;
  @Input() lineColor:any;
  @Input() measureColor:any;
  @Input() dimensionColor:any;
  @Input() legendsAllignment:any
  
  width: string = '100%'; // Width of the chart
  height: string = '400px'; // Height of the chart
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  private chartInstance!: echarts.ECharts;
  // @ViewChild('NgxEchartsDirective', { static: true }) chartDirective!: NgxEchartsDirective; 
   
  series: any[] = [];
  chartOptions: any = {};
  constructor(private cdr: ChangeDetectorRef){}

 
  // ngAfterViewInit() {
  //   this.chartInstance = echarts.init(this.chartContainer.nativeElement);
  //   this.updateChart();
  // }

  ngAfterViewInit(): void {
    this.initChart(); // Initialize the chart after the view is loaded
    this.cdr.detectChanges();

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
      backgroundColor: this.backgroundColor,
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      toolbox: {
        feature: {
          magicType: { show: true, type: ['line'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      tooltip: {
        trigger: 'axis',
      },
      axisPointer: {
        type: 'none'
      },
      dataZoom: [
        {
          show: this.isZoom,
          type: 'slider'
        },

      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '13%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: this.chartsColumnData,
        nameLocation:this.xlabelAlignment,
        splitLine: {
          lineStyle: {
            color: this.xGridColor
          }, show: this.xGridSwitch
        },
        axisLine: {
          lineStyle: {
            color: this.xLabelColor,
          },
        },
        axisLabel: {
          show: this.xLabelSwitch,
          fontFamily: this.xLabelFontFamily,
          fontSize: this.xLabelFontSize,
          fontWeight: this.xlabelFontWeight,
          color:this.dimensionColor,
          // align: this.xlabelAlignment,// Hide xAxis labels
          interval: 0, // Show all labels
          padding: [10, 0, 10, 0],
          formatter: function(value:any) {
            return value.length > 5 ? value.substring(0, 5) + '...' : value; // Truncate long labels
        }
        }
      },
      toggleGridLines: true,
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: this.yLabelColor
          },
          show:this.yGridSwitch
        },
        axisLabel: {
          show: this.yLabelSwitch,
          fontFamily: this.yLabelFontFamily,
          fontSize: this.yLabelFontSize,
          fontWeight: this.ylabelFontWeight,
          color:this.measureColor,
          rotate:0,
          formatter: function(value:any) {
            return value.length > 5 ? value.substring(0, 2) + '...' : value; // Truncate long labels
        }
        },
        splitLine: {
          lineStyle: {
            color: this.yGridColor
          },
          show: this.yGridSwitch
        }
      },
      // itemStyle: {borderWidth : '50px' },
      series: [
        {
          itemStyle: {
            borderRadius: 5
          },
          label: { show: true,
            position: 'center',
            fontFamily:this.dataLabelsFontFamily
           },
          type: 'bar',
          barWidth: '80%',
          data: this.chartsRowData
          // data: this.chartsRowData.map((value: any, index: number) => ({
          //   value,
          //   itemStyle: { borderWidth: '50px' }
          // })),
        },
      ],
      color: this.color

    };
}
flattenDimensions(dimensions: Dimension[]): string[] {
  const numCategories = Math.max(...dimensions.map(dim => dim.values.length));
  return Array.from({ length: numCategories }, (_, index) => {
    return dimensions.map(dim => dim.values[index] === null ? 'null' : dim.values[index] || '').join(',');
  });
}
funnelchart(){
  const dimensions: Dimension[] = this.dualAxisColumnData;
    const categories = this.flattenDimensions(dimensions);
  const combinedArray: any[] = [];
  this.dualAxisColumnData.forEach((item: any) => {
    this.dualAxisRowData.forEach((categoryObj: any) => {
      item.values.forEach((value: any, index: number) => {
        combinedArray.push({
          name: value,
          value: categoryObj.data[index]
        });
      });
    });
  });
  this.chartOptions = {
    color:[this.color],
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: '',
        type: 'funnel',
        data: combinedArray,
        label: {
          show: true,
          fontFamily:this.dataLabelsFontFamily,
          fontSize:this.dataLabelsFontSize,
          formatter: '{b}: {c}', // {b} - name, {c} - primary value (default is sales here)
        },
      },
    ],
  };
}
stackedChart(){
  const dimensions: Dimension[] = this.dualAxisColumnData;
  const categories = this.flattenDimensions(dimensions);
  let yaxisOptions = _.cloneDeep(this.dualAxisRowData);
  yaxisOptions.forEach((bar : any)=>{
bar["type"]="bar";
bar["stack"]="total";
  });
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    toolbox: {
      feature: {
        magicType: { show: true, type: ['line'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    tooltip: {
      trigger: 'axis',
    },
    axisPointer: {
      type: 'none'
    },
    dataZoom: [
      {
        show: this.isZoom,
        type: 'slider'
      },

    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      containLabel: true,
    },
    yAxis: {
      type: 'value',
     
      splitLine: {
        lineStyle: {
          color: this.xGridColor
        }, show: this.xGridSwitch
      },
      axisLine: {
        lineStyle: {
          color: this.xLabelColor,
        },
      },
      axisLabel: {
        show: this.xLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
        align: this.xlabelAlignment// Hide xAxis labels
      }
    },
    toggleGridLines: true,
    xAxis: {
      type: 'category',
      data: categories,
      nameLocation:this.xlabelAlignment,
      axisLine: {
        lineStyle: {
          color: this.yLabelColor
        }
      },
      axisLabel: {
        show: this.yLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
      },
      splitLine: {
        lineStyle: {
          color: this.yGridColor
        },
        show: this.yGridSwitch
      }
    },
    series: yaxisOptions.map((series:any) => ({
      ...series,
      label: {
          show:true, // Enable data labels
          position:'inside', // Position of the labels (e.g., 'top', 'inside', etc.)
          formatter:'{c}', // Customize the label format (e.g., '{c}' for value)
          color:'#000', // Customize label color (default black)
          fontSize:12, // Customize label font size
          fontWeight:'bold', // Customize label font weight
          fontFamily:'Helvetica, Arial, sans-serif' // Use custom font family if needed
      }
  })),        

  };
}
sidebySide(){
  const dimensions: Dimension[] = this.dualAxisColumnData;
  const categories = this.flattenDimensions(dimensions);
  let yaxisOptions = _.cloneDeep(this.dualAxisRowData);
  yaxisOptions.forEach((bar : any)=>{
  bar["type"]="bar";
  });
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    toolbox: {
      feature: {
        magicType: { show: true, type: ['line'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    tooltip: {
      trigger: 'axis',
    },
    axisPointer: {
      type: 'none'
    },
    dataZoom: [
      {
        show: this.isZoom,
        type: 'slider'
      },

    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      containLabel: true,
    },
    yAxis: {
      type: 'value',
     
      splitLine: {
        lineStyle: {
          color: this.xGridColor
        }, 
        show: this.xGridSwitch
      },
      axisLine: {
        lineStyle: {
          color: this.xLabelColor,
        },
      },
      axisLabel: {
        show: this.xLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
        align: this.xlabelAlignment// Hide xAxis labels
      }
    },
    toggleGridLines: true,
    xAxis: {
      type: 'category',
      data: categories,
      nameLocation:this.xlabelAlignment,
      axisLine: {
        lineStyle: {
          color: this.yLabelColor
        }
      },
      axisLabel: {
        show: this.yLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
        color:this.dimensionColor
      },
      splitLine: {
        lineStyle: {
          color: this.yGridColor
        },
        show: this.yGridSwitch
      }
    },
    series: yaxisOptions.map((series: any) => ({
      ...series,
      label: {
          show: true, // Enable data labels
          position: 'top', // Position of the labels (e.g., 'top', 'inside', etc.)
          formatter: '{c}', // Customize the label format (e.g., '{c}' for value)
          color: '#000', // Customize label color
          fontSize: 12, // Customize label font size
          fontWeight: 'bold', // Customize label font weight
          fontFamily: 'Helvetica, Arial, sans-serif' // Use custom font family if needed
      }
  })),
    color:this.color

  };
}
hgroupedChart(){
  const dimensions: Dimension[] = this.dualAxisColumnData;
  const categories = this.flattenDimensions(dimensions);
  let yaxisOptions = _.cloneDeep(this.dualAxisRowData);
  yaxisOptions.forEach((bar : any)=>{
  bar["type"]="bar";
  });
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    toolbox: {
      feature: {
        magicType: { show: true, type: ['line'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    tooltip: {
      trigger: 'axis',
    },
    axisPointer: {
      type: 'none'
    },
    dataZoom: [
      {
        show: this.isZoom,
        type: 'slider'
      },

    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
     
      splitLine: {
        lineStyle: {
          color: this.xGridColor
        }, show: this.xGridSwitch
      },
      axisLine: {
        lineStyle: {
          color: this.xLabelColor,
        },
      },
      axisLabel: {
        show: this.xLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
        align: this.xlabelAlignment// Hide xAxis labels
      }
    },
    toggleGridLines: true,
    yAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        lineStyle: {
          color: this.yLabelColor
        }
      },
      axisLabel: {
        show: this.yLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
      },
      splitLine: {
        lineStyle: {
          color: this.yGridColor
        },
        show: this.yGridSwitch
      }
    },
    series:yaxisOptions.map((series:any) => ({
      ...series,
      label:{
          show:true, // Enable data labels
          position:'right', // Position of the labels (e.g., 'top', 'inside', etc.)
          formatter:'{c}', // Display the value of the bar
          color:'#000', // Default label color (can be updated)
          fontSize:this.xLabelFontSize, // Default label font size
          fontWeight:'bold', // Default label font weight
          fontFamily:this.xLabelFontFamily // Default label font family
      }
  })),

  };
}
hstackedChart(){
  const dimensions: Dimension[] = this.dualAxisColumnData;
  const categories = this.flattenDimensions(dimensions);
  let yaxisOptions = _.cloneDeep(this.dualAxisRowData);
  yaxisOptions.forEach((bar : any)=>{
  bar["type"]="bar";
  bar["stack"]="total";
  });
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    toolbox: {
      feature: {
        magicType: { show: true, type: ['line'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    tooltip: {
      trigger: 'axis',
    },
    axisPointer: {
      type: 'none'
    },
    dataZoom: [
      {
        show: this.isZoom,
        type: 'slider'
      },

    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
     
      splitLine: {
        lineStyle: {
          color: this.xGridColor
        }, show: this.xGridSwitch
      },
      axisLine: {
        lineStyle: {
          color: this.xLabelColor,
        },
      },
      axisLabel: {
        show: this.xLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
        align: this.xlabelAlignment// Hide xAxis labels
      }
    },
    toggleGridLines: true,
    yAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        lineStyle: {
          color: this.yLabelColor
        }
      },
      axisLabel: {
        show: this.yLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
      },
      splitLine: {
        lineStyle: {
          color: this.yGridColor
        },
        show: this.yGridSwitch
      }
    },
    series:yaxisOptions.map((series:any) => ({
      ...series,
      label:{
          show:true, // Enable data labels
          position:'right', // Position of the labels (e.g., 'top', 'inside', etc.)
          formatter:'{c}', // Display the value of the bar
          color:'#000', // Default label color (can be updated)
          fontSize:this.xLabelFontSize, // Default label font size
          fontWeight:'bold', // Default label font weight
          fontFamily:this.xLabelFontFamily // Default label font family
      }
  })),
    

  };
  console.log('Categories:', categories);
console.log('Y Axis Options:', yaxisOptions);
}
areaChart(){
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    toolbox: {
      feature: {
        magicType: { show: true, type: ['line'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    tooltip: {
      trigger: 'axis',
    },
    axisPointer: {
      type: 'none'
    },
    dataZoom: [
      {
        show: this.isZoom,
        type: 'slider'
      },

    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: this.chartsColumnData,
      nameLocation:this.xlabelAlignment,
      splitLine: {
        lineStyle: {
          color: this.xGridColor
        }, show: this.xGridSwitch
      },
      axisLine: {
        lineStyle: {
          color: this.xLabelColor,
        },
      },
      axisLabel: {
        show: this.xLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
        align: this.xlabelAlignment// Hide xAxis labels
      }
    },
    toggleGridLines: true,
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: this.yLabelColor
        }
      },
      axisLabel: {
        show: this.yLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
      },
      splitLine: {
        lineStyle: {
          color: this.yGridColor
        },
        show: this.yGridSwitch
      }
    },
    series: [
      {
        label: { show: true },
        type: 'line',
        data: this.chartsRowData,
        areaStyle: {}
      },
    ],
    color: this.color

  };
console.log(this.chartsRowData,this.chartsColumnData,'areachart')

}
lineChart(){
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    toolbox: {
      feature: {
        magicType: { show: true, type: ['line'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    tooltip: {
      trigger: 'axis',
    },
    axisPointer: {
      type: 'none'
    },
    dataZoom: [
      {
        show: this.isZoom,
        type: 'slider'
      },

    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: this.chartsColumnData,
      nameLocation:this.xlabelAlignment,
      splitLine: {
        lineStyle: {
          color: this.xGridColor
        }, show: this.xGridSwitch
      },
      axisLine: {
        lineStyle: {
          color: this.xLabelColor,
        },
      },
      axisLabel: {
        show: this.xLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
        align: this.xlabelAlignment// Hide xAxis labels
      }
    },
    toggleGridLines: true,
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: this.yLabelColor
        }
      },
      axisLabel: {
        show: this.yLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
      },
      splitLine: {
        lineStyle: {
          color: this.yGridColor
        },
        show: this.yGridSwitch
      }
    },
    series: [
      {
        label: { show: true },
        type: 'line',
        data: this.chartsRowData
      },
    ],
    color: this.color

  };
}
pieChart(){
  let combinedArray = this.chartsRowData.map((value : any, index :number) => ({
    value: value,
    name: this.chartsColumnData[index]
  }));
  // let legendObject = this.setEchartLegendAlignment();
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      type:'scroll',
      show: this.legendSwitch 
      },
          label: {
      show : this.dataLabels,
      formatter: '{b}: {d}%',
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: combinedArray,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: this.dataLabels, // Dynamically show or hide data labels            }
      }
    }
    ]
  };
}
donutChart(){
  let combinedArray = this.chartsRowData.map((value : any, index :number) => ({
    value: value,
    name: this.chartsColumnData[index]
  }));
  // let legendObject = this.setEchartLegendAlignment();
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      type:'scroll',
      show: this.legendSwitch // Control legend visibility
  },            
  label: {
      show : this.dataLabels,
      formatter: '{b}: {d}%',
    },
    series: [
      {
        type: 'pie',
        radius: [this.donutSize+'%' , '70%'],
        data: combinedArray,
        avoidLabelOverlap: true,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: this.dataLabels, // Dynamically show or hide data labels            }
      }
      }
    ]
  };
}
barLineChart(){
  const dimensions: Dimension[] = this.dualAxisColumnData;
  const categories = this.flattenDimensions(dimensions);
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }, label: {
          backgroundColor: '#283b56'
        }
      }
    },
    dataZoom: {
      show: true,
      start: 0,
      end: 100
    },
    toolbox: {
      feature: {
        magicType: { show: true, type: ['bar', 'line'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      show:true
    },
    xAxis: [
      {
        type: 'category',
        data: categories,
        axisPointer: {
          type: 'shadow'
        },
        axisLabel: {
          color: this.xLabelColor, // Customize label color
          fontSize: this.xLabelFontSize, // Customize font size
          fontFamily: this.xLabelFontFamily, // Customize font family
          fontWeight: 'bold', // Customize font weight
          formatter(value:any) {
              return value.length > 5 ? value.substring(0, 5) + '...' : value; // Truncate long labels
          }
      },
      splitLine: {
        lineStyle: {
            color: this.xGridColor || '#cccccc' // Default x-axis grid line color
        },
        show: this.xGridSwitch // Toggle visibility based on user input
    }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Bar Axis',
        position: 'left',
        axisLabel: {
          color: '#333', // Customize label color
          fontSize: 12, // Customize font size
          position: 'right',
          fontFamily: 'Arial, sans-serif', // Customize font family
          fontWeight: 'bold', // Customize font weight
          formatter(value:any) {
              return value; // Customize label format (e.g., add units)
          }
      },
      splitLine: {
        lineStyle: {
            color: this.yGridColor || '#cccccc' // Default x-axis grid line color
        },
        show: this.yGridSwitch // Toggle visibility based on user input
    }
      },
      {
        type: 'value',
        name: 'Line Axis',
        position: 'right',
        axisLabel: {
          color: '#333', // Customize label color
          fontSize: 12, // Customize font size
          position: 'left',
          fontFamily: 'Arial, sans-serif', // Customize font family
          fontWeight: 'bold', // Customize font weight
          formatter(value:any) {
              return value ; // Customize label format (e.g., add units)
          }
      },
      splitLine: {
        lineStyle: {
            color: this.yGridColor || '#cccccc' // Default x-axis grid line color
        },
        show: this.yGridSwitch // Toggle visibility based on user input
    }
      }
    ],
    series: [
      {
        name: this.dualAxisRowData[0]?.name,
        type: 'bar',
        data: this.dualAxisRowData[0]?.data,
        itemStyle:{
          color:this.barColor // Default bar color
      },
        label:{
          show:true,
        }
      },

      {
        name: this.dualAxisRowData[1]?.name,
        type: 'line',
        // xAxisIndex: 1,
        yAxisIndex: 1,
        // tooltip: {
        //   valueFormatter: function (value) {
        //     return value + ' °C';
        //   }
        // },
        lineStyle: {
          color: this.lineColor
        },
        data: this.dualAxisRowData[1]?.data,
        label:{
          show:true,
        }
      }
    ]
  };
}
multiLineChart(){
  const dimensions: Dimension[] = this.dualAxisColumnData;
  const categories = this.flattenDimensions(dimensions);
  let yaxisOptions = _.cloneDeep(this.dualAxisRowData);
  yaxisOptions.forEach((bar : any)=>{
  bar["type"]="line";
  bar["stack"]="Total";
  });
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    toolbox: {
      feature: {
        magicType: { show: true, type: ['bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    tooltip: {
      trigger: 'axis',
    },
    axisPointer: {
      type: 'none'
    },
    dataZoom: [
      {
        show: this.isZoom,
        type: 'slider'
      },

    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
     
      splitLine: {
        lineStyle: {
          color: this.xGridColor
        }, show: this.xGridSwitch
      },
      axisLine: {
        lineStyle: {
          color: this.xLabelColor,
        },
      },
      axisLabel: {
        show: this.xLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
        align: this.xlabelAlignment// Hide xAxis labels
      }
    },
    toggleGridLines: true,
    yAxis: {
      type:'value',
      axisLine: {
        lineStyle: {
          color: this.yLabelColor
        }
      },
      axisLabel: {
        show: this.yLabelSwitch,
        fontFamily: this.xLabelFontFamily,
        fontSize: this.xLabelFontSize,
        fontWeight: this.xlabelFontWeight,
      },
      splitLine: {
        lineStyle: {
          color: this.yGridColor
        },
        show: this.yGridSwitch
      }
    },
    series:yaxisOptions.map((series:any) => ({
      ...series,
      label:{
          show:true, // Enable data labels
          position:'right', // Position of the labels (e.g., 'top', 'inside', etc.)
          formatter:'{c}', // Display the value of the bar
          color:'#000', // Default label color (can be updated)
          fontSize:this.xLabelFontSize, // Default label font size
          fontWeight:'bold', // Default label font weight
          fontFamily:this.xLabelFontFamily // Default label font family
      }
  })),
  };
}
radarChart(){
  const dimensions: Dimension[] = this.dualAxisColumnData;
  const categories = this.flattenDimensions(dimensions);
  let radarArray = categories.map((value: any, index: number) => ({
    name: categories[index]
  }));
  let legendArray = this.radarRowData.map((data: any) => ({
    name: data.name
  }));
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    tooltip: { trigger: "item" },
    legend: {
      data: legendArray,
      show:this.legendSwitch,
      // orient: 'vertical',
      // left: 'center', 
      // bottom: '5%', 
    },
    radar: {
      axisName: {
        color: this.xLabelColor
      },
      axisLabel : {
        color : this.xLabelColor
      },
      // shape: 'circle',
      indicator:
        radarArray

    },
  //   label: {
  //     show: this.dataLabels, // Dynamically show or hide data labels            }
  // },
  series:[
    {
        type:'radar',
        data:this.radarRowData.map((dataItem: any) => ({
            ...dataItem,
            label:{
                show:this.dataLabels,
                fontFamily:this.dataLabelsFontFamily,
                formatter:'{c}',
                color:'#000', // Default label color
                fontSize:12, // Default label font size
                // fontFamily:'Arial' // Default label font family
            }
        }))
    }
]
  }
}
heatMapChart(){
  const dimensions: Dimension[] = this.dualAxisColumnData;
  const categories = this.flattenDimensions(dimensions);
  this.chartOptions = {
    backgroundColor: this.backgroundColor,
    tooltip: {
        position: 'top'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
            show: this.xLabelSwitch,
            interval: 0,
            rotate: 45,
            textStyle: {
                color: this.xLabelColor,
                fontSize: this.xLabelFontSize,
                fontFamily: this.xLabelFontFamily,
                fontWeight: this.xlabelFontWeight,
            }
        }
    },
    yAxis: {
        type: 'category',
        data: this.dualAxisRowData.map((row: { name: any; }) => row.name), // Adjust as necessary
        axisLabel: {
            show: this.yLabelSwitch,
            textStyle: {
                color:this.yLabelColor,
                fontSize : this.yLabelFontSize,
                fontFamily : this.yLabelFontFamily,
                fontWeight : this.ylabelFontWeight
            }
        }
    },
    visualMap: {
        min : 0,
        max : this.getMaxValue(this.dualAxisRowData),
        calculable : true,
        orient : 'horizontal',
        left : 'center',
        // bottom : '15%',
        top: '5%',
        inRange : {
            color : ['#ffffff', '#ff0000'] // Adjust colors as needed
        }
    },
    series : [{
      name : this.dualAxisRowData,
      type : 'heatmap',
      data : this.prepareHeatmapData(this.dualAxisRowData), // Prepare your data accordingly
      label : {
          show : true,
          // formatter : (params: { value: number[]; }) => this.formatNumber(params.value[2]) // Assuming value[2] holds the number to format
      },
      emphasis : {
          itemStyle : {
              shadowBlur : 10,
              shadowColor : '#333'
          }
      }
  }],
  dataZoom: [
    {
      show: this.isZoom,
      type: 'slider'
    },

  ],
};
}
calendarChart() {
  let calendarData: any[] = [];
  let years: Set<any> = new Set();

  // Populate calendarData and collect years
  this.chartsColumnData.forEach((data: any, index: any) => {
      let arr = [data, this.chartsRowData[index]];
      calendarData.push(arr);

      const year = new Date(data).getFullYear();
      years.add(year);
  });

  const minValue = this.chartsRowData.reduce((a: any, b: any) => (a < b ? a : b), Infinity);
  const maxValue = this.chartsRowData.reduce((a: any, b: any) => (a > b ? a : b), -Infinity);

  // Convert years set to array and sort it in ascending order
  let yearArray = Array.from(years).sort((a: any, b: any) => a - b);

  // Define the height for each calendar
  const calendarHeight = 100;  // Adjust height for better visibility
  const yearGap = 20;  // Reduced gap between years
  const totalHeight = (calendarHeight + yearGap) * yearArray.length;

  // Create multiple calendar instances, one for each year
  let calendars = yearArray.map((year: any, idx: any) => ({
      top: idx === 0 ? 25 : (calendarHeight + yearGap) * idx,
      range: year.toString(),
      cellSize: ['auto', 10],
      splitLine: {
          show: true,
          lineStyle: {
              color: '#000',
              width: 1
          }
      },
      yearLabel: {
          margin: 20
      }
  }));

  // Extract data for each year and assign to different series
  let series = yearArray.map((year: any) => {
      const yearData = calendarData.filter(d => new Date(d[0]).getFullYear() === year);
      return {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: yearArray.indexOf(year),
          data: yearData
      };
  });

  let dataZoomConfig = [
    {
        type: 'slider',
        yAxisIndex: 0,
        start: 0,  // Starting position of the scroll
        end: 100,  // The scroll window size (adjustable)
        orient: 'vertical',  // Allow vertical scrolling
        zoomLock: false,  // Disable zoom lock for flexibility
    }
];

this.chartOptions = {
  tooltip: {
      position: 'top',
      formatter: function (params: any) {
          const date = params.data[0];
          const value = params.data[1];
          return `Date: ${date}<br/>Value: ${value}`;
      }
  },
  visualMap: {
      min: minValue,
      max: maxValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      top: 'bottom'
  },
  calendar: calendars,
  series: series,  // Assign filtered data series to the chart
  grid: {
      height: totalHeight,
      containLabel: true
  },
  dataZoom: dataZoomConfig 
};

  console.log(this.chartOptions,'calender');
}
prepareHeatmapData(rowData: any[]) {
  const heatmapData: any[][] = [];
  rowData.forEach((row, rowIndex) => {
      row.data.forEach((value: null | undefined, colIndex: any) => { // Assuming each row has a `data` array
          if (value !== null && value !== undefined) { // Ensure value is valid
              heatmapData.push([colIndex, rowIndex, value]); // [xIndex, yIndex, value]
          }
      });
  });
  return heatmapData;
}
getMaxValue(rowData:any) {
  let max = Number.NEGATIVE_INFINITY; 
  rowData.forEach((row: { data: any[]; }) => {
      row.data.forEach(value => { 
          if (value !== null && value !== undefined) { 
              max = Math.max(max, value); // Update max if current value is greater
          }
      });
  });
  return max === Number.NEGATIVE_INFINITY ? 0 : max; // Return 0 if no valid values found
}

// formatNumber(value: number): string {
//   let formattedNumber = value+'';

//   // if (this.displayUnits !== 'none') {
//     switch (this.displayUnits) {
//       case 'K':
//         formattedNumber = (value / 1_000).toFixed(this.decimalPlaces) + 'K';
//         break;
//       case 'M':
//         formattedNumber = (value / 1_000_000).toFixed(this.decimalPlaces) + 'M';
//         break;
//       case 'B':
//         formattedNumber = (value / 1_000_000_000).toFixed(this.decimalPlaces) + 'B';
//         break;
//       case 'G':
//         formattedNumber = (value / 1_000_000_000_000).toFixed(this.decimalPlaces) + 'G';
//         break;
//       case 'none':
//         formattedNumber = (value/1).toFixed(this.decimalPlaces);
//         break;
//     }
//   // }
//   this.formattedData.push(this.prefix + formattedNumber + this.suffix);
//   return this.prefix + formattedNumber + this.suffix;
// }

private updateChartOptions(): void {
  if (this.chartInstance) {
    this.chartInstance.setOption(this.chartOptions, true); // Update chart options dynamically
  }
}

ngOnInit(){
  this.chartInitialize()
}
chartInitialize(){
  if(this.chartType ==='bar'){
    this.barChart();
  }else if(this.chartType ==='funnel'){
  this.funnelchart();
  }
  else if(this.chartType ==='stocked'){
    this.stackedChart();
  }
  else if(this.chartType === 'sidebyside'){
    this.sidebySide();
  }
  else if(this.chartType === 'hgrouped'){
    this.hgroupedChart();
  }
  else if(this.chartType === 'hstocked'){
    this.hstackedChart();
  }
  else if(this.chartType === 'area'){
    this.areaChart();
  }
  else if (this.chartType === 'line'){
    this.lineChart();
  }
  else if(this.chartType === 'pie'){
    this.pieChart();
  }
  else if(this.chartType === 'donut'){
    this.donutChart();
  }
  else if(this.chartType === 'barline'){
    this.barLineChart();
  }
  else if(this.chartType === 'multiline'){
    this.multiLineChart();
  }
  else if(this.chartType === 'radar'){
    this.radarChart();
  }
  else if(this.chartType === 'heatmap'){
    this.heatMapChart();
  }
  else if(this.chartType === 'calendar'){
    this.calendarChart();
  }
}
  // }
  resetchartoptions(){
    if (!this.chartInstance) {
      console.warn('Chart instance is not initialized.');
      return;
    }
    else{
      this.chartInitialize();
      // this.chartInstance.setOption(this.chartOptions, true); // Full reset
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes[this.chartType]){
      this.chartInitialize();
    }
    if (changes['chartsRowData'] || changes['chartsColumnData'] || changes['dualAxisColumnData'] || changes['dualAxisRowData'] && this.chartInstance) {
      if(changes['dualAxisRowData'] && changes['dualAxisRowData'].currentValue){
        this.resetchartoptions();
      }
    }
    else if(changes['isZoom']){
      if (this.chartInstance) {
        this.chartInstance.setOption({
          dataZoom: this.isZoom ? [
            {
              type: 'slider',
              show: true
            }] : [{
              type: 'slider',
              show: false
            }
          ]
        }
        );
      }
    }
    else if(changes['xLabelFontFamily']){
      if(this.chartInstance){
        this.xLabelFontFamilySetOptions()
      }
    }
    else if(changes['xLabelFontSize']){
      if(this.chartInstance){
        this.xLabelFontSizeSetOption();
      }
    }
    else if(changes['xlabelFontWeight']){
      if(this.chartInstance){
        this.xlabelFontWeightSetOption();
      }
    }
    else if(changes['xlabelFontWeight']){
      if(this.chartInstance){
        this.xlabelFontWeightSetOption();
      }
    }
    else if(changes['dimensionColor']){
      if(this.chartInstance){
        this.dimensionColorSetOption();
      }
    }
    else if(changes['yLabelFontFamily']){
      if(this.chartInstance){
        this.yLabelFontFamilySetOptions();
      }
    }
    else if(changes['yLabelFontSize']){
      if(this.chartInstance){
        this.yLabelFontSizeSetOptions();
      }
    }
    else if(changes['ylabelFontWeight']){
      if(this.chartInstance){
        this.ylabelFontWeightSetOptions();
      }
    }
    else if(changes['measureColor']){
      if(this.chartInstance){
        this.measureColorSetOptions();
      }
    }
    else if(changes['dataLabelsFontFamily']){
      if(this.chartInstance){
        this.dataLabelsFontFamilySetOptions();
      }
    }
    else if(changes['dataLabelsFontSize']){
      if(this.chartInstance){
        this.dataLabelsFontSizeSetOptions();
      }
    }
    else if(changes['dataLabelsColor']){
      if(this.chartInstance){
        this.dataLabelsColorSetOptions();
      }
    }
    else if(changes['xLabelSwitch']){
      if(this.chartInstance){
        this.xLabelSwitchSetOptions();
      }
    }
    else if(changes['yLabelSwitch']){
      if(this.chartInstance){
        this.yLabelSwitchSetOptions();
      }
    }
    else if(changes['xGridSwitch']){
      if(this.chartInstance){
        this.xGridSwitchSetOptions();
      }
    }
    else if(changes['yGridSwitch']){
      if(this.chartInstance){
        this.yGridSwitchSetOptions();
      }
    }
    else if(changes['legendSwitch']){
      if(this.chartInstance){
        this.legendSwitchSetOptions();
      }
    }
    else if(changes['dataLabels']){
      if(this.chartInstance){
        this.dataLabelsSetOptions();
      }
    }
    else if(changes['color'] || changes['barColor'] || changes['lineColor']){
      if(this.chartInstance){
        this.colorSetOptions();
      }
    }
    else if(changes['xGridColor']){
      if(this.chartInstance){
        this.xGridColorSetOptions();
      }
    }
    else if(changes['yGridColor']){
      if(this.chartInstance){
        this.yGridColorSetOptions();
      }
    }
    else if(changes['backgroundColor']){
      if(this.chartInstance){
        this.backgroundColorSetOptions();
      }
    }
    else if(changes['legendsAllignment']){
      if(this.chartInstance){
        this.legendsAllignmentSetOptions()
      }
    }
  }



  xLabelFontFamilySetOptions(){
    if(this.chartType !== 'heatmap'){
    let obj = {
      xAxis :{
        axisLabel :{
          fontFamily: this.xLabelFontFamily
        }
      }
    }   
    this.chartInstance.setOption(obj);
  }else if(this.chartType ==='heatmap'){
    let obj = {
      xAxis :{
        axisLabel :{
          textStyle:{
            fontFamily: this.xLabelFontFamily
          }
        }
      }
    } 
    this.chartInstance.setOption(obj);
  }

  }
  xLabelFontSizeSetOption(){
    if(this.chartType === 'barline'){
    let obj ={
      xAxis :[{
        axisLabel :{
          fontSize: this.xLabelFontSize
        }
      }]
    }
    this.chartInstance.setOption(obj)
  }
  else if(this,this.chartType === 'heatmap'){
    let obj ={
      xAxis :{
        axisLabel :{
          textStyle:{
          fontSize: this.xLabelFontSize
          }
        }
      }
    }
    this.chartInstance.setOption(obj)
  }
  else{
    let obj ={
      xAxis :{
        axisLabel :{
          fontSize: this.xLabelFontSize
        }
      }
    }
    this.chartInstance.setOption(obj)
  }
  }
  xlabelFontWeightSetOption(){
    if(this.chartType ==='barline'){
    let obj ={
      xAxis :[{
        axisLabel :{
          fontWeight: this.xlabelFontWeight
        }
      }]
    }
    this.chartInstance.setOption(obj)
  }
 else if(this.chartType === 'heatmap'){
    let obj ={
      xAxis :{
        axisLabel :{
          textStyle:{
          fontWeight: this.xlabelFontWeight
          }
        }
      }
    }
    this.chartInstance.setOption(obj)
  }
  else{
    let obj ={
      xAxis :{
        axisLabel :{
          fontWeight: this.xlabelFontWeight
        }
      }
    }
    this.chartInstance.setOption(obj)
  }
  }
  dimensionColorSetOption(){
    if(this.chartType ==='barline'){
      let obj ={
        xAxis :[{
          axisLabel :{
            color: this.dimensionColor
          }
        }]
      }
      this.chartInstance.setOption(obj)
    }
   else if(this.chartType === 'heatmap'){
      let obj ={
        xAxis :{
          axisLabel :{
            textStyle:{
              color: this.dimensionColor
            }
          }
        }
      }
      this.chartInstance.setOption(obj)
    }
    else{
      let obj ={
        xAxis :{
          axisLabel :{
            color: this.dimensionColor
          }
        }
      }
      this.chartInstance.setOption(obj)
    }
  }
  yLabelFontFamilySetOptions(){
    if(this.chartType ==='barline'){
     let obj ={
      yAxis: [
        {
          axisLabel: {
            fontFamily: this.yLabelFontFamily, // Update for 'Bar Axis'
          },
        },
        {
          axisLabel: {
            fontFamily: this.yLabelFontFamily, // Update for 'Bar Axis'
          },
        },
      ],
     }
      this.chartInstance.setOption(obj)
    }
    else if(this.chartType === 'heatmap'){
      let obj ={
        yAxis :{
          axisLabel :{
            textStyle:{
              fontFamily: this.yLabelFontFamily
            }
          }
        }
      }
      this.chartInstance.setOption(obj)
    }
    else{
      let obj ={
        yAxis :{
          axisLabel :{
            fontFamily: this.yLabelFontFamily
          }
        }
      }
      this.chartInstance.setOption(obj)
    }
  }
  yLabelFontSizeSetOptions(){
  if(this.chartType ==='barline'){
     let obj ={
      yAxis: [
        {
          axisLabel: {
            fontSize: this.yLabelFontSize, // Update for 'Bar Axis'
          },
        },
        {
          axisLabel: {
            fontSize: this.yLabelFontSize, // Update for 'Bar Axis'
          },
        },
      ],
     }
      this.chartInstance.setOption(obj)
    }
    else if(this.chartType === 'heatmap'){
      let obj ={
        yAxis :{
          axisLabel :{
            textStyle:{
              fontSize: this.yLabelFontSize
            }
          }
        }
      }
      this.chartInstance.setOption(obj)
    }
    else{
      let obj ={
        yAxis :{
          axisLabel :{
            fontSize: this.yLabelFontSize
          }
        }
      }
      this.chartInstance.setOption(obj)
    }
  }
  ylabelFontWeightSetOptions(){
    if(this.chartType ==='barline'){
      let obj ={
       yAxis: [
         {
           axisLabel: {
            fontWeight: this.ylabelFontWeight, // Update for 'Bar Axis'
           },
         },
         {
           axisLabel: {
            fontWeight: this.ylabelFontWeight, // Update for 'Bar Axis'
           },
         },
       ],
      }
       this.chartInstance.setOption(obj)
     }
     else if(this.chartType === 'heatmap'){
       let obj ={
         yAxis :{
           axisLabel :{
             textStyle:{
              fontWeight: this.ylabelFontWeight
             }
           }
         }
       }
       this.chartInstance.setOption(obj)
     }
     else{
       let obj ={
         yAxis :{
           axisLabel :{
            fontWeight: this.ylabelFontWeight
           }
         }
       }
       this.chartInstance.setOption(obj)
     }
  }
  measureColorSetOptions(){
    if(this.chartType ==='barline'){
      let obj ={
       yAxis: [
         {
           axisLabel: {
             color: this.measureColor, // Update for 'Bar Axis'
           },
         },
         {
           axisLabel: {
             color: this.measureColor, // Update for 'Bar Axis'
           },
         },
       ],
      }
       this.chartInstance.setOption(obj)
     }
     else if(this.chartType === 'heatmap'){
       let obj ={
         yAxis :{
           axisLabel :{
             textStyle:{
               color: this.measureColor
             }
           }
         }
       }
       this.chartInstance.setOption(obj)
     }
     else{
       let obj ={
         yAxis :{
           axisLabel :{
             color: this.measureColor
           }
         }
       }
       this.chartInstance.setOption(obj)
     }
  }
  dataLabelsFontFamilySetOptions(){
    if(this.chartType ==='barline'){
      let obj ={
       series: [
         {
           label: {
            fontFamily: this.dataLabelsFontFamily, // Update for 'Bar Axis'
           },
         },
         {
          label: {
            fontFamily: this.dataLabelsFontFamily,
           },
         },
       ],
      }
       this.chartInstance.setOption(obj)
     }
     else if(this.chartType === 'radar'){
      this.chartOptions.series[0].data.forEach((dataItem: { label: { fontFamily: any; }; }) => {
        if (dataItem.label) { // Ensure label exists before updating
            dataItem.label.fontFamily = this.dataLabelsFontFamily;
        }
    });
       this.chartInstance.setOption(this.chartOptions,true)
     }
     else if(this.chartType === 'multiline' || this.chartType === 'hgrouped' || this.chartType === 'hstocked' || this.chartType === 'stocked' || this.chartType === 'sidebyside'){
      this.chartOptions.series.forEach((series: { label: { fontFamily: any; }; }) => {
        series.label.fontFamily = this.dataLabelsFontFamily; 
    });
    this.chartInstance.setOption(this.chartOptions,true)
     }
     else{
       let obj ={
         series :[
          {
           label :{
            fontFamily: this.dataLabelsFontFamily
           }
         }]
       }
       this.chartInstance.setOption(obj)
     }
  }
  dataLabelsFontSizeSetOptions(){
    if(this.chartType ==='barline'){
      let obj ={
       series: [
         {
           label: {
            fontSize: this.dataLabelsFontSize, // Update for 'Bar Axis'
           },
         },
         {
          label: {
            fontSize: this.dataLabelsFontSize,
           },
         },
       ],
      }
       this.chartInstance.setOption(obj)
     }
     else if(this.chartType === 'radar'){
      this.chartOptions.series[0].data.forEach((dataItem: { label: { fontSize: any; }; }) => {
        if (dataItem.label) { // Ensure label exists before updating
            dataItem.label.fontSize = this.dataLabelsFontSize;
        }
    });
       this.chartInstance.setOption(this.chartOptions,true)
     }
     else if(this.chartType === 'multiline' || this.chartType === 'hgrouped' || this.chartType === 'hstocked' || this.chartType === 'stocked' || this.chartType === 'sidebyside'){
      this.chartOptions.series.forEach((series: { label: { fontSize: any; }; }) => {
        series.label.fontSize = this.dataLabelsFontSize; 
    });
    this.chartInstance.setOption(this.chartOptions,true)
     }
     else{
       let obj ={
         series :[
          {
           label :{
            fontSize: this.dataLabelsFontSize
           }
         }]
       }
       this.chartInstance.setOption(obj)
     }
  }
  dataLabelsColorSetOptions(){
    if(this.chartType ==='barline'){
      let obj ={
       series: [
         {
           label: {
            color: this.dataLabelsColor, // Update for 'Bar Axis'
           },
         },
         {
          label: {
            color: this.dataLabelsColor,
           },
         },
       ],
      }
       this.chartInstance.setOption(obj)
     }
     else if(this.chartType === 'radar'){
      this.chartOptions.series[0].data.forEach((dataItem: { label: { color: string; }; }) => {
        dataItem.label.color = this.dataLabelsColor;
    });
       this.chartInstance.setOption(this.chartOptions,true)
     }
     else if(this.chartType === 'multiline' || this.chartType === 'hgrouped' || this.chartType === 'hstocked' || this.chartType === 'stocked' || this.chartType === 'sidebyside'){
      this.chartOptions.series.forEach((series: { label: { color: any; }; }) => {
        series.label.color = this.dataLabelsColor; 
    });
    this.chartInstance.setOption(this.chartOptions,true)
     }
     else{
       let obj ={
         series :[
          {
           label :{
            color: this.dataLabelsColor
           }
         }]
       }
       this.chartInstance.setOption(obj)
     }
  }
  xLabelSwitchSetOptions(){
    if(this.chartType === 'barline'){
      let obj ={
        xAxis :[{
          axisLabel :{
            show: this.xLabelSwitch
          }
        }]
      }
      this.chartInstance.setOption(obj)
    }
    else{
      let obj ={
        xAxis :{
          axisLabel :{
            show: this.xLabelSwitch
          }
        }
      }
      this.chartInstance.setOption(obj)
  }
  }
  yLabelSwitchSetOptions(){
    if(this.chartType === 'barline'){
      let obj ={
        yAxis :[{

        },
      {
        axisLabel :{
          show: this.yLabelSwitch
        }
      }
    ]
      }
      this.chartInstance.setOption(obj)
    }
    else{
      let obj ={
        yAxis :{
          axisLabel :{
            show: this.yLabelSwitch
          }
        }
      }
      this.chartInstance.setOption(obj)
  }
  }
  xGridSwitchSetOptions(){
    if(this.chartType === 'barline'){
      let obj ={
        xAxis :[{
          splitLine :{
            show: this.xGridSwitch
          }
        },
      {
    
      }
    ]
      }
      this.chartInstance.setOption(obj)
    }
    else{
      let obj ={
        xAxis :{
          splitLine :{
            show: this.xGridSwitch
          }
        }
      }
      this.chartInstance.setOption(obj)
  }
  }
  yGridSwitchSetOptions(){
    if(this.chartType === 'barline'){
      let obj ={
        yAxis :[{
          splitLine :{
            show: this.yGridSwitch
          }
        },
      {
        splitLine :{
          show: this.yGridSwitch
        }
      }
    ]
      }
      this.chartInstance.setOption(obj)
    }
    else{
      let obj ={
        yAxis :{
          splitLine :{
            show: this.yGridSwitch
          }
        }
      }
      this.chartInstance.setOption(obj)
  }
  }
  legendSwitchSetOptions(){
    if(this.chartType === 'donut' || this.chartType === 'pie' || this.chartType === 'radar'){
      let obj ={
        legend :{
            show: this.legendSwitch
        }
      }
      this.chartInstance.setOption(obj)
    }
  }
  dataLabelsSetOptions(){
    if(this.chartType === 'donut' || this.chartType === 'pie'){
      let obj ={
        series :[{
          label:{
            show: this.dataLabels
          }
        }]
      }
      this.chartInstance.setOption(obj)
    }
    else if(this.chartType === 'radar'){
      this.chartOptions.series[0].data.forEach((dataItem: { label: { show: boolean; }; }) => {
        dataItem.label.show = this.dataLabels; // Show or hide labels based on checkbox state
    }); 
    this.chartInstance.setOption(this.chartOptions,true)
    }
  }
  colorSetOptions(){
    if(this.chartType === 'barline'){
      let obj ={
        series :[{
          itemStyle :{
            color: this.barColor
          }
        },
        {
          lineStyle :{
            color: this.lineColor
          }
        }
    ]
      }
      this.chartInstance.setOption(obj)
    }
    else{
      let obj ={
       color:this.color
      }
      this.chartInstance.setOption(obj)
  }
  }
  xGridColorSetOptions(){
    if(this.chartType === 'barline'){
      let obj ={
        xAxis :[{
          splitLine :{
            lineStyle:{
              color: this.xGridColor
            }
          }
        },
        {
         
        }
    ]
      }
      this.chartInstance.setOption(obj)
    }else if(this.chartType === 'hgrouped'){
      let obj ={
        xAxis :[{
          axisLabel :{
            splitLine:{
              lineStyle:{
                color: this.xGridColor
              }
            }
          
          }
        },
    ]
      }
      this.chartInstance.setOption(obj)
    }
    else{
      let obj ={
        xAxis :{
          splitLine :{
            lineStyle:{
              color: this.xGridColor
            }
          }
        },
   
      }
      this.chartInstance.setOption(obj)
  }
  }
  yGridColorSetOptions(){
    if(this.chartType === 'barline'){
      let obj ={
        yAxis :[{
          splitLine :{
            lineStyle:{
              color: this.yGridColor
            }
          }
        },
        {
          splitLine :{
            lineStyle:{
              color: this.yGridColor
            }
          }
        }
    ]
      }
      this.chartInstance.setOption(obj)
    }else if(this.chartType === 'hgrouped'){
      let obj ={
        yAxis :[{
          axisLabel :{
            splitLine:{
              lineStyle:{
                color: this.yGridColor
              }
            }
          
          }
        },
    ]
      }
      this.chartInstance.setOption(obj)
    }
    else{
      let obj ={
        yAxis :{
          splitLine :{
            lineStyle:{
              color: this.yGridColor
            }
          }
        },
   
      }
      this.chartInstance.setOption(obj)
  }
  }
  backgroundColorSetOptions(){
      let obj ={
        backgroundColor:this.backgroundColor
      }
      this.chartInstance.setOption(obj)
  }
  legendsAllignmentSetOptions(){
    if(this.chartType === 'pie' || this.chartType === 'donut'){
    if(this.legendsAllignment === 'top'){
    let obj ={
      legend :{
          top : 'top',
          orient:'horizantal'
      },
    }
    this.chartInstance.setOption(obj)
  }
  else if(this.legendsAllignment === 'bottom'){
    let obj ={
      legend :{
          bottom : 'bottom',
          orient:'horizantal'
      },
    }
    this.chartInstance.setOption(obj)
  }
  else if(this.legendsAllignment === 'left'){
    let obj ={
      legend :{
          left : 'left',
          orient:'vertical'
      },
    }
    this.chartInstance.setOption(obj)
  }
  else if(this.legendsAllignment === 'right'){
    let obj ={
      legend :{
          right : 'right',
          orient:'vertical'
      },
    }
    this.chartInstance.setOption(obj)
  }
  }
  else if(this.chartType === 'radar'){
    if(this.legendsAllignment === 'top'){
      let obj ={
        legend :{
            top : 'top',
        },
      }
      this.chartInstance.setOption(obj)
    }
    else if(this.legendsAllignment === 'bottom'){
      let obj ={
        legend :{
            bottom : 'bottom',
        },
      }
      this.chartInstance.setOption(obj)
    }
    else if(this.legendsAllignment === 'left'){
      let obj ={
        legend :{
            left : 'left',
        },
      }
      this.chartInstance.setOption(obj)
    }
    else if(this.legendsAllignment === 'right'){
      let obj ={
        legend :{
            right : 'right',
        },
      }
      this.chartInstance.setOption(obj)
    }
  }
}
}
