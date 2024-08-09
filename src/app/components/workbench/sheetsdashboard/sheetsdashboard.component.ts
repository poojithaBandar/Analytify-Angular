import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbDropdown, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import {CompactType, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterItemComponentInterface, GridsterModule, GridsterPush, 
  GridType,
  DisplayGrid,
  GridsterComponent,
  GridsterComponentInterface,
 
} from 'angular-gridster2';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { EChartsOption, number } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ApexOptions, ChartComponent, ChartType, NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { WorkbenchService } from '../workbench.service';
import { SharedModule } from '../../../shared/sharedmodule';
import { chartOptions } from '../../../shared/data/dashboard';
import { ChartsStoreComponent } from '../charts-store/charts-store.component';
import { v4 as uuidv4 } from 'uuid';
import { debounceTime, fromEvent, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ScreenshotService } from '../../../shared/services/screenshot.service';
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';
import { style } from 'd3';
import { OVERFLOW } from 'html2canvas/dist/types/css/property-descriptors/overflow';
import { LoaderService } from '../../../shared/services/loader.service';
import { arrow } from '@popperjs/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Font, Alignment, FontFamily, Underline, Subscript, Superscript, RemoveFormat, SelectAll, Heading } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { InsightsButtonComponent } from '../insights-button/insights-button.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewTemplateDrivenService } from '../view-template-driven.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  annotations: ApexAnnotations;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  labels: string[];
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};
type DashboardItem = GridsterItem & { 
  data?: { title: string, content: string }, 
  chartOptions?: ApexOptions,
  initCallback?: (item: GridsterItem, itemComponent: GridsterItemComponent) => void 
};
interface Dimension {
  name: string;
  values: string[];
}

@Component({
  selector: 'app-sheetsdashboard',
  standalone: true,
  imports: [SharedModule,NgbModule,CommonModule,ResizableModule,GridsterModule,
    CommonModule,GridsterItemComponent,GridsterComponent,NgApexchartsModule,CdkDropListGroup, 
    CdkDropList, CdkDrag,ChartsStoreComponent,FormsModule, MatTabsModule , CKEditorModule , InsightsButtonComponent, NgxPaginationModule],
  templateUrl: './sheetsdashboard.component.html',
  styleUrl: './sheetsdashboard.component.scss'
})
export class SheetsdashboardComponent {
  @ViewChildren("test344")
  chartstest!: QueryList<ChartComponent>;
 // @HostListener('window:resize', ['$event'])
 itemsPerPage:any;
 pageNo = 1;
 page: number = 1;
 totalItems:any;
 qrySetId:any;
 databaseId:any;
 dashboardName = '';
 dashboardTagName = '';
 panelscheckbox=[] as any;
 isSheetsView : boolean = false;
 sheetsIdArray = [] as any;
 sheetIdsDataSet = [] as any;
 sheetsNewDashboard=false;
 dashboardView = false;
 chartOptionsBar:any;
 dashboardId:any;
 databaseName:any;
 gridType: string = 'fixed';
 updateDashbpardBoolen= false;
 active=1;
 isOverflowHidden = false;
 imageFile:any;
 imagename:any
 sheetsFilterNames = [] as any;
 columnFilterNames = [] as any;
 selectClmn:any;
 selectdColmnDtype:any;
 filterName = '';
 dashboardFilterId:any;
 DahboardListFilters = [] as any;
 storeSelectedColData = [] as any
 colData = [] as any;
 heightGrid : number = 800;
 widthGrid : number = 800;
 gridItemSize : number = 100;
 dataArray = [] as any;
 keysArray = [] as any;
 tablePreviewRow = [] as any;
 tablePreviewColumn =[] as any;
 filteredColumnData = [] as any;
 filteredRowData = [] as any;
 disableDashboardUpdate: boolean = false;
 sheetTabs : any[] = [];
 selectedTabIndex : number = 0;
 selectedTab : any = {};
 displayTabs : boolean = false;
 editDashboard : boolean = false;

  public chartOptions!: Partial<ChartOptions>;
  searchSheets!: string;
  constructor(private workbechService:WorkbenchService,private route:ActivatedRoute,private router:Router,private screenshotService: ScreenshotService,
    private loaderService:LoaderService,private modalService:NgbModal, private viewTemplateService:ViewTemplateDrivenService){
    this.dashboard = [];
    this.editDashboard = this.viewTemplateService.editDashboard();
    const currentUrl = this.router.url; 
    if(currentUrl.includes('workbench/sheetscomponent/sheetsdashboard')){
      this.sheetsNewDashboard = true;
      if (route.snapshot.params['id1'] && route.snapshot.params['id2'] ) {
        this.databaseId = +atob(route.snapshot.params['id1']);
        this.qrySetId = +atob(route.snapshot.params['id2'])
        }
    }else if(currentUrl.includes('workbench/landingpage/sheetsdashboard')){
      this.dashboardView = true;
      this.updateDashbpardBoolen= true
      if (route.snapshot.params['id1'] && route.snapshot.params['id2'] ) {
        this.databaseId = +atob(route.snapshot.params['id1']);
        this.qrySetId = +atob(route.snapshot.params['id2'])
        this.dashboardId = +atob(route.snapshot.params['id3'])

        }
    }
    
  }
  options!: GridsterConfig;
  nestedDashboard: Array<GridsterItem & { data?: any,   chartOptions?: ApexOptions,  chartInstance?: ApexCharts,chartData?: any[],tableData?: { headers: any[], rows: any[] }
}> = [];
  dashboard!: Array<GridsterItem & { data?: any, chartType?: any,   chartOptions?: ApexOptions,  chartInstance?: ApexCharts,chartData?: any[],tableData?: { headers: any[], rows: any[] }
  }>;
  dashboardTest: Array<GridsterItem & { data?: any, chartType?: any,   chartOptions?: ApexOptions,  chartInstance?: ApexCharts,chartData?: any[],tableData?: { headers: any[], rows: any[] }
}> = [];
  dashboardNew!: Array<GridsterItem & { data?: any,   chartOptions?: ApexOptions,  chartInstance?: ApexCharts,chartData?: any[],tableData?: { headers: any[], rows: any[] }
  }>;
  testData!: Array<GridsterItem & { data?: any, chartType?: any,  chartOptions?: ApexOptions,  chartInstance?: ApexCharts,chartData?: any[],tableData?: { headers: any[], rows: any[] }
}>;
  pushNewSheet =[] as any;
  sheetData = [] as any;
  tableHeader:any;
  tableRows:any;
  rowArray = [] as any;
  colArray = [] as any;
  selectedRows = [];
  isAllSelected: boolean = false;

  chartOptionsinitialize = false;
  //@ViewChild('gridster') gridster!: ElementRef;

  screenshotSrc: string | null = null;

  itemToPush!: GridsterItemComponent;
  @ViewChildren(GridsterItemComponent) GridsterItemComponent!: QueryList<GridsterItemComponent>;
  @ViewChild('gridster') gridster!: ElementRef; // Adjust the type as needed
  @ViewChild('nestedDropdown', { static: true }) nestedDropdown: NgbDropdown | undefined;


  static itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    console.info('itemChanged', item, itemComponent);
  }

  static itemResize(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    console.info('itemResized', item, itemComponent);
    const resize$ = fromEvent(window, 'resize');
    resize$
      .pipe(
        map((i: any) => i),
        debounceTime(500) // He waits > 0.5s between 2 events emitted before running the next.
      )
      .subscribe((event) => {
        console.log('resize is finished');
      });
     window.dispatchEvent(new Event('resize'));
    }

  static itemInit(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    console.info('itemInitialized', item, itemComponent);
  }

  static itemRemoved(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    console.info('itemRemoved', item, itemComponent);
  }

  static itemValidate(item: GridsterItem): boolean {
    return item.cols > 0 && item.rows > 0;
  }

  static gridInit(grid: GridsterComponentInterface): void {
    console.info('gridInit', grid);
  }

  static gridDestroy(grid: GridsterComponentInterface): void {
    console.info('gridDestroy', grid);
  }

  static gridSizeChanged(grid: GridsterComponentInterface): void {
    console.info('gridSizeChanged', grid);
  }

  
  ngOnInit() {  
    if(this.sheetsNewDashboard){
      this.sheetsDataWithQuerysetId();
    }
    if(this.dashboardView){
      this.getSavedDashboardData();
      // this.sheetsDataWithQuerysetId();
      this.getDashboardFilterredList();
    }
   
    //this.getSheetData();
    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.CompactLeftAndUp,
      displayGrid: DisplayGrid.Always,
      initCallback: SheetsdashboardComponent.gridInit,
      destroyCallback: SheetsdashboardComponent.gridDestroy,
      gridSizeChangedCallback: SheetsdashboardComponent.gridSizeChanged,
      itemChangeCallback: SheetsdashboardComponent.itemChange,
      itemResizeCallback: SheetsdashboardComponent.itemResize,
      itemInitCallback: SheetsdashboardComponent.itemInit,
      itemRemovedCallback: SheetsdashboardComponent.itemRemoved,
      itemValidateCallback: SheetsdashboardComponent.itemValidate,
      fixedColWidth: 100,
      fixedRowHeight: 100,
      margin : 10,
      // itemChangeCallback: SheetsdashboardComponent.itemChangesss,
      //   // itemResizeCallback: SheetsdashboardComponent.itemResize,
      

      //  itemResizeCallback: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => {
      //   // this.updateSizeOnServer(item, itemComponent);
      //   // this.updateChartDimensions(item,itemComponent as GridsterItemComponent)
      //   // this.saveItemDimensions(item);
      // },
      pushItems: true,
      draggable: {
        enabled: this.editDashboard,
        
      },
      resizable: {
        enabled: this.editDashboard,
        // stop: this.onResizeStop.bind(this)
      }
    };
    const savedItems = JSON.parse(localStorage.getItem('dashboardItems') || '[]');
//     this.dashboard = savedItems.map((item: { chartOptions: {
//       xaxis: any;
//       series: any; chart: {
//         type: ChartType; sheet: string; 
// }; 
// }; sheet_data: { x_values: any; y_values: any; }; }) => ({
//       ...item,
//       chartOptions: this.restoreChartOptions(item.chartOptions.chart.type as ChartType,item.chartOptions.xaxis.categories,item.chartOptions.series[0].data,)
//     }));
    // this.dashboard = [
    //   {cols: 2, rows: 1, y: 0, x: 0, data: { title: 'Card 1', content: 'Content of card 1' },
    //   chartOptions: {
    //     ...this.getChartOptions('pie'),
    //     chart: { type: 'pie', height: 300 } // Example of another chart type
    //   }
    // },
    //   {cols: 2, rows: 2, y: 0, x: 2,data: { title: 'Card 2', content: 'Content of card 2' },
    //   chartOptions: {
    //     ...this.getChartOptions('line'),
    //     chart: { type: 'line', height: 300 } // Example of another chart type
    //   }
    // },
    // ];
  }

  changeGridType(gridType : string){
  if(gridType.toLocaleLowerCase() == 'fixed'){
    this.gridType = 'fixed';
    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.CompactUpAndLeft,
      displayGrid: DisplayGrid.Always,
      initCallback: SheetsdashboardComponent.gridInit,
      destroyCallback: SheetsdashboardComponent.gridDestroy,
      gridSizeChangedCallback: SheetsdashboardComponent.gridSizeChanged,
      itemChangeCallback: SheetsdashboardComponent.itemChange,
      itemResizeCallback: SheetsdashboardComponent.itemResize,
      itemInitCallback: SheetsdashboardComponent.itemInit,
      itemRemovedCallback: SheetsdashboardComponent.itemRemoved,
      itemValidateCallback: SheetsdashboardComponent.itemValidate,
      fixedColWidth: 100,
      fixedRowHeight: 100,
      margin : 10,
      outerMarginBottom: 20,
      // itemChangeCallback: SheetsdashboardComponent.itemChangesss,
      //   // itemResizeCallback: SheetsdashboardComponent.itemResize,
      

      //  itemResizeCallback: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => {
      //   // this.updateSizeOnServer(item, itemComponent);
      //   // this.updateChartDimensions(item,itemComponent as GridsterItemComponent)
      //   // this.saveItemDimensions(item);
      // },
      pushItems: true,
      draggable: {
        enabled: true,
        
      },
      resizable: {
        enabled: true,
        // stop: this.onResizeStop.bind(this)
      }
    };
  } else {
    this.gridType = 'scroll'
    this.options = {
      gridType: GridType.Fixed,
      compactType: CompactType.CompactUpAndLeft,
      displayGrid: DisplayGrid.Always,
      initCallback: SheetsdashboardComponent.gridInit,
      destroyCallback: SheetsdashboardComponent.gridDestroy,
      gridSizeChangedCallback: SheetsdashboardComponent.gridSizeChanged,
      itemChangeCallback: SheetsdashboardComponent.itemChange,
      itemResizeCallback: SheetsdashboardComponent.itemResize,
      itemInitCallback: SheetsdashboardComponent.itemInit,
      itemRemovedCallback: SheetsdashboardComponent.itemRemoved,
      itemValidateCallback: SheetsdashboardComponent.itemValidate,
      fixedColWidth: 100,
      fixedRowHeight: 100,
      margin : 10,
      // itemChangeCallback: SheetsdashboardComponent.itemChangesss,
      //   // itemResizeCallback: SheetsdashboardComponent.itemResize,
      

      //  itemResizeCallback: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => {
      //   // this.updateSizeOnServer(item, itemComponent);
      //   // this.updateChartDimensions(item,itemComponent as GridsterItemComponent)
      //   // this.saveItemDimensions(item);
      // },
      pushItems: true,
      draggable: {
        enabled: true,
        
      },
      resizable: {
        enabled: true,
        // stop: this.onResizeStop.bind(this)
      }
    };
  }
}
  changeGridItemSize(){
    if(this.gridType == 'fixed'){
      this.options = {
        gridType: GridType.Fit,
        compactType: CompactType.CompactUpAndLeft,
        displayGrid: DisplayGrid.Always,
        initCallback: SheetsdashboardComponent.gridInit,
        destroyCallback: SheetsdashboardComponent.gridDestroy,
        gridSizeChangedCallback: SheetsdashboardComponent.gridSizeChanged,
        itemChangeCallback: SheetsdashboardComponent.itemChange,
        itemResizeCallback: SheetsdashboardComponent.itemResize,
        itemInitCallback: SheetsdashboardComponent.itemInit,
        itemRemovedCallback: SheetsdashboardComponent.itemRemoved,
        itemValidateCallback: SheetsdashboardComponent.itemValidate,
        fixedColWidth: this.gridItemSize,
        fixedRowHeight: this.gridItemSize,
        margin : 10,
        // itemChangeCallback: SheetsdashboardComponent.itemChangesss,
        //   // itemResizeCallback: SheetsdashboardComponent.itemResize,
        
  
        //  itemResizeCallback: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => {
        //   // this.updateSizeOnServer(item, itemComponent);
        //   // this.updateChartDimensions(item,itemComponent as GridsterItemComponent)
        //   // this.saveItemDimensions(item);
        // },
        pushItems: true,
        draggable: {
          enabled: true,
          
        },
        resizable: {
          enabled: true,
          // stop: this.onResizeStop.bind(this)
        }
      };
    } else {
      this.options = {
        gridType: GridType.Fixed,
        compactType: CompactType.CompactUpAndLeft,
        displayGrid: DisplayGrid.Always,
        initCallback: SheetsdashboardComponent.gridInit,
        destroyCallback: SheetsdashboardComponent.gridDestroy,
        gridSizeChangedCallback: SheetsdashboardComponent.gridSizeChanged,
        itemChangeCallback: SheetsdashboardComponent.itemChange,
        itemResizeCallback: SheetsdashboardComponent.itemResize,
        itemInitCallback: SheetsdashboardComponent.itemInit,
        itemRemovedCallback: SheetsdashboardComponent.itemRemoved,
        itemValidateCallback: SheetsdashboardComponent.itemValidate,
        fixedColWidth: this.gridItemSize,
        fixedRowHeight: this.gridItemSize,
        margin : 10,
        // itemChangeCallback: SheetsdashboardComponent.itemChangesss,
        //   // itemResizeCallback: SheetsdashboardComponent.itemResize,
        
  
        //  itemResizeCallback: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => {
        //   // this.updateSizeOnServer(item, itemComponent);
        //   // this.updateChartDimensions(item,itemComponent as GridsterItemComponent)
        //   // this.saveItemDimensions(item);
        // },
        pushItems: true,
        draggable: {
          enabled: true,
          
        },
        resizable: {
          enabled: true,
          // stop: this.onResizeStop.bind(this)
        }
      };
    }

    // window.dispatchEvent(new Event('resize'));
  }
  restoreChartOptions(chartType: ChartType,xval:any,yval:any){
    return {
      chart: {
        type: chartType,
        height:300
      },
      series: [{
        name: 'Series 1',
        data: yval
      }],
      xaxis: {
        categories: xval
      }
    };
  }

  fetchSheetsDataBasedOnSheetIds(obj:any){
    this.workbechService.sheetRetrivelBasedOnIds(obj).subscribe({
      next:(data)=>{
        console.log('savedDashboard',data);
      let sheetArray = data.map((sheet:any)=>sheet.sheets[0]);
      this.dashboardNew = sheetArray.map((sheet:any) => ({
        id:uuidv4(),
        cols: 1,
        rows: 1,
        y: 10,
        x: 10,
        sheetType:sheet.sheet_type,
        sheetId:sheet.sheet_id,
        chartType:sheet.chart,
        chartId:sheet.chart_id,
        data: { title: sheet.sheet_name, content: 'Content of card New' },
        selectedSheet : sheet.selectedSheet,
        chartOptions: sheet.sheet_type === 'Chart' ? {
          // ...this.getChartOptions(sheet.chart,sheet?.sheet_data.x_values,sheet?.sheet_data.y_values),
          ... this.getChartOptionsBasedOnType(sheet) as unknown as ApexOptions,
          // chart: { type: sheet.chart, height: 300 },
          //chartData:this.getChartData(sheet.sheet_data.results, sheet.chart)
        } : undefined,
        tableData: sheet.sheet_type === 'Table' ? {
         ... this.getTableData(sheet.sheet_data)
  
        }
         : undefined
      }));
      this.setSelectedSheetData();
       this.isSheetsView = false;
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }
  getSavedDashboardData(){
    const obj ={
      queryset_id:this.qrySetId,
      server_id:this.databaseId,
      dashboard_id:this.dashboardId
    }
    this.workbechService.getSavedDashboardData(obj).subscribe({
      next:(data)=>{
        console.log('savedDashboard',data);
        this.dashboardName=data.dashboard_name;
        this.heightGrid = data.height;
        this.widthGrid = data.width;
        this.gridType = data.grid_type;
        this.changeGridType(this.gridType);
        this.dashboard = data.dashboard_data;
        this.sheetIdsDataSet = data.selected_sheet_ids;
        if(!data.dashboard_tag_name){
          const inputElement = document.getElementById('htmlContent') as HTMLInputElement;
          inputElement.innerHTML = data.dashboard_name;
          this.dashboardTagName = data.dashboard_name;
        }
        else{
          const inputElement = document.getElementById('htmlContent') as HTMLInputElement;
          inputElement.innerHTML = data.dashboard_tag_name;
          inputElement.style.paddingTop = '1.5%';
          this.dashboardTagName = data.dashboard_tag_name;
        }
        console.log(this.dashboard);
        let obj = {sheet_ids: this.sheetIdsDataSet};
        this.fetchSheetsDataBasedOnSheetIds(obj);
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }

  setSelectedSheetData() {
    this.dashboardNew = this.dashboardNew.map(target => {
      const source = this.dashboard.find(source => source['sheetId'] === target['sheetId']);
      if (source) {
        return { ...target, selectedSheet: source['selectedSheet'] };
      }
      return target;
    });
  }

  saveDashboard(){
    this.takeScreenshot();
    // localStorage.setItem('dashboardItems', JSON.stringify(this.dashboard));
    this.sheetsIdArray = this.dashboard.map(item => item['sheetId']);
    if(this.dashboardName===''){
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: 'Please add Name to Dashboard',
        width: '400px',
      })
    }else{
    const obj ={
      grid : this.gridType,
      height: this.heightGrid,
      width: this.widthGrid,
      queryset_id:[this.qrySetId],
      server_id:[this.databaseId],
       sheet_ids:this.sheetsIdArray,
selected_sheet_ids :this.sheetIdsDataSet,
      dashboard_name:this.dashboardName,
      dashboard_tag_name:this.dashboardTagName,
      data:this.dashboard
    }
    this.workbechService.saveDashboard(obj).subscribe({
      next:(data)=>{
        console.log(data);
        this.dashboardId=data.dashboard_id
        Swal.fire({
          icon: 'success',
          title: 'Congartualtions!',
          text: 'Dashboard Saved Successfully',
          width: '400px',
        })
      },
      error:(error)=>{
        console.log(error)
        Swal.fire({
          icon: 'error',
          title: 'oops!',
          text: error.error.message,
          width: '400px',
        })
      }
    })
  }
  }
  takeScreenshot() {
   this.startMethod();
   this.loaderService.show();
   setTimeout(() => {
  const element = document.getElementById('capture-element');
  if (element) {
    // Select all gridster-items
    // Hide scrollbars
    htmlToImage.toPng(element)
      .then((dataUrl) => {
        this.screenshotSrc = dataUrl;
        console.log('scrnsht',this.screenshotSrc);
        // Convert base64 to Blob
        const imageBlob = this.workbechService.base64ToBlob(dataUrl);
        const imageBlob1 = this.workbechService.blobToFile(imageBlob)
        // let fileObj:any;
        // fileObj = this.workbechService.convertBase64ToFileObject(this.screenshotSrc);
        // fileObj = this.workbechService.blobToFile(fileObj);

         this.imageFile = imageBlob
         this.imagename = imageBlob1
         console.log('fileblob',this.imageFile);
         this.loaderService.hide();
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
      })
      .finally(() => {
        this.saveDashboardimage();
      });
      //console.log('converted-image',this.screenshotSrc)
     
  }}, 1000);
  }

  startMethod() {
    this.isOverflowHidden = true;
  }

  endMethod() {
    this.isOverflowHidden = false;
  }
  saveDashboardimage(){
    var formData:any = new FormData();
    formData.append("dashboard_id",this.dashboardId);
    formData.append("imagepath",this.imageFile,this.imagename.name);

    this.workbechService.saveDAshboardimage(formData).subscribe({
      next:(data)=>{
        console.log(data);
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Congartualtions!',
        //   text: 'Dashboard Updated Successfully',
        //   width: '400px',
        // })
        this.endMethod(); 
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }
  updateDashboard(){
    this.takeScreenshot();
      this.sheetsIdArray = this.dashboard.map(item => item['sheetId']);
    if(this.dashboardName===''){
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: 'Please add Name to Dashboard',
        width: '400px',
      })
    }else{
    const obj ={
      grid : this.gridType,
      height: this.heightGrid,
      width: this.widthGrid,
      queryset_id:[this.qrySetId],
      server_id:[this.databaseId],
      sheet_ids:this.sheetsIdArray,
      dashboard_name:this.dashboardName,
      dashboard_tag_name:this.dashboardTagName,
      selected_sheet_ids:this.sheetIdsDataSet,
      data:this.dashboard,
      sheetTabs : this.sheetTabs
      
    }
    this.workbechService.updateDashboard(obj,this.dashboardId).subscribe({
      next:(data)=>{
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Congartualtions!',
          text: 'Dashboard Updated Successfully',
          width: '400px',
        })
        this.endMethod(); 
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }
  }

  sheetsDataWithQuerysetId(){
    const obj ={
      sheetIds:this.sheetIdsDataSet,
    }
    this.workbechService.sheetsDataWithQuerysetId(obj)
    .subscribe({next: (data) => {
       console.log('sheetData',data)
       this.sheetData = data.sheets,
       this.databaseName= data.database_name
    this.dashboardNew = this.sheetData.map((sheet:any) => ({
      id:uuidv4(),
      cols: 1,
      rows: 1,
      y: 10,
      x: 10,
      sheetType:sheet.sheet_type,
      sheetId:sheet.sheet_id,
      chartType:sheet.chart,
      chartId:sheet.chart_id,
      data: { title: sheet.sheet_name, content: 'Content of card  New', sheetTagName: sheet.sheet_tag_name?sheet.sheet_tag_name:sheet.sheet_name },
      selectedSheet : sheet.selectedSheet,
      chartOptions: sheet.sheet_type === 'Chart' ? {
        // ...this.getChartOptions(sheet.chart,sheet?.sheet_data.x_values,sheet?.sheet_data.y_values),
        ... this.getChartOptionsBasedOnType(sheet) as unknown as ApexOptions,
        // chart: { type: sheet.chart, height: 300 },
        //chartData:this.getChartData(sheet.sheet_data.results, sheet.chart)
      } : undefined,
      tableData: sheet.sheet_type === 'Table' ? {
       ... this.getTableData(sheet.sheet_data)

      }
       : undefined
    }));
      if (this.dashboardView) {
        this.getSavedDashboardData();
      }
    let mapper = [0];
        this.testData = mapper.map((sheet:any) => ({
      id:uuidv4(),
      cols: 1,
      rows: 1,
      y: 10,
      x: 10,
      sheetType:111,
      sheetId:111,
      chartType:'Tags',
      chartId:111,
      data: { title: 'Tags', content: 'Content of card New' },
    }));
    console.log('testData',this.testData)
      },
    error:(error)=>{
    console.log(error);
   }
   })
  }
  // getSheetData(){
  //   this.workbechService.getSheetData()
  //   .subscribe({next: (data) => {
  //      console.log('sheetData',data)
  //      this.sheetData = data
  //   this.dashboardNew = this.sheetData.map((sheet:any) => ({
  //     id:uuidv4(),
  //     cols: 2,
  //     rows: 1,
  //     y: 0,
  //     x: 0,
  //     sheetType:sheet.sheet_type,
  //     data: { title: sheet.sheet_name, content: 'Content of card New' },
  //     chartOptions: sheet.sheet_type === 'Chart' ? {
  //       // ...this.getChartOptions(sheet.chart,sheet?.sheet_data.x_values,sheet?.sheet_data.y_values),
  //       ... this.getChartOptionsBasedOnType(sheet),
  //       chart: { type: sheet.chart, height: 300 },
  //       //chartData:this.getChartData(sheet.sheet_data.results, sheet.chart)
  //     } : undefined,
  //     tableData: sheet.sheet_type === 'Table' ? {
  //      ... this.getTableData(sheet.sheet_data)

  //     }
  //      : undefined
  //   }));
  //   console.log('dashboardNew',this.dashboardNew)
  //     },
  //   error:(error)=>{
  //   console.log(error);
  //  }
  //  })
  // }
  flattenDimensions(dimensions: Dimension[]): string[] {
    const numCategories = Math.max(...dimensions.map(dim => dim.values.length));
    return Array.from({ length: numCategories }, (_, index) => {
      return dimensions.map(dim => dim.values[index] || '').join(',');
    });
  }
  getChartOptionsBasedOnType(sheet:any){
    if(sheet.chart_id === 6){
      let xaxis = sheet.sheet_data?.results?.barXaxis;
      let yaxis = sheet.sheet_data?.results?.barYaxis;

      return this.barChartOptions(xaxis,yaxis) 
    }
    if(sheet.chart_id === 17){
      let xaxis = sheet.sheet_data?.results?.areaXaxis;
      let yaxis = sheet.sheet_data?.results?.areaYaxis;
      return this.areaChartOptions(xaxis,yaxis)
    }
    if(sheet.chart_id === 13){
      let xaxis = sheet.sheet_data?.results?.lineXaxis;
      let yaxis = sheet.sheet_data?.results?.lineYaxis;
      return this.lineChartOptions(xaxis,yaxis)
    }
    if(sheet.chart_id === 24){
      let xaxis = sheet.sheet_data?.results?.pieXaxis;
      let yaxis = sheet.sheet_data?.results?.pieYaxis;
      return this.pieChartOptions(xaxis,yaxis)
    }
    //sidebyside
    if(sheet.chart_id === 7){
      let xaxis = sheet.sheet_data?.results?.sidebysideBarXaxis;
      let yaxis = sheet.sheet_data?.results?.sidebysideBarYaxis;

      const dimensions: Dimension[] =xaxis
      const categories = this.flattenDimensions(dimensions)
      return this.sidebySideBarChartOptions(categories,yaxis)

    }
    if(sheet.chart_id === 5){
      let xaxis = sheet.sheet_data?.results?.stokedBarXaxis;
      let yaxis = sheet.sheet_data?.results?.stokedBarYaxis;

      const dimensions: Dimension[] = xaxis;
      const categories = this.flattenDimensions(dimensions);

      return this.stockedBarChartOptions(categories,yaxis)
    }
    if(sheet.chart_id === 4){
      let xaxis = sheet.sheet_data?.results?.barLineXaxis;
      let yaxis = sheet.sheet_data?.results?.barLineYaxis;
      console.log('barlinexaxis',xaxis)
      const dimensions: Dimension[] = xaxis;
      const categories = this.flattenDimensions(dimensions);
      console.log('barlinecategories',categories)

      return this.barLineChartOptions(categories,yaxis)
    }
    if(sheet.chart_id === 2){
      let xaxis = sheet.sheet_data?.results?.hStockedXaxis;
      let yaxis = sheet.sheet_data?.results?.hStockedYaxis;

      const dimensions: Dimension[] = xaxis;
      const categories = this.flattenDimensions(dimensions);
      return this.hStockedBarChartOptions(categories,yaxis);
    }
    if(sheet.chart_id === 3){
      let xaxis = sheet.sheet_data?.results?.hgroupedXaxis;
      let yaxis = sheet.sheet_data?.results?.hgroupedYaxis;

      const dimensions: Dimension[] = xaxis;
      const categories = this.flattenDimensions(dimensions);

      return this.hGroupedChartOptions(categories,yaxis)
    }
    if(sheet.chart_id === 8){
      let xaxis = sheet.sheet_data?.results?.multiLineXaxis;
      let yaxis = sheet.sheet_data?.results?.multiLineYaxis;

      const dimensions: Dimension[] = xaxis;
      const categories = this.flattenDimensions(dimensions);

      return this.multiLineChartOptions(categories,yaxis)
    }
    if(sheet.chart_id === 10){
      let xaxis = sheet.sheet_data?.results?.donutXaxis;
      let yaxis = sheet.sheet_data?.results?.donutYaxis;
      return this.donutChartOptions(xaxis,yaxis)
    }
    
  }

  getChartData(results: any, chartType: string): any[] | undefined{
    switch (chartType) {
      case 'bar':
         return results.bar.map((item: any) => ({ name: item.col, value: item.row }));
         //return results.bar.forEach((item: { col: any; row: any; }) => chartOptions.series[0].data.push(item.col));
      case 'line':
        return [{xAis:results.lineXaxis,yAxis:results.lineYaxis}]
      case 'area':
        return results.areaXaxis+results.areaYaxis
      default:
        return undefined;        
    }
  }
getTableData(tableData: any): { headers: any[], rows: any[] } {
    // Example implementation for table data extraction
    return {
      headers: tableData.results.tableColumns,
      rows: tableData.results.tableData
    };
  }

  onDrag(event: any, item: any){
    let data = JSON.stringify(item);
        event.dataTransfer.setData('item', data);
  }

  
  dropToAddIntoNestedGridster(event: { preventDefault: () => void; stopPropagation: () => void; }, parent: any): void {
    event.preventDefault();
    event.stopPropagation();
    // this.setupDesignerItemToAdd(event, parent);
}

allowDrop(ev : any): void {
  ev.preventDefault();
}
  drop(event: any) {
    if(this.colArray.length >0 && this.rowArray.length>0){
      this.colArray = [];
      this.rowArray = [];
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('Transfering item to new container')
      console.log('Transferring item to new container');
      
      let item: any = event.previousContainer.data[event.previousIndex];
      console.log('Original item:', JSON.stringify(item));
      
      // Creating a deep copy of the item
      let copy: any = JSON.parse(JSON.stringify(item));
      console.log('Copy of item:', JSON.stringify(copy));
      
      // Initialize an empty object to hold the copied attributes
      let element: DashboardItem = {
        id:copy.id,
        x:10,
        y: 20,
        rows: 1,
        cols:1,
        data: copy.data,
        sheetType:copy.sheetType,
        sheetId:copy.sheetId,
        chartType:copy.chartType,
        databaseId : copy.databaseId,
        qrySetId : copy.qrySetId,
        chartId:copy.chartId,
        chartOptions: copy.chartOptions,
        chartInstance: copy.chartInstance,
        tableData:copy.tableData,
        selectedSheet : true,
        chartData:copy.chartOptions?.chartData || [],
      };
    //   if(element.chartOptions?.chart?.type === 'bar'){
    //      element['chartData'].forEach((item: { name: any; value: any; }) => {
    //       this.colArray.push(item.name);
    //       this.rowArray.push(item.value);        
    //       // this.getChartOptions(element.chartOptions?.chart?.type || 'bar',this.colArray,this.rowArray);

    //     });      
    //   }
    //   if(element.chartOptions?.chart?.type === 'line'){
    //     this.colArray = element['chartData'][0].xAis
    //     this.rowArray = element['chartData'][0].yAxis
    //     console.log('linedata',this.colArray,this.rowArray)
    //     // this.getChartOptions(element.chartOptions?.chart?.type || 'bar',this.colArray,this.rowArray);

    //  }
    //  console.log(this.rowArray);
     //this.getChartOptions(element.chartOptions?.chart?.type || 'bar');
    //  if(event.event.target.offsetParent.id == 'cdk-drop-list-0'){
      const index = this.findSheetIndex(copy.sheetId);
      if (index == -1) {
        this.disableDashboardUpdate = false;
        this.setDashboardNewSheets(copy.sheetId, true);
        this.dashboard.push(element);
      }
    //  } else {
    //   this.nestedDashboard.push(element);
    //  }
     
    //  this.initializeChartData(element);  // Initialize chart after adding
     console.log('draggedDashboard',this.dashboard)
    }
   
  }

  setDashboardNewSheets(sheetId: number, selectedSheet: boolean) {
    this.dashboardNew = this.dashboardNew.map(sheet => {
      if (sheet['sheetId'] === sheetId) {
        return { ...sheet, selectedSheet: selectedSheet };
      }
      return sheet;
    });
  }

  dropNested(event: CdkDragDrop<DashboardItem[]>,nestedItem : DashboardItem){
    if(this.colArray.length >0 && this.rowArray.length>0){
      this.colArray = [];
      this.rowArray = [];
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('Transfering item to new container')
      console.log('Transferring item to new container');
      
      let item: any = event.previousContainer.data[event.previousIndex];
      console.log('Original item:', JSON.stringify(item));
      
      // Creating a deep copy of the item
      let copy: any = JSON.parse(JSON.stringify(item));
      console.log('Copy of item:', JSON.stringify(copy));
      
      // Initialize an empty object to hold the copied attributes
      let element: DashboardItem = {
        id:copy.id,
        x: copy.x,
        y: copy.y,
        rows: copy.rows,
        cols: copy.cols,
        data: copy.data,
        sheetType:copy.sheetType,
        sheetId:copy.sheetId,
        chartType:copy.chartType,
        chartId:copy.chartId,
        databaseId : copy.databaseId,
    qrySetId : copy.qrySetId,
        chartOptions: copy.chartOptions,
        chartInstance: copy.chartInstance,
        tableData:copy.tableData,
        chartData:copy.chartOptions?.chartData || [],
      };

     this.nestedDashboard.push(element);
    //  this.initializeChartData(element);  // Initialize chart after adding
     console.log('draggedDashboard',this.dashboard)
  }
}


  viewSheet(sheetdata:any){
    let sheetId = sheetdata.sheetId;
    this.databaseId = sheetdata.databaseId;
    this.qrySetId = sheetdata.qrySetId;
    const encodedServerId = btoa(this.databaseId.toString());
    const encodedQuerySetId = btoa(this.qrySetId.toString());
    const encodedSheetId = btoa(sheetId.toString());
    const encodedDashboardId = btoa(this.dashboardId.toString());

    this.router.navigate(['/workbench/sheetsdashboard/sheets/'+encodedServerId+'/'+encodedQuerySetId+'/'+encodedSheetId+'/'+encodedDashboardId])
  }
  
  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged && this.options.api.resize) {
      this.options.api.optionsChanged();
      this.options.api.resize(); 
    }
  }

  removeItem($event:any, item:any, tabSheet : boolean) {
    // $event.preventDefault();
    // $event.stopPropagation();
    if(tabSheet){
      this.dashboardTest.splice(this.dashboardTest.indexOf(item), 1);
      this.sheetTabs[this.selectedTabIndex].dashboard = this.dashboardTest;
    } else {
      this.dashboard.splice(this.dashboard.indexOf(item), 1);
    }
    this.setDashboardNewSheets(item.sheetId, false);
  }
  removeNestedItem($event:any, item:any) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.nestedDashboard.indexOf(item), 1);
  }

  resetDashboard() {
    this.dashboard = [];
    this.disableDashboardUpdate = true;
    this.dashboardNew.forEach(sheet => {
      sheet['selectedSheet'] = false;
    })
  }

  clearDashboard(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      width: '300px',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Clear it!'
    }).then((result)=>{
      if(result.isConfirmed){
       this.resetDashboard();
      }})
  }
 
  // addItem() {
  //   this.dashboard.push({x: 0, y: 0, cols: 1, rows: 1,data: { title: 'New Card', content: 'New card content' }, 
  //   chartOptions: this.getChartOptions('bar')});
  // }

  initItem(item: GridsterItem, itemComponent: GridsterItemComponent) {
    this.itemToPush = itemComponent;
  }

  // pushItem() {
  //   const itemToPush = this.dashboard[0]; // Assuming you want to push the first item
  //   const itemComponent = this.getItemComponent(itemToPush); // Retrieve the GridsterItemComponent

  //   if (!itemComponent) return;
  //   const push = new GridsterPush(this.itemToPush); // init the service
  //   this.itemToPush.$item.rows += 4; // move/resize your item
  //   if (push.pushItems(push.fromNorth)) { // push items from a direction
  //     push.checkPushBack(); // check for items can restore to original position
  //     push.setPushedItems(); // save the items pushed
  //     this.itemToPush.setSize();
  //     this.itemToPush.checkItemChanges(this.itemToPush.$item, this.itemToPush.item);
  //     this.updateChartDimensions(itemToPush);
  //     this.updateCardData(itemToPush);
  //     this.updateChartData(itemToPush);
  //   } else {
  //     this.itemToPush.$item.rows -= 4;
  //     push.restoreItems(); // restore to initial state the pushed items
  //   }
  //   push.destroy(); // destroy push instance
  //   // similar for GridsterPushResize and GridsterSwap
  // }

  pushItem() {
    const itemToPush = this.dashboard[0];
    const gridsterItemComponent = this.getItemComponent(itemToPush);

    if (!gridsterItemComponent) return;

    const push = new GridsterPush(gridsterItemComponent);
    gridsterItemComponent.$item.rows += 4;
    if (push.pushItems(push.fromNorth)) {
      push.checkPushBack();
      push.setPushedItems();
      gridsterItemComponent.setSize();
      gridsterItemComponent.checkItemChanges(gridsterItemComponent.$item, gridsterItemComponent.item);
      //this.updateChartDimensions(itemToPush);
    } else {
      gridsterItemComponent.$item.rows -= 4;
      push.restoreItems();
    }
    push.destroy();
  }

  // updateChartDimensions(item: GridsterItem) {
  //   const gridsterItemComponent = this.getItemComponent(item);
  //   if (gridsterItemComponent && item['chartInstance']) {
  //     item['chartOptions'].chart = {
  //       ...item['chartOptions'].chart,
  //       width: gridsterItemComponent.el.clientWidth,
  //       height: gridsterItemComponent.el.clientHeight
  //     };
  //     item['chartInstance'].updateOptions(item['chartOptions']);
  //   }
  // }
  updateCardData(item: DashboardItem) {
    // Example of updating card content based on item properties
    if (item.data) {
      item.data.title = `Card ${item.x + 1}`;
      item.data.content = `Content of card ${item.x + 1}`;
    }
  }
  updateChartData(item: DashboardItem) {
    // Example of updating chart data based on item properties
    if (item.chartOptions) {
      item.chartOptions.series = [{
        name: 'Series 1',
        data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100]
      }];
      if (item['chartInstance']) {
        item['chartInstance'].updateOptions(item.chartOptions);
      }
    }
  }
  saveItemDimensions(item: GridsterItem) {
    // Assuming you have a backend service to save dimensions
    // this.workbenchService.saveItemDimensions(item)
    //   .subscribe({
    //     next: (response) => console.log('Item dimensions saved', response),
    //     error: (error) => console.error('Error saving item dimensions', error)
    //   });
  
    // For local storage:
    const savedItems = JSON.parse(localStorage.getItem('dashboardItems') || '[]');
    const index = savedItems.findIndex((i: any) => i.id === item['id']);
    if (index > -1) {
      this.dashboard[index] = item;
    } else {
      this.dashboard.push(item);
    }
    localStorage.setItem('dashboardItems', JSON.stringify(this.dashboard));
  }  // onResizeStop(item: GridsterItem, itemComponent: GridsterItemComponent) {
  //   // Handle resize stop event here
  //   //this.updateChartDimensions(item);
  // }
  onResizeStop(item: DashboardItem, gridSterItem : GridsterItemComponentInterface ,event:any): void {
    const itemComponent  = event.itemComponent as GridsterItemComponent;
    if(gridSterItem){
    this.updateChartDimensions(item, itemComponent,gridSterItem);
    }else{
      console.error('item not available')
    }
  }
  updateSizeOnServer(item:any, itemComponent:any){

  }
  updateChartDimensions(item: DashboardItem, itemComponent: GridsterItemComponent , gridSterItem: GridsterItemComponentInterface): void {
    const chartElement = document.getElementById('test344') as any;
    // if (chartElement) {
    //   chartElement.chartObj.updateOptions({
    //     chart: {
    //       height: gridSterItem.el.clientHeight
    //     }
    //   });
    // }
    item.chartOptions!.chart = {
      // ...item.chartOptions!.chart,
      // width: itemComponent.width,
      height: gridSterItem.el.clientHeight,
      type:item.chartOptions?.chart?.type || 'bar'
    };
    if (item['chartOptions'] && itemComponent) {
      item.chartOptions!.chart = {
        ...item.chartOptions!.chart,
        width: itemComponent.width,
        height: gridSterItem.el.clientHeight,
        type:item.chartOptions?.chart?.type || 'bar'
      };
      item['chartInstance'].updateOptions(item.chartOptions, true);
    }
    // this.chartstest.forEach((chart, index) => {
    //   if (index === 0) {
    //     chart.updateOptions(item.chartOptions);
    //   } else if (index === 1) {
    //     chart.updateOptions(item.chartOptions);
    //   }
    // });
  }
  getItemComponent(item: DashboardItem): GridsterItemComponent | undefined {
    return this.GridsterItemComponent.find(cmp => cmp.item === item);
  }
  getChartOptions(chartType: ChartType,xval:any,yval:any ): ApexOptions {
    this.chartOptionsinitialize = true
    return {
      chart: {
        type: chartType,
        height:300
      },
      series: [{
        name: 'Series 1',
        data: yval
      }],
      xaxis: {
        categories: xval
      }
    };
  }
  ngAfterViewInit() {
    this.dashboard.forEach(item => {
      this.initializeChart(item);
    });
    if (this.gridster) {
      console.log('HEllo element initialized:', this.gridster);
    } else {
      console.error('Gridster element not found!');
    }
  }
  initializeChart(item: DashboardItem): void {
    const chartElement = document.querySelector("#chart"); // Adjust selector if necessary

    if (item['chartInstance']) {
        item['chartInstance'].destroy(); // Destroy the existing chart instance
        item['chartInstance'] = null;
    }
    if (item.chartOptions && item.chartOptions.chart && item.chartOptions.series) {
      const options: ApexOptions = {
        ...item.chartOptions,
        chart: {
          ...item.chartOptions.chart,
          type: item.chartOptions.chart.type || 'bar',
          height: 500
        },
        series: item.chartOptions.series,
        xaxis: {
          ...item.chartOptions.xaxis,
          categories: item.chartOptions.xaxis?.categories
        }
      };
      console.log('Chart options before updating/rendering:', options);

    //       item['chartInstance'] = new ApexCharts(document.querySelector("#chart"), options);
    // item['chartInstance'].render();


    // var chartOrigin = document.querySelector("#chart");
    // if(chartOrigin){
    //   var chart = new ApexCharts(document.querySelector("#chart"),options);
    //   // chartOrigin.updateOptions(options);
    //   chart.render();
    // }


    if (item['chartInstance']) {
      // Update the existing chart instance with new options
      item['chartInstance'].updateOptions(options, true);
  } else {
      // Create a new chart instance if it doesn't exist
      const chartOrigin = document.querySelector("#chart");
      if (chartOrigin) {
          item['chartInstance'] = new ApexCharts(chartOrigin, options);
          item['chartInstance'].render();
      }
  }

    // if(this.chartstest){
    //   this.chartstest['_results'][0].updateOptions(options);
    //   // this.chartstest['_results'][0].render();
    //   // this.chartstest./
    // }
    // item['chartInstance'] = new ApexCharts(document.querySelector("#chart-" + item['id']), item.chartOptions);
    // item['chartInstance'].render();
  }  
}

  onChartInit(event: any, item: DashboardItem) {
    item['chartInstance'] = event.chart;
  }

/////chartOptions
barChartOptions(xaxis:any,yaxis:any){
   return {
    series: [
      {
        name: '',
        data: yaxis,
      },
    ],
    chart: {
      toolbar: {
        show: false
      },
      height: 500,
      type: 'bar',
      foreColor: '#9aa0ac',
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
        colors: ['#9aa0ac'],
      },
    },
    fill: {
      type: 'gradient',
    },
    xaxis: {
      categories: xaxis,
      position: 'bottom',
      labels: {
        rotate:0,
        // offsetY: 0,
        trim: true,
        // minHeight: 40,
        hideOverlappingLabels: false,
        style: {
          colors: '#9aa0ac',
          
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
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
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
        color: '#9aa0ac',
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
areaChartOptions(xaxis:any,yaxis:any){
  return {
    series: [
      {
        name: "",
        data: yaxis,
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
        color: "#8c9097",
      },
    },
    grid: {
      borderColor: "rgba(119, 119, 142, 0.05)",
    },
    labels: xaxis,
    title: {
      text: "",
      align: "left",
      style: {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#8c9097",
      },
    },
    colors: ["#00a5a2"],
    xaxis: {
      type: "",
      labels: {
        show: true,
        style: {
          colors: "#8c9097",
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
          colors: "#8c9097",
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
lineChartOptions(xaxis:any,yaxis:any){
 return {
    series: [{
        name: "",
        data: yaxis
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
        colors: ['#00a5a2'],
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
                color: '#8c9097'
            },
        },
        xaxis: {
            categories: xaxis,
            labels: {
                show: true,
                style: {
                    colors: "#8c9097",
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
                    colors: "#8c9097",
                    fontSize: '11px',
                    fontWeight: 600,
                    cssClass: 'apexcharts-yaxis-label',
                },
            }
        }
    
}
}
pieChartOptions(xaxis:any,yaxis:any){
  return {
    series: yaxis,
    chart: {
        height: 300,
        type: 'pie',
    },
    colors: ["#00a5a2", "#31d1ce", "#f5b849", "#49b6f5", "#e6533c"],
    labels: xaxis,
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
sidebySideBarChartOptions(xaxis:any,yaxis:any){
  return{
    series: yaxis,
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
      categories:xaxis,
      
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
stockedBarChartOptions(xaxis:any,yaxis:any){
  return {
    series: yaxis,
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
      categories: xaxis,
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
barLineChartOptions(xaxis:any,yaxis:any){
    return {
      series: [
        {
          name: yaxis[0]?.name,
          type: "column",
          data: yaxis[0]?.data
        },
        {
          name: yaxis[1]?.name,
          type: "line",
          data: yaxis[1]?.data,
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
      labels: xaxis,
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
hStockedBarChartOptions(xaxis:any,yaxis:any){
    return {
    series: yaxis,
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
      categories: xaxis,
    },
    legend: {
      position: "right",
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  }
}

hGroupedChartOptions(xaxis:any,yaxis:any){
  return{
    series: yaxis,
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
      categories: xaxis
    }
  };
}
multiLineChartOptions(xaxis:any,yaxis:any){
  return {
    series: yaxis,
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
      categories: xaxis
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
donutChartOptions(xaxis:any,yaxis:any){
  return {
    series: yaxis,
    chart: {
      type: "donut"
    },
    labels: xaxis,
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


//filters
openSuperScaled(modal: any) {
  this.modalService.open(modal, {
    centered: true,
    windowClass: 'animate__animated animate__zoomIn',
  });

}

getColumnsForFilter(){
  const obj ={
    dashboard_id:this.dashboardId
  }
  this.workbechService.getColumnsInDashboardFilter(obj).subscribe({
    next:(data)=>{
      console.log(data);
      this.columnFilterNames=data.response_data?.columns;
      this.sheetsFilterNames= data.sheets?.map((name: any) => ({ label: name, selected: false }))

    },
    error:(error)=>{
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
  })
}

ResetDashboard(){
  this.dashboard =[];
}
updateSelectedRows(){
  this.selectedRows = this.sheetsFilterNames
  .filter((row: { selected: any; }) => row.selected)
  .map((row: { label: any; }) => row.label.id);
console.log('selected rows', this.selectedRows);

this.isAllSelected = this.sheetsFilterNames.every((row: { selected: any; }) => row.selected);
}

toggleAllRows(event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked;
  this.sheetsFilterNames.forEach((row: { selected: boolean; }) => row.selected = isChecked);
  this.updateSelectedRows();
}
isAnyRowSelected(): boolean {
  return this.sheetsFilterNames.some((row: { selected: any; }) => row.selected);
}

closeColumnsDropdown(colName:any,colDatatype:any, dropdown: NgbDropdown) {
  dropdown.close();
  this.selectClmn=colName,
  this.selectdColmnDtype=colDatatype

}
closeMainDropdown(dropdown: NgbDropdown,colData :any,id: any){
  localStorage.setItem(id, JSON.stringify(colData));
  dropdown.close();
}

getSelectedData(){

if(this.filterName === ''){
  Swal.fire({
    icon: 'error',
    title: 'oops!',
    text: 'Please add name to Filter',
    width: '400px',
})
}else{
  const Obj ={
    dashboard_id:this.dashboardId,
    filter_name:this.filterName,
    column:this.selectClmn,
    sheets:this.selectedRows,
    datatype:this.selectdColmnDtype
  }
  this.workbechService.selectedDatafromFilter(Obj).subscribe({
    next:(data)=>{
      console.log(data);
      this.dashboardFilterId = data.dashboard_filter_id
      this.getDashboardFilterredList()
    },
    error:(error)=>{
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
  })
}
}

getDashboardFilterredList(){
  const Obj ={
    dashboard_id:this.dashboardId
  }
  this.workbechService.getDashboardFilterredList(Obj).subscribe({
    next:(data)=>{
      console.log(data);
      this.DahboardListFilters = data
    },
    error:(error)=>{
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
  })
}
getColDataFromFilterId(id:string,colData:any){
  if(localStorage.getItem('filterid')){
    colData['colData']= JSON.parse(localStorage.getItem('filterid')!);
  } else {
  const Obj ={
    id:id
  }
  this.workbechService.getColDataFromFilterId(Obj).subscribe({
    next:(data)=>{
      console.log(data);
      // this.colData= data.col_data?.map((name: any) => ({ label: name, selected: false }))
      colData['colData']= data.col_data.map((item: any) => ({ label: item, selected: false }))
      localStorage.setItem(id, JSON.stringify(colData['colData']));
      console.log('coldata',this.colData)
    },
    error:(error)=>{
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
  })
}
}
updateSelectedColmns(filterList:any,col: any){
  if(!this.storeSelectedColData["test"]){
    this.storeSelectedColData["test"]={};
  } 
  if(!this.storeSelectedColData["test"][filterList.dashboard_filter_id]){
    this.storeSelectedColData["test"][filterList.dashboard_filter_id]=[];
  }
  let array = this.storeSelectedColData["test"][filterList.dashboard_filter_id];
  if(col.selected){
    array.push(col.label);
  } else {
    let indexVar = array.indexOf(col.label);
    array.splice(indexVar,1);
  }

this.storeSelectedColData["test"][filterList.dashboard_filter_id] =array ;
console.log('selected Data', this.storeSelectedColData);
this.isAllSelected = filterList.colData.every((row: { selected: any; }) => row.selected);
}
  toggleAllColumns(event: Event, filterList: any) {
    let array: any[] = [];
    const isChecked = (event.target as HTMLInputElement).checked;
    filterList.colData.forEach((row: { selected: boolean; }) => row.selected = isChecked);
    // this.updateSelectedColmns(filterList,filterList.colData);
    if (isChecked) {
      if (!this.storeSelectedColData["test"]) {
        this.storeSelectedColData["test"] = {};
      }
      if (!this.storeSelectedColData["test"][filterList.dashboard_filter_id]) {
        this.storeSelectedColData["test"][filterList.dashboard_filter_id] = [];
      }
      array = [];
      filterList.colData.forEach((col: any) => {
        if (col.selected) {
          array.push(col.label);
        }
      });
    } else {
      array = [];
    }

    this.storeSelectedColData["test"][filterList.dashboard_filter_id] = array;
    console.log('selected Data', this.storeSelectedColData);
  }
extractKeysAndData(): void {
  if (this.storeSelectedColData && this.storeSelectedColData.test) {
    this.extractKeysAndData1(this.storeSelectedColData.test);
    console.log('Keys Array:', this.keysArray);
    console.log('Data Array:', this.dataArray);
  } else {
    console.error('storeSelectedColData.test is not defined:', this.storeSelectedColData.test);
  }
}
extractKeysAndData1(inputData: any): void {
  const keys = Object.keys(inputData);
  console.log('Extracted Keys:', keys);  // Debug: Log extracted keys

  this.keysArray = keys;
  this.dataArray = keys.map(key => inputData[key]);
  console.log('Extracted Data Array:', this.dataArray);  // Debug: Log extracted data array
}
getFilteredData(){
  this.extractKeysAndData();
  const Obj ={
    id:this.keysArray,
    input_list:this.dataArray
  }
  this.workbechService.getFilteredData(Obj).subscribe({
    next:(data)=>{
      console.log(data);
      this.tablePreviewColumn = data.columns;
      this.tablePreviewRow = data.rows;
      console.log(this.tablePreviewColumn);
      console.log(this.tablePreviewRow);
      // localStorage.removeItem('filterid')
      data.forEach((item: any) => {
      item.columns.forEach((res:any) => {      
        let obj1={
          name:res.column,
          values: res.result
        }
        this.filteredColumnData.push(obj1);
        console.log('filtercolumn',this.filteredColumnData)
      });
      item.rows.forEach((res:any) => {
        let obj={
          name: res.column,
          data: res.result
        }
        this.filteredRowData.push(obj);
        console.log('filterowData',this.filteredRowData)
      });
      this.dashboard.forEach((item1:any) => {
        if(item1.sheetId == item.sheet_id){
          if(item.chart_id == '6'){//bar
          item1.chartOptions.xaxis.categories = this.filteredColumnData[0].values;
          item1.chartOptions.series = this.filteredRowData;
          }
          if(item.chart_id == '24'){//pie
            item1.chartOptions.labels = this.filteredColumnData[0].values;
          item1.chartOptions.series = this.filteredRowData[0].data;
          }
          if(item.chart_id == '13'){//line
            item1.chartOptions.xaxis.categories = this.filteredColumnData[0].values;
          item1.chartOptions.series = this.filteredRowData;
          }
          if(item.chart_id == '17'){//area
            item1.chartOptions.labels = this.filteredColumnData[0].values;
          item1.chartOptions.series = this.filteredRowData;
          }
          if(item.chart_id == '7'){//sidebyside
            const dimensions: Dimension[] = this.filteredColumnData
            const categories = this.flattenDimensions(dimensions)

            item1.chartOptions.xaxis.categories = this.filteredColumnData[0].values;
            item1.chartOptions.series = this.filteredRowData;
          }
          if(item.chart_id == '2'){//hstacked
            const dimensions: Dimension[] = this.filteredColumnData
            const categories = this.flattenDimensions(dimensions)

            item1.chartOptions.xaxis.categories = this.filteredColumnData[0].values;
            item1.chartOptions.series = this.filteredRowData;
          }
          if(item.chart_id == '5'){//stacked
            const dimensions: Dimension[] = this.filteredColumnData
            const categories = this.flattenDimensions(dimensions)

            item1.chartOptions.xaxis.categories = this.filteredColumnData[0].values;
            item1.chartOptions.series = this.filteredRowData;
          }
          if(item.chart_id == '4'){//barline
            const dimensions: Dimension[] = this.filteredColumnData
            const categories = this.flattenDimensions(dimensions)

            item1.chartOptions.label = this.filteredColumnData[0].values;
            item1.chartOptions.series = this.filteredRowData;
          }
          if(item.chart_id == '3'){//hgrouped
            const dimensions: Dimension[] = this.filteredColumnData
            const categories = this.flattenDimensions(dimensions)
            
            item1.chartOptions.xaxis.categories = this.filteredColumnData[0].values;
            item1.chartOptions.series = this.filteredRowData;
          }
          if(item.chart_id == '8'){//multiline
            const dimensions: Dimension[] = this.filteredColumnData
            const categories = this.flattenDimensions(dimensions)
            
            item1.chartOptions.xaxis.categories = this.filteredColumnData[0].values;
            item1.chartOptions.series = this.filteredRowData;
          }

              this.initializeChart(item1);
              this.filteredColumnData =[]
              this.filteredRowData=[]

          console.log('filtered dashboard-data',item1)
        }
      })
    });
      },
    error:(error)=>{
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
  })
}
closeFilterModal(){
  this.modalService.dismissAll('close')
}

  findSheetIndex(sheetID: number): number {
    return this.dashboard.findIndex(sheet => sheet['sheetId'] === sheetID);
  }

deleteDashboardFilter(id:any){
  const Obj ={
    id:id
  }
  this.workbechService.deleteDashbaordFilter(Obj).subscribe({
    next:(data)=>{
      console.log(data);
      // this.colData= data.col_data?.map((name: any) => ({ label: name, selected: false }))
     
    },
    error:(error)=>{
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
  })
}

dropTest2(event: any) {
  if(this.colArray.length >0 && this.rowArray.length>0){
    this.colArray = [];
    this.rowArray = [];
  }
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    console.log('Transfering item to new container')
    console.log('Transferring item to new container');
    
    let item: any = event.previousContainer.data[event.previousIndex];
    console.log('Original item:', JSON.stringify(item));
    
    // Creating a deep copy of the item
    let copy: any = JSON.parse(JSON.stringify(item));
    console.log('Copy of item:', JSON.stringify(copy));
    
    // Initialize an empty object to hold the copied attributes
    let element: DashboardItem = {
      id:copy.id,
      x:copy.x,
        y: copy.y,
      rows: 1,
      cols:1,
      data: copy.data,
      sheetType:copy.sheetType,
      sheetId:copy.sheetId,
      chartType:copy.chartType,
      chartId:copy.chartId,
      chartOptions: copy.chartOptions,
      chartInstance: copy.chartInstance,
      tableData:copy.tableData,
      chartData:copy.chartOptions?.chartData || [],
    };
    this.dashboardTest.push(element);
    this.sheetTabs[this.selectedTabIndex].dashboard = this.dashboardTest;
  }
 
}

  selectedSheetTab(event: any) {
    this.selectedTabIndex = event.index;
    this.dashboardTest = this.sheetTabs[this.selectedTabIndex].dashboard;
  }

  addTabs() {
    this.displayTabs = true;
    let id = uuidv4();
    this.selectedTab = { id: id };
    this.selectedTabIndex = this.sheetTabs.length;
    let name = this.selectedTabIndex > 0 ? "Sheet Title " + this.selectedTabIndex : "Sheet Title";
    this.sheetTabs.push({ id: id, name: name, dashboard: [] });
    this.dashboardTest = [];
  }
  Editor = ClassicEditor;
  editor : boolean = false;
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
      inputElement.innerHTML = this.dashboardTagName;
      inputElement.style.paddingTop = '1.5%';
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.dashboardTagName, 'text/html');
    this.dashboardName = doc.body.textContent+'';
}

  addSheetIds(data:any,panel : any){
    data.is_selected = !data.is_selected;
    if(data.is_selected){
      this.sheetIdsDataSet.push(data.sheet_id);
    } else {
      const indexToRemove = this.sheetIdsDataSet.findIndex((num: number) => num === data.sheetId);
        if (indexToRemove !== -1) {
          this.sheetIdsDataSet.splice(indexToRemove, 1);
          panel.is_selected = false;
        }
    }
    
  }

  loadDashboard(){
    let obj = {sheet_ids: this.sheetIdsDataSet};
    this.workbechService.sheetRetrivelBasedOnIds(obj).subscribe({
      next:(data)=>{
        console.log('savedDashboard',data);
      let sheetArray = data.map((sheet:any)=>sheet.sheets[0]);
      this.dashboardNew = sheetArray.map((sheet:any) => ({
        id:uuidv4(),
        cols: 1,
        rows: 1,
        y: 10,
        x: 10,
        sheetType:sheet.sheet_type,
        sheetId:sheet.sheet_id,
        chartType:sheet.chart,
        chartId:sheet.chart_id,
        databaseId : sheet.server_id,
        qrySetId : sheet.queryset_id,
        data: { title: sheet.sheet_name, content: 'Content of card New' },
        selectedSheet : sheet.selectedSheet,
        chartOptions: sheet.sheet_type === 'Chart' ? {
          // ...this.getChartOptions(sheet.chart,sheet?.sheet_data.x_values,sheet?.sheet_data.y_values),
          ... this.getChartOptionsBasedOnType(sheet) as unknown as ApexOptions,
          // chart: { type: sheet.chart, height: 300 },
          //chartData:this.getChartData(sheet.sheet_data.results, sheet.chart)
        } : undefined,
        tableData: sheet.sheet_type === 'Table' ? {
         ... this.getTableData(sheet.sheet_data)
  
        }
         : undefined
      }));
       this.isSheetsView = false;
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }

  pageChangegetUserSheetsList(page:any){
    this.pageNo=page;
    this.fetchSheetsList();
    }

  fetchSheetsList(){
    let obj;
    if( this.searchSheets && this.searchSheets.trim() != '' && this.searchSheets.length > 0){
      obj ={
        sheet_ids : this.sheetIdsDataSet,
        page_no : this.pageNo,
        search : this.searchSheets
      }
    } else {
      obj ={
        sheet_ids : this.sheetIdsDataSet,
        page_no : this.pageNo,
      }
    }

    this.workbechService.fetchSheetsList(obj).subscribe({
      next:(data)=>{
        console.log('savedDashboard',data);
       this.panelscheckbox = data.sheets;
       this.totalItems = data.total_items;
       this.itemsPerPage = data.items_per_page;
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }
  checkAllChilds(panel: any){
    panel.sheet_data.forEach((sheet : any) =>{
      sheet.is_selected = !panel.is_selected;
      if(sheet.is_selected){
        this.sheetIdsDataSet.push(sheet.sheet_id);
      } else {
        const indexToRemove = this.sheetIdsDataSet.findIndex((num: number) => num === sheet.sheetId);
        if (indexToRemove !== -1) {
          this.sheetIdsDataSet.splice(indexToRemove, 1);
        }
      }
    })
  }

}

// export interface CustomGridsterItem extends GridsterItem {
//   title: string;
//   content: string;
// }
