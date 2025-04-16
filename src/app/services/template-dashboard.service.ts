import { Injectable, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { InsightEchartComponent } from '../components/workbench/insight-echart/insight-echart.component';
import { WorkbenchService } from '../components/workbench/workbench.service';
import { uuidv4 } from '@firebase/util';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';

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
    400}
  echartInstance!: InsightEchartComponent;
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
  constructor(private workbechService:WorkbenchService,private router:Router,private toasterservice:ToastrService) { }

  buildSampleConnectWiseDashboard(container: ViewContainerRef, databaseId : any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;
    this.workbechService.buildSampleDashbaord(databaseId).subscribe({next: (responce) => {
      const obj ={
        query_set_id:responce.datasource_query.queryset_id,
        hierarchy_id:responce.datasource_query.hierarchy_id,
        joining_tables: responce.datasource_query.joining_tables,
        join_type:responce.datasource_query.join_type,
        joining_conditions:responce.datasource_query.joining_conditions,
        dragged_array: {dragged_array:responce.datasource_query.dragged_array,dragged_array_indexing:{}},
      } as any
      this.workbechService.joiningTablesTest(obj).subscribe({next: (responce) => {
      
        this.buildDashboardResponseData(responce,"connectWise");
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
          }
        }
      )
      this.buildDashboardResponseData(responce,"connectWise");
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
  }

  buildSampleQuickbooksDashboard(container: ViewContainerRef, databaseId : any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;
    this.workbechService.buildQuickBooksDashbaord(databaseId).subscribe({next: (responce) => {
      const obj ={
        query_set_id:responce.datasource_query.queryset_id,
        hierarchy_id:responce.datasource_query.hierarchy_id,
        joining_tables: responce.datasource_query.joining_tables,
        join_type:responce.datasource_query.join_type,
        joining_conditions:responce.datasource_query.joining_conditions,
        dragged_array: {dragged_array:responce.datasource_query.dragged_array,dragged_array_indexing:{}},
      } as any
      this.workbechService.joiningTablesTest(obj).subscribe({next: (responce) => {
      
        this.buildDashboardResponseData(responce,'quickbooks');
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
          }
        }
      )
      this.buildDashboardResponseData(responce,'quickbooks');
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
  }

  
  buildDashboardResponseData(responce: any,formType: string){
    let dashboardData: any[] = [];
    if(responce){
      const updateRequests = responce.sheets.map((data:any,index:number) => {
        // if(data.chart_id == 1){
        //   data.chart_id = 8 
        // }
        let tableDataStore = [];
        let transformData : any ;
         let tablePreviewColumn = _.cloneDeep(data.sheet_query_data.columns_data)
        let  tablePreviewRow = _.cloneDeep(data.sheet_query_data.rows_data)
        let dualAxisColumnData:any =[];
        let dualAxisRowData:any=[];
        let chartsColumnData:any=[];
        let chartsRowData:any = [];
          if (tablePreviewColumn && tablePreviewRow) {
            tablePreviewColumn.forEach((res: any) => {
              // let obj = {
              //   data: res.result_data
              // }
              // sidebysideBarColumnData.push(res.result_data);
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
          return this.sheetUpdate(chartsColumnData, chartsRowData, dualAxisRowData, dualAxisColumnData,data.sheet_query_data.columns_data,data.sheet_query_data.rows_data,data,dashboardData,index,formType,transformData,tableDataStore,displayedColumns);
        
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

  sheetUpdate(chartsColumnData: [], chartsRowData: [], dualAxisRowData: [], dualAxisColumnData: [],tableColumnData:[],tableRowData:[],data: any,dashboardData: any[],index : number, formType : string,tranformedData:any,tableDataStore: any[],displayedColumns : string[]) {
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
      chartData = this.echartInstance.donutChart(chartsColumnData, chartsRowData);
    } else if(data.chart_id == 7) {
      chartData = this.echartInstance.sidebySide(dualAxisColumnData, dualAxisRowData);
    }  else if(data.chart_id == 27) {
      chartData = this.echartInstance.funnelchart(dualAxisColumnData, dualAxisRowData);
    }  else if(data.chart_id == 29) {
      chartData = this.echartInstance.mapChart(dualAxisColumnData, dualAxisRowData,chartsRowData);
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
          // "tableData": this.saveTableData,
          // "tableColumns": this.savedisplayedColumns,
          // "banding": this.banding,
          // "color1": bandColor1,
          // "color2": bandColor2,
          // "items_per_page": this.itemsPerPage,
          // "total_items": this.totalItems,

          "barYaxis": chartsRowData,
          "barXaxis": chartsColumnData,
          //  "barOptions":this.barOptions,

          "pieYaxis": chartsRowData,
          "pieXaxis": chartsColumnData,
          //   "pieOptions":this.pieOptions,

          "lineYaxis": chartsRowData,
          "lineXaxis": chartsColumnData,
          //   "lineOptions":this.lineOptions,

          "areaYaxis": chartsRowData,
          "areaXaxis": chartsColumnData,
          //   "areaOptions":this.areaOptions,

          "sidebysideBarYaxis": dualAxisRowData,
          "sidebysideBarXaxis": dualAxisColumnData,
          //     "sidebysideBarOptions":this.sidebysideBarOptions,

          "stokedBarYaxis": dualAxisRowData,
          "stokedBarXaxis": dualAxisColumnData,
          //     "stokedOptions":this.stokedOptions,

          "barLineYaxis": dualAxisRowData,
          "barLineXaxis": dualAxisColumnData,
          //     "barLineOptions":this.barLineOptions,

          "hStockedYaxis": dualAxisRowData,
          "hStockedXaxis": dualAxisColumnData,
          //     "hStockedOptions":this.hStockedOptions,

          "hgroupedYaxis": dualAxisRowData,
          "hgroupedXaxis": dualAxisColumnData,
          //     "hgroupedOptions":this.hgroupedOptions,

          "multiLineYaxis": dualAxisRowData,
          "multiLineXaxis": dualAxisColumnData,
          //     "multiLineOptions":this.multiLineOptions,

          "donutYaxis": chartsRowData,
          "donutXaxis": chartsColumnData,
          // "decimalplaces": this.donutDecimalPlaces,
          //     "donutOptions":this.donutOptions,

          "kpiData": tranformedData.rows_data,
          "kpiFontSize": 16,
          // "kpicolor": kpiColor,
          "kpiNumber": tranformedData.rows_data[0]?.result_data[0],
          "kpiPrefix": "",
          "kpiSuffix": "",
          kpiDecimalUnit: "none"
          // "kpiDecimalUnit": this.KPIDisplayUnits,
          // "kpiDecimalPlaces": this.KPIDecimalPlaces
        },
        "isApexChart": false,
        "isEChart": true,
        "savedChartOptions": chartData,
        

      }
    }
    let dashbaordObj = this.updateDashboardJSONData(chartData,data,index, {"kpiNumber": tranformedData.rows_data[0]?.result_data[0],"kpiFontSize": 16,"kpiPrefix": "","kpiSuffix": "",kpiDecimalUnit: "none",rows:tranformedData.rows_data},formType,tableDataStore,displayedColumns);
    dashboardData.push(dashbaordObj);
   return this.workbechService.sheetUpdate(obj, data.sheet_id);

  }

  updateDashboardJSONData(chartData: any, data: any, index : number,kpiData : any,formType : string, tableDataStore : any[],displayedColumns : string[]){
    let tableData;
    let totalRecordCount;
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
      this.workbechService.tablePaginationSearch(obj).subscribe(
        {
          next: (data: any) => {
             totalRecordCount = data.total_items;
          },
          error: (error) => {
            console.log(error);
          }
        }
      )
    }
      let obj = {
        id : uuidv4(),
        x : formType == 'connectWise' ? this.xConnectWiseArray[index] : formType == 'quickbooks' ? this.xQuickbooksAArray[index] : formType == 'salesforce' ? this.xSalesforceArray[index] : this.xHALOPSAArray[index] ,
        y: formType == 'connectWise' ? this.yConnectWiseArray[index] : formType == 'quickbooks' ? this.yQuickbooksAArray[index] :formType == 'salesforce' ? this.ySalesforcesAArray[index] : this.yHALOPSAArray[index],
        rows : formType == 'connectWise' ? this.rowsConnectWiseArray[index] : formType == 'quickbooks' ? this.rowsQuickbooksAArray[index] : formType == 'salesforce' ? this.rowsSalesforceAArray[index] :this.rowsHALOPSAArray[index],
        cols: formType == 'connectWise' ? this.colsConnectWiseArray[index] : formType == 'quickbooks' ? this.colsQuickbooksArray[index] :formType == 'salesforce' ? this.colsSalesforceArray[index] : this.colsHALOPSAArray[index],
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

  
  buildSampleHALOPSADashboard(container: ViewContainerRef , databaseId: any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;
    this.workbechService.buildSampleHALOPSADashbaord(databaseId).subscribe({next: (responce) => {
      const obj ={
        query_set_id:responce.datasource_query.queryset_id,
        hierarchy_id:responce.datasource_query.hierarchy_id,
        joining_tables: responce.datasource_query.joining_tables,
        join_type:responce.datasource_query.join_type,
        joining_conditions:responce.datasource_query.joining_conditions,
        dragged_array: {dragged_array:responce.datasource_query.dragged_array,dragged_array_indexing:{}},
      } as any
      this.workbechService.joiningTablesTest(obj).subscribe({next: (responce) => {        
      this.buildDashboardResponseData(responce,"HALOPSA");      
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
    this.buildDashboardResponseData(responce,'quickbooks');
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
  }
  buildSampleSalesforceDashboard(container: ViewContainerRef , databaseId: any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;
    this.workbechService.buildSampleSalesforceDashbaord(databaseId).subscribe({next: (responce) => {
      const obj ={
        query_set_id:responce.datasource_query.queryset_id,
        hierarchy_id:responce.datasource_query.hierarchy_id,
        joining_tables: responce.datasource_query.joining_tables,
        join_type:responce.datasource_query.join_type,
        joining_conditions:responce.datasource_query.joining_conditions,
        dragged_array: {dragged_array:responce.datasource_query.dragged_array,dragged_array_indexing:{}},
      } as any
      this.workbechService.joiningTablesTest(obj).subscribe({next: (responce) => {
      this.buildDashboardResponseData(responce,'salesforce');      
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
    this.buildDashboardResponseData(responce,'quickbooks');
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
  }

  
}
