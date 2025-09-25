import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/sharedmodule';
import { Router, RouterModule } from '@angular/router';
import { WorkbenchComponent } from '../workbench/workbench.component';
import { TemplateDashboardService } from '../../../services/template-dashboard.service';
import { OpenaiService } from '../../../services/openai.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { InsightEchartComponent } from '../insight-echart/insight-echart.component';
import { InsightApexComponent } from '../insight-apex/insight-apex.component';
import { concatMap, from, map } from 'rxjs';

type LayoutChartType =
  | 'Chart'
  | 'Table'
  | 'KPI';

interface LayoutNumberFormat {
  decimalPlaces: number;
  prefix: string;
  suffix: string;
}

interface LayoutCustomizeOptions {
  backgroundColor: string;
  color: string;
  selectedColorScheme: string[];
  isMeasureDistribution: boolean;
  xLabelSwitch: boolean;
  yLabelSwitch: boolean;
  xLabelFontSize: number;
  yLabelFontSize: number;
  xLabelFontFamily: string;
  yLabelFontFamily: string;
  xlabelFontWeight: number;
  ylabelFontWeight: number;
  dimensionAlignment: string;
  measureAlignment: string;
  gridColor: string;
  xGridSwitch: boolean;
  yGridSwitch: boolean;
  barCornerRadius: number;
  dataLabels: boolean;
  dataLabelsFontSize: number;
  dataLabelsFontFamily: string;
  dataLabelsColor: string;
  isBold: boolean;
  dataLabelsFontPosition: string;
  legendSwitch: boolean;
  legendsAllignment: string;
  donutSize: number;
  donutDecimalPlaces: number;
}

interface LayoutItem {
  id: string;
  x: number;
  y: number;
  rows: number;
  cols: number;
  sheetType: LayoutChartType;
  chartType: string;
  chartId: number;
  isEChart: boolean;
  data: {
    title: string;
    sheetTagName: string;
  };
  chartOptions: Record<string, any>;
  echartOptions: Record<string, any>;
  customizeOptions: LayoutCustomizeOptions;
  column_Data: any[];
  row_Data: any[];
  chartData: any[];
  numberFormat: LayoutNumberFormat;
  kpiData?: Record<string, any> | null;
}

@Component({
  selector: 'app-genie-aiq-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgbModule,NgSelectModule,SharedModule,RouterModule],
  templateUrl: './genie-aiq-dashboard.component.html',
  styleUrl: './genie-aiq-dashboard.component.scss',
  providers: [TemplateDashboardService]

})
export class GenieAiqDashboardComponent {
  // @ViewChild('sheetcontainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  
  step: number = 1;

  tables: string[] = [];
  selectedTables: string[] = [];

  suggestedInsights:any[] = [];
  selectedInsights: any[] = [];
  connectionList: any[] = [];
  selectedConnection: any = null;
  schematableList = [] as any[];
  hierarchyId:any;
  selectedCard: string = 'prompt'; // default selection
  eChartInstance!: InsightEchartComponent;
  apexChartInstance!: InsightApexComponent;
  dashboardName: string = '';
  dashboardTagName: string = '';

  private readonly defaultCustomizeOptions: LayoutCustomizeOptions = {
    backgroundColor: '#ffffff',
    color: '#2392c1',
    selectedColorScheme: ['#1d2e92', '#088ed2'],
    isMeasureDistribution: false,
    xLabelSwitch: true,
    yLabelSwitch: true,
    xLabelFontSize: 12,
    yLabelFontSize: 12,
    xLabelFontFamily: 'sans-serif',
    yLabelFontFamily: 'sans-serif',
    xlabelFontWeight: 400,
    ylabelFontWeight: 400,
    dimensionAlignment: 'center',
    measureAlignment: 'center',
    gridColor: '#e0e0e0',
    xGridSwitch: true,
    yGridSwitch: true,
    barCornerRadius: 4,
    dataLabels: true,
    dataLabelsFontSize: 12,
    dataLabelsFontFamily: 'sans-serif',
    dataLabelsColor: '#2392c1',
    isBold: false,
    dataLabelsFontPosition: 'top',
    legendSwitch: true,
    legendsAllignment: 'bottom',
    donutSize: 70,
    donutDecimalPlaces: 2,
  };

  private readonly defaultNumberFormat: LayoutNumberFormat = {
    decimalPlaces: 2,
    prefix: '',
    suffix: '',
  };

  private coerceRecord(input: any): Record<string, any> {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return {};
    }
    try {
      return typeof structuredClone === 'function'
        ? structuredClone(input)
        : JSON.parse(JSON.stringify(input));
    } catch {
      return { ...input };
    }
  }

  private normalizeLayoutItems(items: any[]): LayoutItem[] {
    if (!Array.isArray(items)) {
      console.warn('LLM did not return an array. Falling back to empty layout.');
      return [];
    }

    return items
      .map((item: any, index: number) => {
        const sanitizedId = typeof item?.id === 'string' && item.id.trim() ? item.id : this.generateLayoutId(index);
        const x = Number.isFinite(item?.x) ? Number(item.x) : 0;
        const y = Number.isFinite(item?.y) ? Number(item.y) : Math.floor(index / 2) * 8;
        const rows = Number.isFinite(item?.rows) && item.rows > 0 ? Number(item.rows) : 8;
        const cols = Number.isFinite(item?.cols) && item.cols > 0 ? Number(item.cols) : 6;
        const sheetType = (item?.sheetType ?? 'Chart') as LayoutChartType;
        const chartType = typeof item?.chartType === 'string' ? item.chartType : 'bar';
        const chartId = Number.isFinite(item?.chartId) ? Number(item.chartId) : 6;
        const chartOptions = this.coerceRecord(item?.chartOptions);
        const echartOptions = this.coerceRecord(item?.echartOptions);
        const isEChart =
          typeof item?.isEChart === 'boolean'
            ? item.isEChart
            : Object.keys(echartOptions).length > 0;
        const title = item?.data?.title ?? 'Untitled Chart';
        const sheetTagName = item?.data?.sheetTagName ?? `<p>${title}</p>`;

        const customizeOptions: LayoutCustomizeOptions = {
          ...this.defaultCustomizeOptions,
          ...(item?.customizeOptions ?? {}),
        };

        const numberFormat: LayoutNumberFormat = {
          ...this.defaultNumberFormat,
          ...(item?.numberFormat ?? {}),
        };

        return {
          id: sanitizedId,
          x,
          y,
          rows,
          cols,
          sheetType,
          chartType,
          chartId,
          isEChart,
          data: {
            title,
            sheetTagName,
          },
          chartOptions,
          echartOptions,
          customizeOptions,
          column_Data: item?.column_Data ?? item?.columnData ?? [],
          row_Data: item?.row_Data ?? item?.rowData ?? [],
          chartData: item?.chartData ?? [],
          numberFormat,
          kpiData: item?.kpiData ?? null,
        } as LayoutItem;
      })
      .filter((item) => !!item);
  }

  private applyDashboardLayout(layout: any[]): void {
    const normalized = this.normalizeLayoutItems(layout);
    if (!normalized.length) {
      this.toasterService.warning('Could not build layout from AI response. Showing empty dashboard.');
    }
    this.dash1 = normalized;
    this.showDashboardView = normalized.length > 0;
  }

  private sanitizePrompt(prompt: string): string {
    return prompt.replace(/\s+/g, ' ').trim();
  }

  private generateLayoutId(index: number): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `chart-${Date.now()}-${index}`;
  }

    @ViewChild('sheetcontainer', { read: ViewContainerRef }) container!: ViewContainerRef;
 chatHistory: ChatMessage[] = [];

  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  constructor(private workbechService:WorkbenchService, private toasterService:ToastrService, private templateDashboardService:TemplateDashboardService, private openAi: OpenaiService, private loaderService:LoaderService, private router:Router){

  }
  ngOnInit(){
    this.step = 1;
    console.log(this.step);
    this.getConnectionList();
  }

  getConnectionList(){
    const Obj ={ 
      need_pagination:false
    }
    this.workbechService.getdatabaseConnectionsList(Obj).subscribe({
      next:(data)=>{
        this.connectionList = data;
        this.groupConnectionsByServerType();
      },
      error:(error)=>{
        console.log(error);
        this.toasterService.error(error.error.message,'error',{ positionClass: 'toast-top-right'});
      }
    })
  }
  groupedConnections: { [key: string]: any[] } = {};
  serverTypes: string[] = [];
  displayNamesForType: any[] = [];
  selectedServerType: string = '';
  groupConnectionsByServerType() {
  this.groupedConnections = {};
  this.serverTypes = [];
  if (this.connectionList && this.connectionList.length) {
    this.connectionList.forEach((conn: any) => {
      const type = conn.server_type;
      if (!this.groupedConnections[type]) {
        this.groupedConnections[type] = [];
        this.serverTypes.push(type);
      }
      this.groupedConnections[type].push(conn);
    });
  }
}
onServerTypeSelect(type: string) {
  this.selectedServerType = type;
  this.selectedConnection = null; // Clear old selection
  this.displayNamesForType = this.groupedConnections[type] || [];
}
  onConnect() {
  const obj ={
    hierarchy_ids:[this.hierarchyId]
  }
  this.schematableList = [];
  this.workbechService.getSchemaTablesFromConnectedDb(obj).subscribe({
    next: (data) => {
      let allTables: any[] = [];
      data.forEach((dataTest: any) => {
        if (dataTest?.data?.schemas && dataTest?.data?.schemas.length > 0) {
          const tablesArr = dataTest?.data?.schemas[0]?.tables || [];
          allTables = allTables.concat(tablesArr);
        }
      });
      this.schematableList = allTables;
      this.tables = allTables.map(tbl => tbl.table); // Extract table names
      // this.step = 2;
      console.log('All tables:', this.tables);
      console.log('schematableList:', this.schematableList);
    },
    error: (error) => {
      console.log(error);
      this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
    }
})
  }
  onTableSelect(promptOverride?: string) {
    if (this.selectedTables && this.selectedTables.length > 0) {
      // Get schema names for selected tables
      // const selectedTableObjects = this.schematableList.filter((tbl: any) => this.selectedTables.includes(tbl.table));
      // // Build joining_tables payload: [schema, table, table]
      // const joining_tables = selectedTableObjects.map((tbl: any) => [tbl.schema, tbl.table, tbl.table]);
      // // Build dragged_array payload
      // const dragged_array = selectedTableObjects.map((tbl: any) => ({
      //   schema: tbl.schema,
      //   table: tbl.table,
      //   alias: tbl.table,
      //   columns: tbl.columns
      // }));
      // console.log('Selected tables:', this.selectedTables);
      // console.log('Corresponding schemas:', selectedTableObjects.map((tbl: any) => tbl.schema));
      // console.log('joining_tables payload:', joining_tables);
      // console.log('dragged_array payload:', dragged_array);

      // const Obj = {
      //     "hierarchy_id":this.hierarchyId,
      //     "query_set_id":null,
      //     "joining_tables":joining_tables,
      //     "join_type":[],
      //     "joining_conditions":[],
      //     "dragged_array":dragged_array,
      //     "is_smart_dashboard":false
      // }
       const selectedTableNames = this.selectedTables.slice();
    console.log('Selected table names:', selectedTableNames);
      const sanitizedPrompt = this.sanitizePrompt(promptOverride ?? this.userPrompt ?? '');
      const Obj= {
         "hierarchy_id":this.hierarchyId,
         "table_name":selectedTableNames,
         "prompt": sanitizedPrompt || null,
        }
      this.workbechService.getChartSuggestions(Obj).subscribe({
      next:(data)=>{
      console.log(data);
      this.suggestedInsights = data.sheet_suggestions.data;
      this.selectedInsights = [];
      this.step = 2;
      },
      error:(error)=>{
        console.log(error);
        this.toasterService.error(error.error.message,'error',{ positionClass: 'toast-top-right'});
      }
    })
    }
  }
selectInsight(insight: any) {
  if (!this.selectedInsights.some(i => i.sample_id === insight.sample_id)) {
    this.selectedInsights.push(insight);
  }
}

removeSelectedInsight(insight: any) {
  this.selectedInsights = this.selectedInsights.filter(i => i.sample_id !== insight.sample_id);
}

isInsightSelected(insight: any): boolean {
  return this.selectedInsights.some(i => i.sample_id === insight.sample_id);
}

  goBack() {
    if (this.step > 1) {
      this.step--;
      // Optionally clear selections when going back
      if (this.step === 1) {
        this.selectedTables = [];
        this.tables = [];
      }
      if (this.step === 2) {
        this.selectedInsights = [];
      }
    }
  }
  generateDashboard() {
    if (!this.selectedInsights.length) {
      this.toasterService.error('Please select at least one chart to generate dashboard', 'Error');
      return;
    }
    const queryset_id = this.suggestedInsights[0]?.queryset_id || null;
    const hierarchy_id = this.suggestedInsights[0]?.hierarchy_id || this.hierarchyId || null;
    const sheet_data = this.selectedInsights.map((insight: any) => ({
      col: insight.col || [],
      row: insight.row || [],
      pivot_measure: insight.pivot_measure || [],
      is_date: false,
      chart_id: insight.chart_id,
      chart_title: insight.chart_title,
      chart_type: insight.chart_type
    }));
    const payload = {
      queryset_id,
      hierarchy_id,
      sheet_data,
      dashboard_name: 'Genie AIQ Dashboard'
    };
     this.workbechService.getDashbaordSuggestions(payload).subscribe({
      next:(data)=>{
      console.log(data);
      this.templateDashboardService.buildSampleGieneAiqDashbaord(this.container,this.hierarchyId.hierarchy_id, data);
      this.step = 3;
      },
      error:(error)=>{
        console.log(error);
        this.toasterService.error(error.error.message,'error',{ positionClass: 'toast-top-right'});
      }
    })

    console.log('Dashboard payload:', payload);
    // Call your API here if needed
  }
  userPrompt: string = '';

  sendPrompt() {
  if (!this.userPrompt || !this.userPrompt.trim()) {
    this.toasterService.error('Please enter a prompt', 'Error');
    return;
  }
  const sanitizedPrompt = this.sanitizePrompt(this.userPrompt);
  console.log('User prompt:', sanitizedPrompt);
  this.onTableSelect(sanitizedPrompt);
  this.userPrompt = '';
}






  // datasources = [
  //   { value: 'postgres', label: 'PostgreSQL', desc: 'Advanced open-source relational database' },
  //   { value: 'mysql', label: 'MySQL', desc: 'Popular relational database' },
  //   { value: 'mongo', label: 'MongoDB', desc: 'NoSQL document database' }
  // ];
  showDatasource = false;

  toggleDatasource() {
    this.showDatasource = !this.showDatasource;
  }
 selectDatasource(data:any) {
  this.hierarchyId = data.hierarchy_id;
  this.selectedConnection = data;
  this.onConnect();
 }
 selectCard(card: string) {
  this.selectedCard = card;
}
isCreateDisabled(): boolean {
  if (this.selectedCard === 'prompt' && !this.userPrompt.trim()) {
    return true;
  }
  return false;
}
showDashboardView = false;
dash1: any = [];
promptDashboard(){
  const sanitizedPrompt = this.sanitizePrompt(this.userPrompt ?? '');
  if (!sanitizedPrompt) {
    this.toasterService.error('Please enter a prompt', 'Error');
    return;
  }
  const payload ={
    h_id: this.hierarchyId,
    question: sanitizedPrompt
  }
    this.workbechService.promptDashboard(payload).subscribe({
      next:(data)=>{
      console.log(data);
      // if(this.datafromApi){
      //   this.buildDashboardprocess(this.datafromApi);
      // }

        // const data = [
        //   {
        //     "sheet_name": "Sheet Data Overview",
        //     "sql_query": "SELECT \"chart_id\", count(\"chart_id\") FROM (select * from sheet_data) temp_table GROUP BY \"chart_id\" ORDER BY \"chart_id\" ASC NULLS FIRST",
        //     "dimensions": [
        //       "chart_id"
        //     ],
        //     "metrics": [
        //       "count(chart_id)"
        //     ],
        //     "chart_type": "bar",
        //     "chart_id": 6,
        //     "is_echart": true,
        //     "sheet_data": "",
        //     "structure_valid": true,
        //     "col_data": [
        //       {
        //         "orginal_column": "chart_id",
        //         "data_type": "int",
        //         "type": ""
        //       }
        //     ],
        //     "row_data": [
        //       {
        //         "orginal_column": "chart_id",
        //         "data_type": "int",
        //         "type": "count"
        //       }
        //     ],
        //     "columns": [
        //       {
        //         "column": "chart_id",
        //         "result": [
        //           1,
        //           2,
        //           3,
        //           4,
        //           5,
        //           6,
        //           7,
        //           8,
        //           9,
        //           10,
        //           11,
        //           12,
        //           13,
        //           14,
        //           17,
        //           18,
        //           24,
        //           25,
        //           26,
        //           27,
        //           28,
        //           29
        //         ]
        //       }
        //     ],
        //     "rows": [
        //       {
        //         "column": "count(chart_id)",
        //         "result": [
        //           289,
        //           65,
        //           78,
        //           62,
        //           1,
        //           295,
        //           8,
        //           4,
        //           5,
        //           224,
        //           1,
        //           65,
        //           12,
        //           2,
        //           34,
        //           6,
        //           184,
        //           1215,
        //           64,
        //           97,
        //           2,
        //           71
        //         ]
        //       }
        //     ]
        //   },
        //   {
        //     "sheet_name": "Top Sheet Users",
        //     "sql_query": "SELECT \"user_id\", count(\"chart_id\") FROM (select * from sheet_data) temp_table GROUP BY \"user_id\" ORDER BY count(\"chart_id\") DESC",
        //     "dimensions": [
        //       "user_id"
        //     ],
        //     "metrics": [
        //       "count(chart_id)"
        //     ],
        //     "chart_type": "line",
        //     "chart_id": 13,
        //     "is_echart": false,
        //     "sheet_data": "",
        //     "structure_valid": true,
        //     "columns": [
        //       {
        //         "column": "user_id",
        //         "result": [
        //           12,
        //           1,
        //           17,
        //           10,
        //           62,
        //           73,
        //           15,
        //           4,
        //           2,
        //           78,
        //           70,
        //           50,
        //           3,
        //           6,
        //           74,
        //           42,
        //           7,
        //           75,
        //           32,
        //           26,
        //           64,
        //           48,
        //           44,
        //           43,
        //           71,
        //           5,
        //           27,
        //           28,
        //           25,
        //           45,
        //           49,
        //           36,
        //           56,
        //           35,
        //           9,
        //           21,
        //           14,
        //           18,
        //           72,
        //           30,
        //           34,
        //           57,
        //           37,
        //           19,
        //           40,
        //           76,
        //           8,
        //           47,
        //           51,
        //           31,
        //           23,
        //           11,
        //           61,
        //           33,
        //           58,
        //           38,
        //           24,
        //           77,
        //           46,
        //           22,
        //           13,
        //           41,
        //           59,
        //           29,
        //           69,
        //           20
        //         ]
        //       }
        //     ],
        //     "rows": [
        //       {
        //         "column": "count(chart_id)",
        //         "result": [
        //           282,
        //           153,
        //           87,
        //           72,
        //           58,
        //           53,
        //           53,
        //           48,
        //           48,
        //           44,
        //           42,
        //           39,
        //           38,
        //           38,
        //           36,
        //           35,
        //           35,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           34,
        //           22,
        //           3
        //         ]
        //       }
        //     ]
        //   }
        // ]
        this.datafromApi = [];
        this.datafromApi = data.dashboard;
        this.loaderService.show();
        this.openAi.getChartOptions(data.dashboard.sheets)
          .then(chartOptions => {
            console.log("Chart Options:", chartOptions);

            // Assign result
            this.applyDashboardLayout(chartOptions);
            this.loaderService.hide();
          })
          .catch(err => {
            console.error("Error fetching chart options", err);
            this.loaderService.hide();
          });
      },
      error:(error)=>{
        console.log(error);
        this.toasterService.error(error.error.message,'error',{ positionClass: 'toast-top-right'});
      }
    })
}
customizeDashboard(){
  const data = this.dash1;
  this.loaderService.show();
  const sanitizedPrompt = this.sanitizePrompt(this.userPrompt ?? '');
  const enrichedPrompt = sanitizedPrompt
    ? `${sanitizedPrompt}. Do not remove unrelated charts; only update the charts that match the request.`
    : 'Do not remove unrelated charts; only update the charts that match the request.';
  this.openAi.getChartOptions(data, enrichedPrompt)
  .then(chartOptions => {
    console.log("Chart Options:", chartOptions);

    // Assign result
    this.applyDashboardLayout(chartOptions);
    this.loaderService.hide();
  })
  .catch(err => {
    console.error("Error fetching chart options", err);
    this.loaderService.hide();
  });


   if (!sanitizedPrompt) return;
    const currentPrompt = sanitizedPrompt;
    // Push user message
    this.chatHistory.push({
      sender: 'User',
      text: sanitizedPrompt,
      timestamp: new Date()
    });

    // Simulate AI response (replace with real API call)
    setTimeout(() => {
      this.chatHistory.push({
        sender: 'AI',
        text: `Got it! I’ll process: "${currentPrompt}"`,
        timestamp: new Date()
      });
      this.scrollToBottom();
    }, 800);

    this.userPrompt = '';
    this.scrollToBottom();
}

  private scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }


buildDashboardprocess(datafromApi:any){

  this.genarateQuerysetId(datafromApi)

}
querySetId:any
genarateQuerysetId(data:any){
  const obj={
    database_id: this.hierarchyId,
    custom_query: data?.queryset?.custom_query,
  }
this.workbechService.executeQuery(obj).subscribe({
  next:(data)=>{
    console.log(data);
    this.querySetId = data.query_set_id;
    this.builSheets(this.datafromApi.sheets, this.dash1);
  }
})
}
builSheets(data:any, dashboard:any){
  let sheetIds : any = [];
  from(dashboard).pipe(
    concatMap((sheetData: any, index: number) =>
      this.sheetSave(sheetData, data[index], index).pipe(
        map(res => ({ res, index }))
      )
    )
  ).subscribe({
    next: ({ res, index }) => {
      console.log("Sheet saved:", res);
      sheetIds.push(res.sheet_id);
      this.dash1[index].sheetId = res.sheet_id; 
    },
    error: (err) => console.error("Error saving sheet:", err),
    complete: () => {
      console.log("✅ All sheets saved sequentially!")
      this.dashboardSave(sheetIds);
    }
  });
}
datafromApi :any={};

  sheetSave(sheetData: any, data: any, index:any) {
    let chartsColumnData: [] = [];
    let chartsRowData: [] = [];
    let dualAxisRowData: [] = [];
    let dualAxisColumnData: [] = [];
    let chartData: any = {};
    if (sheetData.chart_id == 8) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.multiLineChart(dualAxisColumnData, dualAxisRowData);
      } else{
        chartData = this.apexChartInstance.multiLineChart(dualAxisColumnData, dualAxisRowData);
      }
    } else if (sheetData.chart_id == 24) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.pieChart(chartsColumnData, chartsRowData);
      } else{
        chartData = this.apexChartInstance.pieChart(chartsColumnData, chartsRowData);
      }
    } else if (sheetData.chart_id == 6) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.barChart(chartsColumnData, chartsRowData);
      } else{
        chartData = this.apexChartInstance.barChart(chartsColumnData, chartsRowData);
      }
    } else if (sheetData.chart_id == 3) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.hgroupedChart(dualAxisColumnData, dualAxisRowData);
      } else{
        chartData = this.apexChartInstance.hGroupedChart(dualAxisColumnData, dualAxisRowData);
      }
    } else if (sheetData.chart_id == 10) {
      // this.echartInstance.donutSize = this.customizeOptions.donutSize;
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.donutChart(chartsColumnData, chartsRowData);
      } else{
        chartData = this.apexChartInstance.donutChart(chartsColumnData, chartsRowData);
      }
    } else if (sheetData.chart_id == 7) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.sidebySide(dualAxisColumnData, dualAxisRowData);
      } else{
        chartData = this.apexChartInstance.sideBySide(dualAxisColumnData, dualAxisRowData);
      }
    } else if (sheetData.chart_id == 27) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.funnelchart(dualAxisColumnData, dualAxisRowData);
      } else{
        chartData = this.apexChartInstance.funnelChart(dualAxisColumnData, dualAxisRowData);
      }
    } else if (sheetData.chart_id == 29) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.mapChart(dualAxisColumnData, dualAxisRowData, chartsRowData);
      }
    } else if (sheetData.chart_id == 2) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.hstackedChart(dualAxisColumnData, dualAxisRowData);
      } else{
        chartData = this.apexChartInstance.hStockedChart(dualAxisColumnData, dualAxisRowData);
      }
    } else if (sheetData.chart_id == 13) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.linechartFromGenieDashboard(chartsColumnData, chartsRowData);
      } else{
        chartData = this.apexChartInstance.lineChart(chartsColumnData, chartsRowData);
      }
    } else if (sheetData.chart_id == 17) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.areachartFromGenieDashboard(chartsColumnData, chartsRowData);
      } else{
        chartData = this.apexChartInstance.areaChart(chartsColumnData, chartsRowData);
      }
    } else if (sheetData.chart_id == 4) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.barLinechartFromGenieDashboard(dualAxisColumnData, dualAxisRowData);
      } else{
        chartData = this.apexChartInstance.barLineChart(dualAxisColumnData, dualAxisRowData);
      }
    } else if (sheetData.chart_id == 26) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.heatmapFromGenieDashboard(dualAxisColumnData, dualAxisRowData);
      } else{
        chartData = this.apexChartInstance.heatMapChart(dualAxisColumnData, dualAxisRowData);
      }
    } else if (sheetData.chart_id == 18) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.treemapFromGenieDashboard(chartsColumnData, chartsRowData);
      } else{
        chartData = this.apexChartInstance.treeMapChart(chartsColumnData, chartsRowData);
      }
    } else if (sheetData.chart_id == 5) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.stackedchartFromGenieDashboard(dualAxisColumnData, dualAxisRowData);
      } else{
        chartData = this.apexChartInstance.stockedChart(dualAxisColumnData, dualAxisRowData);
      }
    } else if (sheetData.chart_id == 11) {
      if(sheetData?.isEChart){
        chartData = this.eChartInstance.calendarchartFromGenieDashboard(chartsColumnData, chartsRowData);
      }
    } else if (sheetData.chart_id == 14) {
      if(sheetData?.isEChart){
        this.eChartInstance.autoAdjustChartHeightForHBar();
        chartData = this.eChartInstance.horizontalBarChart(chartsColumnData, chartsRowData);
      } else{
        this.apexChartInstance.autoAdjustChartHeightForHBar();
        chartData = this.apexChartInstance.horizontalBarChart(chartsColumnData, chartsRowData);
      }
    } else if (sheetData.chart_id == 12) {
       if(sheetData?.isEChart){
        chartData = this.eChartInstance.radarchartFromGenieDashboard(dualAxisColumnData, dualAxisRowData);
      }
    }

    const sheetRows = data.rows.map((item: any) => {
      return {
        column: item.column,
        data_type: item.data_type,
        type: item.type[0] ? item.type[0] : ""
      };
    });
    const sheetColumns = data.columns.map((item: any) => {
      return {
        column: item.column,
        data_type: item.data_type,
        type: item.type[0] ? item.type[0] : ""
      };
    });
    const sheet_rows_data = data.rows.map((item: any) => {
      return [
        item.column,
        item.type ? "aggregate" : item.data_type,
        item.type[0] ? item.type[0] : "",
        ""
      ];
    });
    const sheet_column_data = data.columns.map((item: any) => {
      return [
        item.column,
        item.data_type,
        (item?.type[0] ? item?.type[0] : "") ?? "",
        ""
      ];
    });

    const obj = {
      "chart_id": sheetData.chartId,
      "queryset_id": this.querySetId,
      "server_id": this.hierarchyId,
      "sheet_name": sheetData.data.title,
      "sheet_tag_name": sheetData.data.sheetTagName,
      "filter_id": [],
      "sheetfilter_querysets_id": null,
      "filter_data": [],
      "datasource_querysetid": null,
      "col": data.dimensions,
      "row": data.metrics,
      "custom_query": data.sql_query,
      "data": {
        "columns": sheetColumns,
        "columns_data": sheet_column_data,
        "col": data.columns.map((col:any)=>{ return {column: col.column, result_data: col.result} }),
        "row": data.rows.map((col:any)=>{ return {column: col.col, result_data: col.result} }),
        "rows": sheetRows,
        "rows_data": sheet_rows_data,
        "results": {
          "kpiData": '',
          "kpiFontSize": 3,
          "kpiNumber": '',
          "kpiPrefix": "",
          "kpiSuffix": "",
          "kpiDecimalPlaces": 2,
          "kpiDecimalUnit": "none",
          "tableData": [],
          "tableColumns": [],
          "banding": false,
          "color1": "#f5f5f5",
          "color2": "#ffffff",
          "items_per_page": 10,
          "total_items": 0
        },
        "isApexChart": sheetData.isEChart ? false : true,
        "isEChart": sheetData.isEChart,
        "savedChartOptions": chartData,
        "customizeOptions": sheetData.customizeOptions
      }
    }

    this.dash1[index].qrySetId = this.querySetId;
    this.dash1[index].databaseId = this.hierarchyId;
    return this.workbechService.sheetSave(obj);
  }

  dashboardSave(sheetIds: any){
    let object = {
      "grid": "fixed",
      "height": 800,
      "width": 800,
      "queryset_id": [this.querySetId],
      "server_id": [this.hierarchyId],
      "sheet_ids": sheetIds,
      "selected_sheet_ids": sheetIds,
      "dashboard_name": this.dashboardName,
      "dashboard_tag_name": this.dashboardTagName,
      "data": this.dash1,
      "tab_data": [],
      "tab_id": [],
      "donutDecimalPlaces": 2
    }

    this.workbechService.saveDashboard(object).subscribe({
    next: (res) => {
      console.log("✅ Dashboard saved successfully:", res);
      const encodedDashboardId = btoa(res.dashboard_id.toString());

      this.router.navigate(['/analytify/home/sheetsdashboard/'+encodedDashboardId])
      // you can show toast/notification here
    },
    error: (err) => {
      console.error("❌ Error saving dashboard:", err);
    }
  });
  }  

  getDashboardData(event : any){
    this.dashboardName = event.dashboardName;
    this.dashboardTagName = event.dashboardTagName;

    this.buildDashboardprocess(this.datafromApi);
  }
}


export interface ChatMessage {
  sender: 'User' | 'AI';
  text: string;
  timestamp: Date;
}