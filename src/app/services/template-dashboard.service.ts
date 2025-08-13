import { Injectable, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { InsightEchartComponent } from '../components/workbench/insight-echart/insight-echart.component';
import { WorkbenchService } from '../components/workbench/workbench.service';
import { uuidv4 } from '@firebase/util';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';
import { SheetsComponent } from '../components/workbench/sheets/sheets.component';

interface TableRow {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateDashboardService {
  customizeOptions = {GridColor
    : 
    "#089ffc",
    KPIDecimalPlaces
    : 
    2,
    KPIDisplayUnits
    : 
    "none",
    KPIPrefix
    : 
    "",
    KPISuffix
    : 
    "",
    backgroundColor
    : 
    "#fcfcfc",
    backgroundColorSwitch
    : 
    false,
    bandingColorSwitch
    : 
    false,
    bandingSwitch
    : 
    false,
    barColor
    : 
    "#4382f7",
    barColorSwitch
    : 
    false,
    bottomLegend
    : 
    "0%",
    chartColorSwitch
    : 
    false,
    color
    : 
    "#2392c1",
    dataLabels
    : 
    true,
    dataLabelsColor
    : 
    "#2392c1",
    dataLabelsFontFamily
    : 
    "sans-serif",
    dataLabelsFontPosition
    : 
    "top",
    dataLabelsFontSize
    : 
    "12px",
    decimalPlaces
    : 
    2,
    dimensionAlignment
    : 
    "center",
    dimensionColor
    : 
    "#2392c1",
    displayUnits
    : 
    "none",
    donutDecimalPlaces
    : 
    2,
    donutSize
    : 
    50,
    funnelColorSwitch
    : 
    false,
    gridLineColorSwitch
    : 
    false,
    headerFontAlignment
    : 
    "left",
    headerFontColor
    : 
    "#000000",
    headerFontDecoration
    : 
    "none",
    headerFontFamily
    : 
    "'Arial', sans-serif",
    headerFontSize
    : 
    "16px",
    headerFontStyle
    : 
    "normal",
    headerFontWeight
    : 
    700,
    isBold
    : 
    false,
    isDistributed
    : 
    false,
    isLocationField
    : 
    false,
    isTableDataBold
    : 
    false,
    isTableHeaderBold
    : 
    false,
    isXlabelBold
    : 
    false,
    isYlabelBold
    : 
    false,
    isZoom
    : 
    false,
    kpiColor
    : 
    "#000000",
    kpiColorSwitch
    : 
    false,
    kpiFontSize
    : 
    "3",
    label
    : 
    true,
    labelAlignment
    : 
    "left",
    leftLegend
    : 
    "center",
    legendOrient
    : 
    "horizontal",
    legendSwitch
    : 
    true,
    legendsAllignment
    : 
    "bottom",
    lineColor
    : 
    "#38ff98",
    lineColorSwitch
    : 
    false,
    locationDrillDownSwitch
    : 
    false,
    maxValueGuage
    : 
    100,
    measureAlignment
    : 
    "center",
    measureColor
    : 
    "#2392c1",
    minValueGuage
    : 
    0,
    prefix
    : 
    "",
    rightLegend
    : 
    null,
    selectedColorScheme
    : 
    ["#1d2e92", "#088ed2", "#007cb9", "#36c2ce", "#52c9f7"],
    sortColumn
    : 
    "select",
    sortType
    : 
    0,
    suffix
    : 
    "",
    tableDataFontAlignment
    : 
    "left",
    tableDataFontColor
    : 
    "#000000",
    tableDataFontDecoration
    : 
    "none",
    tableDataFontFamily
    : 
    "sans-serif",
    tableDataFontSize
    : 
    "12px",
    tableDataFontStyle
    : 
    "normal",
    tableDataFontWeight
    : 
    400,
    topLegend
    : 
    null,
    xGridColor
    : 
    "#2392c1",
    xGridLineColorSwitch
    : 
    false,
    xGridSwitch
    : 
    false,
    xLabelColor
    : 
    "#2392c1",
    xLabelColorSwitch
    : 
    false,
    xLabelFontFamily
    : 
    "sans-serif",
    xLabelFontSize
    : 
    12,
    xLabelSwitch
    : 
    true,
    xlabelFontWeight
    : 
    400,
    yGridColor
    : 
    "#2392c1",
    yGridLineColorSwitch
    : 
    false,
    yGridSwitch
    : 
    false,
    yLabelColor
    : 
    "#2392c1",
    yLabelColorSwitch
    : 
    false,
    yLabelFontFamily
    : 
    "sans-serif",
    yLabelFontSize
    : 
    12,
    yLabelSwitch
    : 
    true,
    ylabelFontWeight
    : 
    400,
    toggleTablePagination
    :true,
    toggleTableSearch
    : true,
  }
  echartInstance!: InsightEchartComponent;
  sheetsInstance!: SheetsComponent;
  xConnectWiseArray = [0,5,10,15,0,10,0,10,0];
  yConnectWiseArray = [0,0,0,0,4,4,12,12,20];
  rowsConnectWiseArray = [4,4,4,4,8,8,8,8,8];
  colsConnectWiseArray = [5,5,5,5,10,10,10,10,10];
  xHALOPSAArray = [0,5,10,15,20,25,0,10,0,10,0];
  yHALOPSAArray = [0,0,0,0,0,0,4,4,12,12,20];

  yQuickbooksAArray = [0,0,0,0,0,0,4,4,12,12,20];
  xQuickbooksAArray = [0,4,8,12,16,20,0,12,0,12,0];
  rowsQuickbooksAArray = [4,4,4,4,4,4,8,8,8,8,8];
  colsQuickbooksArray = [4,4,4,4,4,4,12,12,12,12,12];

  ySalesforcesAArray = [0,0,0,0,0,4,4,12,12,20];
  xSalesforceArray = [0,4,8,12,16,0,10,0,10,0];
  rowsSalesforceAArray = [4,4,4,4,4,8,8,8,8,8];
  colsSalesforceArray = [4,4,4,4,4,10,10,10,10,10];
  rowsHALOPSAArray = [4,4,4,4,4,4,8,8,8,8,8];
  colsHALOPSAArray = [5,5,5,5,5,5,12,12,12,12,12];
  dashboardQuerySetIds: number[]=[];
  sheetsData: any;
  constructor(private workbechService:WorkbenchService,private router:Router,private toasterservice:ToastrService) { }

  buildSampleConnectWiseDashboard(container: ViewContainerRef, databaseId : any, responceData?: any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;

    const handleResponse = (responce: any) => {
      const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
      queries.forEach((query: any) => {
        const obj = {
          query_set_id: query.queryset_id,
          hierarchy_id: query.hierarchy_id,
          joining_tables: query.joining_tables,
          join_type: query.join_type,
          joining_conditions: query.joining_conditions,
          dragged_array: {dragged_array: query.dragged_array, dragged_array_indexing:{}},
          is_smart_dashboard:true

        } as any;
        this.workbechService.joiningTablesTest(obj).subscribe({next: () => {},
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
          }
        });
      });
      this.buildDashboardResponseData(responce);
    };

    if(responceData){
      handleResponse(responceData);
    } else {
      this.workbechService.buildSampleDashbaord(databaseId).subscribe({
        next: handleResponse,
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      });
    }
  }

  buildSampleQuickbooksDashboard(container: ViewContainerRef, databaseId : any, responceData?: any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;

    const handleResponse = (responce: any) => {
      const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
      queries.forEach((query: any) => {
        const obj ={
          query_set_id:query.queryset_id,
          hierarchy_id:query.hierarchy_id,
          joining_tables: query.joining_tables,
          join_type:query.join_type,
          joining_conditions:query.joining_conditions,
          dragged_array: {dragged_array:query.dragged_array,dragged_array_indexing:{}},
          is_smart_dashboard:true

        } as any
        this.workbechService.joiningTablesTest(obj).subscribe({next: () => {},
            error: (error) => {
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
              console.log(error);
            }
          })
      });
      this.buildDashboardResponseData(responce);
    };

    if(responceData){
      handleResponse(responceData);
    } else {
      this.workbechService.buildQuickBooksDashbaord(databaseId).subscribe({
        next: handleResponse,
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      })
    }
  }
  buildSampleImmybotDashboard(container: ViewContainerRef, databaseId: any, responceData?: any) {
    const componentRef = container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;

    const handleResponse = (responce:any) => {
      const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
      queries.forEach((query: any) => {
        const obj = {
          query_set_id: query.queryset_id,
          hierarchy_id: query.hierarchy_id,
            joining_tables: query.joining_tables,
            join_type: query.join_type,
            joining_conditions: query.joining_conditions,
            dragged_array: { dragged_array: query.dragged_array, dragged_array_indexing: {} },
            is_smart_dashboard:true
          } as any;
          this.workbechService.joiningTablesTest(obj).subscribe({
            next: () => {},
            error: (error) => {
              this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
              console.log(error);
            }
          });
      });
      this.buildDashboardResponseData(responce);
    };

    if(responceData){
      handleResponse(responceData);
    } else {
      this.workbechService.buildSampleImmybotDashboard(databaseId).subscribe({
        next: handleResponse,
        error: (error:any) => {
          this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
          console.log(error);
        }
      });
    }
  }
  buildSampleNinjaRMMDashboard(container: ViewContainerRef, databaseId: any, responceData?: any) {
    const componentRef = container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;

    const handleResponse = (responce: any) => {
      const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
      queries.forEach((query: any) => {
        const obj = {
          query_set_id: query.queryset_id,
          hierarchy_id: query.hierarchy_id,
            joining_tables: query.joining_tables,
            join_type: query.join_type,
            joining_conditions: query.joining_conditions,
            dragged_array: { dragged_array: query.dragged_array, dragged_array_indexing: {} },
            is_smart_dashboard:true
          } as any;
          this.workbechService.joiningTablesTest(obj).subscribe({
            next: () => {},
            error: (error) => {
              this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
              console.log(error);
            }
          });
      });
      this.buildDashboardResponseData(responce);
    };

    if(responceData){
      handleResponse(responceData);
    } else {
      this.workbechService.buildSampleNinjaRMMDashboard(databaseId).subscribe({
        next: handleResponse,
        error: (error: any) => {
          this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
          console.log(error);
        }
      });
    }
  }
   buildSampleGieneAiqDashbaord(container: ViewContainerRef, databaseId: any, responceData?: any) {
    const componentRef = container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;

    const handleResponse = (responce: any) => {
      const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
      queries.forEach((query: any) => {
        const obj = {
          query_set_id: query.queryset_id,
          hierarchy_id: query.hierarchy_id,
            joining_tables: query.joining_tables,
            join_type: query.join_type,
            joining_conditions: query.joining_conditions,
            dragged_array: { dragged_array: query.dragged_array, dragged_array_indexing: {} },
            is_smart_dashboard:true
          } as any;
          this.workbechService.joiningTablesTest(obj).subscribe({
            next: () => {},
            error: (error) => {
              this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
              console.log(error);
            }
          });
      });
      this.buildDashboardResponseData(responce);
    };

    if(responceData){
      handleResponse(responceData);
    } else {
     return
    }
  }
  buildDashboardResponseData(responce: any){
    let dashboardData: any[] = [];
    if(responce){
      this.sheetsData = responce.sheets.map(function(obj:any) {
        return {
          sheet_id: obj.sheet_id,
          chart_id: obj.chart_id,
          chart_type: obj.chart_type
        };
      });
      this.generateLayout(this.sheetsData);
      const updateRequests = responce.sheets.map((data:any,index:number) => {
        let tableDataStore = [];
        let transformData : any ;
         let tablePreviewColumn = _.cloneDeep(data.sheet_query_data.columns_data)
        let  tablePreviewRow = _.cloneDeep(data.sheet_query_data.rows_data)
        let dualAxisColumnData:any =[];
        let dualAxisRowData:any=[];
        let chartsColumnData:any=[];
        let chartsRowData:any = [];
        let totalCount: any;
          if (tablePreviewColumn && tablePreviewRow) {
            tablePreviewColumn.forEach((res: any) => {
              let obj1 = {
                name: res.column,
                values: res.data
              }
              dualAxisColumnData.push(obj1);
            });
            tablePreviewRow.forEach((res: any) => {
              let obj = {
                name: res.column,
                data: res.data
              }
              dualAxisRowData.push(obj);
            });
            tablePreviewRow.forEach((res: any) => {
              let obj = {
                name: res.col,
                value: res.data
              }
              // this.radarRowData.push(obj);
            });
            let rowCount: any;
            if (tablePreviewColumn[0]?.data?.length) {
              rowCount = tablePreviewColumn[0]?.data?.length;
            }
            transformData = this.transformData(tablePreviewColumn,tablePreviewRow);
            
            let rowCountStore: any;
            if (transformData?.columns_data.length) {
              rowCountStore = transformData?.columns_data[0]?.result_data?.length;
            } else {
              rowCountStore = transformData?.rows_data[0]?.result_data?.length;
            }
            totalCount = _.cloneDeep(rowCountStore);
            rowCountStore = rowCountStore > 10 ? 10:rowCountStore;
            for (let i = 0; i < rowCountStore; i++) {
              const row: TableRow = {};
              transformData?.columns_data.forEach((col: any) => {
                row[col.column] = col.result_data[i];
              });
              transformData?.rows_data.forEach((rowData: any) => {
                row[rowData.col] = rowData.result_data[i];
              });
              tableDataStore.push(row);
            }
  
            tablePreviewColumn.forEach((col: any) => {
              chartsColumnData = col.data;
            });
            tablePreviewRow.forEach((rowData: any) => {
              chartsRowData = rowData.data;
            });
          }
          let displayedColumns = tablePreviewColumn.map((col: any) => col.column).concat(tablePreviewRow.map((row: any) => row.column));
          this.dashboardQuerySetIds.push(data.queryset_id);
          return this.sheetUpdate(chartsColumnData, chartsRowData, dualAxisRowData, dualAxisColumnData,data.sheet_query_data.columns_data,data.sheet_query_data.rows_data,data,dashboardData,index,transformData,tableDataStore,displayedColumns,totalCount);
        
      });
      
      let dashboardObj ={
        grid : "scroll",
        height: 800,
        width: 800,
        queryset_id: this.dashboardQuerySetIds,
        server_id:responce.dashboard.hierarchy_id,
        sheet_ids:responce.dashboard.sheet_ids,
        dashboard_name:responce.dashboard.dashboard_name,
        dashboard_tag_name:responce.dashboard.dashboard_tag_name,
        selected_sheet_ids:responce.dashboard.selected_sheet_ids,
        data : dashboardData,
        // tab_data : sheetTabsData,
        // tab_name: tabNames,
        // tab_sheets: sheetIds,
        // tab_id: tabIds,

      }
      forkJoin(updateRequests).pipe(
        switchMap(() => this.workbechService.updateDashboard(dashboardObj,responce.dashboard.dashboard_id))
      ).subscribe({
        next: (dashboardData) => {
          const encodedDashboardId = btoa(responce.dashboard.dashboard_id.toString());

          this.router.navigate(['/analytify/home/sheetsdashboard/'+encodedDashboardId])
          console.log('Dashboard Data:', dashboardData);
        },
        error: (err) => {
          console.error('Error during processing or dashboard fetch', err);
        }
      });
    }
  }

  transformData(columns_data: any[],rows_data:any[]) {
    const transformed = {
      columns_data: columns_data.map((item: any) => ({
        column: item.column,
        result_data: item.data
      })),
      rows_data: rows_data.map((item: any) => ({
        col: item.column,
        result_data: item.data
      }))
    };
  
    return transformed;
  }

  sheetUpdate(chartsColumnData: [], chartsRowData: [], dualAxisRowData: [], dualAxisColumnData: [],tableColumnData:[],tableRowData:[],data: any,dashboardData: any[],index : number, tranformedData:any,tableDataStore: any[],displayedColumns : string[],totalCount:number) {
    let chartData;
    if(data.chart_id == 8){
      chartData = this.echartInstance.multiLineChart(dualAxisColumnData, dualAxisRowData);
    } else if(data.chart_id == 24) {
    chartData = this.echartInstance.pieChart(chartsColumnData, chartsRowData);
    } else if(data.chart_id == 6) {
      chartData = this.echartInstance.barChart(chartsColumnData, chartsRowData);
    }  else if(data.chart_id == 3) {
      chartData = this.echartInstance.hgroupedChart(dualAxisColumnData, dualAxisRowData);
    } else if(data.chart_id == 10) {
      this.echartInstance.donutSize = this.customizeOptions.donutSize;
      chartData = this.echartInstance.donutChart(chartsColumnData, chartsRowData);
    } else if(data.chart_id == 7) {
      chartData = this.echartInstance.sidebySide(dualAxisColumnData, dualAxisRowData);
    }  else if(data.chart_id == 27) {
      chartData = this.echartInstance.funnelchart(dualAxisColumnData, dualAxisRowData);
    } else if(data.chart_id == 29) {
      chartData = this.echartInstance.mapChart(dualAxisColumnData, dualAxisRowData,chartsRowData);
    }  else if(data.chart_id == 2) {
      chartData = this.echartInstance.hstackedChart(dualAxisColumnData, dualAxisRowData);
    } else if(data.chart_id == 13) {
      chartData = this.echartInstance.linechartFromGenieDashboard(chartsColumnData,chartsRowData);
    } else if(data.chart_id == 17){
      chartData = this.echartInstance.areachartFromGenieDashboard(chartsColumnData,chartsRowData);
    } else if(data.chart_id == 4){
      chartData = this.echartInstance.barLinechartFromGenieDashboard(dualAxisColumnData, dualAxisRowData);
    } else if(data.chart_id == 26){
      chartData = this.echartInstance.heatmapFromGenieDashboard(dualAxisColumnData, dualAxisRowData);
    } else if(data.chart_id == 5){
      chartData = this.echartInstance.stackedchartFromGenieDashboard(dualAxisColumnData, dualAxisRowData);
    } else if(data.chart_id == 11){
      chartData = this.echartInstance.calendarchartFromGenieDashboard(chartsColumnData, chartsRowData);
    } else if(data.chart_id == 14){
      this.echartInstance.autoAdjustChartHeightForHBar();
      chartData = this.echartInstance.horizontalBarChart(chartsColumnData, chartsRowData);
    } else if(data.chart_id == 12){
      chartData = this.echartInstance.radarchartFromGenieDashboard(dualAxisColumnData, dualAxisRowData);
    }
    
    const sheetRows = data.row_data.map((item:any) => {
      return {
        column: item.orginal_column,
        data_type: item.data_type,
        type: item.type ?  item.type : ""
      };
    });
    const sheetColumns = data.col_data.map((item:any) => {
      return {
        column: item.orginal_column,
        data_type: item.data_type,
        type: item.type ?  item.type : ""
      };
    });
    const sheet_rows_data = data.row_data.map((item:any) => {
      return [
        item.orginal_column,
        item.type ? "aggregate" : item.data_type,
        item.type ? item.type : "",
        ""
      ];
    });
    const sheet_column_data = data.col_data.map((item:any) => {
      return [
        item.orginal_column,
        item.data_type,
        (item?.type ? item?.type : "") ?? "",
        ""
      ];
    });

    const obj = {
      "chart_id": data.chart_id,
      "queryset_id": data.queryset_id,
      "server_id": data.hierarchy_id,
      "sheet_name": data.sheet_name,
      "sheet_tag_name": data.sheet_tag_name,
      "filter_id": data.sheet_filter_ids,
      "sheetfilter_querysets_id": data.sheet_filter_quereyset_ids,
      "filter_data": data.filters_data,
      "datasource_querysetid": data.datasource_queryset_id,
      "col": data.sheet_col,
      "row": data.sheet_row,
      "row_data":data.row_data.map((item: any) => item.column),
      "col_data":data.col_data.map((item: any) => item.column),
      "custom_query": data.custom_query,
      "data": {
        "customizeOptions": this.customizeOptions,
        "columns": sheetColumns,
        "columns_data": sheet_column_data,
        "col":tranformedData.columns_data,
        "row": tranformedData.rows_data,
        "rows":  sheetRows,
        "rows_data": sheet_rows_data,
        // "col": tablePreviewCol,
        // "row": tablePreviewRow,
        "results": {
          "kpiData": tranformedData.rows_data,
          "kpiFontSize": 3,
          "kpiNumber": tranformedData.rows_data[0]?.result_data[0],
          "kpiPrefix": "",
          "kpiSuffix": "",
          "kpiDecimalPlaces": 2,
          kpiDecimalUnit: "none",
          "tableData": tableDataStore,
          "tableColumns": displayedColumns,
          "banding": false,
          "color1": "#f5f5f5",  
          "color2": "#ffffff",
          "items_per_page": 10,
          "total_items": totalCount
        },
        "isApexChart": false,
        "isEChart": true,
        "savedChartOptions": chartData,
        

      }
    }
    let dashbaordObj = this.updateDashboardJSONData(chartData,data,index, {"kpiNumber": tranformedData.rows_data[0]?.result_data[0],"kpiFontSize": 16,"kpiPrefix": "","kpiSuffix": "",kpiDecimalUnit: "none",rows:tranformedData.rows_data},tableDataStore,displayedColumns,totalCount);
    dashboardData.push(dashbaordObj);
   return this.workbechService.sheetUpdate(obj, data.sheet_id);

  }

  updateDashboardJSONData(chartData: any, data: any, index : number,kpiData : any, tableDataStore : any[],displayedColumns : string[],totalCount: any){
    let tableData;
    let totalRecordCount = totalCount;
    const sheet_rows_data = data.row_data.map((item:any) => {
      return [
        item.orginal_column,
        "aggregate",
        item.type ? item.type : "",
        ""
      ];
    });
    const sheet_column_data = data.col_data.map((item:any) => {
      return [
        item.orginal_column,
        item.data_type,
        "",
        ""
      ];
    });
    if (data.chart_id == 1) {
      let columns = data.col_data.map((item: any) => item.column);
      let rows = data.row_data.map((item: any) => item.column);
      const obj = {
        hierarchy_id: data.hierarchy_id,
        // sheetqueryset_id: this.sheetfilter_querysets_id,
        queryset_id: data.queryset_id,
        page_no: 1,
        page_count: 10,
        rows: rows,
        columns: columns,
        custom_query: data.custom_query
      };
      tableData = {
        headers: displayedColumns,
        rows: tableDataStore,
        "banding": false,
        "tableItemsPerPage": 10,
        "tableTotalItems": totalRecordCount,
        "tablePage": 1
      };
      // this.workbechService.tablePaginationSearch(obj).subscribe(
      //   {
      //     next: (data: any) => {
      //        totalRecordCount = data.total_items;
      //     },
      //     error: (error) => {
      //       console.log(error);
      //     }
      //   }
      // )
    }
      let obj = {
        id : uuidv4(),
        x :  this.xHALOPSAArray[index] ,
        y: this.yHALOPSAArray[index],
        rows : this.rowsHALOPSAArray[index],
        cols:  this.colsHALOPSAArray[index],
        data: {
          sheetTagName
            :
            data.sheet_tag_name,
          title
            :
            data.sheet_name
        },
        sheetType: "chart",
        sheetId : data.sheet_id,
        chartType : data.chart_type,
        databaseId : data.hierarchy_id,
        qrySetId : data.queryset_id,
        chartId : data.chart_id,
        selectedSheet : true,
        kpiData: kpiData,
        column_Data: sheet_column_data,
        row_Data: sheet_rows_data,
        isEChart: true,
        echartOptions: chartData,
        customizeOptions : this.customizeOptions,
        tableData : tableData
     }
     return obj;
  }

  
  buildSampleHALOPSADashboard(container: ViewContainerRef , databaseId: any, responceData?: any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;

    const handleResponse = (responce: any) => {
      const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
      queries.forEach((query: any) => {
        const obj ={
          query_set_id:query.queryset_id,
          hierarchy_id:query.hierarchy_id,
          joining_tables: query.joining_tables,
          join_type:query.join_type,
          joining_conditions:query.joining_conditions,
          dragged_array: {dragged_array:query.dragged_array,dragged_array_indexing:{}},
          is_smart_dashboard:true
        } as any;
          this.workbechService.joiningTablesTest(obj).subscribe({next: () => {},
              error: (error) => {
                this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
                console.log(error);
              }
            }
          )
      });
      this.buildDashboardResponseData(responce);
    };

    if(responceData){
      handleResponse(responceData);
    } else {
      this.workbechService.buildSampleHALOPSADashbaord(databaseId).subscribe({
        next: handleResponse,
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      })
    }
  }
  buildSamplePaxDashboard(container: ViewContainerRef , databaseId: any, responceData?: any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;

    const handleResponse = (responce: any) => {
      const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
      queries.forEach((query: any) => {
        const obj ={
          query_set_id:query.queryset_id,
          hierarchy_id:query.hierarchy_id,
          joining_tables: query.joining_tables,
          join_type:query.join_type,
          joining_conditions:query.joining_conditions,
          dragged_array: {dragged_array:query.dragged_array,dragged_array_indexing:{}},
          is_smart_dashboard:true
        } as any;
          this.workbechService.joiningTablesTest(obj).subscribe({next: () => {},
              error: (error) => {
                this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
                console.log(error);
              }
            }
          )
      });
      this.buildDashboardResponseData(responce);
    };

    if(responceData){
      handleResponse(responceData);
    } else {
      this.workbechService.buildSamplePaxDashboard(databaseId).subscribe({
        next: handleResponse,
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      })
    }
  }
  buildSampleSalesforceDashboard(container: ViewContainerRef , databaseId: any, responceData?: any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;

    const handleResponse = (responce: any) => {
      const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
      queries.forEach((query: any) => {
        const obj ={
          query_set_id:query.queryset_id,
          hierarchy_id:query.hierarchy_id,
          joining_tables: query.joining_tables,
          join_type:query.join_type,
          joining_conditions:query.joining_conditions,
          dragged_array: {dragged_array:query.dragged_array,dragged_array_indexing:{}},
          is_smart_dashboard:true
        } as any
          this.workbechService.joiningTablesTest(obj).subscribe({next: () => {},
            error: (error) => {
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
              console.log(error);
            }
          })
      });
      this.buildDashboardResponseData(responce);
    };

    if(responceData){
      handleResponse(responceData);
    } else {
      this.workbechService.buildSampleSalesforceDashbaord(databaseId).subscribe({
        next: handleResponse,
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      })
    }
  }

  buildSampleOpenAIDashboard(container: ViewContainerRef , databaseId: any, responceData?: any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;

    const handleResponse = (responce: any) => {
      const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
      queries.forEach((query: any) => {
        const obj ={
          query_set_id:query.queryset_id,
          hierarchy_id:query.hierarchy_id,
          joining_tables: query.joining_tables,
          join_type:query.join_type,
          joining_conditions:query.joining_conditions,
          dragged_array: {dragged_array:query.dragged_array,dragged_array_indexing:{}},
          is_smart_dashboard:true
        } as any
          this.workbechService.joiningTablesTest(obj).subscribe({next: () => {
              },
              error: (error) => {
                this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
                console.log(error);
              }
            }
          )
      });
      this.buildDashboardResponseData(responce);
    };

    if(responceData){
      handleResponse(responceData);
    } else {
      this.workbechService.buildSampleOpenAIDashboard(databaseId).subscribe({
        next: handleResponse,
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      })
    }
  }
buildSampleTallyDashboard(container: ViewContainerRef, databaseId: any, responceData?: any) {
  const componentRef = container.createComponent(InsightEchartComponent);
  this.echartInstance = componentRef.instance;

  const handleResponse = (responce: any) => {
    const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
    queries.forEach((query: any) => {
      const obj ={
        query_set_id:query.queryset_id,
        hierarchy_id:query.hierarchy_id,
        joining_tables: query.joining_tables,
        join_type:query.join_type,
        joining_conditions:query.joining_conditions,
        dragged_array: {dragged_array:query.dragged_array,dragged_array_indexing:{}},
        is_smart_dashboard:true
      } as any
        this.workbechService.joiningTablesTest(obj).subscribe({next: () => {},
            error: (error) => {
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
              console.log(error);
            }
          }
        )
    });
    this.buildDashboardResponseData(responce);
    };

  if(responceData){
    handleResponse(responceData);
  } else {
    this.workbechService.buildSampleTallyDashboard(databaseId).subscribe({
      next: handleResponse,
      error: (error) => {
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
        console.log(error);
      }
    })
  }
  }
buildSampleHubspotDashboard(container: ViewContainerRef, databaseId: any, responceData?: any) {
  const componentRef = container.createComponent(InsightEchartComponent);
  this.echartInstance = componentRef.instance;

  const handleResponse = (responce: any) => {
    const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
    queries.forEach((query: any) => {
      const obj ={
        query_set_id:query.queryset_id,
        hierarchy_id:query.hierarchy_id,
        joining_tables: query.joining_tables,
        join_type:query.join_type,
        joining_conditions:query.joining_conditions,
        dragged_array: {dragged_array:query.dragged_array,dragged_array_indexing:{}},
        is_smart_dashboard:true
      } as any
        this.workbechService.joiningTablesTest(obj).subscribe({next: () => {},
            error: (error) => {
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
              console.log(error);
            }
          }
        )
    });
    this.buildDashboardResponseData(responce);
    };

  if(responceData){
    handleResponse(responceData);
  } else {
    this.workbechService.buildSampleHubspotDashboard(databaseId).subscribe({
      next: handleResponse,
      error: (error) => {
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
        console.log(error);
      }
    })
  }
  }

  buildSampleShopifyDashboard(container: ViewContainerRef, databaseId: any, responceData?: any) {
    const componentRef = container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;
  
    const handleResponse = (responce: any) => {
      const queries = Array.isArray(responce.datasource_query) ? responce.datasource_query : [responce.datasource_query];
      queries.forEach((query: any) => {
        const obj ={
          query_set_id:query.queryset_id,
          hierarchy_id:query.hierarchy_id,
          joining_tables: query.joining_tables,
          join_type:query.join_type,
          joining_conditions:query.joining_conditions,
          dragged_array: {dragged_array:query.dragged_array,dragged_array_indexing:{}},
          is_smart_dashboard:true
        } as any
          this.workbechService.joiningTablesTest(obj).subscribe({next: () => {},
              error: (error) => {
                this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
                console.log(error);
              }
            }
          )
      });
      this.buildDashboardResponseData(responce);
      };
  
    if(responceData){
      handleResponse(responceData);
    } else {
      this.workbechService.buildSampleShopifyDashbaord(databaseId).subscribe({
        next: handleResponse,
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      })
    }
    }

  private readonly KPI_MAX       = 8;
  private readonly KPI_PER_ROW   = 8;
  private readonly KPI_SIZE      = { cols: 5, rows: 4 };

  private readonly TABLE_MAX     = 1;
  private readonly TABLE_PER_ROW = 1;
  private readonly TABLE_SIZE    = { cols: 20, rows: 15 };

  private readonly MIDDLE_PER_ROW = 2;
  private readonly MIDDLE_SIZE    = { cols: 10, rows: 8 };

  /**
   * Generate four arrays (x/y/cols/rows) for your Gridster layout.
   * @param sheets  flat list of sheet metadata
   */
  public generateLayout(sheets: any[]) {
    const n = sheets.length;
    const xArray    = Array<number>(n).fill(0);
    const yArray    = Array<number>(n).fill(0);
    const colsArray = Array<number>(n).fill(0);
    const rowsArray = Array<number>(n).fill(0);

    // 1) Partition into three buckets, respecting limits.
    const kpis: number[]    = [];
    const tables: number[]  = [];
    const middle: number[]  = [];
    let kpiCount = 0, tableCount = 0;

    sheets.forEach((sh, idx) => {
      if (sh.chart_type === 'KPI' && kpiCount < this.KPI_MAX) {
        kpis.push(idx);
        kpiCount++;
      } else if (sh.chart_type === 'Table' && tableCount < this.TABLE_MAX) {
        tables.push(idx);
        tableCount++;
      } else {
        middle.push(idx);
      }
    });

    // 2) Helper to place a homogeneous group
    const placeGroup = (
      indices: number[],
      offsetY: number,
      perRow: number,
      size: { cols: number; rows: number }
    ): number => {
      indices.forEach((sheetIdx, order) => {
        const row = Math.floor(order / perRow);
        const col = order % perRow;
        xArray[sheetIdx]    = col * size.cols;
        yArray[sheetIdx]    = offsetY + row * size.rows;
        colsArray[sheetIdx] = size.cols;
        rowsArray[sheetIdx] = size.rows;
      });
      // total height consumed by this group
      const numRows = Math.ceil(indices.length / perRow);
      return numRows * size.rows;
    };

    // 3) Stitch them together vertically
    let cursorY = 0;
    // a) KPIs at the very top
    cursorY += placeGroup(kpis,   cursorY, this.KPI_PER_ROW,   this.KPI_SIZE);
    // b) “Other” charts in the middle
    cursorY += placeGroup(middle, cursorY, this.MIDDLE_PER_ROW, this.MIDDLE_SIZE);
    // c) Tables at the bottom
    placeGroup(tables, cursorY, this.TABLE_PER_ROW, this.TABLE_SIZE);

      this.xHALOPSAArray = xArray;
      this.yHALOPSAArray = yArray;
      this.colsHALOPSAArray = colsArray;
      this.rowsHALOPSAArray = rowsArray;  
    }
  
  }
  
        

