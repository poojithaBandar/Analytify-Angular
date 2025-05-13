import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InsightApexComponent } from '../insight-apex/insight-apex.component';
import { InsightEchartComponent } from '../insight-echart/insight-echart.component';
import { WorkbenchService } from '../workbench.service';
import { CustomSheetsComponent } from '../custom-sheets/custom-sheets.component';
import { SheetsComponent } from '../sheets/sheets.component';

@Component({
  selector: 'app-sheet-sdk',
  standalone: true,
  imports: [CommonModule, InsightApexComponent, InsightEchartComponent, CustomSheetsComponent,SheetsComponent],
  templateUrl: './sheet-sdk.component.html',
  styleUrl: './sheet-sdk.component.scss'
})
export class SheetSdkComponent {
  sheetId! : number;                                                                                                       
      chartType = '';                                                                                                     
      config: any;                                                                                                        
      data: any;                                                                                                          
      loading = true;                                                                                                     
      error: string | null = null;                                                                                        
  clientId!: string;
  sheetToken!: string      
  isApexChart : boolean = false;                                                                                                      
  chartOptions: any;
  embedFilters: any;
  // Table display properties
  tableColumnsDisplay: string[] = [];
  tableDataDisplay: any[] = [];
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  bandingSwitch = false;
  color1 = '#ffffff';
  color2 = '#f3f3f3';
  headerFontFamily = '';
  headerFontStyle = '';
  headerFontDecoration = '';
  headerFontColor = '';
  headerFontAlignment: 'left' | 'center' | 'right' = 'left';
  headerFontWeight = '';
  headerFontSize = '';
  tableDataFontFamily = '';
  tableDataFontWeight = '';
  tableDataFontStyle = '';
  tableDataFontDecoration = '';
  tableDataFontColor = '';
  tableDataFontAlignment: 'left' | 'center' | 'right' = 'left';
  tableDataFontSize = '';
  decimalPlaces = 2;
  prefix = '';
  suffix = '';
  displayUnits = '';
  sdkQuerySetID!: number;
  sdkDatabaseID!: number;
      constructor(                                                                                                        
        private route: ActivatedRoute,                                                                                    
        private workbenchService: WorkbenchService                                                                               
      ) {}                                                                                                                
                                                                                                                          
    ngOnInit(): void {                                                                                                 

        this.sheetToken = this.route.snapshot.params['sheetToken'];
        this.clientId = this.route.snapshot.params['clientId'];
        this.route.queryParams.subscribe(params => {
          const rawFilters = params['filters'];
          if (rawFilters) {
            try {
              this.embedFilters = JSON.parse(rawFilters);
              console.log('Filters object:', this.embedFilters);
              // Expected output: { name: ['US', 'UK'], idList: [3, 4] }
            } catch (e) {
              console.error('Error parsing filters:', e);
            }
          }
        });
        let accessToken = this.route.snapshot.params['token'];
        const userToken = { Token: accessToken,};
        localStorage.setItem('currentUser', JSON.stringify(userToken));                                                         
          if (this.sheetToken) {   
            let sheetPayload = {sheet_token : this.sheetToken}
            this.workbenchService.fetchSheetId(sheetPayload).subscribe({                                                         
              next: (data:any) => {                                                                                                  
                this.sheetId = data.dashboard_id;     
                this.sdkQuerySetID = data.queryset_id;
                this.sdkDatabaseID = data.server_id;
                this.fetchData();                                                                       
              },                                                                                                              
              error: (err : any) => {                                                                                                 
                console.error(err);                                                                                           
                this.error = 'Failed to load chart data';                                                                     
                this.loading = false;                                                                                         
              }                                                                                                               
            });                                                                                                                                                                                                                                                                                             
          } else {                                                                                                        
            this.error = 'Sheet Token is required';                                                                          
            this.loading = false;                                                                                         
          }                                                                                                                                                                                                                           
      }  
      
      setChartType(chartId: number){
        switch (chartId) {
          case 9:
            this.chartType = 'pivot';
            break;
          case 1: 
          this.chartType = 'table';
          break;
          case 25:
            this.chartType = 'kpi';
            break;
          case 6:
            this.chartType = 'bar';
            break;
          case 24:
            this.chartType = 'pie';
            break;
          case 11:
            this.chartType = 'line';
            break;
          case 17:
            this.chartType = 'area';
            break;
          case 7:
            this.chartType = 'sidebyside';
            break;
          case 5:
            this.chartType = 'stocked';
            break;
          case 2:
            this.chartType = 'hstocked';
            break;
          case 3:
            this.chartType = 'hgrouped';
            break;
          case 8:
            this.chartType = 'multiline';
            break;
          case 10:
            this.chartType = 'donut';
            break;
          case 27:
            this.chartType = 'funnel';
            break;
          case 28:
            this.chartType = 'guage';
            break;

          case 4:
            this.chartType = 'barline';
            break;

          case 26:
            this.chartType = 'heatmap';
            break;


        }
      }
                                                                                                                          
  fetchData(): void {
    this.loading = true;
    let filterKeys;
    let filterValues;
    let payload;
    if (this.embedFilters) {
      filterKeys = Object.keys(this.embedFilters);
      filterValues = Object.values(this.embedFilters);
      payload = {
        "filter_name": filterKeys,
        "sheet_id": this.sheetId,
        "input_list": filterValues
      }
    } else {
       payload = { "sheet_id": this.sheetId };
    }
    this.workbenchService.getSheetSdkData(payload).subscribe({
      next: (data: any) => {
        console.log(data);
        const sheet = data.sheet_retrieve_data.sheet_data;
        this.isApexChart = sheet.isApexChart;
        this.chartOptions = sheet.savedChartOptions;
        this.setChartType(data.sheet_retrieve_data.chart_id);
        // If it's not a chart, render table via CustomSheetsComponent
        if (!this.isApexChart) {
          // columns and rows arrays from API
          const cols: string[] = sheet.columns || sheet.table?.columns || [];
          const rows: any[][] = sheet.rows || sheet.table?.rows || [];
          this.tableColumnsDisplay = cols;
          // Map row arrays to objects
          this.tableDataDisplay = rows.map(r => {
            const obj: any = {};
            cols.forEach((c, i) => obj[c] = r[i]);
            return obj;
          });
          this.totalItems = this.tableDataDisplay.length;
          this.itemsPerPage = sheet.itemsPerPage ?? this.itemsPerPage;
          this.page = 1;
          this.bandingSwitch = sheet.bandingSwitch ?? this.bandingSwitch;
          this.color1 = sheet.color1 ?? this.color1;
          this.color2 = sheet.color2 ?? this.color2;
          this.headerFontFamily = sheet.headerFontFamily ?? this.headerFontFamily;
          this.headerFontStyle = sheet.headerFontStyle ?? this.headerFontStyle;
          this.headerFontDecoration = sheet.headerFontDecoration ?? this.headerFontDecoration;
          this.headerFontColor = sheet.headerFontColor ?? this.headerFontColor;
          this.headerFontAlignment = sheet.headerFontAlignment ?? this.headerFontAlignment;
          this.headerFontWeight = sheet.headerFontWeight ?? this.headerFontWeight;
          this.headerFontSize = sheet.headerFontSize ?? this.headerFontSize;
          this.tableDataFontFamily = sheet.tableDataFontFamily ?? this.tableDataFontFamily;
          this.tableDataFontWeight = sheet.tableDataFontWeight ?? this.tableDataFontWeight;
          this.tableDataFontStyle = sheet.tableDataFontStyle ?? this.tableDataFontStyle;
          this.tableDataFontDecoration = sheet.tableDataFontDecoration ?? this.tableDataFontDecoration;
          this.tableDataFontColor = sheet.tableDataFontColor ?? this.tableDataFontColor;
          this.tableDataFontAlignment = sheet.tableDataFontAlignment ?? this.tableDataFontAlignment;
          this.tableDataFontSize = sheet.tableDataFontSize ?? this.tableDataFontSize;
          this.decimalPlaces = sheet.decimalPlaces ?? this.decimalPlaces;
          this.prefix = sheet.prefix ?? this.prefix;
          this.suffix = sheet.suffix ?? this.suffix;
          this.displayUnits = sheet.displayUnits ?? this.displayUnits;
        }
        // done loading
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Failed to load chart data';
        this.loading = false;
      }
    });
  }       
  /**
   * Handle pagination change from CustomSheetsComponent
   */
  pageChangeTable(newPage: number) {
    this.page = newPage;
  }
}
