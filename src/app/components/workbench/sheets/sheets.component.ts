import { Component } from '@angular/core';
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
import { NgApexchartsModule } from 'ng-apexcharts';
import {FormControl} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxColorsModule } from 'ngx-colors';
import { CommonModule } from '@angular/common';
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
    CdkDropListGroup, CdkDropList,CommonModule, CdkDrag,NgApexchartsModule,MatTabsModule,MatFormFieldModule,MatInputModule],
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
      this.sheetRetrive();
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
        name: '',
        data: this.chartsRowData,
      },
    ],
    chart: {
      toolbar: {
        show: false
      },
      height: 385,
      type: 'bar',
      foreColor: this.color,
    },
    grid: {
      show: false,      // you can either change hear to disable all grids
      xaxis: {
        lines: {
          show: false  //or just here to disable only x axis grids
         }
       },  
      yaxis: {
        lines: { 
          show: false  //or just here to disable only y axis
         }
       },   
    },
    plotOptions: {
      bar: {
        dataLabels: {
          hideOverflowingLabels:false,
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val + '';
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: [this.color],
      },
    },
    fill: {
      type: 'gradient',
    },
    xaxis: {
      categories: this.chartsColumnData,
      position: 'bottom',
      labels: {
        rotate:0,
        // offsetY: 0,
        trim: true,
        // minHeight: 40,
        hideOverlappingLabels: false,
        style: {
          colors: this.color,
          
        },
      //   formatter: (value) => {
      //     return (value && value.split(' ')[1][1] === '0' ? value : '');
      // }
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
    colors: [this.color],
    // fill: {
    //   type: 'gradient',
    //   gradient: {
    //     shade: 'light',
    //     type: 'horizontal',
    //     shadeIntensity: 0.25,
    //     gradientToColors: undefined,
    //     inverseColors: true,
    //     opacityFrom: 1,
    //     opacityTo: 1,
    //     stops: [50, 0, 100, 100],
    //   },
    // },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val: number) {
          return val + '$';
        },
      },
    },
    title: {
      text: '',
      offsetY: 10,
      align: 'center',
      style: {
        color: this.color,
      },
    },
    // tooltip: {
    //   theme: 'dark',
    //   marker: {
    //     show: true,
    //   },
    //   x: {
    //     show: true,
    //   },
    // },
  };
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
        position: "bottom"
    },
    dataLabels: {
        dropShadow: {
            enabled: false
        }
    },
    };
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
            enabled: false
        },
        stroke: {
            curve: 'straight',
            width: 3,
        },
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
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
                style: {
                    colors: this.color,
                    fontSize: '11px',
                    fontWeight: 600,
                    cssClass: 'apexcharts-xaxis-label',
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
            }
        }
    
}
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
      enabled: false,
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
      },
    },
    legend: {
      horizontalAlign: "left",
    },
  };
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
          // endingShape: "rounded"
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories:categories,
        
      },
      yaxis: {
        title: {
          text: '',
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
      },
    };
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
    },
    legend: {
      position: "right",
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  };
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
      borderColor: "rgba(119, 119, 142, 0.05)",
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
      enabledOnSeries: [1]
    },
    labels: categories,
    xaxis: {
      type: ""
    },
    yaxis: [
      {
        title: {
          text: "",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        }
      },
      {
        opposite: true,
        title: {
          text: "",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        }
      }
    ]
    
  };
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
    },
    legend: {
      position: "right",
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  };
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
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"]
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"]
    },
    xaxis: {
      categories: categories
    }
  };
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
      enabled: false
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
      labels: {
        trim: false
      },
      categories: categories
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
      borderColor: "#f1f1f1"
    }
  };
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
    ]
  };
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
          console.log(this.sidebysideBarColumnData1)
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
  dragStartedColumn(index:any){
    this.draggedColumns.splice(index, 1);
   this.draggedColumnsData.splice(index, 1);
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
}

