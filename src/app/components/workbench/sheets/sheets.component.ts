import { Component,ViewChild } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/sharedmodule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkbenchService } from '../../workbench/workbench.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import * as d3 from 'd3';
import type { EChartsOption } from 'echarts';
import { NgApexchartsModule,ChartComponent } from 'ng-apexcharts';
import {FormControl} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxColorsModule } from 'ngx-colors';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Font, Alignment, FontFamily, Underline, Subscript, Superscript, RemoveFormat, SelectAll, Heading } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
interface TableRow {
  [key: string]: any;
}
interface Dimension {
  name: string;
  values: string[];
}

@Component({
  selector: 'app-sheets',
  standalone: true,
  imports: [SharedModule,NgSelectModule,NgbModule,FormsModule,ReactiveFormsModule,MatIconModule,NgxColorsModule,
    CdkDropListGroup, CdkDropList,CommonModule, CdkDrag,NgApexchartsModule,MatTabsModule,MatFormFieldModule,MatInputModule,CKEditorModule],
  templateUrl: './sheets.component.html',
  styleUrl: './sheets.component.scss'
})
export class SheetsComponent {
  tableColumnsData = [] as any;
  draggedtables = [] as any;
  draggedColumns = [] as any;
  draggedRows = [] as any;
  dimentions = [] as any;
  measurments = [] as any;
  columnData = [] as any;
  rowData = [] as any;
  tableName: any;
  schemaName: any;
  table_alias: any;
  draggedColumnsData = [] as any;
  draggedRowsData = [] as any;
  tablePreviewColumn = [] as any;
  tablePreviewRow = [] as any;
  tableData: TableRow[] = [];
  displayedColumns: string[] = [];
  chartEnable = true;
  dimensionExpand = false;
  chartSuggestions: any = null;
  errorMessage : any;
  userPrompt: string = '';	
 /* private data = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];*/

  //Bar
  public svg: any;
  public margin = 50;
  public width = 750 - (this.margin * 2);
  public height = 350 - (this.margin * 2);
  //Pie
  public widthPie = 600;
  public heightPie = 300;
  // The radius of the pie chart is half the smallest side
  public radius = Math.min(this.width, this.height) / 2 - this.margin;
  public colors:any;
  public chartsData = [] as any;
  chartsColumnData = [] as any;
  chartsRowData = [] as any;
  public lineChartOptions!: Partial<EChartsOption>;
  chartOptions:any;
  chartOptions1:any;
  sheetNumber: number = 1;
  sheetName = "Sheet 1";
  sheetTitle = "Sheet ";
  sheetTagName = "";
  databaseId:any;
  qrySetId:any;
  chartsEnableDisable = [] as any;
  chartId = 1;
  sheetResponce = [] as any;
  SheetIndex = 0;
  chartOptions2:any;
  chartOptions3:any;
  chartOptions4:any;
  chartOptions6:any;
  chartOptions5:any;
  chartOptions7:any;
  chartOptions8:any;
  chartOptions9:any;
  chartOptions10:any;
  dimetionMeasure = [] as any;
  filterValues:any;
  filterId = [] as any;
  sidebysideBarColumnData = [] as any;
  sidebysideBarRowData = [] as any;
  measureValue:any;
  retriveDataSheet_id: any;
  sheetfilter_querysets_id = null;
  editFilterId: any;
  isValuePresent: any;
  color = '#00a5a2';
  database_name: any;
  sidebysideBarColumnData1 = [] as any;
  filterQuerySetId: any;
  measureValues = [] as any;
  SheetSavePlusEnabled = ['Sheet 1'];
  oldColumn: any;
  newColumn: any;
  selectedTabIndex: any;
  isAllSelected: boolean = false;
  active=1;

  Editor = ClassicEditor;
  editor : boolean = false;
  bandingSwitch: boolean = false; 
  legendSwitch: boolean = false;
  xLabelSwitch: boolean = false;
  yLabelSwitch: boolean = false;
  xGridSwitch: boolean = false; 
  yGridSwitch: boolean = false;
  numberPopup : boolean = false;
  decimalPlaces: number = 2;
  displayUnits: string = 'none';
  prefix: string = '';
  suffix: string = '';

  @ViewChild('barChart') barchart!: ChartComponent;
  @ViewChild('areaChart') areachart!: ChartComponent;
  @ViewChild('lineChart') linechart!: ChartComponent;
  @ViewChild('sidebyside') sidebysideChart!: ChartComponent;
  @ViewChild('stocked') stockedChart!: ChartComponent;
  @ViewChild('barline') barlineChart!: ChartComponent;
  @ViewChild('horizentalstocked') horizontolstockedChart!: ChartComponent;
  @ViewChild('grouped') groupedChart!: ChartComponent;
  @ViewChild('multiline') multilineChart!: ChartComponent;
  @ViewChild('piechart') piechart!: ChartComponent;
  @ViewChild('donutchart') donutchart!: ChartComponent;

  constructor(private workbechService:WorkbenchService,private route:ActivatedRoute,private modalService: NgbModal,private router:Router){   
   
   if(this.router.url.includes('/workbench/sheets/')){
    if (route.snapshot.params['id1'] && route.snapshot.params['id2']&& route.snapshot.params['id3'] ) {
      this.databaseId = +atob(route.snapshot.params['id1']);
      this.qrySetId = +atob(route.snapshot.params['id2']);
      this.filterQuerySetId = atob(route.snapshot.params['id3'])
      if(this.filterQuerySetId==='null'){
        console.log('filterqrysetid',this.filterQuerySetId)
        this.filterQuerySetId = null
      }
      else{
          parseInt(this.filterQuerySetId)
          console.log(this.filterQuerySetId)
        }
      }
   }
   if(this.router.url.includes('/workbench/landingpage/sheets/')){
    console.log("landing page")
    if (route.snapshot.params['id1'] && route.snapshot.params['id2'] && route.snapshot.params['id3']&& route.snapshot.params['id4']) {
      this.databaseId = +atob(route.snapshot.params['id1']);
      this.qrySetId = +atob(route.snapshot.params['id2'])
      this.retriveDataSheet_id = +atob(route.snapshot.params['id3'])
      this.sheetName = atob(route.snapshot.params['id4'])
      console.log(this.retriveDataSheet_id,this.sheetName,'shetname')
      this.tabs[0] = this.sheetName;
      // this.sheetRetrive();
      }
   }
  }

  ngOnInit(): void {
    this.columnsData();
    this.sheetTitle = this.sheetTitle +this.sheetNumber;
    this.getSheetNames();
  }
 getSheetNames(){
  const obj={
    "server_id":this.databaseId,
    "queryset_id":this.qrySetId,
}
  this.workbechService.getSheetNames(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        if(responce.data.length>0){
        this.tabs = responce.data
        this.sheetTitle = this.tabs[0];
        this.SheetSavePlusEnabled.splice(0, 1);
        console.log(this.SheetSavePlusEnabled)
        this.sheetRetrive();
  }
      },
      error: (error) => {
        console.log(error);
      }
    }
  )
 }
  goToDataSource(){
    const encodeddbId = btoa(this.databaseId.toString());
    const encodedqurysetId = btoa(this.qrySetId.toString())
    this.router.navigate(['/workbench/database-connection/sheets/'+encodeddbId+'/'+encodedqurysetId])


    if (this.filterQuerySetId === null || this.filterQuerySetId === undefined) {
      // Encode 'null' to represent a null value
     const encodedDsQuerySetId = btoa('null');
     this.router.navigate(['/workbench/database-connection/sheets/'+encodeddbId+'/'+encodedqurysetId+'/'+encodedDsQuerySetId])

    } else {
      // Convert to string and encode
     const encodedDsQuerySetId = btoa(this.filterQuerySetId.toString());
     this.router.navigate(['/workbench/database-connection/sheets/'+encodeddbId+'/'+encodedqurysetId+'/'+encodedDsQuerySetId])
  
    }
  }
  goToConnections(){
    this.router.navigate(['/workbench/work-bench/view-connections'])
  }
  toggleSubMenu(menu: any) {
    menu.expanded = !menu.expanded;
  }

  barChart(){
    this.chartOptions3 = {
      series: [
        {
          name: "",
          data: this.chartsRowData 
        }
      ],
      chart: {
        toolbar: {
          show: false
        },
        height: 385,
        type: 'bar',
        foreColor: this.color,
      },
      title: {
        text: "",
        offsetY: 10,
        align: 'center',
        style: {
          color: this.color,
        },
      },
      xaxis: {
        categories: this.chartsColumnData,
        position: 'bottom',
        labels: {
          show: true,
          trim: true,
          hideOverlappingLabels: false,
          style: {
            colors: this.color,
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 12,
        },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: false,
          offsetY: -35,
        },
      },
      yaxis:{
        show: true,
        labels: {
          show: true,
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 12,
          },
          formatter: this.formatNumber.bind(this)
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            hideOverflowingLabels:false,
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: this.formatNumber.bind(this),
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: [this.color],
        },
      },
      fill: {
        type: 'gradient',
      },
      colors: [this.color]
    };
    this.xLabelSwitch = this.chartOptions3.xaxis.labels.show;
    this.yLabelSwitch = this.chartOptions3.yaxis.labels.show;
    this.xGridSwitch = this.chartOptions3.grid.xaxis.lines.show;
    this.yGridSwitch = this.chartOptions3.grid.yaxis.lines.show;
  }
  pieChart(){
    this.chartOptions4={
      series: this.chartsRowData,
      chart: {
          height: 300,
          type: 'pie',
      },
      colors: ["#00a5a2", "#31d1ce", "#f5b849", "#49b6f5", "#e6533c"],
      labels: this.chartsColumnData,
      legend: {
          show: true,
          position: "bottom"
      },
      dataLabels: {
          dropShadow: {
              enabled: false
          }
      },
      };
      this.legendSwitch = this.chartOptions4.legend.show;
  }
  lineChart(){
    this.chartOptions={
      series: [{
          name: "",
          data: this.chartsRowData
      }],
     
          chart: {
              height: 200,
              type: 'line',
              reponsive: true,
              zoom: {
                  enabled: false
              },
              events: {
                  mounted: (chart:any) => {
                    chart.windowResizeHandler();
                  }
                },
          },
          colors: [this.color],
          dataLabels: {
            enabled: true,
            formatter: this.formatNumber.bind(this),
            offsetY: -20,
            style: {
              fontSize: '12px',
              colors: [this.color],
            },
          },
          stroke: {
              curve: 'straight',
              width: 3,
          },
          grid: {
            borderColor: "rgba(119, 119, 142, 0.05)",
            show: true,
            xaxis: {
              lines: {
                show: false
              }
            },
            yaxis: {
              lines: {
                show: false
              }
            },
          },
          title: {
              text: '',
              align: 'left',
              style: {
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: this.color
              },
          },
          xaxis: {
              categories: this.chartsColumnData,
              labels: {
                  show: true,
                  hideOverlappingLabels: false,
                  trim: true,
                  style: {
                    colors: this.color,
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 12,
                  },
              }
          },
          yaxis: {
              labels: {
                  show: true,
                  style: {
                      colors: this.color,
                      fontSize: '11px',
                      fontWeight: 600,
                      cssClass: 'apexcharts-yaxis-label',
                  },
                  formatter: this.formatNumber.bind(this)
              }
          }
      
  }
    this.xLabelSwitch = this.chartOptions.xaxis.labels.show;
    this.yLabelSwitch = this.chartOptions.yaxis.labels.show;
    this.xGridSwitch = this.chartOptions.grid.xaxis.lines.show;
    this.yGridSwitch = this.chartOptions.grid.yaxis.lines.show;
  }
  areaChart(){
    this.chartOptions1 = {
      series: [
        {
          name: "",
          data: this.chartsRowData,
        },
      ],
      chart: {
        type: "area",
        height: 200,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: this.formatNumber.bind(this),
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: [this.color],
        },
      },
      stroke: {
        curve: "straight",
      },
      subtitle: {
        text: "",
        align: "left",
        style: {
          fontSize: "11px",
          fontWeight: "normal",
          color: this.color,
        },
      },
      grid: {
        borderColor: "rgba(119, 119, 142, 0.05)",
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      labels: this.chartsColumnData,
      title: {
        text: "",
        align: "left",
        style: {
          fontSize: "13px",
          fontWeight: "bold",
          color: this.color,
        },
      },
      colors: [this.color],
      xaxis: {
        type: "",
        labels: {
          show: true,
          style: {
            colors: this.color,
            fontSize: "11px",
            fontWeight: 600,
            cssClass: "apexcharts-xaxis-label",
          },
        },
      },
      yaxis: {
        opposite: true,
        labels: {
          show: true,
          style: {
            colors: this.color,
            fontSize: "11px",
            fontWeight: 600,
            cssClass: "apexcharts-xaxis-label",
          },
          formatter: this.formatNumber.bind(this)
        },
      },
      legend: {
        horizontalAlign: "left",
      },
    };
    this.xLabelSwitch = this.chartOptions1.xaxis.labels.show;
    this.yLabelSwitch = this.chartOptions1.yaxis.labels.show;
    this.xGridSwitch = this.chartOptions1.grid.xaxis.lines.show;
    this.yGridSwitch = this.chartOptions1.grid.yaxis.lines.show;
  }
  sidebysideBar(){
      const dimensions: Dimension[] = this.sidebysideBarColumnData1;
      const categories = this.flattenDimensions(dimensions);
      this.chartOptions2 = {
        series: this.sidebysideBarRowData,
        colors:['#00a5a2','#0dc9c5','#f43f63'],
        chart: {
          type: 'bar',
          height: 320,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
          },
        },
        dataLabels: {
          enabled: true,
          formatter: this.formatNumber.bind(this),
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#f43f63'],
          },
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories:categories,
          labels: {
            show: true,
            style: {
              colors: this.color,
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          title: {
            text: '',
          },
          labels: {
            show: true,
            style: {
              colors: this.color,
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
            formatter: this.formatNumber.bind(this)
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val:any) {
              console.log(val)
              return val ;
            },
          },
        },
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
          show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
        },
      };
    this.xLabelSwitch = this.chartOptions2.xaxis.labels.show;
    this.yLabelSwitch = this.chartOptions2.yaxis.labels.show;
    this.xGridSwitch = this.chartOptions2.grid.xaxis.lines.show;
    this.yGridSwitch = this.chartOptions2.grid.yaxis.lines.show;
    }
  flattenDimensions(dimensions: Dimension[]): string[] {
    const numCategories = Math.max(...dimensions.map(dim => dim.values.length));
    return Array.from({ length: numCategories }, (_, index) => {
      return dimensions.map(dim => dim.values[index] || '').join(',');
    });
  }
  stockedBar(){
    const dimensions: Dimension[] = this.sidebysideBarColumnData1;
      const categories = this.flattenDimensions(dimensions);
    this.chartOptions6 = {
      series: this.sidebysideBarRowData,
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: categories,
        labels: {
          show: true,
          style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 12
          },
      },
      },
      yaxis: {
        show: true,
        labels: {
          show: true,
          style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 12
          },
          formatter: this.formatNumber.bind(this)
      }
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      dataLabels: {
        enabled: true,
        formatter: this.formatNumber.bind(this),
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: [this.color],
        },
      }
    };
    this.xLabelSwitch = this.chartOptions3.xaxis.labels.show;
    // this.yLabelSwitch = this.chartOptions3.yaxis.labels.show;
    this.xGridSwitch = this.chartOptions3.grid.xaxis.lines.show;
    this.yGridSwitch = this.chartOptions3.grid.yaxis.lines.show;
  }
  
  barLineChart(){
    const dimensions: Dimension[] = this.sidebysideBarColumnData1;
    const categories = this.flattenDimensions(dimensions);
    this.chartOptions5 = {
      series: [
        {
          name: this.sidebysideBarRowData[0]?.name,
          type: "column",
          data: this.sidebysideBarRowData[0]?.data
        },
        {
          name: this.sidebysideBarRowData[1]?.name,
          type: "line",
          data: this.sidebysideBarRowData[1]?.data,
        }
      ],
      colors:['#00a5a2','#31d1ce'],
      chart: {
        height: 350,
        type: "line"
      },
      grid: {
        show : true,
        xaxis: {
          lines: {
              show: false
          }
      },   
      yaxis: {
          lines: {
              show: false
          }
      }, 
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: "",
        style: {
          fontSize: "13px",
          fontWeight: "bold",
          color: "#8c9097",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: this.formatNumber.bind(this),
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: [this.color],
        },
      },
      labels: categories,
      xaxis: {
        type: "",
        labels: {
          show: true,
          style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 12
          },
      }},
      yaxis: [
        {
          show : true,
          title: {
            text: "",
            style: {
              fontSize: "13px",
              fontWeight: "bold",
              color: "#8c9097",
            },
          },
          labels: {
            show: true,
            style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 12
            },
            formatter: this.formatNumber.bind(this)
          }
        },
        {
          show : true,
          opposite: true,
          title: {
            text: "",
            style: {
              fontSize: "13px",
              fontWeight: "bold",
              color: "#8c9097",
            },
          },
          labels: {
            show: true,
            style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 12
            },
            formatter: this.formatNumber.bind(this)
          }
        }
      ]
      
    };
    this.xLabelSwitch = this.chartOptions5.xaxis.labels.show;
    // this.yLabelSwitch = this.chartOptions5.yaxis.labels.show;
    this.xGridSwitch = this.chartOptions5.grid.xaxis.lines.show;
    this.yGridSwitch = this.chartOptions5.grid.yaxis.lines.show;
  }
  horizentalStockedBar(){
    const dimensions: Dimension[] = this.sidebysideBarColumnData1;
    const categories = this.flattenDimensions(dimensions);
    this.chartOptions7 = {
      series: this.sidebysideBarRowData,
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      xaxis: {
        type: "category",
        categories: categories,
        labels: {
          show: true,
          style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 12
          },
          formatter: this.formatNumber.bind(this)
        }
      },
      yaxis : {
        show : true,
        labels: {
          show: true,
          style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 12
          },
        }
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      },
      grid: {
        show: true,
        xaxis: {
            lines: {
                show: false
            }
        },   
        yaxis: {
            lines: {
                show: false
            }
        },  
      },
      dataLabels: {
        enabled: true,
        formatter: this.formatNumber.bind(this),
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: [this.color],
        },
      }
    };
    this.xLabelSwitch = this.chartOptions7.xaxis.labels.show;
    this.yLabelSwitch = this.chartOptions7.yaxis.labels.show;
    this.xGridSwitch = this.chartOptions7.grid.xaxis.lines.show;
    this.yGridSwitch = this.chartOptions7.grid.yaxis.lines.show;
  }
  hGrouped(){
    const dimensions: Dimension[] = this.sidebysideBarColumnData1;
    const categories = this.flattenDimensions(dimensions);
    this.chartOptions8 = {
      series: this.sidebysideBarRowData,
      chart: {
        type: "bar",
        height: 430
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: this.formatNumber.bind(this),
        offsetY: -6,
        style: {
          fontSize: '12px',
          colors: ["#fff"],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: categories,
        labels: {
          show: true,
          style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 12
          },
          formatter: this.formatNumber.bind(this)
          },
      },
      yaxis: {
        show: true,
        labels: {
            show: true,
            style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 12
            },
        },
    },
    grid: {
      show: true,
      xaxis: {
          lines: {
              show: false
          }
      },   
      yaxis: {
          lines: {
              show: true
          }
      },  
      },  
    };
    this.xLabelSwitch = this.chartOptions8.xaxis.labels.show;
    this.yLabelSwitch = this.chartOptions8.yaxis.labels.show;
    this.xGridSwitch = this.chartOptions8.grid.xaxis.lines.show;
    this.yGridSwitch = this.chartOptions8.grid.yaxis.lines.show;
  }
  multiLineChart(){
    const dimensions: Dimension[] = this.sidebysideBarColumnData1;
    const categories = this.flattenDimensions(dimensions);
    this.chartOptions9 = {
      series: this.sidebysideBarRowData,
      chart: {
        height: 350,
        type: "line"
      },
      dataLabels: {
        enabled: true,
        formatter: this.formatNumber.bind(this),
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: [this.color],
        },
      },
      stroke: {
        width: 5,
        curve: "straight",
        dashArray: [0, 8, 5]
      },
      title: {
        text: "",
        align: "left"
      },
      legend: {
        tooltipHoverFormatter: function(val:any, opts:any) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: categories,
        labels: {
          show: true,
          style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 12
          },
        },
      },
      yaxis: {
        show: true,
        labels: {
          show: true,
          style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 12
          },
          formatter: this.formatNumber.bind(this)
        },
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function(val:any) {
                return val;
              }
            }
          },
        ]
      },
      grid: {
        show: true,
        xaxis: {
            lines: {
                show: false
            }
        },   
        yaxis: {
            lines: {
                show: false
            }
        }, 
      } 
    };
    this.xLabelSwitch = this.chartOptions3.xaxis.labels.show;
    // this.yLabelSwitch = this.chartOptions3.yaxis.labels.show;
    this.xGridSwitch = this.chartOptions3.grid.xaxis.lines.show;
    this.yGridSwitch = this.chartOptions3.grid.yaxis.lines.show;
  }
  donutChart(){
    this.chartOptions10 = {
      series: this.chartsRowData,
      chart: {
        type: "donut"
      },
      labels: this.chartsColumnData,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 100
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      legend: {
        show: true,
    },
    };
    this.legendSwitch = this.chartOptions10.legend.show;
  }

tableDimentions = [] as any;
tableMeasures = [] as any;
  columnsData(){
    const obj={
      "db_id":this.databaseId,
      "queryset_id":this.qrySetId,
  }
    this.workbechService.getColumnsData(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.tableColumnsData = responce;
          this.database_name = responce[0].database_name;
          this.tableDimentions = responce.dimensions;
          this.tableMeasures = responce.measures;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }

  dataExtraction(){
    this.sidebysideBarColumnData1 = [];
    this.tablePreviewColumn = [];
    this.tablePreviewRow = [];
    this.tableData = [];
    this.chartsData = [];
    this.displayedColumns = [];
    this.chartsColumnData = [];
    this.chartsRowData = [];
    this.sidebysideBarColumnData = [];
    this.sidebysideBarRowData = [];
      const obj={
          "database_id":this.databaseId,
          "queryset_id":this.qrySetId,
          "col":this.draggedColumnsData,
          "row":this.draggedRowsData,
          "filter_id": this.filterId,
          "datasource_querysetid":this.filterQuerySetId,
          "sheetfilter_querysets_id": this.sheetfilter_querysets_id,
      }
    this.workbechService.getDataExtraction(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.sheetfilter_querysets_id = responce.sheetfilter_querysets_id;
          this.tablePreviewColumn = responce.data.col;
          this.tablePreviewRow = responce.data.row;
          console.log(this.tablePreviewColumn);
          console.log(this.tablePreviewRow);
          this.tablePreviewColumn.forEach((res:any) => {
            let obj={
              data: res.result_data
            }
            this.sidebysideBarColumnData.push(res.result_data);
            let obj1={
              name:res.column,
              values: res.result_data
            }
            this.sidebysideBarColumnData1.push(obj1);
          });
          this.tablePreviewRow.forEach((res:any) => {
            let obj={
              name: res.col,
              data: res.result_data
            }
            this.sidebysideBarRowData.push(obj);
          });
          console.log(this.sidebysideBarColumnData)
          console.log('sidebysideBarColumnData1this',this.sidebysideBarColumnData1)
          console.log(this.sidebysideBarRowData);
          let rowCount:any;
         if(this.tablePreviewColumn[0]?.result_data?.length){
           rowCount = this.tablePreviewColumn[0]?.result_data?.length;
         }else{
           rowCount = this.tablePreviewRow[0]?.result_data?.length;
         }
          //const rowCount = this.tablePreviewRow[0]?.result_data?.length;
          // Extract column names
          this.displayedColumns = this.tablePreviewColumn.map((col:any) => col.column).concat(this.tablePreviewRow.map((row:any) => row.col));
          // Create table data
          console.log(this.displayedColumns)
          for (let i = 0; i < rowCount; i++) {
            const row: TableRow = {};
            this.tablePreviewColumn.forEach((col:any) => {
              row[col.column] = col.result_data[i];
            });
            this.tablePreviewRow.forEach((rowData:any) => {
              row[rowData.col] = rowData.result_data[i];
            });
            this.tableData.push(row);
         
        }
      console.log(this.tableData);
      this.tablePreviewColumn.forEach((col:any) => {
        this.chartsColumnData = col.result_data;
      });
      this.tablePreviewRow.forEach((rowData:any) => {
        this.chartsRowData = rowData.result_data;
      });
      console.log(this.chartsColumnData)
      console.log(this.chartsRowData)
      const length = Math.min(this.chartsColumnData.length, this.chartsRowData.length);
      for (let i = 0; i < length; i++) {
        const aa = { col: this.chartsColumnData[i], row: this.chartsRowData[i] };
        this.chartsData.push(aa);
      }
      console.log(this.chartsData)
      if(this.chartsRowData.length >0){
        this.enableDisableCharts();
       // this.createSvg();
       // this.drawBars(this.chartsData);
        this.barChart();
        //this.createSvgPie();
        //this.createColors();
        //this.drawChartPie();
        this.pieChart();
        this.lineChart();
        this.areaChart();
        this.sidebysideBar();
        this.stockedBar();
        this.barLineChart();
        this.horizentalStockedBar();
        this.hGrouped();
        this.multiLineChart();
        this.donutChart();
      }
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  
   
  }
 
  tableNameMethod(schemaname:any,tablename:any,tableAlias:any){
    this.schemaName = '';
    this.tableName = '';
    this.table_alias = '';
  this.schemaName = schemaname;
  this.tableName = tablename;
  this.table_alias = tableAlias;
  }
  storeColumnData = [] as any;
  storeRowData = [] as any;
  columndrop(event: CdkDragDrop<string[]>){
    console.log(event)
    let item: any = event.previousContainer.data[event.previousIndex];
    this.storeColumnData.push(event.previousContainer.data); 
    // this.storeColumnData[0].forEach((element:any) => {
     // if(element.column === item.column){
        let copy: any = JSON.parse(JSON.stringify(item));
        let element: any = {};
        for (let attr in copy) {
          if (attr == 'title') {
            element[attr] = copy[attr];
          } else {
            element[attr] = copy[attr];
          }
        }
        this.draggedColumns.splice(event.currentIndex, 0, element);
        //this.draggedColumnsData.push([this.schemaName,this.tableName,this.table_alias,element.column,element.data_type,""])
        this.draggedColumnsData.push([element.column,element.data_type,""])
    
        this.dataExtraction();
     // }else{
     // }

   // });
    
  }
  rowdrop(event: CdkDragDrop<string[]>){
   console.log(event)
    let item: any = event.previousContainer.data[event.previousIndex];
   // this.storeRowData.push(event.previousContainer.data); 
    //this.storeRowData[0].forEach((element:any) => {
    //  if(element.column === item.column){
        let copy: any = JSON.parse(JSON.stringify(item));
        let element: any = {};
        for (let attr in copy) {
          if (attr == 'title') {
            element[attr] = copy[attr];
          } else {
            element[attr] = copy[attr];
          }
        }
        this.draggedRows.splice(event.currentIndex, 0, element);
        //this.draggedRowsData.push([this.schemaName,this.tableName,this.table_alias,element.column,element.data_type,""])
        this.draggedRowsData.push([element.column,element.data_type,""])
        console.log(this.draggedRowsData);
        this.dataExtraction();
      //}else{
        console.log("Can't Accept")
      //}
   // });

  }
  isDropdownVisible = false;

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  rowMeasuresCount(rows:any,index:any,type:any){
      this.measureValues = [];
      this.measureValues = [rows.column,"aggregate",type]
     if(type === ''){
      this.draggedRowsData[index] = [rows.column,rows.data_type,type];
      this.draggedRows[index] = {column:rows.column,data_type:rows.data_type,type:type};
      this.dataExtraction();
     }else if(type === '-Select-'){
      this.draggedRowsData[index] = [rows.column,rows.data_type,''];
      this.draggedRows[index] = {column:rows.column,data_type:rows.data_type,type:''};
      this.dataExtraction();
     }else{
    this.draggedRowsData[index] = this.measureValues;
    console.log(this.draggedRowsData);
    this.draggedRows[index] = {column:rows.column,data_type:rows.data_type,type:type};
    console.log(this.draggedRows)
    this.dataExtraction();
     }
  }
   drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  dragStartedColumn(index:any,column:any){
    console.log(this.draggedColumns);
    console.log(this.draggedColumnsData);
    console.log(index);
    this.draggedColumns.splice(index, 1);
    (this.draggedColumnsData as any[]).forEach((data,index)=>{
      (data as any[]).forEach((aa)=>{ 
        if(column === aa){
          console.log(aa);
          this.draggedColumnsData.splice(index, 1);
        }
      } );
    });   
   this.dataExtraction();
  }
  dragStartedRow(index:any){
   this.draggedRows.splice(index, 1);
   this.draggedRowsData.splice(index, 1);
   this.dataExtraction();
  }
  rightArrow(){
    console.log(this.draggedColumns.length)
    if(this.draggedColumns.length == 6){

    }else{
   const columnNext =  this.draggedColumns.length;
    for (let i = 7; i < columnNext; i++) {
      this.draggedColumns[i];
    }
    console.log(this.draggedColumns)
  }
  }
  table = true;
  bar = false;
  sidebyside = false;
  area = false;
  line = false;
  pie = false;
  stocked = false;
  barLine = false;
  horizentalStocked = false;
  grouped = false;
  multiLine = false;
  donut = false;
  chartDisplay(table:boolean,bar:boolean,area:boolean,line:boolean,pie:boolean,sidebysideBar:boolean,stocked:boolean,barLine:boolean,
    horizentalStocked:boolean,grouped:boolean,multiLine:boolean,donut:boolean,chartId:any){
    this.table = table;
    this.bar=bar;
    this.area=area;
    this.line=line;
    this.pie=pie;
    this.sidebyside = sidebysideBar;
    this.stocked = stocked;
    this.barLine = barLine;
    this.horizentalStocked = horizentalStocked;
    this.grouped = grouped;
    this.multiLine = multiLine;
    this.donut = donut;
    this.chartId = chartId;
    this.dataExtraction();
  }
  enableDisableCharts(){
    console.log(this.draggedColumnsData);
    console.log(this.draggedRowsData);
    const obj={
        "db_id":this.databaseId,
        "col":this.draggedColumnsData,
        "row":this.draggedRowsData,
  }
    this.workbechService.getChartsEnableDisable(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.chartsEnableDisable = responce;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }
  tabs = ['Sheet 1'];
  selected = new FormControl(0);
  addSheet() {
    this.sheetName = ''; this.sheetTitle = '';
    if(this.sheetName != ''){
       this.tabs.push(this.sheetName);
    }else{
      this.getChartData();
      this.sheetNumber+=1;
       this.tabs.push('Sheet ' +this.sheetNumber);
       this.SheetSavePlusEnabled.push('Sheet ' +this.sheetNumber);
       this.selectedTabIndex = this.tabs.length - 1;
    }
  }
  sheetNameChange(name:any,event:any){
    console.log(this.SheetIndex)
    if (event.keyCode === 13) {
      this.tabs[this.SheetIndex] = name;
    }
    
  }
  removeTab() {
    console.log(this.SheetIndex)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result)=>{
      if(result.isConfirmed){
        this.workbechService.sheetDelete(this.databaseId,this.qrySetId,this.retriveDataSheet_id).subscribe({next: (data:any) => {
              console.log(data);      
              if(data){
                 this.tabs.splice(this.SheetIndex, 1);
                Swal.fire({
                  icon: 'success',
                  title: 'Deleted!',
                  text: 'Deleted Successfully',
                  width: '200px',
                })
                    this.getChartData();
              }

            },
            error:(error:any)=>{
              Swal.fire({
                icon: 'warning',
                text: error.error.message,
                width: '200px',
              })
              console.log(error)
            }
          } 
        )
      }})  
  }
  onChange(event:any){
    this.sheetName = '';
    console.log(event)
    if(event.index === -1){
     this.retriveDataSheet_id = 1;
    }
    this.SheetIndex = event.index;
    this.sheetName = event.tab?.textLabel
    this.sheetTitle = event.tab?.textLabel;
    console.log(this.sheetName)
    console.log(this.retriveDataSheet_id);
   // if(!this.sheetTitle){
      this.sheetRetrive();
   // }
    
  }
  getChartData(){
   // if(this.draggedColumns && this.draggedRows && !this.retriveDataSheet_id){
   //alert("pls save your changes")
   // }else{
    this.filterData = [];
    this.filterId = [];
    this.retriveDataSheet_id = '';
    this.dimetionMeasure = [];
    this.sidebysideBarColumnData = [];
    this.sidebysideBarColumnData1 = [];
    this.sidebysideBarRowData = [];
    this.sheetfilter_querysets_id = null;
      this.saveTableData = [] ;
      this.savedisplayedColumns = [];
      this.saveBar = [];
      this.savePie = [];
      this.lineYaxis = [];
      this.lineXaxis = [];
      this.areaYaxis = [];
      this.areaXaxis = [];
      this.draggedColumns = [];
      this.draggedRows = [];
      this.tablePreviewColumn = [];
      this.tablePreviewRow = [];
      this.tableData = [];
      this.displayedColumns = [];
      this.chartsData = [];
      this.chartsRowData = [];
      this.chartsColumnData = [];
      this.draggedColumnsData = [];
      this.draggedRowsData = [];
      this.sidebysideBarYaxis = [];
      this.sidebysideBarXaxis = [];
      this.stokedBarYaxis = [];
      this.stokedBarXaxis = [];
      this.barLineYaxis = [];
      this.barLineXaxis = [];
      this.hStockedYaxis = [];
      this.hStockedXaxis = [];
      this.hgroupedYaxis = [];
      this.hgroupedXaxis = [];
      this.multiLineYaxis = [];
      this.multiLineXaxis = [];
      this.donutYaxis = [];
      this.donutXaxis = [];
      this.table = true;
      this.bar = false;
      this.pie = false;
      this.line = false;
      this.area = false;
      this.sidebyside = false;
      this.stocked = false;
      this.barLine = false;
      this.horizentalStocked = false;
      this.grouped = false;
      this.multiLine = false;
      this.donut = false;
   // }
  }
  saveTableData = [] as any;
  savedisplayedColumns = [] as any;
  saveBar = [] as any;
  savePie = [] as any;
  lineYaxis = [] as any;
  lineXaxis = [] as any;
  areaYaxis = [] as any;
  areaXaxis = [] as any;
  barXaxis = [] as any;
  pieXaxis = [] as any;
  sidebysideBarYaxis = [] as any;
  sidebysideBarXaxis = [] as any;
  stokedBarYaxis = [] as any;
  stokedBarXaxis = [] as any;
  barLineYaxis = [] as any;
  barLineXaxis = [] as any;
  hStockedYaxis = [] as any;
  hStockedXaxis = [] as any;
  hgroupedYaxis = [] as any;
  hgroupedXaxis = [] as any;
  multiLineYaxis = [] as any;
  multiLineXaxis = [] as any;
  donutYaxis = [] as any;
  donutXaxis = [] as any;

sheetSave(){
  if(this.table && this.chartId == 1){
   this.saveTableData =  this.tableData;
   this.savedisplayedColumns = this.displayedColumns;
  }
  if(this.bar && this.chartId == 6){
    this.saveBar = this.chartsRowData;
    this.barXaxis = this.chartsColumnData;
  }
  if(this.pie && this.chartId == 24){
    this.savePie = this.chartsRowData;
    this.pieXaxis = this.chartsColumnData
  }
  if(this.line && this.chartId == 13){
    this.lineYaxis = this.chartsRowData;
    this.lineXaxis = this.chartsColumnData;
  }
  if(this.area && this.chartId == 17){
    this.areaYaxis = this.chartsRowData;
    this.areaXaxis = this.chartsColumnData;
  }
  if(this.sidebyside && this.chartId == 7){
    this.sidebysideBarYaxis = this.sidebysideBarRowData;
    this.sidebysideBarXaxis = this.sidebysideBarColumnData1;
  }
  if(this.stocked && this.chartId == 5){
    this.stokedBarYaxis = this.sidebysideBarRowData;
    this.stokedBarXaxis = this.sidebysideBarColumnData1;
  }
  if(this.barLine && this.chartId == 4){
    this.barLineYaxis = this.sidebysideBarRowData;
    this.barLineXaxis = this.sidebysideBarColumnData1;
  }
  if(this.horizentalStocked && this.chartId == 2){
    this.hStockedYaxis = this.sidebysideBarRowData;
    this.hStockedXaxis = this.sidebysideBarColumnData1;
  }
  if(this.grouped && this.chartId == 3){
    this.hgroupedYaxis = this.sidebysideBarRowData;
    this.hgroupedXaxis = this.sidebysideBarColumnData1;
  }
  if(this.multiLine && this.chartId == 8){
    this.multiLineYaxis = this.sidebysideBarRowData;
    this.multiLineXaxis = this.sidebysideBarColumnData1;
  }
  if(this.donut && this.chartId == 10){
    this.donutYaxis = this.chartsRowData;
    this.donutXaxis = this.chartsColumnData;
  }
const obj={
  "chart_id": this.chartId,
  "queryset_id":this.qrySetId,
  "server_id": this.databaseId,
  "sheet_name": this.sheetTitle,
  "sheet_tag_name": this.sheetTagName,
  "filterId":this.filterId,
  "sheetfilter_querysets_id":this.sheetfilter_querysets_id,
  "data":{
  "columns": this.draggedColumns,
  "rows": this.draggedRows,
  "results": {
    "tableData":this.saveTableData,
    "tableColumns":this.savedisplayedColumns,

    "barYaxis":this.saveBar,
    "barXaxis":this.barXaxis,
   
    "pieYaxis":this.savePie,
    "pieXaxis":this.pieXaxis,

    "lineYaxis":this.lineYaxis,
    "lineXaxis": this.lineXaxis,

    "areaYaxis":this.areaYaxis,
    "areaXaxis":this.areaXaxis,

  
      "sidebysideBarYaxis": this.sidebysideBarYaxis,
      "sidebysideBarXaxis": this.sidebysideBarXaxis,
   
      "stokedBarYaxis": this.stokedBarYaxis,
      "stokedBarXaxis": this.stokedBarXaxis,
  
      "barLineYaxis":this.barLineYaxis,
      "barLineXaxis":this.barLineXaxis,

      "hStockedYaxis": this.hStockedYaxis,
      "hStockedXaxis": this.hStockedXaxis,

      "hgroupedYaxis": this.hgroupedYaxis,
      "hgroupedXaxis": this.hgroupedXaxis,

      "multiLineYaxis":this.multiLineYaxis,
      "multiLineXaxis": this.multiLineXaxis,

      "donutYaxis": this.donutYaxis,
      "donutXaxis": this.donutXaxis,
  },
}
}
console.log(this.retriveDataSheet_id)
if(this.retriveDataSheet_id){
  console.log("Sheet Update")
  this.workbechService.sheetUpdate(obj,this.retriveDataSheet_id).subscribe({next: (responce:any) => {
    this.tabs[this.SheetIndex] = this.sheetTitle;
    if(responce){
      Swal.fire({
        icon: 'success',
        text: responce.message,
        width: '200px',
      })
     // this.sheetRetrive();
    }
  
  },
  error: (error) => {
    console.log(error);
    Swal.fire({
      icon: 'error',
      text: error.error.message,
      width: '200px',
    })
  }
}
)
}else{
  this.retriveDataSheet_id = '';
  this.workbechService.sheetSave(obj).subscribe({next: (responce:any) => {
    this.tabs[this.SheetIndex] = this.sheetTitle;
    console.log(responce);
    if(responce){
      Swal.fire({
        icon: 'success',
        text: responce.message,
        width: '200px',
      })
      this.retriveDataSheet_id = responce.sheet_id;
      //this.sheetRetrive();
      this.SheetSavePlusEnabled.splice(0, 1);
    }
    this.saveTableData= [];
    this.savedisplayedColumns = [];
    this.saveBar =[];
    this.barXaxis = [];
    this.savePie = [];
    this.pieXaxis =[];
    this.lineYaxis = [];
    this.lineXaxis =[];
    this.areaYaxis =[];
    this.areaXaxis =[];
    this.sidebysideBarYaxis =[];
    this.sidebysideBarXaxis =[];
    this.stokedBarYaxis =[];
    this.stokedBarXaxis =[];
    this.barLineYaxis =[];
    this.barLineXaxis =[];
    this.hStockedYaxis =[];
    this.hStockedXaxis =[];
    this.hgroupedYaxis =[];
    this.hgroupedXaxis =[];
    this.multiLineYaxis =[];
    this.multiLineXaxis =[];
    this.donutYaxis =[];
    this.donutXaxis =[];
    this.measureValues = [];
  //  this.draggedRowsData = [];
   // this.draggedColumnsData = [];
  },
  error: (error) => {
    console.log(error);
    Swal.fire({
      icon: 'error',
      text: error.error.message,
      width: '200px',
    })
   
  }
}
)
}

  }
sheetRetrive(){
  this.draggedColumnsData  = [];
  this.draggedRowsData = [];
  this.getChartData();
  const obj={
  "queryset_id":this.qrySetId,
  "server_id": this.databaseId,
  "sheet_name": this.sheetName,
}
  this.workbechService.sheetGet(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        this.retriveDataSheet_id = responce.sheet_id;
        this.sheetfilter_querysets_id = responce.sheet_filter_quereyset_ids;
        this.chartId = responce.chart_id;
        this.sheetName = responce.sheet_name;
        this.sheetTitle = responce.sheet_name;
        this.sheetResponce = responce.sheet_data;
        this.draggedColumns=this.sheetResponce.columns;
        this.draggedRows = this.sheetResponce.rows;
        this.dimetionMeasure = responce.filters_data;
        if(!responce.sheet_tag_name){
          const inputElement = document.getElementById('htmlContent') as HTMLInputElement;
          inputElement.innerHTML = responce.sheet_name;
          this.sheetTagName = responce.sheet_name;
        }
        else{
          const inputElement = document.getElementById('htmlContent') as HTMLInputElement;
          inputElement.innerHTML = responce.sheet_tag_name;
          inputElement.style.paddingTop = '1.5%';
          this.sheetTagName = responce.sheet_tag_name;
        }
        this.displayUnits = 'none';
        
        this.draggedColumns.forEach((res:any) => {
          this.draggedColumnsData.push([res.column,res.data_type,""])
        });
        this.draggedRows.forEach((res:any) => {
          this.draggedRowsData.push([res.column,res.data_type,""])
        });
        if(responce.chart_id == 1){
          this.tableData = this.sheetResponce.results.tableData;
          this.displayedColumns = this.sheetResponce.results.tableColumns;
          this.table = true;
          this.bar = false;
          this.pie = false;
          this.line = false;
          this.area = false;
          this.sidebyside = false;
          this.stocked = false;
          this.barLine = false;
          this.horizentalStocked = false;
          this.grouped = false;
          this.multiLine = false;
          this.donut = false;
        }
       if(responce.chart_id == 6){
        this.chartsRowData = this.sheetResponce.results.barYaxis;
        this.chartsColumnData = this.sheetResponce.results.barXaxis;
       this.barChart();
        this.bar = true;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = false;
          this.sidebyside = false;
          this.stocked = false;
          this.barLine = false;
          this.horizentalStocked = false;
          this.grouped = false;
          this.multiLine = false;
          this.donut = false;
       }
       if(responce.chart_id == 24){
        this.chartsRowData = this.sheetResponce.results.pieYaxis;
        this.chartsColumnData = this.sheetResponce.results.pieXaxis;
        this.bar = false;
        this.table = false;
          this.pie = true;
          this.line = false;
          this.area = false;
          this.sidebyside = false;
          this.stocked = false;
          this.barLine = false;
          this.horizentalStocked = false;
          this.grouped = false;
          this.multiLine = false;
          this.donut = false;
          this.pieChart();
       }
       if(responce.chart_id == 13){
        this.chartsRowData = this.sheetResponce.results.lineYaxis;
        this.chartsColumnData = this.sheetResponce.results.lineXaxis;
        this.lineChart();
        this.bar = false;
        this.table = false;
          this.pie = false;
          this.line = true;
          this.area = false;
          this.sidebyside = false;
          this.stocked = false;
          this.barLine = false;
          this.horizentalStocked = false;
          this.grouped = false;
          this.multiLine = false;
          this.donut = false;
       }
       if(responce.chart_id == 17){
        this.chartsRowData = this.sheetResponce.results.areaYaxis;
        this.chartsColumnData = this.sheetResponce.results.areaXaxis;
        this.areaChart();
        this.bar = false;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = true;
          this.sidebyside = false;
          this.stocked = false;
          this.barLine = false;
          this.horizentalStocked = false;
          this.grouped = false;
          this.multiLine = false;
          this.donut = false;
       }
       if(responce.chart_id == 7){
        this.sidebysideBarRowData = this.sheetResponce.results.sidebysideBarYaxis;
        this.sidebysideBarColumnData1 = this.sheetResponce.results.sidebysideBarXaxis;
        this.sidebysideBar();
        this.bar = false;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = false;
          this.sidebyside = true;
          this.stocked = false;
          this.barLine = false;
          this.horizentalStocked = false;
          this.grouped = false;
          this.multiLine = false;
          this.donut = false;
       }
       if(responce.chart_id == 5){
        this.sidebysideBarRowData = this.sheetResponce.results.stokedBarYaxis;
        this.sidebysideBarColumnData1 = this.sheetResponce.results.stokedBarXaxis;
        this.stockedBar();
        this.bar = false;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = false;
          this.sidebyside = false;
          this.stocked = true;
          this.barLine = false;
          this.horizentalStocked = false;
          this.grouped = false;
          this.multiLine = false;
          this.donut = false;
       }
       if(responce.chart_id == 4){
        this.sidebysideBarRowData = this.sheetResponce.results.barLineYaxis;
        this.sidebysideBarColumnData1 = this.sheetResponce.results.barLineXaxis;
        this.barLineChart();
        this.bar = false;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = false;
          this.sidebyside = false;
          this.stocked = false;
          this.barLine = true;
          this.horizentalStocked = false;
          this.grouped = false;
          this.multiLine = false;
          this.donut = false;
       }
       if(responce.chart_id == 2){
        this.sidebysideBarRowData = this.sheetResponce.results.hStockedYaxis;
        this.sidebysideBarColumnData1 = this.sheetResponce.results.hStockedXaxis;
        this.horizentalStockedBar();
        this.bar = false;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = false;
          this.sidebyside = false;
          this.stocked = false;
          this.barLine = false;
          this.horizentalStocked = true;
          this.grouped = false;
          this.multiLine = false;
          this.donut = false;
       }
       if(responce.chart_id == 3){
        this.sidebysideBarRowData = this.sheetResponce.results.hgroupedYaxis;
        this.sidebysideBarColumnData1 = this.sheetResponce.results.hgroupedXaxis;
        this.hGrouped();
        this.bar = false;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = false;
          this.sidebyside = false;
          this.stocked = false;
          this.barLine = false;
          this.horizentalStocked = false;
          this.grouped = true;
          this.multiLine = false;
          this.donut = false;
       }
       if(responce.chart_id == 8){
        this.sidebysideBarRowData = this.sheetResponce.results.multiLineYaxis;
        this.sidebysideBarColumnData1 = this.sheetResponce.results.multiLineXaxis;
        this.multiLineChart();
        this.bar = false;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = false;
          this.sidebyside = false;
          this.stocked = false;
          this.barLine = false;
          this.horizentalStocked = false;
          this.grouped = false;
          this.multiLine = true;
          this.donut = false;
       }
       if(responce.chart_id == 10){
        this.chartsRowData = this.sheetResponce.results.donutYaxis;
        this.chartsColumnData = this.sheetResponce.results.donutXaxis;
        this.donutChart();
        this.bar = false;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = false;
          this.sidebyside = false;
          this.stocked = false;
          this.barLine = false;
          this.horizentalStocked = false;
          this.grouped = false;
          this.multiLine = false;
          this.donut = true;
       }
      },
      error: (error) => {
        console.log(error);
        this.getChartData();
      }
    }
  )
  }
  filterName:any
  filterType:any;
  openSuperScaled(modal: any,data:any) {
    this.filterDataArray = [];
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
    });
    this.filterName = data.column;
    this.filterType = data.data_type;
    this.filterDataGet();
  }
  filterData = [] as any;
  filter_id: any;
  filterDataGet(){
    const obj={
      "database_id" :this.databaseId,
      "query_set_id":this.qrySetId,
      "type_of_filter" : "sheet",
      "datasource_queryset_id" :this.filterQuerySetId,
      "col_name":this.filterName,
       "data_type":this.filterType,
      // "format_date":""
}
  this.workbechService.filterPost(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        this.filterData = responce.col_data;
        //this.filter_id = responce.filter_id;
      },
      error: (error) => {
        console.log(error);
      }
    }
  )
  }
  toggleEditAllRows(event:any){
    this.isAllSelected = !this.isAllSelected;
    this.filterData.forEach((element:any) => element['selected'] = this.isAllSelected);
    console.log(this.filterData)
  }
  filterDataArray = [] as any;
  filterCheck(event:any,data:any){
    if(event.target.checked){
      this.filterDataArray.push(data);
    }else{
      let index1 = this.filterDataArray.findIndex((i:any) => i == data);
      this.filterDataArray.splice(index1, 1);
    }
   console.log(this.filterDataArray)
  }
  filterDataPut(){
    this.dimetionMeasure = [];
    const obj={
    //"filter_id": this.filter_id,
    "database_id": this.databaseId,
    "queryset_id": this.qrySetId,
    "type_of_filter":"sheet",
    "datasource_querysetid" : this.filterQuerySetId,
    "range_values": [],
    "select_values":this.filterDataArray,
    "col_name":this.filterName,
       "data_type":this.filterType,
}
  this.workbechService.filterPut(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        this.filterId.push(responce.filter_id);
        this.filter_id=responce.filter_id
        this.dimetionMeasure.push({"col_name":this.filterName,"data_type":this.filterType,"filter_id":responce.filter_id});
        this.dataExtraction();
      },
      error: (error) => {
        console.log(error);
      }
    }
  )
  }
  filterEditGet(){
    this.filterData = [];
    const obj={
      "type_filter":"chartfilter",
      "database_id" :this.databaseId,
      "filter_id" :this.filter_id
}
  this.workbechService.filterEditPost(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        this.filter_id = responce.filter_id;
        this.filterName=responce.column_name;
        this.filterType=responce.data_type;
        responce.result.forEach((element:any) => {
          this.filterData.push(element);
        });
        
      },
      error: (error) => {
        console.log(error);
      }
    }
  )
  }
  filterDataEditArray = [] as any;
  filterDataEditPut(){
    const obj={
      "filter_id": this.filter_id,
      "database_id": this.databaseId,
      "queryset_id": this.qrySetId,
      "type_of_filter":"sheet",
      "datasource_querysetid" : this.filterQuerySetId,
      "range_values": [],
      "select_values":this.filterDataArray,
      "col_name":this.filterName,
      "data_type":this.filterType

  }
    this.workbechService.filterPut(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.dataExtraction();
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }
  filterDelete(index:any,filterId:any){
  this.workbechService.filterDelete(this.databaseId,filterId).subscribe({next: (responce:any) => {
        this.dimetionMeasure.splice(index, 1);
       let index1 = this.filterId.findIndex((i:any) => i == filterId);
         this.filterId.splice(index1, 1);
         this.dataExtraction();
      },
      error: (error) => {
        console.log(error);
      }
    }
  )
  }
  openSuperScaledModal(modal: any,type:any) {
    if(type === undefined){
      this.measureValue = '-Select-';
    }else{
    this.measureValue = type;
    }
    console.log(this.measureValue)
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
    });
}
openSuperScalededitFilter(modal: any,data:any) {
  this.modalService.open(modal, {
    centered: true,
    windowClass: 'animate__animated animate__zoomIn',
  });
  this.filterName = data.col_name;
  this.filterType = data.data_type;
  this.filterEditGet();
}
gotoDashboard(){
  const encodedDatabaseId = btoa(this.databaseId.toString());
  const encodedQuerySetId = btoa(this.qrySetId.toString());
  this.router.navigate(['/workbench/sheetscomponent/sheetsdashboard'+'/'+ encodedDatabaseId +'/' +encodedQuerySetId])
}
marksColor(color:any){
console.log(color)
this.color = color;
}
rename(index:any,name:any,event:any){
  this.oldColumn = '';
this.oldColumn = name;
//let rename = this.draggedColumnsData.indexOf((i:any) => i === index);
//console.log(rename[0])
let reName=`${this.draggedColumnsData.at(index)}`;
console.log(reName.split(',')[0])
}

renameColumn(index:any,column:any,event:any){
  this.newColumn = '';
  this.newColumn = column;
  if (event.keyCode === 13) {
  this.renameColumns();
 }
}
renameColumns(){
  const obj={
    "database_id":this.databaseId,
    "queryset_id":this.qrySetId,
    "old_col_name" :this.oldColumn,
    "new_col_name":this.newColumn
}
  this.workbechService.renameColumn(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        this.columnsData();
      },
      error: (error) => {
        console.log(error);
      }
    }
  )
 }

  editorConfig = {
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Georgia, serif',
        'Impact, Charcoal, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        'Courier New, Courier, monospace',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Comic Sans MS, Comic Sans, cursive',
        'Palatino Linotype, Book Antiqua, Palatino, serif',
        'Arial Black, Gadget, sans-serif'
      ],
      supportAllValues: true
    },
    fontSize: {
      options: [9, 11, 13, 'default', 17, 19, 21]
    },
    toolbar: ['undo', 'redo', '|', 'selectAll', '|', 'heading', '|', 'bold', 'italic', 'underline',
      '|', 'removeformat', '|', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|', 'alignment'],
    plugins: [
      Bold, Essentials, Italic, Mention, Paragraph, Undo, Font, Alignment, Underline, RemoveFormat, SelectAll, Heading],
  };

  toggleEditor() {
    this.editor = !this.editor;
  }
  updateSheetName() {
    const inputElement = document.getElementById('htmlContent') as HTMLInputElement;
    if (inputElement) {
      inputElement.innerHTML = this.sheetTagName;
      inputElement.style.paddingTop = '1.5%';
    }
  }
  fontChange(event : any, section : any){
    if (section === 'dimension') {
      if (event.target.value === 'arial') {
        if (this.barchart) {
          this.chartOptions3.xaxis.labels.style.fontFamily = 'Arial, sans-serif';
          this.chartOptions3.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions3.xaxis.labels.style.fontSize = '12px';
        }
        else if (this.areachart) {
          this.chartOptions1.xaxis.labels.style.fontFamily = 'Arial, sans-serif';
          this.chartOptions1.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions1.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.linechart){
          this.chartOptions.xaxis.labels.style.fontFamily = 'Arial, sans-serif';
          this.chartOptions.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.sidebysideChart){
          this.chartOptions2.xaxis.labels.style.fontFamily = 'Arial, sans-serif';
          this.chartOptions2.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions2.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.stockedChart){
          this.chartOptions6.xaxis.labels.style.fontFamily = 'Arial, sans-serif';
          this.chartOptions6.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions6.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.barlineChart){
          this.chartOptions5.xaxis.labels.style.fontFamily = 'Arial, sans-serif';
          this.chartOptions5.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions5.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.horizontolstockedChart){
          this.chartOptions7.xaxis.labels.style.fontFamily = 'Arial, sans-serif';
          this.chartOptions7.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions7.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.groupedChart){
          this.chartOptions8.xaxis.labels.style.fontFamily = 'Arial, sans-serif';
          this.chartOptions8.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions8.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.multilineChart){
          this.chartOptions9.xaxis.labels.style.fontFamily = 'Arial, sans-serif';
          this.chartOptions9.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions9.xaxis.labels.style.fontSize = '12px';
        }
      }
      if (event.target.value === 'calibri') {
        if (this.barchart) {
          this.chartOptions3.xaxis.labels.style.fontFamily = 'Calibri, sans-serif';
          this.chartOptions3.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions3.xaxis.labels.style.fontSize = '14px';
        }
        else if (this.areachart) {
          this.chartOptions1.xaxis.labels.style.fontFamily = 'Calibri, sans-serif';
          this.chartOptions1.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions1.xaxis.labels.style.fontSize = '14px';
        }
        else if(this.linechart){
          this.chartOptions.xaxis.labels.style.fontFamily = 'Calibri, sans-serif';
          this.chartOptions.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions.xaxis.labels.style.fontSize = '14px';
        }
        else if(this.sidebysideChart){
          this.chartOptions2.xaxis.labels.style.fontFamily = 'Calibri, sans-serif';
          this.chartOptions2.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions2.xaxis.labels.style.fontSize = '14px';
        }
        else if(this.stockedChart){
          this.chartOptions6.xaxis.labels.style.fontFamily = 'Calibri, sans-serif';
          this.chartOptions6.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions6.xaxis.labels.style.fontSize = '14px';
        }
        else if(this.barlineChart){
          this.chartOptions5.xaxis.labels.style.fontFamily = 'Calibri, sans-serif';
          this.chartOptions5.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions5.xaxis.labels.style.fontSize = '14px';
        }
        else if(this.horizontolstockedChart){
          this.chartOptions7.xaxis.labels.style.fontFamily = 'Calibri, sans-serif';
          this.chartOptions7.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions7.xaxis.labels.style.fontSize = '14px';
        }
        else if(this.groupedChart){
          this.chartOptions8.xaxis.labels.style.fontFamily = 'Calibri, sans-serif';
          this.chartOptions8.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions8.xaxis.labels.style.fontSize = '14px';
        }
        else if(this.multilineChart){
          this.chartOptions9.xaxis.labels.style.fontFamily = 'Calibri, sans-serif';
          this.chartOptions9.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions9.xaxis.labels.style.fontSize = '14px';
        }
      }
      if (event.target.value === 'times') {
        if (this.barchart) {
          this.chartOptions3.xaxis.labels.style.fontFamily = 'Times New Roman, serif';
          this.chartOptions3.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions3.xaxis.labels.style.fontSize = '16px';
        }
        else if (this.areachart) {
          this.chartOptions1.xaxis.labels.style.fontFamily = 'Times New Roman, serif';
          this.chartOptions1.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions1.xaxis.labels.style.fontSize = '16px';
        }
        else if(this.linechart){
          this.chartOptions.xaxis.labels.style.fontFamily = 'Times New Roman, serif';
          this.chartOptions.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions.xaxis.labels.style.fontSize = '16px';
        }
        else if(this.sidebysideChart){
          this.chartOptions2.xaxis.labels.style.fontFamily = 'Times New Roman, serif';
          this.chartOptions2.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions2.xaxis.labels.style.fontSize = '16px';
        }
        else if(this.stockedChart){
          this.chartOptions6.xaxis.labels.style.fontFamily = 'Times New Roman, serif';
          this.chartOptions6.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions6.xaxis.labels.style.fontSize = '16px';
        }
        else if(this.barlineChart){
          this.chartOptions5.xaxis.labels.style.fontFamily = 'Times New Roman, serif';
          this.chartOptions5.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions5.xaxis.labels.style.fontSize = '16px';
        }
        else if(this.horizontolstockedChart){
          this.chartOptions7.xaxis.labels.style.fontFamily = 'Times New Roman, serif';
          this.chartOptions7.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions7.xaxis.labels.style.fontSize = '16px';
        }
        else if(this.groupedChart){
          this.chartOptions8.xaxis.labels.style.fontFamily = 'Times New Roman, serif';
          this.chartOptions8.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions8.xaxis.labels.style.fontSize = '16px';
        }
        else if(this.multilineChart){
          this.chartOptions9.xaxis.labels.style.fontFamily = 'Times New Roman, serif';
          this.chartOptions9.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions9.xaxis.labels.style.fontSize = '16px';
        }
      }
      if (event.target.value === 'verdana') {
        if (this.barchart) {
          this.chartOptions3.xaxis.labels.style.fontFamily = 'Verdana, sans-serif';
          this.chartOptions3.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions3.xaxis.labels.style.fontSize = '12px';
        }
        else if (this.areachart) {
          this.chartOptions1.xaxis.labels.style.fontFamily = 'Verdana, sans-serif';
          this.chartOptions1.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions1.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.linechart){
          this.chartOptions.xaxis.labels.style.fontFamily = 'Verdana, sans-serif';
          this.chartOptions.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.sidebysideChart){
          this.chartOptions2.xaxis.labels.style.fontFamily = 'Verdana, sans-serif';
          this.chartOptions2.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions2.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.stockedChart){
          this.chartOptions6.xaxis.labels.style.fontFamily = 'Verdana, sans-serif';
          this.chartOptions6.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions6.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.barlineChart){
          this.chartOptions5.xaxis.labels.style.fontFamily = 'Verdana, sans-serif';
          this.chartOptions5.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions5.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.horizontolstockedChart){
          this.chartOptions7.xaxis.labels.style.fontFamily = 'Verdana, sans-serif';
          this.chartOptions7.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions7.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.groupedChart){
          this.chartOptions8.xaxis.labels.style.fontFamily = 'Verdana, sans-serif';
          this.chartOptions8.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions8.xaxis.labels.style.fontSize = '12px';
        }
        else if(this.multilineChart){
          this.chartOptions9.xaxis.labels.style.fontFamily = 'Verdana, sans-serif';
          this.chartOptions9.xaxis.labels.style.fontWeight = 'bold';
          this.chartOptions9.xaxis.labels.style.fontSize = '12px';
        }
      }
    }
    else{
      if(event.target.value === 'arial'){
        if (this.barchart) {
          if(this.chartOptions3.yaxis.length >0){
            (this.chartOptions3.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Arial, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions3.yaxis.labels.style.fontFamily = 'Arial, sans-serif';
            this.chartOptions3.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions3.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if (this.areachart){
          if(this.chartOptions1.yaxis.length >0){
            (this.chartOptions1.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Arial, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions1.yaxis.labels.style.fontFamily = 'Arial, sans-serif';
            this.chartOptions1.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions1.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.linechart){
          if(this.chartOptions.yaxis.length >0){
            (this.chartOptions.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Arial, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions.yaxis.labels.style.fontFamily = 'Arial, sans-serif';
            this.chartOptions.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.sidebysideChart){
          if(this.chartOptions2.yaxis.length >0){
            (this.chartOptions2.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Arial, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions2.yaxis.labels.style.fontFamily = 'Arial, sans-serif';
            this.chartOptions2.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions2.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.stockedChart){
          if(this.chartOptions6.yaxis.length >0){
            (this.chartOptions6.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Arial, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions6.yaxis.labels.style.fontFamily = 'Arial, sans-serif';
            this.chartOptions6.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions6.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.barlineChart){
          if(this.chartOptions5.yaxis.length >0){
            (this.chartOptions5.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Arial, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions5.yaxis.labels.style.fontFamily = 'Arial, sans-serif';
            this.chartOptions5.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions5.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.horizontolstockedChart){
          if(this.chartOptions7.yaxis.length >0){
            (this.chartOptions7.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Arial, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions7.yaxis.labels.style.fontFamily = 'Arial, sans-serif';
            this.chartOptions7.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions7.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.groupedChart){
          if(this.chartOptions8.yaxis.length >0){
            (this.chartOptions8.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Arial, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions8.yaxis.labels.style.fontFamily = 'Arial, sans-serif';
            this.chartOptions8.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions8.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.multilineChart){
          if(this.chartOptions9.yaxis.length >0){
            (this.chartOptions9.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Arial, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions9.yaxis.labels.style.fontFamily = 'Arial, sans-serif';
            this.chartOptions9.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions9.yaxis.labels.style.fontSize = '12px';
          }
        }
      }
      if(event.target.value === 'calibri'){
        if(this.barchart){
          if(this.chartOptions3.yaxis.length >0){
            (this.chartOptions3.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Calibri, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '14px';
            })
          }
          else{
            this.chartOptions3.yaxis.labels.style.fontFamily = 'Calibri, sans-serif';
            this.chartOptions3.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions3.yaxis.labels.style.fontSize = '14px';
          }
        }
        else if(this.areachart){
          if(this.chartOptions1.yaxis.length >0){
            (this.chartOptions1.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Calibri, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '14px';
            })
          }
          else{
            this.chartOptions1.yaxis.labels.style.fontFamily = 'Calibri, sans-serif';
            this.chartOptions1.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions1.yaxis.labels.style.fontSize = '14px';
          }
        }
        else if(this.linechart){
          if(this.chartOptions.yaxis.length >0){
            (this.chartOptions.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Calibri, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '14px';
            })
          }
          else{
            this.chartOptions.yaxis.labels.style.fontFamily = 'Calibri, sans-serif';
            this.chartOptions.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions.yaxis.labels.style.fontSize = '14px';
          }
        }
        else if(this.sidebysideChart){
          if(this.chartOptions2.yaxis.length >0){
            (this.chartOptions2.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Calibri, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '14px';
            })
          }
          else{
            this.chartOptions2.yaxis.labels.style.fontFamily = 'Calibri, sans-serif';
            this.chartOptions2.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions2.yaxis.labels.style.fontSize = '14px';
          }
        }
        else if(this.stockedChart){
          if(this.chartOptions6.yaxis.length >0){
            (this.chartOptions6.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Calibri, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '14px';
            })
          }
          else{
            this.chartOptions6.yaxis.labels.style.fontFamily = 'Calibri, sans-serif';
            this.chartOptions6.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions6.yaxis.labels.style.fontSize = '14px';
          }
        }
        else if(this.barlineChart){
          if(this.chartOptions5.yaxis.length >0){
            (this.chartOptions5.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Calibri, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '14px';
            })
          }
          else{
            this.chartOptions5.yaxis.labels.style.fontFamily = 'Calibri, sans-serif';
            this.chartOptions5.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions5.yaxis.labels.style.fontSize = '14px';
          }
        }
        else if(this.horizontolstockedChart){
          if(this.chartOptions7.yaxis.length >0){
            (this.chartOptions7.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Calibri, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '14px';
            })
          }
          else{
            this.chartOptions7.yaxis.labels.style.fontFamily = 'Calibri, sans-serif';
            this.chartOptions7.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions7.yaxis.labels.style.fontSize = '14px';
          }
        }
        else if(this.groupedChart){
          if(this.chartOptions8.yaxis.length >0){
            (this.chartOptions8.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Calibri, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '14px';
            })
          }
          else{
            this.chartOptions8.yaxis.labels.style.fontFamily = 'Calibri, sans-serif';
            this.chartOptions8.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions8.yaxis.labels.style.fontSize = '14px';
          }
        }
        else if(this.multilineChart){
          if(this.chartOptions9.yaxis.length >0){
            (this.chartOptions9.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Calibri, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '14px';
            })
          }
          else{
            this.chartOptions9.yaxis.labels.style.fontFamily = 'Calibri, sans-serif';
            this.chartOptions9.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions9.yaxis.labels.style.fontSize = '14px';
          }
        }
      }
      if(event.target.value === 'times'){
        if(this.barchart){
          if(this.chartOptions3.yaxis.length >0){
            (this.chartOptions3.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Times New Roman, serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '16px';
            })
          }
          else{
            this.chartOptions3.yaxis.labels.style.fontFamily = 'Times New Roman, serif';
            this.chartOptions3.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions3.yaxis.labels.style.fontSize = '16px';
          }
        }
        else if(this.areachart){
          if(this.chartOptions1.yaxis.length >0){
            (this.chartOptions1.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Times New Roman, serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '16px';
            })
          }
          else{
            this.chartOptions1.yaxis.labels.style.fontFamily = 'Times New Roman, serif';
            this.chartOptions1.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions1.yaxis.labels.style.fontSize = '16px';
          }
        }
        else if(this.linechart){
          if(this.chartOptions.yaxis.length >0){
            (this.chartOptions.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Times New Roman, serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '16px';
            })
          }
          else{
            this.chartOptions.yaxis.labels.style.fontFamily = 'Times New Roman, serif';
            this.chartOptions.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions.yaxis.labels.style.fontSize = '16px';
          }
        }
        else if(this.sidebysideChart){
          if(this.chartOptions2.yaxis.length >0){
            (this.chartOptions2.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Times New Roman, serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '16px';
            })
          }
          else{
            this.chartOptions2.yaxis.labels.style.fontFamily = 'Times New Roman, serif';
            this.chartOptions2.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions2.yaxis.labels.style.fontSize = '16px';
          }
        }
        else if(this.stockedChart){
          if(this.chartOptions6.yaxis.length >0){
            (this.chartOptions6.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Times New Roman, serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '16px';
            })
          }
          else{
            this.chartOptions6.yaxis.labels.style.fontFamily = 'Times New Roman, serif';
            this.chartOptions6.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions6.yaxis.labels.style.fontSize = '16px';
          }
        }
        else if(this.barlineChart){
          if(this.chartOptions5.yaxis.length >0){
            (this.chartOptions5.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Times New Roman, serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '16px';
            })
          }
          else{
            this.chartOptions5.yaxis.labels.style.fontFamily = 'Times New Roman, serif';
            this.chartOptions5.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions5.yaxis.labels.style.fontSize = '16px';
          }
        }
        else if(this.horizontolstockedChart){
          if(this.chartOptions7.yaxis.length >0){
            (this.chartOptions7.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Times New Roman, serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '16px';
            })
          }
          else{
            this.chartOptions7.yaxis.labels.style.fontFamily = 'Times New Roman, serif';
            this.chartOptions7.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions7.yaxis.labels.style.fontSize = '16px';
          }
        }
        else if(this.groupedChart){
          if(this.chartOptions8.yaxis.length >0){
            (this.chartOptions8.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Times New Roman, serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '16px';
            })
          }
          else{
            this.chartOptions8.yaxis.labels.style.fontFamily = 'Times New Roman, serif';
            this.chartOptions8.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions8.yaxis.labels.style.fontSize = '16px';
          }
        }
        else if(this.multilineChart){
          if(this.chartOptions9.yaxis.length >0){
            (this.chartOptions9.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Times New Roman, serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '16px';
            })
          }
          else{
            this.chartOptions9.yaxis.labels.style.fontFamily = 'Times New Roman, serif';
            this.chartOptions9.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions9.yaxis.labels.style.fontSize = '16px';
          }
        }
      }
      if(event.target.value === 'verdana'){
        if(this.barchart){
          if(this.chartOptions3.yaxis.length >0){
            (this.chartOptions3.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Verdana, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions3.yaxis.labels.style.fontFamily = 'Verdana, sans-serif';
            this.chartOptions3.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions3.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.areachart){
          if(this.chartOptions1.yaxis.length >0){
            (this.chartOptions1.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Verdana, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions1.yaxis.labels.style.fontFamily = 'Verdana, sans-serif';
            this.chartOptions1.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions1.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.linechart){
          if(this.chartOptions.yaxis.length >0){
            (this.chartOptions.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Verdana, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions.yaxis.labels.style.fontFamily = 'Verdana, sans-serif';
            this.chartOptions.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.sidebysideChart){
          if(this.chartOptions2.yaxis.length >0){
            (this.chartOptions2.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Verdana, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions2.yaxis.labels.style.fontFamily = 'Verdana, sans-serif';
            this.chartOptions2.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions2.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.stockedChart){
          if(this.chartOptions6.yaxis.length >0){
            (this.chartOptions6.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Verdana, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions6.yaxis.labels.style.fontFamily = 'Verdana, sans-serif';
            this.chartOptions6.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions6.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.barlineChart){
          if(this.chartOptions5.yaxis.length >0){
            (this.chartOptions5.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Verdana, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions5.yaxis.labels.style.fontFamily = 'Verdana, sans-serif';
            this.chartOptions5.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions5.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.horizontolstockedChart){
          if(this.chartOptions7.yaxis.length >0){
            (this.chartOptions7.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Verdana, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions7.yaxis.labels.style.fontFamily = 'Verdana, sans-serif';
            this.chartOptions7.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions7.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.groupedChart){
          if(this.chartOptions8.yaxis.length >0){
            (this.chartOptions8.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Verdana, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions8.yaxis.labels.style.fontFamily = 'Verdana, sans-serif';
            this.chartOptions8.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions8.yaxis.labels.style.fontSize = '12px';
          }
        }
        else if(this.multilineChart){
          if(this.chartOptions9.yaxis.length >0){
            (this.chartOptions9.yaxis as any[]).forEach((data)=>{
              data.labels.style.fontFamily = 'Verdana, sans-serif';
              data.labels.style.fontWeight = 'bold';
              data.labels.style.fontSize = '12px';
            })
          }
          else{
            this.chartOptions9.yaxis.labels.style.fontFamily = 'Verdana, sans-serif';
            this.chartOptions9.yaxis.labels.style.fontWeight = 'bold';
            this.chartOptions9.yaxis.labels.style.fontSize = '12px';
          }
        }
      }
    }
    
    console.log(this.chartOptions3);
    this.updateChart();
  }
  allignmentChange(event: any, section: any) {
    if (section === 'dimension') {
      if (event.target.value === 'center') {
        if(this.barchart){
          this.chartOptions3.xaxis.labels.offsetX = 0;
        }
        else if(this.areachart){
          this.chartOptions1.xaxis.labels.offsetX = 0;
        }
        else if(this.linechart){
          this.chartOptions.xaxis.labels.offsetX = 0;
        }
        else if(this.sidebysideChart){
          this.chartOptions2.xaxis.labels.offsetX = 0;
        }
        else if(this.stockedChart){
          this.chartOptions6.xaxis.labels.offsetX = 0;
        }
        else if(this.barlineChart){
          this.chartOptions5.xaxis.labels.offsetX = 0;
        }
        else if(this.horizontolstockedChart){
          this.chartOptions7.xaxis.labels.offsetX = 0;
        }
        else if(this.groupedChart){
          this.chartOptions8.xaxis.labels.offsetX = 0;
        }
        else if(this.multilineChart){
          this.chartOptions9.xaxis.labels.offsetX = 0;
        }

      }
      if (event.target.value === 'left') {
        if(this.barchart){
          this.chartOptions3.xaxis.labels.offsetX = -10;
        }
        else if(this.areachart){
          this.chartOptions1.xaxis.labels.offsetX = -10;
        }
        else if(this.linechart){
          this.chartOptions.xaxis.labels.offsetX = -10;
        }
        else if(this.sidebysideChart){
          this.chartOptions2.xaxis.labels.offsetX = -10;
        }
        else if(this.stockedChart){
          this.chartOptions6.xaxis.labels.offsetX = -10;
        }
        else if(this.barlineChart){
          this.chartOptions5.xaxis.labels.offsetX = -10;
        }
        else if(this.horizontolstockedChart){
          this.chartOptions7.xaxis.labels.offsetX = -10;
        }
        else if(this.groupedChart){
          this.chartOptions8.xaxis.labels.offsetX = -10;
        }
        else if(this.multilineChart){
          this.chartOptions9.xaxis.labels.offsetX = -10;
        }
      }
      if (event.target.value === 'right') {
        if(this.barchart){
          this.chartOptions3.xaxis.labels.offsetX = 10;
        }
        else if(this.areachart){
          this.chartOptions1.xaxis.labels.offsetX = 10;
        }
        else if(this.linechart){
          this.chartOptions.xaxis.labels.offsetX = 10;
        }
        else if(this.sidebysideChart){
          this.chartOptions2.xaxis.labels.offsetX = 10;
        }
        else if(this.stockedChart){
          this.chartOptions6.xaxis.labels.offsetX = 10;
        }
        else if(this.barlineChart){
          this.chartOptions5.xaxis.labels.offsetX = 10;
        }
        else if(this.horizontolstockedChart){
          this.chartOptions7.xaxis.labels.offsetX = 10;
        }
        else if(this.groupedChart){
          this.chartOptions8.xaxis.labels.offsetX = 10;
        }
        else if(this.multilineChart){
          this.chartOptions9.xaxis.labels.offsetX = 10;
        }
      }
    }
    else {
      if (event.target.value === 'center') {
        if(this.barchart){
          if (this.chartOptions3.yaxis.length > 0) {
            (this.chartOptions3.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 0;
            })
          }
          else {
            this.chartOptions3.yaxis.labels.offsetY = 0;
          }
        }
        else if(this.areachart){
          if (this.chartOptions1.yaxis.length > 0) {
            (this.chartOptions1.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 0;
            })
          }
          else {
            this.chartOptions1.yaxis.labels.offsetY = 0;
          }
        }
        else if(this.linechart){
          if (this.chartOptions.yaxis.length > 0) {
            (this.chartOptions.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 0;
            })
          }
          else {
            this.chartOptions.yaxis.labels.offsetY = 0;
          }
        }
        else if(this.sidebysideChart){
          if (this.chartOptions2.yaxis.length > 0) {
            (this.chartOptions2.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 0;
            })
          }
          else {
            this.chartOptions2.yaxis.labels.offsetY = 0;
          }
        }
        else if(this.stockedChart){
          if (this.chartOptions6.yaxis.length > 0) {
            (this.chartOptions6.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 0;
            })
          }
          else {
            this.chartOptions6.yaxis.labels.offsetY = 0;
          }
        }
        else if(this.barlineChart){
          if (this.chartOptions5.yaxis.length > 0) {
            (this.chartOptions5.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 0;
            })
          }
          else {
            this.chartOptions5.yaxis.labels.offsetY = 0;
          }
        }
        else if(this.horizontolstockedChart){
          if (this.chartOptions7.yaxis.length > 0) {
            (this.chartOptions7.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 0;
            })
          }
          else {
            this.chartOptions7.yaxis.labels.offsetY = 0;
          }
        }
        else if(this.groupedChart){
          if (this.chartOptions8.yaxis.length > 0) {
            (this.chartOptions8.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 0;
            })
          }
          else {
            this.chartOptions8.yaxis.labels.offsetY = 0;
          }
        }
        else if(this.multilineChart){
          if (this.chartOptions9.yaxis.length > 0) {
            (this.chartOptions9.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 0;
            })
          }
          else {
            this.chartOptions9.yaxis.labels.offsetY = 0;
          }
        }
      }
      if (event.target.value === 'up') {
        if(this.barchart){
          if (this.chartOptions3.yaxis.length > 0) {
            (this.chartOptions3.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = -10;
            })
          }
          else {
            this.chartOptions3.yaxis.labels.offsetY = -10;
          }
        }
        else if(this.areachart){
          if (this.chartOptions1.yaxis.length > 0) {
            (this.chartOptions1.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = -10;
            })
          }
          else {
            this.chartOptions1.yaxis.labels.offsetY = -10;
          }
        }
        else if(this.linechart){
          if (this.chartOptions.yaxis.length > 0) {
            (this.chartOptions.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = -10;
            })
          }
          else {
            this.chartOptions.yaxis.labels.offsetY = -10;
          }
        }
        else if(this.sidebysideChart){
          if (this.chartOptions2.yaxis.length > 0) {
            (this.chartOptions2.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = -10;
            })
          }
          else {
            this.chartOptions2.yaxis.labels.offsetY = -10;
          }
        }
        else if(this.stockedChart){
          if (this.chartOptions6.yaxis.length > 0) {
            (this.chartOptions6.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = -10;
            })
          }
          else {
            this.chartOptions6.yaxis.labels.offsetY = -10;
          }
        }
        else if(this.barlineChart){
          if (this.chartOptions5.yaxis.length > 0) {
            (this.chartOptions5.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = -10;
            })
          }
          else {
            this.chartOptions5.yaxis.labels.offsetY = -10;
          }
        }
        else if(this.horizontolstockedChart){
          if (this.chartOptions7.yaxis.length > 0) {
            (this.chartOptions7.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = -10;
            })
          }
          else {
            this.chartOptions7.yaxis.labels.offsetY = -10;
          }
        }
        else if(this.groupedChart){
          if (this.chartOptions8.yaxis.length > 0) {
            (this.chartOptions8.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = -10;
            })
          }
          else {
            this.chartOptions8.yaxis.labels.offsetY = -10;
          }
        }
        else if(this.multilineChart){
          if (this.chartOptions9.yaxis.length > 0) {
            (this.chartOptions9.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = -10;
            })
          }
          else {
            this.chartOptions9.yaxis.labels.offsetY = -10;
          }
        }
      }
      if (event.target.value === 'down') {
        if(this.barchart){
          if (this.chartOptions3.yaxis.length > 0) {
            (this.chartOptions3.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 10;
            })
          }
          else {
            this.chartOptions3.yaxis.labels.offsetY = 10;
          }
        }
        else if(this.areachart){
          if (this.chartOptions1.yaxis.length > 0) {
            (this.chartOptions1.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 10;
            })
          }
          else {
            this.chartOptions1.yaxis.labels.offsetY = 10;
          }
        }
        else if(this.linechart){
          if (this.chartOptions.yaxis.length > 0) {
            (this.chartOptions.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 10;
            })
          }
          else {
            this.chartOptions.yaxis.labels.offsetY = 10;
          }
        }
        else if(this.sidebysideChart){
          if (this.chartOptions2.yaxis.length > 0) {
            (this.chartOptions2.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 10;
            })
          }
          else {
            this.chartOptions2.yaxis.labels.offsetY = 10;
          }
        }
        else if(this.stockedChart){
          if (this.chartOptions6.yaxis.length > 0) {
            (this.chartOptions6.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 10;
            })
          }
          else {
            this.chartOptions6.yaxis.labels.offsetY = 10;
          }
        }
        else if(this.barlineChart){
          if (this.chartOptions5.yaxis.length > 0) {
            (this.chartOptions5.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 10;
            })
          }
          else {
            this.chartOptions5.yaxis.labels.offsetY = 10;
          }
        }
        else if(this.horizontolstockedChart){
          if (this.chartOptions7.yaxis.length > 0) {
            (this.chartOptions7.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 10;
            })
          }
          else {
            this.chartOptions7.yaxis.labels.offsetY = 10;
          }
        }
        else if(this.groupedChart){
          if (this.chartOptions8.yaxis.length > 0) {
            (this.chartOptions8.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 10;
            })
          }
          else {
            this.chartOptions8.yaxis.labels.offsetY = 10;
          }
        }
        else if(this.multilineChart){
          if (this.chartOptions9.yaxis.length > 0) {
            (this.chartOptions9.yaxis as any[]).forEach((data) => {
              data.labels.offsetY = 10;
            })
          }
          else {
            this.chartOptions9.yaxis.labels.offsetY = 10;
          }
        }
      }
    }
    this.updateChart();
  }
  updateChart() {
    if (this.barchart) {
      this.barchart.updateOptions(this.chartOptions3);
      console.log(this.chartOptions3);
    }
    else if(this.areachart){
      this.areachart.updateOptions(this.chartOptions1);
      console.log(this.chartOptions1);
    }
    else if(this.linechart){
      this.linechart.updateOptions(this.chartOptions);
      console.log(this.chartOptions);
    }
    else if(this.sidebysideChart){
      this.sidebysideChart.updateOptions(this.chartOptions2);
      console.log(this.chartOptions2);
    }
    else if(this.stockedChart){
      this.stockedChart.updateOptions(this.chartOptions6);
      console.log(this.chartOptions6);
    }
    else if(this.barlineChart){
      this.barlineChart.updateOptions(this.chartOptions5);
      console.log(this.chartOptions5);
    }
    else if(this.horizontolstockedChart){
      this.horizontolstockedChart.updateOptions(this.chartOptions7);
      console.log(this.chartOptions7);
    }
    else if(this.groupedChart){
      this.groupedChart.updateOptions(this.chartOptions8);
      console.log(this.chartOptions8);
    }
    else if(this.multilineChart){
      this.multilineChart.updateOptions(this.chartOptions9);
      console.log(this.chartOptions9);
    }
    else if(this.piechart){
      this.piechart.updateOptions(this.chartOptions4);
      console.log(this.chartOptions4);
    }
    else if(this.donutchart){
      this.donutchart.updateOptions(this.chartOptions10);
      console.log(this.chartOptions10);
    }
  }
  toggleSwitch(type : string) {
    if(type === 'banding'){
      this.bandingSwitch = !this.bandingSwitch;
    }
    else if(type === 'xlabel'){
      this.xLabelSwitch = !this.xLabelSwitch;
      if(this.barchart){
        this.chartOptions3.xaxis.labels.show = this.xLabelSwitch;
      }
      else if(this.areachart){
        this.chartOptions1.xaxis.labels.show = this.xLabelSwitch;
      }
      else if(this.linechart){
        this.chartOptions.xaxis.labels.show = this.xLabelSwitch;
      }
      else if(this.sidebysideChart){
        this.chartOptions2.xaxis.labels.show = this.xLabelSwitch;
      }
      else if(this.stockedChart){
        this.chartOptions6.xaxis.labels.show = this.xLabelSwitch;
      }
      else if(this.barlineChart){
        this.chartOptions5.xaxis.labels.show = this.xLabelSwitch;
      }
      else if(this.horizontolstockedChart){
        this.chartOptions7.xaxis.labels.show = this.xLabelSwitch;
      }
      else if(this.groupedChart){
        this.chartOptions8.xaxis.labels.show = this.xLabelSwitch;
      }
      else if(this.multilineChart){
        this.chartOptions9.xaxis.labels.show = this.xLabelSwitch;
      }
    }
    else if(type === 'ylabel'){
      this.yLabelSwitch = !this.yLabelSwitch;
      if(this.barchart){
        if(this.chartOptions3.yaxis.length >0){
          (this.chartOptions3.yaxis as any[]).forEach((data)=>{
            data.labels.show = this.yLabelSwitch;
          })
        }
        else{
          this.chartOptions3.yaxis.labels.show = this.yLabelSwitch;
        }
      }
      else if(this.areachart){
        if(this.chartOptions1.yaxis.length >0){
          (this.chartOptions1.yaxis as any[]).forEach((data)=>{
            data.labels.show = this.yLabelSwitch;
          })
        }
        else{
          this.chartOptions1.yaxis.labels.show = this.yLabelSwitch;
        }
      }
      else if(this.linechart){
        if(this.chartOptions.yaxis.length >0){
          (this.chartOptions.yaxis as any[]).forEach((data)=>{
            data.labels.show = this.yLabelSwitch;
          })
        }
        else{
          this.chartOptions.yaxis.labels.show = this.yLabelSwitch;
        }
      }
      else if(this.sidebysideChart){
        if(this.chartOptions2.yaxis.length >0){
          (this.chartOptions2.yaxis as any[]).forEach((data)=>{
            data.labels.show = this.yLabelSwitch;
          })
        }
        else{
          this.chartOptions2.yaxis.labels.show = this.yLabelSwitch;
        }
      }
      else if(this.stockedChart){
        if(this.chartOptions6.yaxis.length >0){
          (this.chartOptions6.yaxis as any[]).forEach((data)=>{
            data.labels.show = this.yLabelSwitch;
          })
        }
        else{
          this.chartOptions6.yaxis.labels.show = this.yLabelSwitch;
        }
      }
      else if(this.barlineChart){
        if(this.chartOptions5.yaxis.length >0){
          (this.chartOptions5.yaxis as any[]).forEach((data)=>{
            data.labels.show = this.yLabelSwitch;
          })
        }
        else{
          this.chartOptions5.yaxis.labels.show = this.yLabelSwitch;
        }
      }
      else if(this.horizontolstockedChart){
        if(this.chartOptions7.yaxis.length >0){
          (this.chartOptions7.yaxis as any[]).forEach((data)=>{
            data.labels.show = this.yLabelSwitch;
          })
        }
        else{
          this.chartOptions7.yaxis.labels.show = this.yLabelSwitch;
        }
      }
      else if(this.groupedChart){
        if(this.chartOptions8.yaxis.length >0){
          (this.chartOptions8.yaxis as any[]).forEach((data)=>{
            data.labels.show = this.yLabelSwitch;
          })
        }
        else{
          this.chartOptions8.yaxis.labels.show = this.yLabelSwitch;
        }
      }
      else if(this.multilineChart){
        if(this.chartOptions9.yaxis.length >0){
          (this.chartOptions9.yaxis as any[]).forEach((data)=>{
            data.labels.show = this.yLabelSwitch;
          })
        }
        else{
          this.chartOptions9.yaxis.labels.show = this.yLabelSwitch;
        }
      }
    }
    else if(type === 'xgrid'){
      this.xGridSwitch = !this.xGridSwitch;
      if(this.barchart){
        this.chartOptions3.grid.xaxis.lines.show = this.xGridSwitch;
      }
      else if(this.areachart){
        this.chartOptions1.grid.xaxis.lines.show = this.xGridSwitch;
      }
      else if(this.linechart){
        this.chartOptions.grid.xaxis.lines.show = this.xGridSwitch;
      }
      else if(this.sidebysideChart){
        this.chartOptions2.grid.xaxis.lines.show = this.xGridSwitch;
      }
      else if(this.stockedChart){
        this.chartOptions6.grid.xaxis.lines.show = this.xGridSwitch;
      }
      else if(this.barlineChart){
        this.chartOptions5.grid.xaxis.lines.show = this.xGridSwitch;
      }
      else if(this.horizontolstockedChart){
        this.chartOptions7.grid.xaxis.lines.show = this.xGridSwitch;
      }
      else if(this.groupedChart){
        this.chartOptions8.grid.xaxis.lines.show = this.xGridSwitch;
      }
      else if(this.multilineChart){
        this.chartOptions9.grid.xaxis.lines.show = this.xGridSwitch;
      }
    }
    else if(type === 'ygrid'){
      this.yGridSwitch = !this.yGridSwitch;
      if(this.barchart){
        this.chartOptions3.grid.yaxis.lines.show = this.yGridSwitch;
      }
      else if(this.areachart){
        this.chartOptions1.grid.yaxis.lines.show = this.yGridSwitch;
      }
      else if(this.linechart){
        this.chartOptions.grid.yaxis.lines.show = this.yGridSwitch;
      }
      else if(this.sidebysideChart){
        this.chartOptions2.grid.yaxis.lines.show = this.yGridSwitch;
      }
      else if(this.stockedChart){
        this.chartOptions6.grid.yaxis.lines.show = this.yGridSwitch;
      }
      else if(this.barlineChart){
        this.chartOptions5.grid.yaxis.lines.show = this.yGridSwitch;
      }
      else if(this.horizontolstockedChart){
        this.chartOptions7.grid.yaxis.lines.show = this.yGridSwitch;
      }
      else if(this.groupedChart){
        this.chartOptions8.grid.yaxis.lines.show = this.yGridSwitch;
      }
      else if(this.multilineChart){
        this.chartOptions9.grid.yaxis.lines.show = this.yGridSwitch;
      }
    }
    else if(type === 'legend'){
      this.legendSwitch = !this.legendSwitch;
      if(this.piechart){
        this.chartOptions4.legend.show = this.legendSwitch;
      }
      else if(this.donutchart){
        this.chartOptions10.legend.show = this.legendSwitch;
      }
    }
    this.updateChart();
  }
  formatNumber(value: number): string {
    let formattedNumber = value+'';

    if (this.displayUnits !== 'none') {
      switch (this.displayUnits) {
        case 'K':
          formattedNumber = (value / 1_000).toFixed(this.decimalPlaces) + 'K';
          break;
        case 'M':
          formattedNumber = (value / 1_000_000).toFixed(this.decimalPlaces) + 'M';
          break;
        case 'B':
          formattedNumber = (value / 1_000_000_000).toFixed(this.decimalPlaces) + 'B';
          break;
        case 'G':
          formattedNumber = (value / 1_000_000_000_000).toFixed(this.decimalPlaces) + 'G';
          break;
      }
    }

    return this.prefix + formattedNumber + this.suffix;
  }
  numberPopupTrigger(){
    this.numberPopup = !this.numberPopup;
  }

 getChartSuggestions() {
  
  const obj ={
    id:this.qrySetId
  }

  this.workbechService.getServerTablesList(obj).subscribe(
    data => {
      console.log(data)
      if (Array.isArray(data.data)) {
        // Handle the case where data.data is an array
        console.log(data.data.length);
        this.chartSuggestions = data.data;
        this.errorMessage = '';
      } else if (typeof data.data === 'string') {
        // Handle the case where data.data is a message
        console.log('Message:', data.data);
        // Optionally handle the message case, for example by showing it to the user
        this.chartSuggestions = [];
        this.errorMessage = data.data;
      } else {
        // Handle unexpected data format
        console.error('Unexpected data format:', data.data);
        this.chartSuggestions = [];
        this.errorMessage = 'Unexpected data format';
      }

    },
    error => {
      console.log("Error",error.message)
      this.chartSuggestions = null;
      this.errorMessage = 'Error fetching chart suggestions';
      console.error(error);
    }
  );
}
fetchChartData(chartData: any){
  this.databaseId = chartData.database_id;
          this.qrySetId = chartData.queryset_id;
          this.draggedColumnsData = chartData.col;
          this.draggedRowsData = chartData.row;
          this.draggedColumns = chartData.columns;
          this.draggedRows = chartData.rows;
          this.filterId =[];
          this.filterQuerySetId = null,
          this.sheetfilter_querysets_id = null;
          
          console.log("This is ChaetData",chartData)
          this.sheetTitle = chartData.chart_title
          if (chartData.chart_type==="Bar Chart"){
            this.chartDisplay(false,true,false,false,false,false,false,false,false,false,false,false,6);
          }else if (chartData.chart_type==="Pie Chart"){
            this.chartDisplay(false,false,false,false,true,false,false,false,false,false,false,false,24);
          }else if (chartData.chart_type==="Line Chart"){
            this.chartDisplay(false,false,false,true,false,false,false,false,false,false,false,false,13);
          }else if (chartData.chart_type==="Area Chart"){
            this.chartDisplay(false,false,true,false,false,false,false,false,false,false,false,false,17);
          }
          this.dataExtraction();

}

sendPrompt() {
  if (this.userPrompt.trim()) {
    const obj ={
      id:this.qrySetId,
      prompt:this.userPrompt.trim()
    }
    this.workbechService.getServerTablesList(obj).subscribe(
      data => {
        if (Array.isArray(data.data)) {
          this.chartSuggestions = data.data;
          this.errorMessage = '';
        } else if (typeof data.data === 'string') {
          this.chartSuggestions = [];
          this.errorMessage = data.data;
        } else {
          this.chartSuggestions = [];
          this.errorMessage = 'Unexpected data format';
        }
      },
      error => {
        this.chartSuggestions = null;
        this.errorMessage = 'Error sending prompt';
        console.error(error);
      }
    );
  }
}
}