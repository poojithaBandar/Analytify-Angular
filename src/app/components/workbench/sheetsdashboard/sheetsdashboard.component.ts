import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import {CompactType, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterItemComponentInterface, GridsterModule, GridsterPush, 
  GridType,
  DisplayGrid,
  GridsterComponent,
  GridsterComponentInterface,
 
} from 'angular-gridster2';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { EChartsOption } from 'echarts';
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
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ScreenshotService } from '../../../shared/services/screenshot.service';

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
    CdkDropList, CdkDrag,ChartsStoreComponent,FormsModule,  ],
  templateUrl: './sheetsdashboard.component.html',
  styleUrl: './sheetsdashboard.component.scss'
})
export class SheetsdashboardComponent {
 // @HostListener('window:resize', ['$event'])
 qrySetId:any;
 databaseId:any;
 dashboardName = '';
 sheetsIdArray = [] as any;
 sheetsNewDashboard=false;
 dashboardView = false;
 chartOptionsBar:any;
 dashboardId:any;
 databaseName:any;
 updateDashbpardBoolen= false;
 active=1;
  public chartOptions!: Partial<ChartOptions>;
  constructor(private workbechService:WorkbenchService,private route:ActivatedRoute,private router:Router,private screenshotService: ScreenshotService){
    this.dashboard = [];
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
  dashboard!: Array<GridsterItem & { data?: any,   chartOptions?: ApexOptions,  chartInstance?: ApexCharts,chartData?: any[],tableData?: { headers: any[], rows: any[] }
  }>;
  dashboardNew!: Array<GridsterItem & { data?: any,   chartOptions?: ApexOptions,  chartInstance?: ApexCharts,chartData?: any[],tableData?: { headers: any[], rows: any[] }
  }>;
  pushNewSheet =[] as any;
  sheetData = [] as any;
  tableHeader:any;
  tableRows:any;
  rowArray = [] as any;
  colArray = [] as any;
  chartOptionsinitialize = false;
  //@ViewChild('gridster') gridster!: ElementRef;

  screenshotSrc: string | null = null;

  itemToPush!: GridsterItemComponent;
  @ViewChildren(GridsterItemComponent) GridsterItemComponent!: QueryList<GridsterItemComponent>;
  @ViewChild('gridster') gridster!: ElementRef; // Adjust the type as needed

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
      this.sheetsDataWithQuerysetId();

    }
   
    //this.getSheetData();
    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      displayGrid: DisplayGrid.Always,
      initCallback: SheetsdashboardComponent.gridInit,
      destroyCallback: SheetsdashboardComponent.gridDestroy,
      gridSizeChangedCallback: SheetsdashboardComponent.gridSizeChanged,
      itemChangeCallback: SheetsdashboardComponent.itemChange,
      itemResizeCallback: SheetsdashboardComponent.itemResize,
      itemInitCallback: SheetsdashboardComponent.itemInit,
      itemRemovedCallback: SheetsdashboardComponent.itemRemoved,
      itemValidateCallback: SheetsdashboardComponent.itemValidate,
      // fixedColWidth: 400,
      // fixedRowHeight: 400,
      // itemChangeCallback: SheetsdashboardComponent.itemChange,
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
  getSavedDashboardData(){
    const obj ={
      queryset_id:this.qrySetId,
      server_id:this.databaseId,
      dashboard_id:this.dashboardId
    }
    this.workbechService.getSavedDashboardData(obj).subscribe({
      next:(data)=>{
        console.log(data);
        this.dashboardName=data.dashboard_name
        this.dashboard = data.dashboard_data
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }
  saveDashboard(){
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
      queryset_id:this.qrySetId,
      server_id:this.databaseId,
       sheet_ids:this.sheetsIdArray,
      dashboard_name:this.dashboardName,
      data:this.dashboard
    }
    this.workbechService.saveDashboard(obj).subscribe({
      next:(data)=>{
        console.log(data);
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
this.takeScreenshot();
  }
  takeScreenshot() {
    const element = this.gridster?.nativeElement ||  document.querySelector('gridster') as HTMLElement;
    if (element) {
      this.screenshotService.capture(element).then((imgData) => {
        this.screenshotSrc = imgData;
      }).catch((error) => {
        console.error('Error capturing screenshot:', error);
      });
    } else {
      console.error('Gridster element is not defined for screenshot.');
    }
    // setTimeout(() => {
    //   const element = this.gridster?.nativeElement ||  document.querySelector('gridster') as HTMLElement;

    //   window.scrollTo(0, 0); // Scroll to top
    //   const clone = element.cloneNode(true) as HTMLElement;

    //   clone.style.position = 'absolute';
    //   clone.style.left = '0';
    //   clone.style.top = '0';
    //   clone.style.width = `${clone.scrollWidth}px`;
    //   clone.style.height = `${clone.scrollHeight}px`;
    //   clone.style.overflow = 'hidden';
    //   document.body.appendChild(clone);  
    //   if (clone) {
    //     this.screenshotService.capture(clone).then((imgData) => {
    //       this.screenshotSrc = imgData;
    //     }).catch((error) => {
    //       console.error('Error capturing screenshot:', error);
    //     });
    //   } else {
    //     console.error('Gridster element is not defined for screenshot.');
    //   }
    // }, 1000);
  }
  updateDashboard(){
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
      queryset_id:this.qrySetId,
      server_id:this.databaseId,
       sheet_ids:this.sheetsIdArray,
      dashboard_name:this.dashboardName,
      data:this.dashboard
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
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }
  this.takeScreenshot();

  }
  sheetsDataWithQuerysetId(){
    const obj ={
      // server_id:this.databaseId,
      // queryset_id:this.qrySetId
      server_id:this.databaseId,
      queryset_id:this.qrySetId
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
      y: 0,
      x: 0,
      sheetType:sheet.sheet_type,
      sheetId:sheet.sheet_id,
      chartType:sheet.chart,
      chartId:sheet.chart_id,
      data: { title: sheet.sheet_name, content: 'Content of card New' },
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
    console.log('dashboardNew',this.dashboardNew)
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
      return this.sidebySideBarChartOptions(xaxis,yaxis)
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
      return this.barLineChartOptions(xaxis,yaxis)
    }
    if(sheet.chart_id === 2){
      let xaxis = sheet.sheet_data?.results?.hStockedXaxis;
      let yaxis = sheet.sheet_data?.results?.hStockedYaxis;
      return this.hStockedBarChartOptions(xaxis,yaxis)
    }
    if(sheet.chart_id === 3){
      let xaxis = sheet.sheet_data?.results?.hgroupedXaxis;
      let yaxis = sheet.sheet_data?.results?.hgroupedYaxis;
      return this.hGroupedChartOptions(xaxis,yaxis)
    }
    if(sheet.chart_id === 8){
      let xaxis = sheet.sheet_data?.results?.multiLineXaxis;
      let yaxis = sheet.sheet_data?.results?.multiLineYaxis;
      return this.multiLineChartOptions(xaxis,yaxis)
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
  drop(event: CdkDragDrop<DashboardItem[]>) {
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
        chartOptions: copy.chartOptions,
        chartInstance: copy.chartInstance,
        tableData:copy.tableData,
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
     this.dashboard.push(element);
    //  this.initializeChartData(element);  // Initialize chart after adding
     console.log('draggedDashboard',this.dashboard)
    }
   
  }

  viewSheet(sheetId:any,sheetname:any){
    const encodedServerId = btoa(this.databaseId.toString());
    const encodedQuerySetId = btoa(this.qrySetId.toString());
    const encodedSheetId = btoa(sheetId.toString());
    const encodedSheetName = btoa(sheetname);
  
    this.router.navigate(['/workbench/landingpage/sheets/'+encodedServerId+'/'+encodedQuerySetId+'/'+encodedSheetId+'/'+encodedSheetName])
  }
  
  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged && this.options.api.resize) {
      this.options.api.optionsChanged();
      this.options.api.resize(); 
    }
  }

  removeItem($event:any, item:any) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
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
  onResizeStop(item: DashboardItem, event:any): void {
    const itemComponent  = event.itemComponent as GridsterItemComponent;
    if(itemComponent){
    this.updateChartDimensions(item, itemComponent);
    }else{
      console.error('item not available')
    }
  }
  updateSizeOnServer(item:any, itemComponent:any){

  }
  updateChartDimensions(item: DashboardItem, itemComponent: GridsterItemComponent): void {
    if (item['chartInstance'] && itemComponent) {
      item.chartOptions!.chart = {
        ...item.chartOptions!.chart,
        width: itemComponent.width,
        height: itemComponent.height,
        type:item.chartOptions?.chart?.type || 'bar'
      };
      item['chartInstance'].updateOptions(item.chartOptions, true);
    }
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
    if (item.chartOptions && item.chartOptions.chart && item.chartOptions.series) {
      const options: ApexOptions = {
        ...item.chartOptions,
        chart: {
          ...item.chartOptions.chart,
          type: item.chartOptions.chart.type || 'bar',
          height: 300
        },
        series: item.chartOptions.series,
        xaxis: item.chartOptions.xaxis,
      };
          item['chartInstance'] = new ApexCharts(document.querySelector("#chart"), options);
    item['chartInstance'].render();
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
      height: 385,
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
  return {
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
      categories:xaxis[0],
      
    },
    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: string) {
          return '$ ' + val + ' thousands';
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
      labels: xaxis[0],
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
        categories: xaxis[0],
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

hGroupedChartOptions(xaxis:any,yaxis:any){
  return{
    series:yaxis,
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
      categories: xaxis[0]
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
      categories: xaxis[0]
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
}
// export interface CustomGridsterItem extends GridsterItem {
//   title: string;
//   content: string;
// }
