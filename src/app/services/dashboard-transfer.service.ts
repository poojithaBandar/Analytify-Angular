import { Injectable, ViewContainerRef } from '@angular/core';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { InsightEchartComponent } from '../components/workbench/insight-echart/insight-echart.component';
import { SheetsComponent } from '../components/workbench/sheets/sheets.component';
import { SheetsdashboardComponent } from '../components/workbench/sheetsdashboard/sheetsdashboard.component';
import { WorkbenchService } from '../components/workbench/workbench.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardTransferService {

  echartInstance!: InsightEchartComponent;
  sheetsInstance!: SheetsComponent;
  dashboardInstance! : SheetsdashboardComponent;

  constructor(private workbechService: WorkbenchService, private toasterservice: ToastrService) { }

    buildDashboardTransfer(container: ViewContainerRef,responesData : any){
    const componentRef =container.createComponent(SheetsComponent);
    this.sheetsInstance = componentRef.instance;
    const dashboardComponentRef =container.createComponent(SheetsdashboardComponent);
    this.dashboardInstance = dashboardComponentRef.instance;
    const queries = Array.isArray(responesData.datasource_query) ? responesData.datasource_query : [responesData.datasource_query];
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
      this.workbechService.joiningTablesTest(obj).subscribe({
        next: () => {},
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      });
    });
    responesData.sheets.forEach((sheet: any)=> {
        const {
          chart_id,
          sheet_col,
          sheet_row,
          sheet_data,
          sheet_query_data,
          ...rest
        } = sheet;
        const transformedColumns = sheet_query_data.columns_data.map(({ data, ...colRest }:any) => ({
          ...colRest,
          result_data: data
        }));
      
        let transformedRows = {};
        if (chart_id == 9) {
          transformedRows = sheet_query_data.rows_data.map((data: any) => ({
            col: data.column,
            result_data: data.data
          }));
        } else {
          transformedRows = sheet_query_data.rows_data.map(({ data, ...rowRest }: any) => ({
            ...rowRest,
            result_data: data
          }));
        }

        let pivotMeasureData = {};
        if (chart_id == 9) {
          pivotMeasureData = sheet_query_data.pivot_data.map((data: any) => ({
            col: data.column,
            result_data: data.data
          }));
        }

        const KPIRows = sheet_query_data.rows_data.map(({ data, ...rowRest }: any) => ({
          ...rowRest,
          result: data
        }));
        const dashboardKPIRows = sheet_query_data.rows_data.map((row: any) => ({
          col: row.column,
          result_data: row.data
        }));
        let transformData = this.transformDashboardTransferData(sheet.sheet_query_data, chart_id)
        let chartTransformaedData = this.transformTableAndChartData(transformData);
        let chartOptions = sheet.sheet_data.savedChartOptions;
        if(![1, 9, 25].includes(chart_id)){ 
          chartOptions = this.updateChartOptions(chartOptions,chart_id,sheet.sheet_data.isApexChart,chartTransformaedData.xAxisCategories,chartTransformaedData.multiSeriesChartData);
        }
        const transformed = {
          chart_id,
          ...rest,
          col_data: sheet_col,
          row_data: sheet_row,
          ...(chart_id === 9 && { pivot_measure: sheet.sheet_pivot }),
          sheet_data: {
          savedChartOptions : chartOptions,
            ...sheet_data,
            col: transformedColumns,
            row: transformedRows,
            ...(chart_id === 9 && { pivotMeasure_Data: pivotMeasureData })
          }
        };
        if(chart_id == 25 ){
          transformed.sheet_data.results.kpiNumber = sheet_query_data.rows_data[0]?.data[0];
          transformed.sheet_data.results.kpiData[0].result_data = transformed.sheet_data.row[0].result_data;
          sheet['rows'] = KPIRows;
          sheet['dashboardKPIRows'] = dashboardKPIRows;
        } else if(chart_id != 1 && chart_id != 9){
          sheet.sheet_data.savedChartOptions = chartOptions;
        }
        this.sheetsInstance.setSheetData(transformed,false,null , true);
        if(chart_id == 1){
          sheet.sheet_data.results = {"tableData":this.sheetsInstance.tableDataStore,
          "tableColumns":this.sheetsInstance.displayedColumns,
          "banding":this.sheetsInstance.banding,
          "color1":this.sheetsInstance.color1,
          "color2":this.sheetsInstance.color2,
          "items_per_page":this.sheetsInstance.itemsPerPage,
          "total_items":this.sheetsInstance.tableDataStore.length}
        } else if(chart_id == 9){
          this.sheetsInstance.pivotTableDatatransform(false, true);
          sheet.sheet_data = {
            ...sheet.sheet_data,
            pivotMeasure_Data: this.sheetsInstance.pivotMeasureData.map((data:any)=>{
              return {
                col: data.col,
                result_data: data.result_data
              }
            }),
            pivotTransformedData: this.sheetsInstance.transformedData,
            col: this.sheetsInstance.pivotColumnData,
            row: this.sheetsInstance.pivotRowData
          }
        }
      });
    let responseData = _.cloneDeep(this.mergeSheetData(responesData));
    this.updateDashboardData(responseData.dashboard, responseData.sheets).then(() => {
      this.dashboardInstance.dashboardId = responesData.dashboard.dashboard_id;
      this.dashboardInstance.assignDashboardParams(responseData.dashboard,true);
      // this.dashboardInstance.updateDashboard(false,false,true);
    }).catch(error => {
      console.error('Error updating dashboard data:', error);
    });
  }

  mergeSheetData(data: any) {
    const sheetMap = new Map<number, any>();

    // Map sheetId to sheetQuery_Data for faster lookup
    data.sheets.forEach((sheet:any) => {
      sheetMap.set(sheet.sheet_id, sheet.sheet_query_data);
    });

    // Function to merge sheetQuery_Data into dashboardData
    const mergeDashboardData = (dashboardData: any[]) => {
      return dashboardData.map(item => {
        const matchingData = sheetMap.get(item.sheetId);
        if (matchingData) {
          return {
            ...item,
            ...matchingData
          };
        }
        return item;
      });
    };

    // Merge for main dashboard
    data.dashboard.dashboard_data = mergeDashboardData(data.dashboard.dashboard_data);

    // Merge for each tab's dashboard
    if (data.dashboard.tab_data && data.dashboard.tab_data.length > 0) {
      data.dashboard.tab_data?.forEach((tab: any) => {
        tab.dashboard = mergeDashboardData(tab.dashboard);
      });
    }

    return data;
  }

  updateChartOptions(chartOptions: any, chartId: any, isApexChart: boolean,
    xAxisCategories: string[], multiSeriesChartData: { name: string; data: number[] }[]): any {
      // chartType = chartType?.toLowerCase();
    // if (!chartOptions) chartOptions = {};

    // if (isApexChart) {
    //   if (['pie', 'donut', 'guage'].includes(chartType)) {
    //     chartOptions.series = multiSeriesChartData[0]?.data || [];
    //     chartOptions.labels = xAxisCategories;
    //   } else {
    //     chartOptions.series?.forEach((row: any, index: number) => {
    //       row.data = multiSeriesChartData[index]?.data || [];
    //     });
    //     chartOptions.xaxis = {
    //       ...chartOptions.xaxis,
    //       categories: xAxisCategories
    //     };
    //   }
    // } else {
    //   chartOptions.series?.forEach((row: any, index: number) => {
    //     row.data = multiSeriesChartData[index]?.data || [];
    //   });
    //   chartOptions.xAxis = {
    //     ...chartOptions.xAxis,
    //     data: xAxisCategories
    //   };
    // }


     if (!chartOptions) chartOptions = {};

  if (isApexChart) {
    if ([24, 10].includes(chartId)) {
      chartOptions.series = multiSeriesChartData[0]?.data || [];
      chartOptions.labels = xAxisCategories;
    } else if (chartId == 28) {
      chartOptions.series = multiSeriesChartData[0]?.data || [];
      chartOptions.labels = [multiSeriesChartData[0]?.name];
    } else if (chartId == 20) {
      const rawValues = multiSeriesChartData[0]?.data || [];
      const maxVal = chartOptions?.plotOptions?.radialBar?.max || Math.max(...rawValues, 0);
      chartOptions.series = rawValues.map((val: number) => maxVal ? (val / maxVal) * 100 : 0);
      chartOptions.labels = xAxisCategories;
      chartOptions.plotOptions = chartOptions.plotOptions || {};
      chartOptions.plotOptions.radialBar = chartOptions.plotOptions.radialBar || {};
      chartOptions.plotOptions.radialBar.max = maxVal;
      const radialRaw = rawValues;
      chartOptions.tooltip = {
        ...(chartOptions.tooltip || {}),
        y: {
          formatter: (_: any, opts: any) => radialRaw[opts.seriesIndex]
        }
      };
    } else if (chartId == 18) {
      const data = xAxisCategories.map((name, index) => ({
        x: name,
        y: multiSeriesChartData[0]?.data[index]
      }));
      if (chartOptions.series && chartOptions.series[0]) {
        chartOptions.series[0].data = data;
      } else {
        chartOptions.series = [{ data }];
      }
    } else {
      chartOptions.series?.forEach((row: any, index: number) => {
        row.data = multiSeriesChartData[index]?.data || [];
      });
      chartOptions.xaxis = chartOptions.xaxis || {};
      chartOptions.xaxis.categories = xAxisCategories;
    }
  } else {
    if (![12, 26, 11, 29, 24, 10, 27, 18].includes(chartId)) {
      chartOptions.series?.forEach((row: any, index: number) => {
        row.data = multiSeriesChartData[index]?.data || [];
      });
    } else if (chartId == 26) {
      const heatmapData: any[][] = [];
      multiSeriesChartData.forEach((row, rowIndex: any) => {
        row.data.forEach((value, colIndex: any) => { // Assuming each row has a data array
          if (value !== null && value !== undefined) { // Ensure value is valid
            heatmapData.push([colIndex, rowIndex, value]); // [xIndex, yIndex, value]
          }
        });
      });

      chartOptions.series.forEach((row: any, index: any) => {
        row.data = heatmapData;
      });
    } else if (chartId == 18) {
      const data: any[] = [];
      xAxisCategories.forEach((col: any, index: any) => {
        data.push({ name: col, value: multiSeriesChartData[0].data[index] });
      });
      if (chartOptions.series && chartOptions.series[0]) {
        chartOptions.series[0].data = data;
      }
    }

    if (chartId == 4) {
      chartOptions.xAxis?.forEach((column: any) => {
        column.data = xAxisCategories;
      });
    } else if (chartId == 21) {
      const normalizeLabel = (value: any) => {
        if (value === null || value === undefined) {
          return 'null';
        }
        const label = String(value).trim();
        return label === '' ? 'null' : label;
      };

      const aggregatedMeasures = multiSeriesChartData.reduce((acc: number[], row: any) => {
        (row?.data || []).forEach((val: any, index: number) => {
          const numericValue = typeof val === 'number' ? val : parseFloat(val);
          const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
          acc[index] = (acc[index] ?? 0) + safeValue;
        });
        return acc;
      }, [] as number[]);

      const wordcloudData = xAxisCategories.map((label: any, index: number) => ({
        name: normalizeLabel(label),
        value: aggregatedMeasures[index] ?? 0
      }));

      if (chartOptions.series && chartOptions.series.length) {
        chartOptions.series = [
          {
            ...chartOptions.series[0],
            data: wordcloudData
          },
          ...chartOptions.series.slice(1)
        ];
      } else {
        chartOptions.series = [{ type: 'wordCloud', data: wordcloudData }];
      } 
    }else if ([2, 3, 14].includes(chartId)) {
      // chartOptions.yAxis?.forEach((column: any) => {
      //   column.data = xAxisCategories;
      // });
      chartOptions.yAxis.data = xAxisCategories;
    } else if (chartId == 12) {
      let radarArray = xAxisCategories.map((value: any, index: number) => ({
        name: xAxisCategories[index]
      }));
      const transformedArray = multiSeriesChartData.map((obj: any) => ({
        name: obj.name,
        value: obj.data
      }));
      chartOptions.radar.indicator = radarArray;
      // this.chartOptions.series[0].data = transformedArray;
      chartOptions.series[0].data.forEach((row: any, index: any) => {
        row.value = multiSeriesChartData[index].data;
      });
    } else if (chartId == 11) {
      let calendarData: any[] = [];
      let years: Set<any> = new Set();

      if (multiSeriesChartData[0]?.data?.length > 0 || xAxisCategories?.length > 0) {
        multiSeriesChartData.forEach((series: any) => {
          series.data.forEach((value: any, index: number) => {
            const formattedDate = xAxisCategories[index]?.split(" ")[0];
            calendarData.push([formattedDate, value]);
            years.add(new Date(xAxisCategories[index]).getFullYear());
          });
        });

        const yearArray = Array.from(years).sort((a: any, b: any) => a - b);
        const series = yearArray.map((year: any, idx: number) => ({
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: idx,
          data: calendarData.filter(d => new Date(d[0]).getFullYear() === year)
        }));

        const calendarHeight = 120;
        const yearGap = 30;
        const calendars = yearArray.map((year: any, idx: number) => ({
          top: idx === 0 ? 25 : (calendarHeight + yearGap) * idx,
          range: year.toString(),
          cellSize: ['auto', 12],
          splitLine: {
            show: true,
            lineStyle: {
              color: '#000',
              width: 1
            }
          },
          yearLabel: {
            show: true,
            margin: 25,
            fontSize: 14,
            fontWeight: 'bold'
          }
        }));

        const allValues = multiSeriesChartData[0].data;
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);

        chartOptions.series = series;
        chartOptions.calendar = calendars;
        chartOptions.visualMap = {
          ...(chartOptions.visualMap || {}),
          min: minValue,
          max: maxValue
        };
      } else {
        chartOptions = {};
      }
    } else if (chartId == 29) {
      const result: any[] = [];
      let minData = 0;
      const maxData = Math.max(...multiSeriesChartData[0].data);

      xAxisCategories.forEach((country: string, index: number) => {
        const countryData: any = {
          name: country,
          value: multiSeriesChartData[0].data[index]
        };
        multiSeriesChartData.forEach((measure: any) => {
          countryData[measure.name] = measure.data[index];
        });
        result.push(countryData);
      });

      if (multiSeriesChartData.length > 0) {
        minData = Math.min(...multiSeriesChartData[0].data);
      }

      chartOptions.tooltip = {
        formatter: (params: any) => {
          const { name, data } = params;
          if (data) {
            return Object.entries(data)
              .map(([key, val]) => `${key}: ${val}`)
              .join('<br/>');
          } else {
            return `${name}: No Data`;
          }
        },
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2
      };

      chartOptions.visualMap = {
        ...(chartOptions.visualMap || {}),
        min: minData,
        max: maxData
      };

      chartOptions.series[0].data = result;
      chartOptions = {...chartOptions};
    } else if([24, 10, 27].includes(chartId)){
      let data: any[] = [];
      xAxisCategories.forEach((col: any, index: any) => {
        data.push({ value: multiSeriesChartData[0].data[index], name: col })
      });
      chartOptions.series[0].data = data;
    } else if (chartId == 18) {
      // Treemap does not use xAxis configuration
    } else {
      chartOptions.xAxis = {
        ...(chartOptions.xAxis || {}),
        data: xAxisCategories
      };
    }
  }

    return { ...chartOptions }; // ensure immutability
  }

  updateDashboardData(dashboard: any, sheets: any[]):  Promise<void> { 
    return new Promise((resolve) => {
    sheets.forEach(sheet => {
      const sheetId = sheet.sheet_id;

      dashboard.dashboard_data.forEach((dashboardItem:any) => {
        if (dashboardItem.sheetId === sheetId) {
          if(dashboardItem.chartId == 25 || sheet.chart_id == 25){
            dashboardItem.kpiData.kpiNumber = sheet.sheet_data.results.kpiNumber
            dashboardItem.kpiData.rows = sheet.dashboardKPIRows;
          } else if(dashboardItem.chartId == 1 || sheet.chart_id == 1){
            let tableData = this.dashboardInstance.getTableData(sheet.sheet_data)
            dashboardItem.tableData.rows = tableData.rows.slice(0, tableData.tableItemsPerPage);
          } else if(dashboardItem.chartId == 9 || sheet.chart_id == 9){
            dashboardItem.pivotData.pivotColData = sheet?.sheet_data?.col;
            dashboardItem.pivotData.pivotMeasureData = sheet?.sheet_data?.pivotMeasure_Data;
            dashboardItem.pivotData.pivotRowData = sheet?.sheet_data?.row;
            dashboardItem.transformedData = sheet?.sheet_data?.pivotTransformedData;
            delete dashboardItem.pivot_data;
          } else {
          if (sheet.sheet_data.isEChart) {
            dashboardItem.echartOptions = sheet.sheet_data.savedChartOptions;
          } else {
            dashboardItem.chartOptions = sheet.sheet_data.savedChartOptions;
          }
        }
        }
      });
      if (dashboard.tab_data && dashboard.tab_data.length > 0) {
        dashboard.tab_data?.forEach((tabData: any) => {
          tabData.dashboard?.forEach((dashboardItem: any) => {
            if (dashboardItem.sheetId === sheetId) {
              if (dashboardItem.chartId == 25 || sheet.chart_id == 25) {
                dashboardItem.kpiData.kpiNumber = sheet.sheet_data.results.kpiNumber
                dashboardItem.kpiData.rows = sheet.dashboardKPIRows;
              } else if (dashboardItem.chartId == 1 || sheet.chart_id == 1) {
                let tableData = this.dashboardInstance.getTableData(sheet.sheet_data)
                dashboardItem.tableData.rows = tableData.rows.slice(0, tableData.tableItemsPerPage);
              } else if (dashboardItem.chartId == 9 || sheet.chart_id == 9) {
                dashboardItem.pivotData.pivotColData = sheet?.sheet_data?.col;
                dashboardItem.pivotData.pivotMeasureData = sheet?.sheet_data?.pivotMeasure_Data;
                dashboardItem.pivotData.pivotRowData = sheet?.sheet_data?.row;
                dashboardItem.transformedData = sheet?.sheet_data?.pivotTransformedData;
                delete dashboardItem.pivot_data;
              } else {
                if (sheet.sheet_data.isEChart) {
                  dashboardItem.echartOptions = sheet.sheet_data.savedChartOptions;
                } else {
                  dashboardItem.chartOptions = sheet.sheet_data.savedChartOptions;
                }
              }
            }
          });
        })
      }
      
    });
    resolve(); // Resolve the promise once updates are done
  });
  }

  transformDashboardTransferData(inputData: any, chartId:any): any {
    const transformedData = {
      col: [],
      row: [],
      ...(chartId === 9 && { pivotMeasure: [] })
    };

    // Transform columns_data to col
    if (inputData.columns_data) {
      transformedData.col = inputData.columns_data.map((item: any) => ({
        column: item.column,
        result_data: item.data
      }));
    }

    // Transform rows_data to row
    if (inputData.rows_data) {
      transformedData.row = inputData.rows_data.map((item: any) => ({
        col: item.column,
        result_data: item.data
      }));
    }

    // Transform pivot_measure to pivotMeasure
    if (chartId === 9 && inputData.pivot_data) {
      transformedData.pivotMeasure = inputData.pivot_data.map((item: any) => ({
        col: item.column,
        result_data: item.data
      }));
    }

    return transformedData;
  }

  transformTableAndChartData(data: any): {
    xAxisCategories: string[],
    multiSeriesChartData: { name: string; data: number[] }[],
    combinedTableData: any[],
    columnNames: string[]
  } {
    const colArray = data?.col || [];
    const rowArray = data?.row || [];

    const xAxisCategories: string[] = [];
    const multiSeriesChartData: { name: string; data: number[] }[] = [];
    const combinedTableData: any[] = [];
    const columnNames: string[] = [
      ...colArray.map((col: { column: any }) => col.column),
      ...rowArray.map((row: { col: any }) => row.col)
    ];

    const rowCount = Math.max(
      colArray[0]?.result_data?.length || 0,
      rowArray[0]?.result_data?.length || 0
    );

    for (let i = 0; i < rowCount; i++) {
      const rowObj: any = {};
      colArray.forEach((col: { column: string; result_data: any[] }) => {
        rowObj[col.column] = col.result_data?.[i];
      });
      rowArray.forEach((row: { col: string; result_data: any[] }) => {
        rowObj[row.col] = row.result_data?.[i];
      });
      combinedTableData.push(rowObj);
    }

    // if (colArray.length > 0) {
    //   xAxisCategories.push(...(colArray[0].result_data?.map((v: any) => v ?? 'nu  ll') || []));
    // }

    const maxLength = Math.max(...colArray.map((col:any) => col.result_data?.length || 0));

    for (let i = 0; i < maxLength; i++) {
      const combined = colArray.map((col:any) => col.result_data?.[i] ?? 'null').join(', ');
      xAxisCategories.push(combined);
    }

    multiSeriesChartData.push(
      ...rowArray.map((row: { col: any; result_data: any }) => ({
        name: row.col,
        data: row.result_data || []
      }))
    );

    return {
      xAxisCategories,
      multiSeriesChartData,
      combinedTableData,
      columnNames
    };
  }
}
