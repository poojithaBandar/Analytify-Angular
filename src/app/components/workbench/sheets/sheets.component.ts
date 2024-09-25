import { Component,ViewChild,NgZone } from '@angular/core';
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
import * as _ from 'lodash';
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
import * as echarts from 'echarts';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { InsightsButtonComponent } from '../insights-button/insights-button.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';
import { ViewTemplateDrivenService } from '../view-template-driven.service';
import { ToastrService } from 'ngx-toastr';
import { series } from '../../charts/apexcharts/data';
import { NgxPaginationModule } from 'ngx-pagination';
declare type HorizontalAlign = 'left' | 'center' | 'right';
interface TableRow {
  [key: string]: any;
}
interface Dimension {
  name: string;
  values: string[];
}
interface RangeSliderModel {
  minValue: number;
  maxValue: number;
  options: Options;
}
@Component({
  selector: 'app-sheets',
  standalone: true,
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: echarts }),
    },
  ],
  imports: [SharedModule, NgxEchartsModule, NgSelectModule,NgbModule,FormsModule,ReactiveFormsModule,MatIconModule,NgxColorsModule,
    CdkDropListGroup, CdkDropList,CommonModule, CdkDrag,NgApexchartsModule,MatTabsModule,MatFormFieldModule,MatInputModule,CKEditorModule,
    InsightsButtonComponent,NgxSliderModule,NgxPaginationModule],
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
  mulColData = [] as any;
  mulRowData = [] as any;
  draggedRowsData = [] as any;
  tablePreviewColumn = [] as any;
  tablePreviewRow = [] as any;
  tableData: TableRow[] = [];  
  displayedColumns: string[] = [];
  chartEnable = true;
  dimensionExpand = false;
  chartSuggestions: any = null;
  errorMessage : any;
  errorMessage1:any;
  userPrompt: string = '';
  selectedChartPlugin : string = 'apex'	
  isApexCharts : boolean = true;
  isEChatrts : boolean = false;
  isZoom : boolean = false;
  xLabelFontSize : number = 12;
  xLabelFontFamily : string = 'sans-serif';
  xlabelFontWeight : number = 400;
  xLabelColor : string = '#00a5a2';
  xGridColor : string = '#00a5a2';
  yLabelColor : string = '#00a5a2';
  yGridColor : string = '#00a5a2';
  filterSearch! : string;
  editFilterSearch! : string;
  tableSearch! : string;
  isMeasureEdit : boolean = false;
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
  fileId:any;
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
  heatMapChartOptions: any;
  funnelChartOptions:any;
  guageChartOptions:any;
  eBarChartOptions: any;
  eStackedBarChartOptions: any;
  eGroupedBarChartOptions: any;
  eMultiBarChartOptions: any;
  ehorizontalStackedBarChartOptions: any;
  eSideBySideBarChartOptions: any;
  eAreaChartOptions: any;
  eLineChartOptions: any;
  ePieChartOptions: any;
  eBarLineChartOptions: any;
  eRadarChartOptions: any;
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
  activeTabId = 1;
  fromFileId=false;
  sheetsDashboard : boolean = false;
  sheetList : any [] = [];
  dashboardId : any;
  selectedDashboardId : any = 0;
  GridColor : any;
  apexbBgColor : any;
  dateValue : any = "-Select-";
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
  KPIDecimalPlaces: number = 0;
  KPIRoundPlaces: number = 0;
  KPIDisplayUnits: string = 'none';
  KPIPrefix: string = '';
  KPISuffix: string = '';
  isCustomSql = false;
  canDrop = true;
  createdBy : any;
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
  @ViewChild('funnelChart') funnelCharts!: ChartComponent;
  radar: boolean = false;
  radarRowData: any = [];
  labelAlignment : HorizontalAlign = 'left';
  backgroundColor: string = '#fff';
  canEditDb = false;
  draggedDrillDownColumns = [] as any;
  drillDownIndex : number = 0;
  originalData : any ;
  dateDrillDownSwitch : boolean = false;
  drillDownLevel : any[] = [];
  drillDownObject: any[] = [];
  sheetCustomQuery: any;
  KPINumber: any;

  tableDataDisplay: TableRow[] = [];
  tableColumnsDisplay: string[] = [];
  tableRowDisplayPreview = [] as any;
  tableColumnDisplayPreview = [] as any;

  itemsPerPage!:number;
  pageNo = 1;
  page: number = 1;
  totalItems:any;
  tableChartSearch:any;

  tablePaginationCustomQuery:any;
  tablePaginationColumn =[] as any;
  tablePaginationRows =[] as any;

  guagechartRowData:any;
  minValueGuage: number = 0; // Default minimum value
  maxValueGuage: number = 100; // Default maximum value

  constructor(private workbechService:WorkbenchService,private route:ActivatedRoute,private modalService: NgbModal,private router:Router,private zone: NgZone, private sanitizer: DomSanitizer,
    private templateService:ViewTemplateDrivenService,private toasterService:ToastrService){   
    if(this.router.url.includes('/workbench/sheets/dbId')){
      if (route.snapshot.params['id1'] && route.snapshot.params['id2']&& route.snapshot.params['id3'] ) {
        this.databaseId = +atob(route.snapshot.params['id1']);
        this.qrySetId = +atob(route.snapshot.params['id2']);
        this.filterQuerySetId = atob(route.snapshot.params['id3'])
          // this.tabs[0] = this.sheetName;
          this.sheetTagName = this.sheetName;
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
     if(this.router.url.includes('/workbench/sheets/fileId')){
      if (route.snapshot.params['id1'] && route.snapshot.params['id2']&& route.snapshot.params['id3'] ) {
        this.fileId = +atob(route.snapshot.params['id1']);
        this.qrySetId = +atob(route.snapshot.params['id2']);
        this.filterQuerySetId = atob(route.snapshot.params['id3']);
        // this.tabs[0] = this.sheetName;
        this.sheetTagName = this.sheetName;
        this.fromFileId = true;
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
 // if(this.router.url.includes('/workbench/landingpage/sheets/')){ //old landing page to sheet 
  //   console.log("landing page")
  //   if (route.snapshot.params['id1'] && route.snapshot.params['id2'] && route.snapshot.params['id3']) {
  //     this.databaseId = +atob(route.snapshot.params['id1']);
  //     this.qrySetId = +atob(route.snapshot.params['id2'])
  //     this.retriveDataSheet_id = +atob(route.snapshot.params['id3'])
  //     console.log(this.retriveDataSheet_id);
  //     //this.tabs[0] = this.sheetName;
  //     // this.sheetRetrive();
  //     }
  //  }
  if(this.router.url.includes('/workbench/landingpage/dbId/sheets/')){
    if (route.snapshot.params['id1'] && route.snapshot.params['id2'] && route.snapshot.params['id3']) {
      this.databaseId = +atob(route.snapshot.params['id1']);
      this.qrySetId = +atob(route.snapshot.params['id2'])
      this.retriveDataSheet_id = +atob(route.snapshot.params['id3'])
      console.log(this.retriveDataSheet_id);
      //this.tabs[0] = this.sheetName;
      // this.sheetRetrive();
      }
   }
   if(this.router.url.includes('/workbench/landingpage/fileId/sheets/')){
    this.fromFileId = true;
    if (route.snapshot.params['id1'] && route.snapshot.params['id2'] && route.snapshot.params['id3']) {
      this.fileId = +atob(route.snapshot.params['id1']);
      this.qrySetId = +atob(route.snapshot.params['id2'])
      this.retriveDataSheet_id = +atob(route.snapshot.params['id3'])
      console.log(this.retriveDataSheet_id);
      //this.tabs[0] = this.sheetName;
      // this.sheetRetrive();
      }
   }


   if(this.router.url.includes('/workbench/sheetsdashboard/sheets/fileId/')){
    this.sheetsDashboard = true;
    this.fromFileId = true;
    console.log("landing page")
    if (route.snapshot.params['id1'] && route.snapshot.params['id2'] && route.snapshot.params['id3'] && route.snapshot.params['id4']) {
      this.fileId = +atob(route.snapshot.params['id1']);
      this.qrySetId = +atob(route.snapshot.params['id2']);
      this.retriveDataSheet_id = +atob(route.snapshot.params['id3']);
      this.dashboardId = +atob(route.snapshot.params['id4']);
      console.log(this.retriveDataSheet_id)
      // this.sheetRetrive();
      }
   } 
   if(this.router.url.includes('/workbench/sheetsdashboard/sheets/dbId/')){
    this.sheetsDashboard = true;
    this.fromFileId = false;
    console.log("landing page")
    if (route.snapshot.params['id1'] && route.snapshot.params['id2'] && route.snapshot.params['id3'] && route.snapshot.params['id4']) {
      this.databaseId = +atob(route.snapshot.params['id1']);
      this.qrySetId = +atob(route.snapshot.params['id2']);
      this.retriveDataSheet_id = +atob(route.snapshot.params['id3']);
      this.dashboardId = +atob(route.snapshot.params['id4']);
      console.log(this.retriveDataSheet_id)
      // this.sheetRetrive();
      }
   } 
   this.canEditDb = this.templateService.addDatasource();
   this.canDrop = !this.canEditDb
  }

  ngOnInit(): void {
    this.columnsData();
    this.sheetTitle = this.sheetTitle +this.sheetNumber;
    this.getSheetNames();
    this.getDashboardsList();
    // this.sheetRetrive();
  }
 async getSheetNames(){
  //this.tabs = [];
  const obj={
    "server_id":this.databaseId,
    "queryset_id":this.qrySetId,
}as any;
if(this.fromFileId){
  delete obj.server_id;
  obj.file_id=this.fileId;
}
  this.workbechService.getSheetNames(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        if(responce.data.length>0){
          this.sheetList = responce.data;
          this.sheetNumber = this.sheetList.length+1;
          (responce.data as any[]).forEach((sheet,index)=>{
            this.tabs.push(sheet.sheet_name);
            if(sheet.id === this.retriveDataSheet_id){
              this.selectedTabIndex = index;
            }
          });
          console.log(this.tabs);
          
        // this.sheetTitle = this.tabs[0];
        this.SheetSavePlusEnabled.splice(0, 1);
        console.log(this.SheetSavePlusEnabled)
          // this.sheetRetrive();
        }
        else {
          this.SheetSavePlusEnabled.splice(0, 1);
          this.sheetNumber = 1;
          this.addSheet();
        }
      },
      error: (error) => {
        console.log(error);
      }
    }
  )
 }
  goToDataSource(){

    if(this.isCustomSql){
      const encodeddbId = btoa(this.databaseId?.toString());
      const encodedqurysetId = btoa(this.qrySetId.toString());
      const encodedFileId = btoa(this.fileId?.toString());

      const fromSource = this.fromFileId ? 'fileId' : 'dbId'
      const idToPass = this.fromFileId ? encodedFileId : encodeddbId;

      if (this.filterQuerySetId === null || this.filterQuerySetId === undefined) {
        // Encode 'null' to represent a null value
       const encodedDsQuerySetId = btoa('null');
       this.router.navigate(['/workbench/database-connection/savedQuery/'+fromSource+'/'+idToPass+'/'+encodedqurysetId])
  
      } else {
        // Convert to string and encode
       const encodedDsQuerySetId = btoa(this.filterQuerySetId.toString());
       this.router.navigate(['/workbench/database-connection/savedQuery/'+fromSource+'/'+idToPass+'/'+encodedqurysetId])
    
      } 
     }
    else{
    const encodeddbId = btoa(this.databaseId?.toString());
    const encodedqurysetId = btoa(this.qrySetId.toString());
    const encodedFileId = btoa(this.fileId?.toString());
    // this.router.navigate(['/workbench/database-connection/sheets/'+encodeddbId+'/'+encodedqurysetId])

    const idToPass = this.fromFileId ? encodedFileId : encodeddbId;
    const fromSource = this.fromFileId ? 'fileId' : 'dbId'
  
    if (this.filterQuerySetId === null || this.filterQuerySetId === undefined) {
      // Encode 'null' to represent a null value
     const encodedDsQuerySetId = btoa('null');
     this.router.navigate(['/workbench/database-connection/sheets/'+fromSource+'/'+idToPass+'/'+encodedqurysetId+'/'+encodedDsQuerySetId])

    } else {
      // Convert to string and encode
     const encodedDsQuerySetId = btoa(this.filterQuerySetId.toString());
     this.router.navigate(['/workbench/database-connection/sheets/'+fromSource+'/'+idToPass+'/'+encodedqurysetId+'/'+encodedDsQuerySetId])
  
    }
  }

  }
  goToConnections(){
    this.router.navigate(['/workbench/work-bench/view-connections'])
  }
  toggleSubMenu(menu: any) {
    menu.expanded = !menu.expanded;
  }

  barChart() {
    if (this.isApexCharts) {
      const self = this;
        this.chartOptions3 = {
          series: [
            {
              name: "",
              data: this.chartsRowData 
            }
          ],
          annotations: {
            points: [{
              x: 'zoom',
              seriesIndex: 0,
              label: {
                borderColor: '#775DD0',
                offsetY: 0,
                style: {
                  color: '#fff',
                  background: '#775DD0',
                },
                text: 'zoom',
              }
            }]
          },
          chart: {
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true || '<img src="./assets/images/icons/home-icon.png" width="20">',
              },
              autoSelected: 'zoom' 
            },
            type: 'bar',
            height: 320,
            foreColor: this.color, 
            events: {
              dataPointSelection: function (event: any, chartContext: any, config: any) {
                const selectedXValue = self.chartsColumnData[config.dataPointIndex];
                console.log('X-axis value:', selectedXValue);
                if (self.drillDownIndex < self.draggedDrillDownColumns.length - 1) {
                  const selectedXValue = self.chartsColumnData[config.dataPointIndex];
                  console.log('X-axis value:', selectedXValue);
                  let nestedKey = self.draggedDrillDownColumns[self.drillDownIndex];
                  self.drillDownIndex++;
                  let obj = { [nestedKey]: selectedXValue };
                  self.drillDownObject.push(obj);
                  self.setOriginalData();
                  self.dataExtraction();
                }
              }
            }
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
            categories: this.chartsColumnData.map((category : any)  => category === null ? 'null' : category),
            tickPlacement: 'on',
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
              // formatter: this.formatNumber.bind(this)
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
            borderColor: '#90A4AE',
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
    } else {
      this.eBarChartOptions = {
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
            align: this.labelAlignment// Hide xAxis labels
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
            // formatter: function (value: number) {
            //   return (value * 1) + 'k'; 
            // }
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
            label: { show: true },
            type: 'bar',
            barWidth: '60%',
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
  }
  pieChart(){
    if(this.isApexCharts){
      const self = this;
        this.chartOptions4 = {
          series: this.chartsRowData,
          chart: {
            height: 300,
            type: 'pie',
            events: {
              dataPointSelection: function (event: any, chartContext: any, config: any) {
                const selectedXValue = self.chartsColumnData[config.dataPointIndex];
                console.log('X-axis value:', selectedXValue);
                if (self.drillDownIndex < self.draggedDrillDownColumns.length - 1) {
                  const selectedXValue = self.chartOptions4.labels[config.dataPointIndex];
                  console.log('X-axis value:', selectedXValue);
                  let nestedKey = self.draggedDrillDownColumns[self.drillDownIndex];
                  self.drillDownIndex++;
                  let obj = { [nestedKey]: selectedXValue };
                  self.drillDownObject.push(obj);
                  self.setOriginalData();
                  self.dataExtraction();
                }
              }
            }
          },
          colors: ["#00a5a2", "#31d1ce", "#f5b849", "#49b6f5", "#e6533c"],
          labels: this.chartsColumnData.map((category: any) => category === null ? 'null' : category),
          legend: {
            show: true,
            position: "bottom"
          },
          dataLabels: {
            enabled: true,
            dropShadow: {
              enabled: false
            }
          },
          tooltip: {
            enabled:true,
            y: {
              formatter: function(value: number) {
                console.log("Tooltip triggered"); // Simple debug message
                return value;
              }
            }
          }
        };
    }
     else {
      let combinedArray = this.chartsRowData.map((value : any, index :number) => ({
        value: value,
        name: this.chartsColumnData[index]
      }));
      this.ePieChartOptions = {
        backgroundColor: this.backgroundColor,
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'horizontal',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: combinedArray,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    }
  }
  lineChart() {
    if (this.isApexCharts) {
      const self = this;
        this.chartOptions = {
          series: [{
            name: "",
            data: this.chartsRowData
          }],
          annotations: {
            points: [{
              x: 'zoom',
              seriesIndex: 0,
              label: {
                borderColor: '#775DD0',
                offsetY: 0,
                style: {
                  color: '#fff',
                  background: '#775DD0',
                },
                text: 'zoom',
              }
            }]
          },
          chart: {
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true || '<img src="./assets/images/icons/home-icon.png" width="20">',
              },
              autoSelected: 'zoom' 
            },
            height: 200,
            type: 'line',
            reponsive: true,
            zoom: {
              enabled: true
            },
            events: {
              mounted: (chart: any) => {
                chart.windowResizeHandler();
              },
              dataPointSelection: function (event: any, chartContext: any, config: any) {
                if (self.drillDownIndex < self.draggedDrillDownColumns.length - 1) {
                  const selectedXValue = self.chartsColumnData[config.dataPointIndex];
                  console.log('X-axis value:', selectedXValue);
                  let nestedKey = self.draggedDrillDownColumns[self.drillDownIndex];
                  self.drillDownIndex++;
                  let obj = { [nestedKey]: selectedXValue };
                  self.drillDownObject.push(obj);
                  self.setOriginalData();
                  self.dataExtraction();
                }
              },
            }
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
              tooltip: {
                intersect: true,
                shared: false
              },
              markers: { size: 10 },
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
              categories: this.chartsColumnData.map((category: any) => category === null ? 'null' : category),
              tickPlacement: 'on',
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
      } else {
        this.eLineChartOptions = {
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
              align: this.labelAlignment// Hide xAxis labels
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
    }
    areaChart(){
      if (this.isApexCharts) {
          this.chartOptions1 = {
            series: [
              {
                name: "",
                data: this.chartsRowData,
              },
            ],
            annotations: {
              points: [{
                x: 'zoom',
                seriesIndex: 0,
                label: {
                  borderColor: '#775DD0',
                  offsetY: 0,
                  style: {
                    color: '#fff',
                    background: '#775DD0',
                  },
                  text: 'zoom',
                }
              }]
            },
            chart: {
              toolbar: {
                show: true,
                offsetX: 0,
                offsetY: 0,
                tools: {
                  download: true,
                  selection: true,
                  zoom: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  reset: true || '<img src="./assets/images/icons/home-icon.png" width="20">',
                },
                autoSelected: 'zoom' 
              },
              type: "area",
              height: 200,
              zoom: {
                enabled: true,
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
            labels: this.chartsColumnData.map((category: any) => category === null ? 'null' : category),
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
              tickPlacement: 'on'
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
      } else {
        this.eAreaChartOptions = {
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
              align: this.labelAlignment// Hide xAxis labels
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
      }
    }
    sidebysideBar(){
      const dimensions: Dimension[] = this.sidebysideBarColumnData1;
      const categories = this.flattenDimensions(dimensions);
      if(this.isApexCharts){
        this.chartOptions2 = {
          series: this.sidebysideBarRowData,
          annotations: {
            points: [{
              x: 'zoom',
              seriesIndex: 0,
              label: {
                borderColor: '#775DD0',
                offsetY: 0,
                style: {
                  color: '#fff',
                  background: '#775DD0',
                },
                text: 'zoom',
              }
            }]
          },
          colors: ['#00a5a2', '#0dc9c5', '#f43f63'],
          chart: {
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true || '<img src="./assets/images/icons/home-icon.png" width="20">',
              },
              autoSelected: 'zoom' 
            },
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
            categories: categories,
            tickPlacement: 'on',
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
              formatter: function (val: any) {
                console.log(val)
                return val;
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
    } else {
      let yaxisOptions = _.cloneDeep(this.sidebysideBarRowData);
      yaxisOptions.forEach((bar : any)=>{
bar["type"]="bar";
      });
      this.eSideBySideBarChartOptions = {
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
            align: this.labelAlignment// Hide xAxis labels
          }
        },
        toggleGridLines: true,
        xAxis: {
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
        series: yaxisOptions,
        

      };
    }
    }
    flattenDimensions(dimensions: Dimension[]): string[] {
      const numCategories = Math.max(...dimensions.map(dim => dim.values.length));
      return Array.from({ length: numCategories }, (_, index) => {
        return dimensions.map(dim => dim.values[index] === null ? 'null' : dim.values[index] || '').join(',');
      });
    }
    stockedBar(){
      const dimensions: Dimension[] = this.sidebysideBarColumnData1;
      const categories = this.flattenDimensions(dimensions);
      if(this.isApexCharts){
        this.chartOptions6 = {
          series: this.sidebysideBarRowData,
          annotations: {
            points: [{
              x: 'zoom',
              seriesIndex: 0,
              label: {
                borderColor: '#775DD0',
                offsetY: 0,
                style: {
                  color: '#fff',
                  background: '#775DD0',
                },
                text: 'zoom',
              }
            }]
          },
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
              horizontal: false
            }
          },
          xaxis: {
            type: "category",
            categories: categories,
            tickPlacement: 'on',
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
    } else {
      let yaxisOptions = _.cloneDeep(this.sidebysideBarRowData);
      yaxisOptions.forEach((bar : any)=>{
bar["type"]="bar";
bar["stack"]="total";
      });
      this.eStackedBarChartOptions = {
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
            align: this.labelAlignment// Hide xAxis labels
          }
        },
        toggleGridLines: true,
        xAxis: {
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
        series: yaxisOptions,
        

      };
    }

    }

    barLineChart(){
      const dimensions: Dimension[] = this.sidebysideBarColumnData1;
      const categories = this.flattenDimensions(dimensions);
      if (this.isApexCharts) {
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
            annotations: {
              points: [{
                x: 'zoom',
                seriesIndex: 0,
                label: {
                  borderColor: '#775DD0',
                  offsetY: 0,
                  style: {
                    color: '#fff',
                    background: '#775DD0',
                  },
                  text: 'zoom',
                }
              }]
            },
            colors: ['#00a5a2', '#31d1ce'],
            chart: {
              toolbar: {
                show: true,
                offsetX: 0,
                offsetY: 0,
                tools: {
                  download: true,
                  selection: true,
                  zoom: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  reset: true || '<img src="./assets/images/icons/home-icon.png" width="20">',
                },
                autoSelected: 'zoom' 
              },
              height: 350,
              type: "line"
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
              tickPlacement: 'on',
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
            yaxis: [
              {
                show: true,
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
                show: true,
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
      } else {
        this.eBarLineChartOptions = {
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
              magicType: { show: true, type: ['line', 'bar', 'stack'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {

          },
          xAxis: [
            {
              type: 'category',
              data: categories,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: 'Bar'
            },
            {
              type: 'value',
              name: 'Line'
            }
          ],
          // yAxis: {
          //       type: 'value',
          //       axisLine: {
          //           lineStyle: {
          //               color: "#8c9097"
          //           }
          //       },
          //       // splitLine: {
          //       //     lineStyle: {
          //       //         color: "rgba(142, 156, 173,0.1)"
          //       //     }
          //       // }
          //   },
          // yAxis: [
          //   {
          //     type: 'value',
          //     name: 'Precipitation',
          //     min: 0,
          //     max: 250,
          //     interval: 50,
          //     axisLabel: {
          //       formatter: '{value} ml'
          //     }
          //   }
          // ],
          series: [
            {
              name: this.sidebysideBarRowData[0]?.name,
              type: 'bar',
              // xAxisIndex: 1,
              yAxisIndex: 1,
              // tooltip: {
              //   valueFormatter: function (value) {
              //     return value + ' ml';
              //   }
              // },
              data: this.sidebysideBarRowData[0]?.data
            },

            {
              name: this.sidebysideBarRowData[1]?.name,
              type: 'line',
              // xAxisIndex: 1,
              yAxisIndex: 1,
              // tooltip: {
              //   valueFormatter: function (value) {
              //     return value + ' °C';
              //   }
              // },
              lineStyle: {
                color: "red"
              },
              data: this.sidebysideBarRowData[1]?.data
            }
          ]
        };
      }
    }
    radarChart(){
      const dimensions: Dimension[] = this.sidebysideBarColumnData1;
      const categories = this.flattenDimensions(dimensions);
      let radarArray = categories.map((value: any, index: number) => ({
        name: categories[index]
      }));
      let legendArray = this.radarRowData.map((data: any) => ({
        name: data.name
      }));
      this.eRadarChartOptions = {
        backgroundColor: this.backgroundColor,
        tooltip: { trigger: "item" },
        legend: {
          data: legendArray
        },
        dataZoom: {
          show: true,

        },
        axisName: {
          color: 'rgb(238, 197, 102)'
        },
        axisLabel : {
          color : this.xLabelColor
        },
        radar: {
          // shape: 'circle',
          indicator:
            radarArray

        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: this.radarRowData,

          }
        ]
      }
    }
    horizentalStockedBar(){
      const dimensions: Dimension[] = this.sidebysideBarColumnData1;
      const categories = this.flattenDimensions(dimensions);
      if(this.isApexCharts){
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
    } else {
      let yaxisOptions = _.cloneDeep(this.sidebysideBarRowData);
      yaxisOptions.forEach((bar : any)=>{
bar["type"]="bar";
bar["stack"]="total";
      });
      this.ehorizontalStackedBarChartOptions = {
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
            align: this.labelAlignment// Hide xAxis labels
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
        series: yaxisOptions,
        

      };
    }
    }
    hGrouped(){
      const dimensions: Dimension[] = this.sidebysideBarColumnData1;
      const categories = this.flattenDimensions(dimensions);
      if(this.isApexCharts){
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
     } else {
        let yaxisOptions = _.cloneDeep(this.sidebysideBarRowData);
        yaxisOptions.forEach((bar : any)=>{
  bar["type"]="bar";
        });
        this.eGroupedBarChartOptions = {
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
              align: this.labelAlignment// Hide xAxis labels
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
          series: yaxisOptions,
          
  
        };
      }
    }
    multiLineChart(){
      const dimensions: Dimension[] = this.sidebysideBarColumnData1;
      const categories = this.flattenDimensions(dimensions);
      if(this.isApexCharts){
        this.chartOptions9 = {
          series: this.sidebysideBarRowData,
          annotations: {
            points: [{
              x: 'zoom',
              seriesIndex: 0,
              label: {
                borderColor: '#775DD0',
                offsetY: 0,
                style: {
                  color: '#fff',
                  background: '#775DD0',
                },
                text: 'zoom',
              }
            }]
          },
          chart: {
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true || '<img src="./assets/images/icons/home-icon.png" width="20">',
              },
              autoSelected: 'zoom' 
            },
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
            tooltipHoverFormatter: function (val: any, opts: any) {
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
            tickPlacement: 'on',
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
                  formatter: function (val: any) {
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
    } else {
      let yaxisOptions = _.cloneDeep(this.sidebysideBarRowData);
      yaxisOptions.forEach((bar : any)=>{
bar["type"]="line";
      });
      this.eMultiBarChartOptions = {
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
            align: this.labelAlignment// Hide xAxis labels
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
        series: yaxisOptions,
        

      };
    }
    }
    donutChart(){
      const self = this;
        this.chartOptions10 = {
          series: this.chartsRowData,
          chart: {
            type: "donut",
            events: {
              dataPointSelection: function (event: any, chartContext: any, config: any) {
                if (self.drillDownIndex < self.draggedDrillDownColumns.length - 1) {
                  const selectedXValue = self.chartsColumnData[config.dataPointIndex];
                  console.log('X-axis value:', selectedXValue);
                  let nestedKey = self.draggedDrillDownColumns[self.drillDownIndex];
                  self.drillDownIndex++;
                  let obj = { [nestedKey]: selectedXValue };
                  self.drillDownObject.push(obj);
                  self.setOriginalData();
                  self.dataExtraction();
                }
              }
            }
          },
          labels: this.chartsColumnData.map((category: any) => category === null ? 'null' : category),
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
          dataLabels: {
            enabled: true,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: false,
                  name: {
                    show: true
                  },
                  value: {
                    show: true,
                    formatter: (val:any) => {
                      return val;
                    }
                  },
                  total: {
                    show: true,
                    showAlways: true,
                    formatter: (w:any) => {
                      return w.globals.seriesTotals.reduce((a:any, b:any) => {
                        return +a + b
                      }, 0)
                    }
                  }
                }
              }
            }
          },
        };
        this.changeLegendsAllignment('right');
        this.label = this.chartOptions10.plotOptions.pie.donut.labels.show;
    }
      heatMapChart() {
        const dimensions: Dimension[] = this.sidebysideBarColumnData1;
        const categories = this.flattenDimensions(dimensions);
        this.heatMapChartOptions = {
          series: this.sidebysideBarRowData,
          chart: {
            height: 350,
            type: 'heatmap',
          },
          plotOptions: {
            heatmap: {
              shadeIntensity: 0.5,
              colorScale: {
                ranges: [],
                // Stops define the gradient stops for color intensity
                stops: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                // Enable this to inverse the colors
                inverseColors: true
              }
            }
          },
          dataLabels: {
            enabled: true
          },
          xaxis: {
            type: 'category',
            categories: categories,
          },
          yaxis: {
            title: {
              text: ''
            }
          },
          legend: {
            show: true,
            position: 'bottom'
          },
          grid: {
            padding: {
              right: 20
            }
          }
        };
      }

      funnelChart(){
        const dimensions: Dimension[] = this.sidebysideBarColumnData1;
        const categories = this.flattenDimensions(dimensions);
        this.funnelChartOptions = {
          series: this.sidebysideBarRowData,
          chart: {
            type: "bar",
            height: 350
          },
          plotOptions: {
            bar: {
              borderRadius: 0,
              horizontal: true,
              barHeight: "80%",
              isFunnel: true,
              dataLabels: {
                position: "center",
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (val:any, opt:any) {
              return opt.w.globals.labels[opt.dataPointIndex];
            },
            dropShadow: {
              enabled: true,
            },
            style: {
              fontSize: "8px",
              fontFamily: "Helvetica, Arial, sans-serif",
            },
          },
          title: {
          },
          xaxis: {
            categories: categories
          },
          legend: {
            show: false
          }
        };
      }

      guageChart(){
        this.KPINumber = _.cloneDeep(this.tablePreviewRow[0].result_data[0]);
        this.guageChartOptions = {
          series: [this.calculateSeries(this.KPINumber)],
          chart: {
          height: 350,
          type: 'radialBar',
          toolbar: {
            show: true
          }
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 225,
             hollow: {
              margin: 0,
              size: '70%',
              background: '#fff',
              image: undefined,
              imageOffsetX: 0,
              imageOffsetY: 0,
              position: 'front',
              dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24
              }
            },
            track: {
              background: '#fff',
              strokeWidth: '67%',
              margin: 0, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35
              }
            },
        
            dataLabels: {
              show: true,
              name: {
                offsetY: -10,
                show: true,
                color: '#888',
                fontSize: '17px'
              },
              value: {
                formatter: (val: number) => {
                  console.log('Formatter value:', val);
    
                  if (isNaN(val) || !isFinite(val)) {
                    console.error('Invalid value detected in formatter:', val);
                    return '0'; // Handle NaN by returning '0'
                  }
                      const originalValue = Math.round((val / 100) * this.maxValueGuage);
                  console.log('Original Value:', originalValue);
                  return originalValue.toString(); 
                },
                color: '#111',
                fontSize: '36px',
                show: true,
              }
            }
          }
        },
      
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#ABE5A1'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: 'round'
        },
        labels: [this.tablePreviewRow[0].col], 
      }
      }
      updateGuageChart() {
        this.guageChartOptions.series = [this.calculateSeries(this.KPINumber)];
    
      }
      calculateSeries(value: number): number {
        console.log('Series Value:', value);
            if (isNaN(value) || value < 0 || isNaN(this.maxValueGuage) || this.maxValueGuage <= 0) {
          console.error('Invalid series or maxValue:', value, this.maxValueGuage);
          return 0; 
        }
        
        const calculatedValue = (value / this.maxValueGuage) * 100;
        console.log('Calculated Series Value:', calculatedValue);
    
        return calculatedValue;
      }
      tableDimentions = [] as any;
      tableMeasures = [] as any;
      columnsData(){
        const obj = {
          "db_id": this.databaseId,
          "queryset_id": this.qrySetId,
          "search": this.tableSearch
        } as any;
        if (this.fromFileId) {
          delete obj.db_id;
          obj.file_id = this.fileId;
        }
        this.workbechService.getColumnsData(obj).subscribe({
          next: (responce: any) => {
            console.log(responce);
            this.tableColumnsData = responce;
            this.database_name = responce[0].database_name;
            this.isCustomSql = responce[0].is_custom_sql;
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
        this.radarRowData = [];
        let draggedColumnsObj;
        if (this.dateDrillDownSwitch) {
          draggedColumnsObj = _.cloneDeep(this.draggedColumnsData);
          draggedColumnsObj[0][2] = 'year'
        } else {
          draggedColumnsObj = this.draggedColumnsData
        }
        const obj = {
          "database_id": this.databaseId,
          "queryset_id": this.qrySetId,
          "col": draggedColumnsObj,
          "row": this.draggedRowsData,
          "filter_id": this.filterId,
          "datasource_querysetid": this.filterQuerySetId,
          "sheetfilter_querysets_id": this.sheetfilter_querysets_id,
          "hierarchy": this.draggedDrillDownColumns,
          "is_date": this.dateDrillDownSwitch,
          "drill_down": this.drillDownObject,
          "next_drill_down": this.draggedDrillDownColumns[this.drillDownIndex],
          "parent_user":this.createdBy
        } as any;
        if (this.fromFileId) {
          delete obj.database_id;
          obj.file_id = this.fileId;
        }
        this.workbechService.getDataExtraction(obj).subscribe({
          next: (responce: any) => {
            console.log(responce);
            this.tablePaginationRows=responce.rows;
            this.tablePaginationColumn=responce.columns;
            this.tablePaginationCustomQuery=responce.custom_query;
            this.chartsDataSet(responce);
            this.mulColData = responce.columns;
            this.mulRowData = responce.rows;
            if (this.chartsRowData.length > 0) {
              this.enableDisableCharts();
              // this.chartsOptionsSet();
              if (this.retriveDataSheet_id) {
                const dimensions: Dimension[] = this.sidebysideBarColumnData1;
                const categories = this.flattenDimensions(dimensions);
                let object : any;
                if (this.barchart) {
                  this.chartOptions3.series[0].data = this.chartsRowData;
                  this.chartOptions3.xaxis.categories = this.chartsColumnData;
                  this.chartOptions3.xaxis.convertedCatToNumeric = true;
                  console.log(this.chartOptions3.xaxis.categories);
                  console.log(this.chartOptions3);
                  object = [{data : this.chartsRowData}];
                  this.barchart.updateSeries(object);
                  object = {xaxis: {categories : this.chartsColumnData, convertedCatToNumeric : true}};
                  this.barchart.updateOptions(object);
                  console.log(this.barchart);
                }
                else if (this.piechart) {
                  this.chartOptions4.series = this.chartsRowData;
                  this.chartOptions4.labels = this.chartsColumnData;
                }
                else if (this.linechart) {
                  this.chartOptions.series[0].data = this.chartsRowData;
                  this.chartOptions.xaxis.categories = this.chartsColumnData;
                  this.chartOptions.xaxis.convertedCatToNumeric = true;
                  object = [{data : this.chartsRowData}];
                  this.linechart.updateSeries(object);
                  object = {xaxis: {categories : this.chartsColumnData, convertedCatToNumeric : true}};
                  this.linechart.updateOptions(object);
                  console.log(this.linechart);
                }
                else if (this.areachart) {
                  this.chartOptions1.series[0].data = this.chartsRowData;
                  this.chartOptions1.labels = this.chartsColumnData;
                  this.chartOptions1.xaxis.convertedCatToNumeric = true;
                  object = [{data : this.chartsRowData}];
                  this.areachart.updateSeries(object);
                  object = {xaxis: {categories : this.chartsColumnData, convertedCatToNumeric : true}};
                  this.areachart.updateOptions(object);
                  console.log(this.linechart);
                }
                else if (this.sidebysideChart) {
                  this.chartOptions2.series = this.sidebysideBarRowData;
                  this.chartOptions2.xaxis.categories = categories;
                }
                else if (this.stockedChart) {
                  this.chartOptions6.series = this.sidebysideBarRowData;
                  this.chartOptions6.xaxis.categories = categories;
                }
                else if (this.barlineChart) {
                  // this.chartOptions5.series[0] = {name: this.sidebysideBarRowData[0]?.name,type: "column",data: this.sidebysideBarRowData[0]?.data};
                  // this.chartOptions5.series[1] = {name: this.sidebysideBarRowData[1]?.name,type: "line",data: this.sidebysideBarRowData[1]?.data};
                  this.chartOptions5.series = this.sidebysideBarRowData;
                  this.chartOptions5.labels = categories;
                  this.chartOptions5.xaxis.categories = categories;
                }
                else if (this.horizontolstockedChart) {
                  this.chartOptions7.series = this.sidebysideBarRowData;
                  this.chartOptions7.xaxis.categories = categories;
                }
                else if (this.groupedChart) {
                  this.chartOptions8.series = this.sidebysideBarRowData;
                  this.chartOptions8.xaxis.categories = categories;
                }
                else if (this.multilineChart) {
                  this.chartOptions9.series = this.sidebysideBarRowData;
                  this.chartOptions9.xaxis.categories = categories;
                }
                else if (this.donutchart) {
                  this.chartOptions10.series = this.chartsRowData;
                  this.chartOptions10.labels = this.chartsColumnData;
                }
                else if (this.heatMap) {
                  this.chartOptions9.series = this.sidebysideBarRowData;
                  this.chartOptions9.xaxis.categories = categories;
                }
                else if (this.funnel) {
                  this.chartOptions9.series = this.sidebysideBarRowData;
                  this.chartOptions9.xaxis.categories = categories;
                }
                // this.updateChart();
              }
              else{
                this.chartsOptionsSet();
              }
            }
           
            if ((this.draggedColumns.length < 1 || this.draggedRows.length < 1) && !this.kpi ) {
              this.table = true;
              this.bar = false;
              this.area = false;
              this.line = false;
              this.pie = false;
              this.sidebyside = false;
              this.stocked = false;
              this.barLine = false;
              this.horizentalStocked = false;
              this.grouped = false;
              this.multiLine = false;
              this.donut = false;
              this.chartId = 1;
              this.radar = false;
              this.kpi = false;
              this.heatMap = false;
              this.guage = false;
              this.funnel = false;
            }
            if(this.kpi && (this.draggedColumns.length > 0 || this.draggedRows.length < 1 || this.draggedRows.length > 1)){
              this.table = true;
              this.bar = false;
              this.area = false;
              this.line = false;
              this.pie = false;
              this.sidebyside = false;
              this.stocked = false;
              this.barLine = false;
              this.horizentalStocked = false;
              this.grouped = false;
              this.multiLine = false;
              this.donut = false;
              this.chartId = 1;
              this.radar = false;
              this.kpi = false;
              this.heatMap = false;
              this.funnel = false;
              this.guage = false;
            }
          },
          error: (error) => {
            console.log(error);
          }
        }
        )
      }

      pageChangeTableDisplay(page:any){
        this.pageNo=page;
        this.tableDisplayPagination();
      }
      tableDisplayPagination() {
        if (this.draggedRows.length > 0 || this.draggedColumns.length > 0) {
          const obj = {
            database_id: this.databaseId,
            file_id: this.fileId,
            sheetqueryset_id: this.sheetfilter_querysets_id,
            queryset_id: this.qrySetId,
            page_no: this.pageNo,
            page_count: this.itemsPerPage,
            search: this.tableChartSearch,
            rows: this.tablePaginationRows,
            columns: this.tablePaginationColumn,
            custom_query: this.tablePaginationCustomQuery
          }
          if (obj.search === '' || obj.search === null) {
            delete obj.search;
          }
          this.tableDataDisplay = []
          this.tableColumnsDisplay = []
          this.workbechService.tablePaginationSearch(obj).subscribe(
            {
              next: (data: any) => {
                console.log(data);
                this.itemsPerPage = data.items_per_page;
                this.totalItems = data.total_items;
                this.tableColumnDisplayPreview = data.data?.col
                this.tableRowDisplayPreview = data.data?.row

                let rowCountData: any;
                if (this.tableColumnDisplayPreview[0]?.result_data?.length) {
                  rowCountData = this.tableColumnDisplayPreview[0]?.result_data?.length;
                } else {
                  rowCountData = this.tableRowDisplayPreview[0]?.result_data?.length;
                }
                this.tableColumnsDisplay = this.tableColumnDisplayPreview.map((col: any) => col.column).concat(this.tableRowDisplayPreview.map((row: any) => row.col));

                for (let i = 0; i < rowCountData; i++) {
                  const tableRow: TableRow = {};
                  this.tableColumnDisplayPreview?.forEach((col: any) => {
                    tableRow[col.column] = col.result_data[i];
                  });
                  this.tableRowDisplayPreview?.forEach((rowData: any) => {
                    tableRow[rowData.col] = rowData.result_data[i];
                  });
                  this.tableDataDisplay.push(tableRow);
                  console.log('display row data ', this.tableDataDisplay)
                }
              },
              error: (error) => {
                console.log(error);
              }
            }
          )
        } else {
          this.tableDataDisplay = []
          this.tableColumnsDisplay = []
          this.totalItems = 0
        }
      }

      chartsDataSet(data: any) {
        this.sheetCustomQuery = data.custom_query;
        // this.sheetfilter_querysets_id = data.sheetfilter_querysets_id || data.sheet_filter_quereyset_ids;
        this.tablePreviewColumn = data.table_data?.col ? data.table_data.col : data.sheet_data?.col ? data.sheet_data.col : [];
        this.tablePreviewRow = data.table_data?.row ? data.table_data.row : data.sheet_data?.row ? data.sheet_data.row : [];
        this.tableDisplayPagination();
        console.log(this.tablePreviewColumn);
        console.log(this.tablePreviewRow);
        if (this.tablePreviewColumn && this.tablePreviewRow) {
          this.tablePreviewColumn.forEach((res: any) => {
            let obj = {
              data: res.result_data
            }
            this.sidebysideBarColumnData.push(res.result_data);
            let obj1 = {
              name: res.column,
              values: res.result_data
            }
            this.sidebysideBarColumnData1.push(obj1);
          });
          this.tablePreviewRow.forEach((res: any) => {
            let obj = {
              name: res.col,
              data: res.result_data
            }
            this.sidebysideBarRowData.push(obj);
          });
          this.tablePreviewRow.forEach((res: any) => {
            let obj = {
              name: res.col,
              value: res.result_data
            }
            this.radarRowData.push(obj);
          });
          console.log(this.sidebysideBarColumnData)
          console.log('sidebysideBarColumnData1this', this.sidebysideBarColumnData1)
          console.log(this.sidebysideBarRowData);
          let rowCount: any;
          if (this.tablePreviewColumn[0]?.result_data?.length) {
            rowCount = this.tablePreviewColumn[0]?.result_data?.length;
          } else {
            rowCount = this.tablePreviewRow[0]?.result_data?.length;
            this.guagechartRowData = rowCount
            console.log('guage length',this.guagechartRowData)
          }
          //const rowCount = this.tablePreviewRow[0]?.result_data?.length;
          // Extract column names
          this.displayedColumns = this.tablePreviewColumn.map((col: any) => col.column).concat(this.tablePreviewRow.map((row: any) => row.col));
          // Create table data
          console.log(this.displayedColumns)
          for (let i = 0; i < rowCount; i++) {
            const row: TableRow = {};
            this.tablePreviewColumn.forEach((col: any) => {
              row[col.column] = col.result_data[i];
            });
            this.tablePreviewRow.forEach((rowData: any) => {
              row[rowData.col] = rowData.result_data[i];
            });
            this.tableData.push(row);

          }
          console.log(this.tableData);
          this.tablePreviewColumn.forEach((col: any) => {
            this.chartsColumnData = col.result_data;
          });
          this.tablePreviewRow.forEach((rowData: any) => {
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
        }
      }

      chartsOptionsSet(){
        if (this.bar) {
          this.barChart();
        } else if (this.area) {
          this.areaChart();
        } else if (this.line) {
          this.lineChart();
        } else if (this.pie) {
          this.pieChart();
        } else if (this.sidebyside) {
          this.sidebysideBar();
        } else if (this.stocked) {
          this.stockedBar();
        } else if (this.barLine) {
          this.barLineChart();
        } else if (this.horizentalStocked) {
          this.horizentalStockedBar();
        } else if (this.grouped) {
          this.hGrouped();
        } else if (this.multiLine) {
          this.multiLineChart();
        } else if (this.donut) {
          this.donutChart();
        } else if (this.radar) {
          this.radarChart();
        } else if (this.heatMap) {
          this.heatMapChart();
        } else if (this.kpi){
          this.KPIChart();
        } else if (this.funnel){
          this.funnelChart();
        }else if(this.guage){
          this.guageChart();
        }
        
      }

      KPIChart(){
        this.KPINumber = _.cloneDeep(this.tablePreviewRow[0].result_data[0]);
      }
      tableNameMethod(schemaname: any, tablename: any, tableAlias: any){
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
        for(let attr in copy) {
        if (attr == 'title') {
          element[attr] = copy[attr];
        } else {
          element[attr] = copy[attr];
        }
      }
      this.draggedColumns.splice(event.currentIndex, 0, element);
      const columnIndexMap = new Map((this.draggedColumns as any[]).map((col, index) => [col.column, index]));
      //this.draggedColumnsData.push([this.schemaName,this.tableName,this.table_alias,element.column,element.data_type,""])
      this.draggedColumnsData.push([element.column, element.data_type, "", ""]);
      this.draggedColumnsData = (this.draggedColumnsData as any[]).sort((a, b) => {
        const indexA = columnIndexMap.get(a[0]) ?? -1;
        const indexB = columnIndexMap.get(b[0]) ?? -1;
        return indexA - indexB;
      });
      this.draggedColumns.forEach((column: any, index: number) => {
        if (column.column === element.column) {
          if (event.currentIndex !== index) {
            event.currentIndex = index;
          }
        }
      });
      console.log(this.draggedColumnsData);
      if (this.dateList.includes(element.data_type)) {
        this.dateFormat(element, event.currentIndex, 'year');
      } else {
        this.dataExtraction();
      }
    }
    dateList = ['date', 'time', 'datetime', 'timestamp', 'timestamp with time zone', 'timestamp without time zone', 'timezone', 'time zone', 'timestamptz'];
    integerList = ['numeric', 'int', 'float', 'number', 'double precision', 'smallint', 'integer', 'bigint', 'decimal', 'numeric', 'real', 'smallserial', 'serial', 'bigserial', 'binary_float', 'binary_double'];
    boolList = ['bool', 'boolean'];
    rowdrop(event: CdkDragDrop<string[]>){
      console.log(event)
    let item: any = event.previousContainer.data[event.previousIndex];
      // this.storeRowData.push(event.previousContainer.data); 
      //this.storeRowData[0].forEach((element:any) => {
      //  if(element.column === item.column){
      let copy: any = JSON.parse(JSON.stringify(item));
      let element: any = {};
      for(let attr in copy) {
      if (attr == 'title') {
        element[attr] = copy[attr];
      } else {
        element[attr] = copy[attr];
      }
    }
    this.draggedRows.splice(event.currentIndex, 0, element);
    const rowIndexMap = new Map((this.draggedRows as any[]).map((row, index) => [row.column, index]));
    //this.draggedRowsData.push([this.schemaName,this.tableName,this.table_alias,element.column,element.data_type,""])
    this.draggedRowsData.push([element.column, element.data_type, "", ""]);
    this.draggedRowsData = (this.draggedRowsData as any[]).sort((a, b) => {
      const indexA = rowIndexMap.get(a[0]) ?? -1;
      const indexB = rowIndexMap.get(b[0]) ?? -1;
      return indexA - indexB;
    });
    this.draggedRows.forEach((row: any, index: number) => {
      if (row.column === element.column) {
        if (event.currentIndex !== index) {
          event.currentIndex = index;
        }
      }
    });
    console.log(this.draggedRowsData);
    if (this.integerList.includes(element.data_type)) {
      this.rowMeasuresCount(element, event.currentIndex, 'sum');
    } else {
      this.dataExtraction();
    }

  }
  isDropdownVisible = false;

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  rowMeasuresCount(rows:any,index:any,type:any){
      this.measureValues = [];
      this.measureValues = [rows.column,"aggregate",type,rows.alias ? rows.alias : ""]
     if(type === ''){
      this.draggedRowsData[index] = [rows.column,rows.data_type,type,rows.alias ? rows.alias : ""];
      this.draggedRows[index] = {column:rows.column,data_type:rows.data_type,type:type,alias:rows.alias};
      this.dataExtraction();
     }else if(type === '-Select-'){
      this.draggedRowsData[index] = [rows.column,rows.data_type,'',rows.alias ? rows.alias : ""];
      this.draggedRows[index] = {column:rows.column,data_type:rows.data_type,type:'',alias:rows.alias};
      this.dataExtraction();
     }else{
    this.draggedRowsData[index] = this.measureValues;
    console.log(this.draggedRowsData);
    this.draggedRows[index] = {column:rows.column,data_type:rows.data_type,type:type,alias:rows.alias};
    console.log(this.draggedRows)
    this.dataExtraction();
     }
  }

  onAliasChange(rows : any , index : any){
    this.isMeasureEdit = false;
    this.rowMeasuresCount(rows, index, rows.type);
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
  dragStartedRow(index:any,column:any){
    this.draggedRows.splice(index, 1);
    (this.draggedRowsData as any[]).forEach((data,index)=>{
     (data as any[]).forEach((aa)=>{ 
       if(column === aa){
         console.log(aa);
         this.draggedRowsData.splice(index, 1);
       }
     } );
   });   
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
  kpi = false;
  heatMap = false;
  funnel = false;
  guage = false;
  chartDisplay(table:boolean,bar:boolean,area:boolean,line:boolean,pie:boolean,sidebysideBar:boolean,stocked:boolean,barLine:boolean,
    horizentalStocked:boolean,grouped:boolean,multiLine:boolean,donut:boolean,radar:boolean,kpi:any,heatMap:any,funnel:any,guage:boolean,chartId:any){
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
    this.radar = radar;
    this.kpi = kpi;
    this.heatMap = heatMap;
    this.funnel = funnel;
    this.guage = guage;
    // this.dataExtraction();
    this.chartsOptionsSet(); 
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
  tabs : any [] = [];
  selected = new FormControl(0);
  addSheet() {
    this.retriveDataSheet_id = '';
    this.draggedDrillDownColumns = [];
    this.drillDownObject = [];
    this.drillDownIndex = 0;
    this.dateDrillDownSwitch = false;
    delete this.originalData;
    this.sheetName = ''; this.sheetTitle = '';
    this.KPIDecimalPlaces = 0;
    this.KPIRoundPlaces = 0;
    this.KPIDisplayUnits = 'none';
    this.KPIPrefix = '';
    this.KPISuffix = '';
    if(this.sheetName != ''){
       this.tabs.push(this.sheetName);
    }else{
      this.getChartData();
      this.sheetNumber = this.tabs.length+1;
       this.tabs.push('Sheet ' +this.sheetNumber);
       this.SheetSavePlusEnabled.push('Sheet ' +this.sheetNumber);
       this.selectedTabIndex = this.tabs.length - 1;
       this.sheetTagName = 'Sheet ' +this.sheetNumber;
    }
    this.kpi=false;
  }
  sheetNameChange(name:any,event:any){
    console.log(this.SheetIndex)
    // if (event.keyCode === 13) {
    //   this.tabs[this.SheetIndex] = name;
    // }
    this.sheetTagName = name;
  }
  removeTab() {
    console.log(this.SheetIndex)
    const obj = {
      sheet_id: this.retriveDataSheet_id,
    }
    this.workbechService.deleteSheetMessage(obj)
      .subscribe(
        {
          next: (data: any) => {
            console.log(data);
            Swal.fire({
              title: 'Are you sure?',
              text: data.message,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
              if (result.isConfirmed) {
                const idToPass = this.fromFileId ? this.fileId : this.databaseId;
                this.workbechService.deleteSheet(idToPass,this.qrySetId,this.retriveDataSheet_id).subscribe({next: (data:any) => {
                // this.workbechService.deleteSheet(this.databaseId, this.qrySetId, this.retriveDataSheet_id).subscribe({
                //   next: (data: any) => {
                    console.log(data);
                    if (data) {
                      this.tabs.splice(this.SheetIndex, 1);
                      // Swal.fire({
                      //   icon: 'success',
                      //   title: 'Deleted!',
                      //   text: 'Deleted Successfully',
                      //   width: '200px',
                      // })
                      this.toasterService.success('Deleted Successfully','success',{ positionClass: 'toast-top-right'});
                      this.getChartData();
                    }
                  },
                  error: (error: any) => {
                    Swal.fire({
                      icon: 'warning',
                      text: error.error.message,
                      width: '200px',
                    })
                    console.log(error)
                  }
                }
                )
              }
            })
          },
          error: (error: any) => {
            Swal.fire({
              icon: 'warning',
              text: error.error.message,
              width: '300px',
            })
            console.log(error)
          }
        }
      )
  }
  onChange(event:any){
    this.draggedDrillDownColumns = [];
    this.drillDownObject = [];
    this.drillDownIndex = 0;
    this.sheetName = '';
    this.dateDrillDownSwitch = false;
    delete this.originalData;
    console.log(event)
    if(event.index === -1){
     this.retriveDataSheet_id = 1;
    }
    this.SheetIndex = event.index;
    this.sheetName = event.tab?.textLabel
    this.sheetTitle = event.tab?.textLabel;
    const obj = {
      "server_id": this.databaseId,
      "queryset_id": this.qrySetId,
    } as any;
    if (this.fromFileId) {
      delete obj.server_id;
      obj.file_id = this.fileId;
    }
    this.workbechService.getSheetNames(obj).subscribe({
      next: (responce: any) => {
        this.sheetList = responce.data;
        if (!this.sheetList.some(sheet => sheet.sheet_name === this.sheetName)) {
          this.retriveDataSheet_id = '';
        } else {
          this.sheetList.forEach(sheet => {
            if (sheet.sheet_name === this.sheetName) {
              this.retriveDataSheet_id = sheet.id;
            }
          });
        }
        // const inputElement = document.getElementById('htmlContent') as HTMLInputElement;
        // inputElement.innerHTML = event.tab?.textLabel;
        this.sheetTagName = event.tab?.textLabel;
        console.log(this.sheetName)
        console.log(this.retriveDataSheet_id);
        this.draggedColumns = [];
        this.draggedColumnsData = [];
        this.draggedRows = [];
        this.draggedRowsData = [];
        this.displayedColumns = [];
        this.tableData = [];
        this.getChartData();
       if(this.retriveDataSheet_id){
          this.sheetRetrive();
       }
      },
      error: (error) => {
        console.log(error);
      }
    }
    )
    this.kpi = false;
  }
  getChartData(){
   // if(this.draggedColumns && this.draggedRows && !this.retriveDataSheet_id){
   //alert("pls save your changes")
   // }else{
    this.filterData = [];
    this.filterId = [];
    this.draggedColumns =[];
    this.draggedColumnsData =[];
    this.draggedRows = [];
    this.draggedRowsData = [];
    // this.retriveDataSheet_id = '';
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
      this.totalItems = 0;
      this.tableDataDisplay = [];
      this.tableColumnsDisplay = [];
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
      this.radar = false;
      this.kpi = false;
      this.heatMap = false;
      this.funnel = false;
      this.banding = false;
      this.barOptions = undefined;
      this.lineOptions = undefined;
      this.areaOptions = undefined;
      this.pieOptions = undefined;
      this.sidebysideBarOptions = undefined;
      this.stokedOptions = undefined;
      this.barLineOptions = undefined;
      this.hStockedOptions = undefined;
      this.hgroupedOptions = undefined;
      this.multiLineOptions = undefined;
      this.donutOptions = undefined;
      this.kpiFontSize = '3';
      this.kpiColor = '#000000';
   // }
  }
  saveTableData = [] as any;
  savedisplayedColumns = [] as any;
  banding : boolean = false;
  saveBar = [] as any;
  savePie = [] as any;
  lineYaxis = [] as any;
  lineXaxis = [] as any;
  lineOptions : any = undefined;
  areaYaxis = [] as any;
  areaXaxis = [] as any;
  areaOptions : any = undefined;
  barXaxis = [] as any;
  barOptions : any = undefined;
  pieXaxis = [] as any;
  pieOptions : any = undefined;
  sidebysideBarYaxis = [] as any;
  sidebysideBarXaxis = [] as any;
  sidebysideBarOptions : any = undefined;
  stokedBarYaxis = [] as any;
  stokedBarXaxis = [] as any;
  stokedOptions : any = undefined;
  barLineYaxis = [] as any;
  barLineXaxis = [] as any;
  barLineOptions : any = undefined;
  hStockedYaxis = [] as any;
  hStockedXaxis = [] as any;
  hStockedOptions : any = undefined;
  hgroupedYaxis = [] as any;
  hgroupedXaxis = [] as any;
  hgroupedOptions : any = undefined;
  multiLineYaxis = [] as any;
  multiLineXaxis = [] as any;
  multiLineOptions : any = undefined;
  donutYaxis = [] as any;
  donutXaxis = [] as any;
  donutOptions : any = undefined;

sheetSave(){
  let savedChartOptions ;
  let kpiData;
  let kpiColor;
  let kpiFontSize;
  let bandColor1;
  let bandColor2;
  let tablePreviewRow = this.tablePreviewRow;
  let tablePreviewCol = this.tablePreviewColumn;
  if(this.table && this.chartId == 1){
   this.saveTableData =  this.tableData;
   this.savedisplayedColumns = this.displayedColumns;
   this.banding = this.bandingSwitch;
   bandColor1 = this.color1;
   bandColor2 = this.color2;
  }
  if(this.bar && this.chartId == 6){
    console.log(this.chartOptions3);
    this.saveBar = this.chartsRowData;
    this.barXaxis = this.chartsColumnData;
    if (this.originalData) {
      this.saveBar = this.originalData.data;
      this.barXaxis = this.originalData.categories;
      this.chartOptions3.xaxis.categories = this.originalData.categories;
      this.chartOptions3.series[0].data = this.originalData.data;
      tablePreviewRow = _.cloneDeep(this.tablePreviewRow);
      tablePreviewRow[0].result_data = this.originalData.data;
      tablePreviewCol = _.cloneDeep(this.tablePreviewColumn);
      tablePreviewCol[0].result_data = this.originalData.categories;
      delete this.originalData;
    }
    if(this.isApexCharts) {
      savedChartOptions = this.chartOptions3;
      this.barOptions = this.chartOptions3;
    } else {
      savedChartOptions = this.eBarChartOptions;
    }
  }
  if(this.pie && this.chartId == 24){
    this.savePie = this.chartsRowData;
    this.pieXaxis = this.chartsColumnData;
    if(this.isApexCharts) {
      savedChartOptions = _.cloneDeep(this.chartOptions4);
      this.pieOptions = this.chartOptions4;
    } else {
      savedChartOptions = this.ePieChartOptions;
    }
    if (this.originalData) {
      this.savePie = this.originalData.data;
      this.pieXaxis = this.originalData.categories;
      savedChartOptions.labels = this.originalData.categories;
      savedChartOptions.series = this.originalData.data;
      tablePreviewRow = _.cloneDeep(this.tablePreviewRow);
      tablePreviewRow[0].result_data = this.originalData.data;
      tablePreviewCol = _.cloneDeep(this.tablePreviewColumn);
      tablePreviewCol[0].result_data = this.originalData.categories;
      delete this.originalData;
    }
  }
  if(this.line && this.chartId == 13){
    this.lineYaxis = this.chartsRowData;
    this.lineXaxis = this.chartsColumnData;
    if(this.isApexCharts) {
      savedChartOptions = this.chartOptions;
      this.lineOptions = this.chartOptions;
    } else {
      savedChartOptions = this.eLineChartOptions;
    }
  }
  if(this.area && this.chartId == 17){
    this.areaYaxis = this.chartsRowData;
    this.areaXaxis = this.chartsColumnData;
    if(this.isApexCharts) {
      savedChartOptions = this.chartOptions1;
      this.areaOptions = this.chartOptions1;
    } else {
      savedChartOptions = this.eAreaChartOptions;
    }
  }
  if(this.sidebyside && this.chartId == 7){
    this.sidebysideBarYaxis = this.sidebysideBarRowData;
    this.sidebysideBarXaxis = this.sidebysideBarColumnData1;
    if(this.isApexCharts) {
      this.sidebysideBarOptions = this.chartOptions2;
    savedChartOptions = this.chartOptions2;
    } else {
      savedChartOptions = this.eSideBySideBarChartOptions;
    }
    
  }
  if(this.stocked && this.chartId == 5){
    this.stokedBarYaxis = this.sidebysideBarRowData;
    this.stokedBarXaxis = this.sidebysideBarColumnData1;
    if(this.isApexCharts) {
      this.stokedOptions = this.chartOptions6;
    savedChartOptions = this.chartOptions6;
    } else {
      savedChartOptions = this.eStackedBarChartOptions;
    }
    
  }
  if(this.barLine && this.chartId == 4){
    this.barLineYaxis = this.sidebysideBarRowData;
    this.barLineXaxis = this.sidebysideBarColumnData1;
    if(this.isApexCharts) {
      savedChartOptions = this.chartOptions5;
      this.barLineOptions = this.chartOptions5;
    } else {
      savedChartOptions = this.eBarLineChartOptions;
    }
  }
  if(this.horizentalStocked && this.chartId == 2){
    this.hStockedYaxis = this.sidebysideBarRowData;
    this.hStockedXaxis = this.sidebysideBarColumnData1;
    if(this.isApexCharts) {
      this.hStockedOptions = this.chartOptions7;
    savedChartOptions = this.chartOptions7;
    } else {
      savedChartOptions = this.ehorizontalStackedBarChartOptions;
    }
    
  }
  if(this.grouped && this.chartId == 3){
    this.hgroupedYaxis = this.sidebysideBarRowData;
    this.hgroupedXaxis = this.sidebysideBarColumnData1;
    if(this.isApexCharts) {
      this.hgroupedOptions = this.chartOptions8;
      savedChartOptions = this.chartOptions8;
    } else {
      savedChartOptions = this.eGroupedBarChartOptions;
    }
    
  }
  if(this.multiLine && this.chartId == 8){
    this.multiLineYaxis = this.sidebysideBarRowData;
    this.multiLineXaxis = this.sidebysideBarColumnData1;
    if(this.isApexCharts) {
      this.multiLineOptions = this.chartOptions9;
    savedChartOptions = this.chartOptions9;
    } else {
      savedChartOptions = this.eMultiBarChartOptions;
    }
    
  }
  if(this.donut && this.chartId == 10){
    
    this.donutYaxis = this.chartsRowData;
    this.donutXaxis = this.chartsColumnData;
    this.donutOptions = this.chartOptions10;
    savedChartOptions = _.cloneDeep(this.chartOptions10);
    if (this.originalData) {
      this.donutYaxis = this.originalData.data;
      this.donutXaxis = this.originalData.categories;
      savedChartOptions.labels = this.originalData.categories;
      savedChartOptions.series = this.originalData.data;
      tablePreviewRow = _.cloneDeep(this.tablePreviewRow);
      tablePreviewRow[0].result_data = this.originalData.data;
      tablePreviewCol = _.cloneDeep(this.tablePreviewColumn);
      tablePreviewCol[0].result_data = this.originalData.categories;
      delete this.originalData;
    }
  }
  if(this.radar && this.chartId == 12){
    this.barLineXaxis = this.sidebysideBarColumnData1;
      savedChartOptions = this.eRadarChartOptions;
  }
  if(this.kpi && this.chartId == 25){
    kpiData = this.tablePreviewRow;
    kpiColor = this.kpiColor;
    kpiFontSize = this.kpiFontSize;
  }
  if(this.heatMap && this.chartId == 26){
    savedChartOptions = this.heatMapChartOptions;
  }
  if(this.funnel && this.chartId == 27){
    savedChartOptions = this.funnelChartOptions;
  }
  if(this.guage && this.chartId == 28){
    savedChartOptions = this.guageChartOptions;
  }
  let customizeObject = {
    isZoom : this.isZoom,
    xGridColor : this.xGridColor,
    xGridSwitch : this.xGridSwitch,
    xLabelSwitch : this.xLabelSwitch,
    xLabelColor : this.xLabelColor,
    yLabelSwitch : this.yLabelSwitch,
    yGridColor : this.yGridColor,
    yGridSwitch : this.yGridSwitch,
    yLabelColor : this.yLabelColor,
    xLabelFontFamily : this.xLabelFontFamily,
    xLabelFontSize : this.xLabelFontSize,
    xlabelFontWeight : this.xlabelFontWeight,
    labelAlignment : this.labelAlignment
  }
  // this.sheetTagName = this.sheetTitle;
  let draggedColumnsObj;
  if (this.dateDrillDownSwitch) {
    draggedColumnsObj = _.cloneDeep(this.draggedColumnsData);
    draggedColumnsObj[0][2] = 'year'
  } else {
    draggedColumnsObj = this.draggedColumnsData
  }
const obj={
  "chart_id": this.chartId,
  "queryset_id":this.qrySetId,
  "server_id": this.databaseId,
  "sheet_name": this.sheetTitle,
  "sheet_tag_name": this.sheetTagName,
  "filter_id":this.filterId,
  "sheetfilter_querysets_id":this.sheetfilter_querysets_id,
  "filter_data": this.dimetionMeasure,
  "datasource_querysetid": this.filterQuerySetId,
  "col": this.mulColData,
  "row": this.mulRowData,
  "custom_query":this.sheetCustomQuery,
  "data":{
    "drillDownHierarchy":this.draggedDrillDownColumns,
    "isDrillDownData" : this.dateDrillDownSwitch,
  "columns": this.draggedColumns,
  "columns_data":draggedColumnsObj,
  "rows": this.draggedRows,
  "rows_data":this.draggedRowsData,
  "col":tablePreviewCol,
  "row":tablePreviewRow,
  "results": {
    "tableData":this.saveTableData,
    "tableColumns":this.savedisplayedColumns,
    "banding":this.banding,
    "color1":bandColor1,
    "color2":bandColor2,
    "items_per_page":this.itemsPerPage,
    "total_items":this.totalItems,

    "barYaxis":this.saveBar,
    "barXaxis":this.barXaxis,
  //  "barOptions":this.barOptions,

    "pieYaxis":this.savePie,
    "pieXaxis":this.pieXaxis,
  //   "pieOptions":this.pieOptions,

    "lineYaxis":this.lineYaxis,
    "lineXaxis": this.lineXaxis,
  //   "lineOptions":this.lineOptions,

    "areaYaxis":this.areaYaxis,
    "areaXaxis":this.areaXaxis,
  //   "areaOptions":this.areaOptions,

      "sidebysideBarYaxis": this.sidebysideBarYaxis,
      "sidebysideBarXaxis": this.sidebysideBarXaxis,
  //     "sidebysideBarOptions":this.sidebysideBarOptions,
   
      "stokedBarYaxis": this.stokedBarYaxis,
      "stokedBarXaxis": this.stokedBarXaxis,
  //     "stokedOptions":this.stokedOptions,
  
      "barLineYaxis":this.barLineYaxis,
      "barLineXaxis":this.barLineXaxis,
  //     "barLineOptions":this.barLineOptions,

      "hStockedYaxis": this.hStockedYaxis,
      "hStockedXaxis": this.hStockedXaxis,
  //     "hStockedOptions":this.hStockedOptions,

      "hgroupedYaxis": this.hgroupedYaxis,
      "hgroupedXaxis": this.hgroupedXaxis,
  //     "hgroupedOptions":this.hgroupedOptions,

      "multiLineYaxis":this.multiLineYaxis,
      "multiLineXaxis": this.multiLineXaxis,
  //     "multiLineOptions":this.multiLineOptions,

      "donutYaxis": this.donutYaxis,
      "donutXaxis": this.donutXaxis,
  //     "donutOptions":this.donutOptions,

      "kpiData": kpiData,
      "kpiFontSize": kpiFontSize,
      "kpicolor": kpiColor,
      "kpiNumber" : this.KPINumber,
      "kpiPrefix" : this.KPIPrefix,
      "kpiSuffix" : this.KPISuffix,
      "kpiDecimalUnit" : this.KPIDisplayUnits,
      "kpiDecimalPlaces" : this.KPIDecimalPlaces
  },
  "isApexChart" : this.isApexCharts,
  "isEChart" : this.isEChatrts,
  "savedChartOptions" : savedChartOptions,
  "customizeOptions" : customizeObject
}
}as any;
if(this.fromFileId){
  delete obj.server_id;
  obj.file_id=this.fileId; 
}
console.log(this.retriveDataSheet_id)
if(this.retriveDataSheet_id){
  console.log("Sheet Update")
  this.workbechService.sheetUpdate(obj,this.retriveDataSheet_id).subscribe({next: (responce:any) => {
   this.tabs[this.SheetIndex] = this.sheetTitle;
    if(responce){
      // Swal.fire({
      //   icon: 'success',
      //   text: responce.message,
      //   width: '200px',
      // })
      this.toasterService.success(responce.message,'success',{ positionClass: 'toast-top-right'});

    //   this.getSheetNames();
    //  this.sheetRetrive();
    }
      let obj : object= {
        "sheet_id":this.retriveDataSheet_id
      }
      this.workbechService.dashboardSheetsUpdate(obj).subscribe({next: (responce:any) => {
        console.log('sheet_dash_update');
        console.log(responce);
      }
    })
  
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
      // Swal.fire({
      //   icon: 'success',
      //   text: responce.message,
      //   width: '200px',
      // })
      this.toasterService.success(responce.message,'success',{ positionClass: 'toast-top-right'});
      this.retriveDataSheet_id = responce.sheet_id;
      // this.getSheetNames();
      this.sheetRetrive();
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
sheetTagTitle : any;
sheetRetrive(){
  this.getChartData();
  console.log(this.tabs);
  const obj={
  "queryset_id":this.qrySetId,
  "server_id": this.databaseId,
}as any;
if(this.fromFileId){
  delete obj.server_id;
  obj.file_id=this.fileId;
}

this.workbechService.sheetGet(obj,this.retriveDataSheet_id).subscribe({next: (responce:any) => {
          console.log(responce);
        this.retriveDataSheet_id = responce.sheet_id;
        this.chartId = responce.chart_id;
        this.sheetName = responce.sheet_name;
        this.sheetTitle = responce.sheet_name;
        this.sheetCustomQuery = responce.custom_query;
        this.sheetResponce = responce.sheet_data;
        this.draggedColumns=this.sheetResponce.columns;
        this.draggedRows = this.sheetResponce.rows;
        this.mulColData = responce.col_data;
        this.mulRowData = responce.row_data;
        this.tablePaginationRows=responce.row_data;
        this.tablePaginationColumn=responce.col_data;
        this.dimetionMeasure = responce.filters_data;
        this.createdBy = responce.created_by;
        this.color1 = responce.sheet_data?.results?.color1;
        this.color2 = responce.sheet_data?.results?.color2;
        this.sheetfilter_querysets_id = responce.sheetfilter_querysets_id || responce.sheet_filter_quereyset_ids;
        this.tablePaginationCustomQuery = responce.custom_query;
        // this.GridColor = responce.sheet_data.savedChartOptions.chart.background;
        // this.apexbBgColor = responce.sheet_data.savedChartOptions.grid.borderColor;
        responce.filters_data.forEach((filter: any)=>{
          this.filterId.push(filter.filter_id);
        })
        this.isEChatrts = this.sheetResponce.isEChart;
        this.isApexCharts = this.sheetResponce.isApexChart;
        this.dateDrillDownSwitch = this.sheetResponce.isDrillDownData;
        this.draggedDrillDownColumns = this.sheetResponce.drillDownHierarchy ? this.sheetResponce.drillDownHierarchy : [];
        if(this.isEChatrts){
          this.selectedChartPlugin = 'echart';
        } else {
          this.isApexCharts = true;
          this.selectedChartPlugin = 'apex';
        }
        if(!responce.sheet_tag_name){
          // const inputElement = document.getElementById('htmlContent') as HTMLInputElement;
          // inputElement.innerHTML = responce.sheet_name;
          this.sheetTagName = responce.sheet_name;
        }
        else{
          // const inputElement = document.getElementById('htmlContent') as HTMLInputElement;
          // inputElement.innerHTML = responce.sheet_tag_name;
          // inputElement.style.paddingTop = '1.5%';
          this.sheetTagName = responce.sheet_tag_name;
        }
        this.sheetTagTitle = this.sanitizer.bypassSecurityTrustHtml(this.sheetTagName);
        this.displayUnits = 'none';
        
        if(this.sheetResponce.column_data){
          this.draggedColumnsData = this.sheetResponce.column_data;
        }
        else{
          this.draggedColumns.forEach((res:any) => {
            this.draggedColumnsData.push([res.column,res.data_type,"",""])
          });
        }
        if(this.sheetResponce.rows_data){
          this.draggedRowsData = this.sheetResponce.rows_data;
        }
        else{
          this.draggedRows.forEach((res:any) => {
            this.draggedRowsData.push([res.column,res.data_type,"",res.alias ? res.alias : ""])
          });
        }
        this.chartsDataSet(responce);
        if(responce.chart_id == 1){
          this.tableData = this.sheetResponce.results.tableData;
          this.displayedColumns = this.sheetResponce.results.tableColumns;
          this.bandingSwitch = this.sheetResponce.results.banding;
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
        }
        if(responce.chart_id == 25){
          this.tablePreviewRow = this.sheetResponce.results.kpiData;
          this.KPINumber = this.sheetResponce.results.kpiNumber;
          this.kpiFontSize = this.sheetResponce.results.kpiFontSize;
          this.kpiColor = this.sheetResponce.results.kpicolor;
          if(this.sheetResponce.results.kpiPrefix) {
            this.KPIPrefix = this.sheetResponce.results.kpiPrefix;
          }
          if(this.sheetResponce.results.kpiSuffix) {
            this.KPISuffix = this.sheetResponce.results.kpiSuffix;
          }
          this.KPIDisplayUnits = this.sheetResponce.results.kpiDecimalUnit,
          this.KPIDecimalPlaces = this.sheetResponce.results.kpiDecimalPlaces,
          this.table = false;
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
          this.radar = false;
          this.kpi = true;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
        }
       if(responce.chart_id == 6){
        // this.chartsRowData = this.sheetResponce.results.barYaxis;
        // this.chartsColumnData = this.sheetResponce.results.barXaxis;
       if(this.isApexCharts){
        const self = this;
        this.chartOptions3 = this.sheetResponce.savedChartOptions;
        this.chartOptions3.xaxis.convertedCatToNumeric = true;
        this.barchart?.updateOptions(this.chartOptions3);
        this.chartOptions3.dataLabels.formatter = this.formatNumber.bind(this);
        this.chartOptions3.chart.events = {
          dataPointSelection: function (event: any, chartContext: any, config: any) {
            const selectedXValue = self.chartOptions3.xaxis.categories[config.dataPointIndex];
            if (self.drillDownIndex < self.draggedDrillDownColumns.length - 1) {
              const selectedXValue = self.chartsColumnData[config.dataPointIndex];
              console.log('X-axis value:', selectedXValue);
              let nestedKey = self.draggedDrillDownColumns[self.drillDownIndex];
              self.drillDownIndex++;
              let obj = { [nestedKey]: selectedXValue };
              self.drillDownObject.push(obj);
              self.setOriginalData();
              self.dataExtraction();
            }
          }
        };
        this.xLabelSwitch = this.chartOptions3.xaxis.labels.show;
        // this.yLabelSwitch = this.chartOptions3.yaxis.labels.show;
        this.xGridSwitch = this.chartOptions3.grid.xaxis.lines.show;
        this.yGridSwitch = this.chartOptions3.grid.yaxis.lines.show;
        console.log(this.chartOptions3.xaxis.convertedCatToNumeric);
        console.log(this.chartOptions3);
       } else {
         this.eBarChartOptions = this.sheetResponce.savedChartOptions;
       }
      //  this.barChart();
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
       }
       if(responce.chart_id == 24){
        // this.chartsRowData = this.sheetResponce.results.pieYaxis;
        // this.chartsColumnData = this.sheetResponce.results.pieXaxis;
        if(this.isApexCharts){
          const self = this;
          this.chartOptions4 = this.sheetResponce.savedChartOptions;
          this.changeLegendsAllignment('bottom');
          this.chartOptions4.chart.events =  {
          dataPointSelection: function(event:any, chartContext:any, config:any) {
           if(self.drillDownIndex < self.draggedDrillDownColumns.length - 1  ){
            const selectedXValue = self.chartOptions4.labels[config.dataPointIndex];
           console.log('X-axis value:', selectedXValue);
           let nestedKey = self.draggedDrillDownColumns[self.drillDownIndex];
           self.drillDownIndex++;
           let obj = { [nestedKey] : selectedXValue};
           self.drillDownObject.push(obj);
           self.setOriginalData();
           self.dataExtraction();
           }
          }
        };
        this.legendSwitch = this.chartOptions4.legend?.show;
        } else {
          this.ePieChartOptions = this.sheetResponce.savedChartOptions;
        }
        // this.pieChart();
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
          this.changeLegendsAllignment(this.sheetResponce.savedChartOptions.legend.position);
          this.dataLabels = this.sheetResponce.savedChartOptions.dataLabels.enabled;
       }
       if(responce.chart_id == 13){
        // this.chartsRowData = this.sheetResponce.results.lineYaxis;
        // this.chartsColumnData = this.sheetResponce.results.lineXaxis
        if(this.isApexCharts){
          const self = this;
          this.chartOptions = this.sheetResponce.savedChartOptions;
          this.chartOptions.xaxis.convertedCatToNumeric = true;
          this.linechart?.updateOptions(this.chartOptions);
          this.chartOptions.events = {
            dataPointSelection: function (event: any, chartContext: any, config: any) {
              if (self.drillDownIndex < self.draggedDrillDownColumns.length - 1) {
                const selectedXValue = self.chartsColumnData[config.dataPointIndex];
                console.log('X-axis value:', selectedXValue);
                let nestedKey = self.draggedDrillDownColumns[self.drillDownIndex];
                self.drillDownIndex++;
                let obj = { [nestedKey]: selectedXValue };
                self.drillDownObject.push(obj);
                self.setOriginalData();
                self.callDrillDown();
              }
            }
          }
          this.xLabelSwitch = this.chartOptions.xaxis.labels.show;
          // this.yLabelSwitch = this.chartOptions.yaxis.labels.show;
          this.xGridSwitch = this.chartOptions.grid.xaxis.lines.show;
          this.yGridSwitch = this.chartOptions.grid.yaxis.lines.show;
        } else {
          this.eLineChartOptions = this.sheetResponce.savedChartOptions;
        }
        // this.lineChart();
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
       }
       if(responce.chart_id == 17){
        // this.chartsRowData = this.sheetResponce.results.areaYaxis;
        // this.chartsColumnData = this.sheetResponce.results.areaXaxis;
        if(this.isApexCharts){
          this.chartOptions1 = this.sheetResponce.savedChartOptions;
          this.chartOptions1.xaxis.convertedCatToNumeric = true;
          this.areachart?.updateOptions(this.chartOptions1);
          this.xLabelSwitch = this.chartOptions1.xaxis.labels.show;
          // this.yLabelSwitch = this.chartOptions1.yaxis.labels.show;
          this.xGridSwitch = this.chartOptions1.grid.xaxis.lines.show;
          this.yGridSwitch = this.chartOptions1.grid.yaxis.lines.show;
        } else {
          this.eAreaChartOptions = this.sheetResponce.savedChartOptions;
        }
        // this.areaChart();
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
       }
       if(responce.chart_id == 7){
        // this.sidebysideBarRowData = this.sheetResponce.results.sidebysideBarYaxis;
        // this.sidebysideBarColumnData1 = this.sheetResponce.results.sidebysideBarXaxis;
        if(this.isApexCharts){
        this.chartOptions2 = this.sheetResponce.savedChartOptions;
        this.xLabelSwitch = this.chartOptions2.xaxis.labels.show;
        // this.yLabelSwitch = this.chartOptions2.yaxis.labels.show;
        this.xGridSwitch = this.chartOptions2.grid.xaxis.lines.show;
        this.yGridSwitch = this.chartOptions2.grid.yaxis.lines.show;
        } else {
          this.eSideBySideBarChartOptions = this.sheetResponce.savedChartOptions;
        }
        // this.sidebysideBar();
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
       }
       if(responce.chart_id == 5){
        // this.sidebysideBarRowData = this.sheetResponce.results.stokedBarYaxis;
        // this.sidebysideBarColumnData1 = this.sheetResponce.results.stokedBarXaxis;
        if(this.isApexCharts){
        this.chartOptions6 = this.sheetResponce.savedChartOptions;
        this.xLabelSwitch = this.chartOptions6.xaxis.labels.show;
        this.xGridSwitch = this.chartOptions6.grid.xaxis.lines.show;
        this.yGridSwitch = this.chartOptions6.grid.yaxis.lines.show;
        } else {
          this.eStackedBarChartOptions = this.sheetResponce.savedChartOptions;
        }
        // this.stockedBar();
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
       }
       if(responce.chart_id == 4){
        // this.sidebysideBarRowData = this.sheetResponce.results.barLineYaxis;
        // this.sidebysideBarColumnData1 = this.sheetResponce.results.barLineXaxis;
        if(this.isApexCharts){
          this.chartOptions5 = this.sheetResponce.savedChartOptions;
          this.xLabelSwitch = this.chartOptions5.xaxis.labels.show;
          // this.yLabelSwitch = this.chartOptions5.yaxis.labels.show;
          this.xGridSwitch = this.chartOptions5.grid.xaxis.lines.show;
          this.yGridSwitch = this.chartOptions5.grid.yaxis.lines.show;
        } else {
          this.eBarLineChartOptions = this.sheetResponce.savedChartOptions;
        }
        // this.barLineChart();
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
       }
       if(responce.chart_id == 12){
        this.sidebysideBarColumnData1 = this.sheetResponce.results.barLineXaxis;
        this.radarChart();
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
          this.donut = false;
          this.radar = true;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
          if(this.isApexCharts){
          
          } else {
            this.eRadarChartOptions = this.sheetResponce.savedChartOptions;
          }
       }
       if(responce.chart_id == 2){
        // this.sidebysideBarRowData = this.sheetResponce.results.hStockedYaxis;
        // this.sidebysideBarColumnData1 = this.sheetResponce.results.hStockedXaxis;
        if(this.isApexCharts){
        this.chartOptions7 = this.sheetResponce.savedChartOptions;
        this.xLabelSwitch = this.chartOptions7.xaxis.labels.show;
        // this.yLabelSwitch = this.chartOptions7.yaxis.labels.show;
        this.xGridSwitch = this.chartOptions7.grid.xaxis.lines.show;
        this.yGridSwitch = this.chartOptions7.grid.yaxis.lines.show;
        } else {
          this.ehorizontalStackedBarChartOptions = this.sheetResponce.savedChartOptions;
        }
        // this.horizentalStockedBar();
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
       }
       if(responce.chart_id == 3){
        // this.sidebysideBarRowData = this.sheetResponce.results.hgroupedYaxis;
        // this.sidebysideBarColumnData1 = this.sheetResponce.results.hgroupedXaxis;
        if(this.isApexCharts){
        this.chartOptions8 = this.sheetResponce.savedChartOptions;
        this.xLabelSwitch = this.chartOptions8.xaxis.labels.show;
        // this.yLabelSwitch = this.chartOptions8.yaxis.labels.show;
        this.xGridSwitch = this.chartOptions8.grid.xaxis.lines.show;
        this.yGridSwitch = this.chartOptions8.grid.yaxis.lines.show;
        } else {
          this.eGroupedBarChartOptions = this.sheetResponce.savedChartOptions;
        }
        // this.hGrouped();
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
       }
       if(responce.chart_id == 8){
        // this.sidebysideBarRowData = this.sheetResponce.results.multiLineYaxis;
        // this.sidebysideBarColumnData1 = this.sheetResponce.results.multiLineXaxis;
        if(this.isApexCharts){
        this.chartOptions9 = this.sheetResponce.savedChartOptions;
        this.xLabelSwitch = this.chartOptions9.xaxis.labels.show;
        // this.yLabelSwitch = this.chartOptions9.yaxis.labels.show;
        this.xGridSwitch = this.chartOptions9.grid.xaxis.lines.show;
        this.yGridSwitch = this.chartOptions9.grid.yaxis.lines.show;
        } else {
          this.eMultiBarChartOptions = this.sheetResponce.savedChartOptions;
        }
        // this.multiLineChart();
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
       }
       if(responce.chart_id == 10){
        // this.chartsRowData = this.sheetResponce.results.donutYaxis
        // this.chartsColumnData = this.sheetResponce.results.donutXaxis;
        this.chartOptions10 = this.sheetResponce.savedChartOptions;
        const self = this;
        this.chartOptions10.chart.events = {
          dataPointSelection: function (event: any, chartContext: any, config: any) {
            if (self.drillDownIndex < self.draggedDrillDownColumns.length - 1) {
              const selectedXValue = self.chartOptions10.labels[config.dataPointIndex];
              console.log('X-axis value:', selectedXValue);
              let nestedKey = self.draggedDrillDownColumns[self.drillDownIndex];
              self.drillDownIndex++;
              let obj = { [nestedKey]: selectedXValue };
              self.drillDownObject.push(obj);
              self.setOriginalData();
              self.callDrillDown();
            }
          }
        }
        this.legendSwitch = this.chartOptions10.legend.show;
        // this.donutChart();
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
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = false;
          this.changeLegendsAllignment(this.sheetResponce.savedChartOptions.legend.position);
          this.dataLabels = this.sheetResponce.savedChartOptions.dataLabels.enabled;
          this.label = this.sheetResponce.savedChartOptions.plotOptions.pie.donut.labels.show
       }
       if(responce.chart_id == 26){
        this.heatMapChartOptions = this.sheetResponce.savedChartOptions;
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
          this.donut = false;
          this.radar = false;
          this.kpi = false;
          this.heatMap = true;
          this.funnel = false;
          this.guage = false;
       }
       if(responce.chart_id == 27){
        this.funnelChartOptions = this.sheetResponce.savedChartOptions;
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
          this.donut = false;
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = true;
          this.guage = false;
       }
       if(responce.chart_id == 28){
        this.guageChartOptions = this.sheetResponce.savedChartOptions;
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
          this.donut = false;
          this.radar = false;
          this.kpi = false;
          this.heatMap = false;
          this.funnel = false;
          this.guage = true;
       }
       this.setCustomizeOptions(this.sheetResponce.customizeOptions);
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
  minValue: any;
  maxValue: any;
  floor: any;
  ceil: any;
  minDate: string = '';
  maxDate: string = '';
  options: Options ={};
  filterDateRange : any[] = [];
  updateDateRange() {
    const format: Intl.DateTimeFormatOptions = { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    };
    this.minDate = new Date(this.minValue).toLocaleDateString('en-US', format);
    this.maxDate = new Date(this.maxValue).toLocaleDateString('en-US', format);
    this.filterDateRange = [this.minDate, this.maxDate];
  }
  filterDataGet(){
    const obj={
      "database_id" :this.databaseId,
      "query_set_id":this.qrySetId,
      "type_of_filter" : "sheet",
      "datasource_queryset_id" :this.filterQuerySetId,
      "col_name":this.filterName,
       "data_type":this.filterType,
       "search":this.filterSearch,
       "parent_user":this.createdBy
      // "format_date":""
}as any;
if(this.fromFileId){
  delete obj.database_id;
  obj.file_id=this.fileId;
}
  this.workbechService.filterPost(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        this.filterData = responce.col_data;
        if(this.dateList.includes(responce.dtype)){
          this.floor = new Date(this.filterData[0]).getTime();
          this.ceil = new Date(this.filterData[this.filterData.length - 1]).getTime();
          this.minValue = this.floor;
          this.maxValue = this.ceil;
          this.options = {
            floor: this.floor,
            ceil: this.ceil,
            step: 24 * 60 * 60 * 1000,
            showSelectionBar: true,
            selectionBarGradient: {
              from: '#5a66f1',
              to: '#5a66f1',
            },
            translate: (value: number): string => {
              return new Date(value).toLocaleDateString();
            }
          };
          this.updateDateRange();
          this.filterDateRange = [];
        }
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
    // this.dimetionMeasure = [];
    const obj={
    //"filter_id": this.filter_id,
    "database_id": this.databaseId,
    "queryset_id": this.qrySetId,
    "type_of_filter":"sheet",
    "datasource_querysetid" : this.filterQuerySetId,
    "range_values": this.filterDateRange,
    "select_values":this.filterDataArray,
    "col_name":this.filterName,
       "data_type":this.filterType,
       "parent_user":this.createdBy
}as any;
if(this.fromFileId){
  delete obj.database_id;
  obj.file_id=this.fileId;
}
  this.workbechService.filterPut(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        this.filterId.push(responce.filter_id);
        this.filter_id=responce.filter_id
        this.dimetionMeasure.push({"col_name":this.filterName,"data_type":this.filterType,"filter_id":responce.filter_id});
        this.dataExtraction();
        this.filterDataArray = [];
        this.filterDateRange = [];
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
      "filter_id" :this.filter_id,
      "search":this.editFilterSearch
}as any;
if(this.fromFileId){
  delete obj.database_id;
  obj.file_id=this.fileId;
}
  this.workbechService.filterEditPost(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        this.filter_id = responce.filter_id;
        this.filterName=responce.column_name;
        this.filterType=responce.data_type;
        responce.result.forEach((element:any) => {
          this.filterData.push(element);
        });
        this.filterData.forEach((filter:any)=>{
          if(filter.selected){
            this.filterDataArray.push(filter.label);
          }
        })
        if(this.dateList.includes(responce.dtype)){
          this.updateDateRange();
          this.filterDateRange = [];
        }
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
      "range_values": this.filterDateRange,
      "select_values":this.filterDataArray,
      "col_name":this.filterName,
      "data_type":this.filterType

  }as any;
  if(this.fromFileId){
    delete obj.database_id;
    obj.file_id=this.fileId;
  }
    this.workbechService.filterPut(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.dataExtraction();
          this.filterDataArray = [];
          this.filterDateRange = [];
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }
  filterDelete(index:any,filterId:any){
  this.workbechService.filterDelete(filterId).subscribe({next: (responce:any) => {
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
  console.log(data);
  this.filterType = data.data_type;
  if ('filter_id' in data) {
    this.filterName = data.col_name;
    this.filter_id = data.filter_id;
  }
  else{
    this.filterName = data.column;
    this.dimetionMeasure.forEach((column:any)=>{
      if(column.col_name === data.column){
        this.filter_id = column.filter_id;
      }
    })
  }
  this.filterEditGet();
}
filterAdded : boolean = false;
editFilterCheck(data:any){
  if(this.dimetionMeasure.length>0){
    this.dimetionMeasure.forEach((column:any)=>{
      if(column.col_name === data){
        this.filterAdded = true;
      }
      else{
        this.filterAdded = false;
      }
    })
  }
  else{
    this.filterAdded = false;
  }
}
gotoDashboard(){
  if(!this.fromFileId){
  const encodedDatabaseId = btoa(this.databaseId.toString());
  const encodedQuerySetId = btoa(this.qrySetId.toString());
  this.router.navigate(['/workbench/sheetscomponent/sheetsdashboard/dbId'+'/'+ encodedDatabaseId +'/' +encodedQuerySetId])
  }
if(this.fromFileId){
  const encodedFileId = btoa(this.fileId.toString())
  const encodedQuerySetId = btoa(this.qrySetId.toString());
  this.router.navigate(['/workbench/sheetscomponent/sheetsdashboard/fileId'+'/'+ encodedFileId +'/' +encodedQuerySetId])
}
}
viewDashboard(){
  if(this.fromFileId){
    const encodedDatabaseId = btoa(this.fileId.toString());
    const encodedQuerySetId = btoa(this.qrySetId.toString());
    const encodedDashboardId = btoa(this.dashboardId.toString());
    this.router.navigate(['workbench/landingpage/sheetsdashboard'+'/'+ encodedDatabaseId +'/' +encodedQuerySetId +'/' + encodedDashboardId])

  } else {
  const encodedDatabaseId = btoa(this.databaseId.toString());
  const encodedQuerySetId = btoa(this.qrySetId.toString());
  const encodedDashboardId = btoa(this.dashboardId.toString());
  this.router.navigate(['workbench/landingpage/sheetsdashboard'+'/'+ encodedDatabaseId +'/' +encodedQuerySetId +'/' + encodedDashboardId])
  }

}
barColor : any;
lineColor : any;
marksColor2(color:any){
console.log(this.sidebysideBarRowData);
console.log(color)
let object : any;
if(this.barchart){
  this.chartOptions3.colors = color;
  object = {colors: [color]};
}
else if(this.areachart){
  this.chartOptions1.colors = color;
  object = {colors: [color]};
}
else if(this.linechart){
  this.chartOptions.colors = color;
  object = {colors: [color]};
}
else if(this.sidebysideChart){
  if(this.sidebysideBarRowData){
  }
  this.chartOptions2.colors = color;
  object = {colors: [color]};
}
else if(this.stockedChart){
  this.chartOptions6.colors = color;
  object = {colors: [color]};
}
else if(this.barlineChart){
  this.chartOptions5.series[0].color = this.barColor;
  this.chartOptions5.series[1].color = this.lineColor;
  object = {colors: [this.barColor, this.lineColor]};
}
else if(this.horizontolstockedChart){
  this.chartOptions7.colors = color;
  object = {colors: [color]};
}
else if(this.groupedChart){
  this.chartOptions8.colors = color;
  object = {colors: [color]};
}
else if(this.multilineChart){
  this.chartOptions9.colors = color;
  object = {colors: [color]};
}
this.updateChart(object);
}
// scolor : any;
// barColors(color:any, index: any){
//   if(index === 0){
//     this.chartOptions2.series[0].color = color;
//   }
//   if(index === 1){
//     this.chartOptions2.series[1].color = color;
//   }
//   if(index === 2){
//     this.chartOptions2.series[2].color = color;
//   }
//   this.updateChart();
// }
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
    toolbar: ['heading', '|', 'bold', 'italic', 'underline','|', 'fontSize', 'fontFamily', 'fontColor', '|', 'alignment'],
    plugins: [
      Bold, Essentials, Italic, Mention, Paragraph, Undo, Font, Alignment, Underline, RemoveFormat, SelectAll, Heading],
  };

  // editorConfig1 = {
  //   toolbar: [],
  //   plugins: [
  //     Bold, Essentials, Italic, Mention, Paragraph, Undo, Font, Alignment, Underline, RemoveFormat, SelectAll, Heading],
  // };

  toggleEditor() {
    this.editor = !this.editor;
  }
  updateSheetName() {
    // const inputElement = document.getElementById('htmlContent') as HTMLInputElement;
    // if (inputElement) {
    //   inputElement.innerHTML = this.sheetTagName;
    //   inputElement.style.paddingTop = '1.5%';
    // }
    this.sheetTagTitle = this.sanitizer.bypassSecurityTrustHtml(this.sheetTagName);
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.sheetTagName, 'text/html');
    this.sheetTitle = doc.body.textContent+'';
  }
  fontChange(event : any, section : any){
    let object:any;
    if (section === 'dimension') {
      if (event.target.value === 'arial') {
        object = {xaxis: {labels: {style: {fontFamily: 'Arial, sans-serif',fontWeight: 'bold',fontSize: '12px',}}, categories: this.chartsColumnData}}
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
        object = {xaxis: {labels: {style: {fontFamily: 'Calibri, sans-serif',fontWeight: 'bold',fontSize: '14px',}}, categories: this.chartsColumnData}}
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
        object = {xaxis: {labels: {style: {fontFamily: 'Times New Roman, serif',fontWeight: 'bold',fontSize: '16px',}}, categories: this.chartsColumnData}}
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
        object = {xaxis: {labels: {style: {fontFamily: 'Verdana, sans-serif',fontWeight: 'bold',fontSize: '12px',}}, categories: this.chartsColumnData}}
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
        object = {yaxis: [{labels: {style: {fontFamily: 'Arial, sans-serif',fontWeight: 'bold',fontSize: '12px',}}}]};
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
        object = {yaxis: [{labels: {style: {fontFamily: 'Calibri, sans-serif',fontWeight: 'bold',fontSize: '14px',}}}]};
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
        object = {yaxis: [{labels: {style: {fontFamily: 'Times New Roman, serif',fontWeight: 'bold',fontSize: '16px',}}}]};
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
        object = {yaxis: [{labels: {style: {fontFamily: 'Verdana, sans-serif',fontWeight: 'bold',fontSize: '12px',}}}]};
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
    this.updateChart(object);
  }
  allignmentChange(event: any, section: any) {
    let object : any;
    if (section === 'dimension') {
      if (event.target.value === 'center') {
        object = {xaxis: {labels : {offsetX : 0}, categories: this.chartsColumnData}};
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
        object = {xaxis: {labels : {offsetX : -10}, categories: this.chartsColumnData}};
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
        object = {xaxis: {labels : {offsetX : 10}, categories: this.chartsColumnData}};
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
        object = {yaxis: {labels : {offsetY : 0}}};
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
        object = {yaxis: {labels : {offsetY : -10}}};
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
        object = {yaxis: {labels : {offsetY : 10}}};
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
    this.updateChart(object);
  }
  updateChart(object : any) {
    if (this.barchart) {
      this.barchart.updateOptions(object);
      console.log(this.chartOptions3);
      console.log(this.barchart);
    }
    else if(this.areachart){
      this.areachart.updateOptions(object);
      console.log(this.chartOptions1);
      console.log(this.areachart);
    }
    else if(this.linechart){
      this.linechart.updateOptions(object);
      console.log(this.chartOptions);
      console.log(this.linechart);
    }
    else if(this.sidebysideChart){
      this.sidebysideChart.updateOptions(object);
      console.log(this.chartOptions2);
      console.log(this.sidebysideChart);
    }
    else if(this.stockedChart){
      this.stockedChart.updateOptions(object);
      console.log(this.chartOptions6);
      console.log(this.stockedChart);
    }
    else if(this.barlineChart){
      this.barlineChart.updateOptions(object);
      console.log(this.chartOptions5);
      console.log(this.barlineChart);
    }
    else if(this.horizontolstockedChart){
      this.horizontolstockedChart.updateOptions(object);
      console.log(this.chartOptions7);
      console.log(this.horizontolstockedChart);
    }
    else if(this.groupedChart){
      this.groupedChart.updateOptions(object);
      console.log(this.chartOptions8);
      console.log(this.groupedChart);
    }
    else if(this.multilineChart){
      this.multilineChart.updateOptions(object);
      console.log(this.chartOptions9);
      console.log(this.multilineChart);
    }
    else if(this.piechart){
      this.piechart.updateOptions(object);
      console.log(this.chartOptions4);
      console.log(this.piechart);
    }
    else if(this.donutchart){
      this.donutchart.updateOptions(object);
      console.log(this.chartOptions10);
      console.log(this.donutchart);
    }
    else if(this.funnel){
      this.funnelCharts.updateOptions(object);
      console.log(this.funnelCharts);
    }
  }
  dataLabels:boolean = true;
  label : boolean = true;
  isDistributed : boolean = false;
  toggleSwitch(type : string) {
    let object:any;
    if(type === 'banding'){
      this.bandingSwitch = !this.bandingSwitch;
      if(!this.bandingSwitch){
        this.color1 = undefined;
        this.color2 = undefined;
      }
    }
    else if(type === 'xlabel'){
      this.xLabelSwitch = !this.xLabelSwitch;
      const dimensions: Dimension[] = this.sidebysideBarColumnData1;
      const categories = this.flattenDimensions(dimensions);
      if(this.isApexCharts){
      object = { xaxis: {labels: {show: this.xLabelSwitch}, categories: this.chartsColumnData}};
      if(this.barchart){
        this.chartOptions3.xaxis.labels.show = this.xLabelSwitch;
        this.chartOptions3.xaxis.categories = this.chartsColumnData;
      }
      else if(this.areachart){
        this.chartOptions1.xaxis.labels.show = this.xLabelSwitch;
        this.chartOptions1.xaxis.categories = this.chartsColumnData;
      }
      else if(this.linechart){
        this.chartOptions.xaxis.labels.show = this.xLabelSwitch;
        this.chartOptions.xaxis.categories = this.chartsColumnData;
      }
      else if(this.sidebysideChart){
        this.chartOptions2.xaxis.labels.show = this.xLabelSwitch;
        this.chartOptions2.xaxis.categories = categories;
      }
      else if(this.stockedChart){
        this.chartOptions6.xaxis.labels.show = this.xLabelSwitch;
        this.chartOptions6.xaxis.categories = categories;
      }
      else if(this.barlineChart){
        this.chartOptions5.xaxis.labels.show = this.xLabelSwitch;
        this.chartOptions5.xaxis.categories = categories;
      }
      else if(this.horizontolstockedChart){
        this.chartOptions7.xaxis.labels.show = this.xLabelSwitch;
        this.chartOptions7.xaxis.categories = categories;
      }
      else if(this.groupedChart){
        this.chartOptions8.xaxis.labels.show = this.xLabelSwitch;
        this.chartOptions8.xaxis.categories = categories;
      }
      else if(this.multilineChart){
        this.chartOptions9.xaxis.labels.show = this.xLabelSwitch;
        this.chartOptions9.xaxis.categories = categories;
      }
    } else {
      this.changeAlignment();
    }
    }
    else if(type === 'ylabel'){
      this.yLabelSwitch = !this.yLabelSwitch;
      if(this.isApexCharts){
      object = { yaxis: {labels: {show: this.yLabelSwitch}}};
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
    } else {
      this.changeAlignment();
    }
    }
    else if(type === 'xgrid'){
      this.xGridSwitch = !this.xGridSwitch;
      if(this.isApexCharts){
      object = {grid: {xaxis: {lines: {show: this.xGridSwitch}}}};
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
    } else {
      this.changeAlignment();
    }
    }
    else if(type === 'ygrid'){
      this.yGridSwitch = !this.yGridSwitch;
      if(this.isApexCharts){
      object = {grid: {yaxis: {lines: {show: this.yGridSwitch}}}};
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
    } else {
      this.changeAlignment();
    }
    }
    else if(type === 'legend'){
      this.legendSwitch = !this.legendSwitch;
      object = {legend: {show: this.legendSwitch}};
      if(this.piechart){
        this.chartOptions4.legend.show = this.legendSwitch;
      }
      else if(this.donutchart){
        this.chartOptions10.legend.show = this.legendSwitch;
      }
    }
    else if(type === 'dataLabels'){
      this.dataLabels = !this.dataLabels;
      object = {dataLabels: {enabled: this.dataLabels}}; 
      if(this.piechart){
        this.chartOptions4.dataLabels.enabled = this.dataLabels;
      }
      else if(this.donutchart){
        this.chartOptions10.dataLabels.enabled = this.dataLabels;
      }
    }
    else if(type === 'label'){
      this.label = !this.label;
      object = {plotOptions: {pie: {donut: {labels: {show: this.label}}}}}
      if(this.donutchart){
        this.chartOptions10.plotOptions.pie.donut.labels.show = this.label;
      }
    }
    else if(type === 'distributed'){
      this.isDistributed = !this.isDistributed;
      object = {plotOptions: {bar: {distributed: this.isDistributed}}};
      this.funnelChartOptions.plotOptions.bar.distributed = this.isDistributed;
    }
    this.updateChart(object);
  }
  enableZoom(){
    this.isZoom = !this.isZoom;
    if(this.bar){
      this.barChart();
    }
    else if(this.area){
      this.areaChart();
    }
    else if(this.line){
      this.lineChart();
    }
    else if(this.barLine){
      this.barLineChart();
    } else if(this.stocked){
      this.stockedBar();
    }
    else if(this.grouped){
      this.hGrouped();
    }
    else if(this.sidebyside){
      this.sidebysideBar();
    } else if(this.horizentalStocked){
      this.horizentalStockedBar();
    } else if(this.multiLine){
      this.multiLineChart();
    }
  }

  changeAlignment(){

    if(this.bar){
      this.barChart();
    }
    else if(this.area){
      this.areaChart();
    }
    else if(this.line){
      this.lineChart();
    }
    else if(this.barLine){
      this.barLineChart();
    }
  }
  formattedData : any[] = [];
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
    this.formattedData.push(this.prefix + formattedNumber + this.suffix);
    return this.prefix + formattedNumber + this.suffix;
  }

  formatKPINumber() {
    let formattedNumber = this.tablePreviewRow[0].result_data[0]+'';
    let value = this.tablePreviewRow[0].result_data[0];
    if (this.KPIDisplayUnits !== 'none') {
      switch (this.KPIDisplayUnits) {
        case 'K':
          formattedNumber = (value / 1_000).toFixed(this.KPIDecimalPlaces) + 'K';
          break;
        case 'M':
          formattedNumber = (value / 1_000_000).toFixed(this.KPIDecimalPlaces) + 'M';
          break;
        case 'B':
          formattedNumber = (value / 1_000_000_000).toFixed(this.KPIDecimalPlaces) + 'B';
          break;
        case 'G':
          formattedNumber = (value / 1_000_000_000_000).toFixed(this.KPIDecimalPlaces) + 'G';
          break;
      }
    } else {
      formattedNumber = (value).toFixed(this.KPIDecimalPlaces)
    }

    this.KPINumber = this.KPIPrefix + formattedNumber + this.KPISuffix;
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
      const apiKey = localStorage.getItem('API_KEY');
      if (error.error.message === 'Queryset ID is required'){
        this.chartSuggestions = null;
        this.errorMessage = ""
      }
      else if  (!apiKey || apiKey.trim() === '') {
        // Store the current URL before navigating to the configure page
        localStorage.setItem('previousUrl', this.router.url);
        this.chartSuggestions = null;
        // API Key is missing or empty, show the message and navigate to the configure page on click
        // this.errorMessage = `The GPT API Key is missing. Please <a href="/workbench/configure-page/configure">add the GPT API Key</a> to proceed.`;
        this.errorMessage1 = 'the GPT API key is missing. Please'
        // this.router.navigate(['/workbench/configure-page/configure']);
      } else {
        // Handle other errors
        console.log("Error:", error.message);
        this.chartSuggestions = null;
        this.errorMessage = `We're experiencing a <b>'data-ruption'</b>! Please reconnect to the database and try again.`;
        console.error(error);
      }
    }
  );
}
routeConfigure(){
  this.router.navigate(['/workbench/configure-page/configure'])
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
            this.chartDisplay(false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,6);
          }else if (chartData.chart_type==="Pie Chart"){
            this.chartDisplay(false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,24);
          }else if (chartData.chart_type==="Line Chart"){
            this.chartDisplay(false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,13);
          }else if (chartData.chart_type==="Area Chart"){
            this.chartDisplay(false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,17);
          }
          this.dataExtraction();

}

  changeChartPlugin() {
    if (this.selectedChartPlugin == 'apex') {
      this.isApexCharts = true;
      this.isEChatrts = false;
    } else {
      this.isApexCharts = false;
      this.isEChatrts = true;
    }
    this.reAssignChartData();
  }
  reAssignChartData() {
    this.barChart();
    this.pieChart();
    this.lineChart();
    this.areaChart();
    this.barLineChart();
    this.radarChart();
    this.stockedBar();
    this.hGrouped();
    this.sidebysideBar();
    this.horizentalStockedBar();
  }
  marksColor(color: any, colorCase: number) {
    console.log(color)
    switch (colorCase) {
      case 1: this.xGridColor = color; break;
      case 2: this.yLabelColor = color; break;
      case 3: this.yGridColor = color; break;
      case 4: this.color = color; break;
      case 5: this.xLabelColor = color; break;
      case 6: this.backgroundColor = color; break;
    }
    this.reAssignChartData();
  }

  setCustomizeOptions(data: any) {
    this.isZoom = data.isZoom;
    this.xGridColor = data.xGridColor;
    this.xGridSwitch = data.xGridSwitch;
    // this.xLabelSwitch = data.xLabelSwitch;
    this.xLabelColor = data.xLabelColor;
    this.yLabelSwitch = data.yLabelSwitch;
    this.yGridColor = data.yGridColor;
    this.yGridSwitch = data.yGridSwitch;
    this.yLabelColor = data.yLabelColor;
    this.xLabelFontFamily = data.xLabelFontFamily;
    this.xLabelFontSize = data.xLabelFontSize;
    this.xlabelFontWeight = data.xlabelFontWeight;
    this.labelAlignment = data.labelAlignment;
  }

  sendPrompt() {
    if (this.userPrompt.trim()) {
      const obj = {
        id: this.qrySetId,
        prompt: this.userPrompt.trim()
      };
      this.workbechService.getServerTablesList(obj).subscribe(
        data => {
          this.zone.run(() => {
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
          });
        },
        error => {
          const apiKey = localStorage.getItem('API_KEY');
          if (error.error.message === 'Queryset ID is required'){
            this.chartSuggestions = null;
            this.errorMessage = ""
          }
          else if  (!apiKey || apiKey.trim() === '') {
            this.chartSuggestions = null;
            // API Key is missing or empty, show the message and navigate to the configure page
            // this.errorMessage = `The GPT API Key is missing. Please <a href="/workbench/configure-page/configure">add the GPT API Key</a> to proceed.`;
            this.errorMessage1 = 'the GPT API key is missing. Please'
            // this.router.navigate(['/workbench/configure-page/configure']);
          } else {
            // Handle other errors
            console.log("Error:", error.message);
            this.chartSuggestions = null;
            this.errorMessage = `We're experiencing a <b>'data-ruption'</b>! Please reconnect to the database and try again.`;
            console.error(error);
          }
        }
      );
    }
  }
  
  startVoiceRecognition() {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.start();
  
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.zone.run(() => {
        this.userPrompt = transcript;
        this.sendPrompt();
      });
    };
  
    recognition.onerror = (event: any) => {
      console.error('Voice recognition error', event);
      this.zone.run(() => {
        this.errorMessage = 'Voice recognition error';
      });
    };
  
    recognition.onend = () => {
      console.log('Voice recognition ended');
    };
  }
  openSelectDashboard(modal : any){
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
    });
  }
  dashboardList : any[] = [];
  getDashboardsList() {
    this.workbechService.getuserDashboardsList().subscribe({
      next: (responce: any) => {
        console.log(responce);
        this.dashboardList = responce;
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          text: error.error.message,
          width: '200px',
        })
      }
    })
  }
  async moveToDashboard(){
    if(this.selectedDashboardId > 0) {
      this.dashboardId = this.selectedDashboardId;
    }
    if(this.tabs && this.sheetList &&  this.tabs.length != this.sheetList.length){
      await this.getSheetNames();
    }
    console.log(this.dashboardId);
    let sheetIds = this.sheetList.map(sheet => sheet.id)
    let obj = {
      dashboard_id : this.dashboardId,
      sheet_ids : sheetIds
    }
    this.workbechService.addSheetToDashboard(obj).subscribe({
      next: () => {
        this.viewDashboard();
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          text: error.error.message,
          width: '200px',
        })
      }
    })
  }
  gridLineColor(color: any){
    let object : any;
    if(color){
      object = {grid: { borderColor: color }}
      if(this.barchart){
        this.chartOptions3.grid.borderColor = color;
      }
      else if(this.areachart){
        this.chartOptions1.grid.borderColor = color;
      }
      else if(this.linechart){
        this.chartOptions.grid.borderColor = color;
      }
      else if(this.sidebysideChart){
        this.chartOptions2.grid.borderColor = color;
      }
      else if(this.stockedChart){
        this.chartOptions6.grid.borderColor = color;
      }
      else if(this.barlineChart){
        this.chartOptions5.grid.borderColor = color;
      }
      else if(this.horizontolstockedChart){
        this.chartOptions7.grid.borderColor = color;
      }
      else if(this.groupedChart){
        this.chartOptions8.grid.borderColor = color;
      }
      else if(this.multilineChart){
        this.chartOptions9.grid.borderColor = color;
      }
      this.updateChart(object);
    }
  }
  apexbBackgroundColor(color: any){
    let object:any;
    if(color){
      object = {chart: {background: color}};
      if(this.barchart){
        this.chartOptions3.chart.background = color;
      }
      else if(this.areachart){
        this.chartOptions1.chart.background = color;
      }
      else if(this.linechart){
        this.chartOptions.chart.background = color;
      }
      else if(this.sidebysideChart){
        this.chartOptions2.chart.background = color;
      }
      else if(this.stockedChart){
        this.chartOptions6.chart.background = color;
      }
      else if(this.barlineChart){
        this.chartOptions5.chart.background = color;
      }
      else if(this.horizontolstockedChart){
        this.chartOptions7.chart.background = color;
      }
      else if(this.groupedChart){
        this.chartOptions8.chart.background = color;
      }
      else if(this.multilineChart){
        this.chartOptions9.chart.background = color;
      }
      else if(this.piechart){
        this.chartOptions4.chart.background = color;
      }
      else if(this.donutchart){
        this.chartOptions10.chart.background = color;
      }
      this.updateChart(object);
    }
  }
  openDateFormatModal(modal: any){
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
    });
  }
  dateFormat(column:any, index:any, format:any){
    if(format === ''){
      this.draggedColumnsData[index] = [column.column,column.data_type,format,""];
      this.draggedColumns[index] = {column:column.column,data_type:column.data_type,type:format};
     }else if(format === '-Select-'){
      this.draggedColumnsData[index] = [column.column,column.data_type,'',''];
      this.draggedColumns[index] = {column:column.column,data_type:column.data_type,type:''};
     }
     else{
      this.draggedColumnsData[index] = [column.column, "date", format,''];
      this.draggedColumns[index] = { column: column.column, data_type: column.data_type, type: format };
      console.log(this.draggedColumns);
     }
     this.dataExtraction();
  }
  dateAggregation(column:any, index:any, type:any){
    if (type === '') {
      this.draggedColumnsData[index] = [column.column, column.data_type, type, ''];
      this.draggedColumns[index] = { column: column.column, data_type: column.data_type, type: type };
    }
    else {
      this.draggedColumnsData[index] = [column.column, "aggregate", type, ''];
      this.draggedColumns[index] = { column: column.column, data_type: column.data_type, type: type };
      console.log(this.draggedColumns);
    }
    this.dataExtraction();
  }
  
  kpiFontSize: string = '3';
  kpiColor: string = '#000000';

  sliderOptions = {
    floor: 1,
    ceil: 20,
    step: 0.1,
    showTicks: true
  };
  getFontSize(): string {
    return `${this.kpiFontSize}rem`;
  }

  searchFilterList(){
    this.filterDataGet();
  }
  editFilterList(){
    this.filterEditGet();
  }
  drillDownColumndrop(event: CdkDragDrop<string[]>){
        console.log(event)
        let item: any = event.previousContainer.data[event.previousIndex];
        this.draggedDrillDownColumns.push(item.column);
  }
  removeDrillDownColumn(index:any,column:any){
       
    this.draggedDrillDownColumns.splice(index, 1);
        (this.draggedDrillDownColumns as any[]).forEach((data,index)=>{
          (data as any[]).forEach((aa)=>{ 
           if(column === aa){
              this.draggedDrillDownColumns.splice(index, 1);
            }
         } );
        });   
       this.dataExtraction();
      }

      toggleDateSwitch(){
            this.dateDrillDownSwitch = !this.dateDrillDownSwitch;
            if(this.dateDrillDownSwitch){
              this.draggedDrillDownColumns = ["year","quarter","month","date"];
              this.drillDownIndex = 0;
            } else {
              this.drillDownIndex = 0;
              this.draggedDrillDownColumns = [];
              this.drillDownObject = [];
            }
             
            this.dataExtraction();
         }
        
          callDrillDown(){
            this.dataExtraction();
          }
        
          goDrillDownBack(){
            if(this.drillDownIndex > 0) {
              this.drillDownIndex--;
              this.drillDownObject.pop();
              this.callDrillDown();
            }         
          }
  titleShow : boolean = true;
  legendsAllignment : any;
  changeLegendsAllignment(allignment:any){
    this.legendsAllignment = allignment;
    let object : any = {legend: {position: allignment}};
    if(this.pie){
      this.legendsAllignment = allignment;
      this.chartOptions4.legend.position = allignment;
    }
    else if(this.donut){
      this.legendsAllignment = allignment;
      this.chartOptions10.legend.position = allignment;
    }
    this.updateChart(object);
  }
  donutSize:any = 50;
  changeSize(){
    let object : any = {plotOptions: { pie: {donut: {size: this.donutSize+'%'}}}};
    this.chartOptions10.plotOptions.pie.donut.size = this.donutSize+'%';
    this.updateChart(object);
  }
  color1:any;
  color2:any;

  setOriginalData(){
        if(this.bar){//bar
          if(!this.originalData){
            this.originalData = {categories: this.chartsColumnData , data:this.chartsRowData };
          }
        }
        else if(this.pie){//pie
          if(!this.originalData){
            this.originalData = {categories: this.chartsColumnData , data:this.chartsRowData };
          }
        }
        else if(this.donut){//pie
          if(!this.originalData){
            this.originalData = {categories: this.chartsColumnData , data:this.chartsRowData };
          }
        }
      }

      sortFunnel(event:any){
        const numbers = this.funnelChartOptions.series[0].data;
        if(event.target.value === 'ascending'){
          numbers.sort((a:any, b:any) => a - b);
        }
        else if(event.target.value === 'descending'){
          numbers.sort((a:any, b:any) => b - a);
        }
        console.log(numbers);
        this.funnelChartOptions.series[0].data = numbers;
        this.funnelCharts.updateSeries([{data: numbers}]);
      }
      funnelFontChange(event:any,type:any){
        let font = event.target.value;
        let object = {};
        if(type === 'family'){
          this.funnelChartOptions.dataLabels.style.fontFamily = font;
          object = { datalabels: { style: { fontFamily: font } } };
          object = this.funnelChartOptions
        } else if(type === 'size'){
          let size = event.target.value;
          this.funnelChartOptions.dataLabels.style.fontSize = size;
          object = { datalabels: { style: { fontSize: size } } };
          object = this.funnelChartOptions;
        } else if(type === 'allign'){
          let allign = event.target.value;
          this.funnelChartOptions.plotOptions.bar.dataLabels.position = allign;
          object = { plotOptions: { bar: { dataLabels: { position: allign } } } }
        }
        this.updateChart(object);
      }
      funnelColorChange(event:any){
        let selectedColor = event;
        this.funnelChartOptions.series[0].color = selectedColor;
        let object = {series: [{color: selectedColor}]}
        object = this.funnelChartOptions;
        this.updateChart(object);
      }
}