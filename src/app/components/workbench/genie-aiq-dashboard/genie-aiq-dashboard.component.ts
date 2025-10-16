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
import { concatMap, from, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { base64DecodeUtf8 } from '../../../services/base64';
import { DashboardTransferService } from '../../../services/dashboard-transfer.service';
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

    @ViewChild('sheetcontainer', { read: ViewContainerRef }) container!: ViewContainerRef;
 chatHistory: ChatMessage[] = [];

  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  constructor(private workbechService:WorkbenchService, private toasterService:ToastrService, private templateDashboardService:TemplateDashboardService, private openAi: OpenaiService, private loaderService:LoaderService, private router:Router,private http: HttpClient,private dashbaordTransferService:DashboardTransferService){

  }
  ngOnInit(){
    this.step = 1;
    console.log(this.step);
    this.getConnectionList();
    this.getOpenAiKey();
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
  onTableSelect() {
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
      const Obj= {
         "hierarchy_id":this.hierarchyId,
         "table_name":selectedTableNames,
         "prompt": this.userPrompt ? this.userPrompt : null,
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
  console.log('User prompt:', this.userPrompt);
  // Call your API or handle the message sending logic here
  this.userPrompt = ''; // Clear input after sending
  this.onTableSelect();
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

allChartOptions: { [title: string]: any } = {};

promptDashboard(){
  const selectedTableNames = this.selectedTables.slice();
  const payload ={
    h_id: this.hierarchyId,
    tables:selectedTableNames,
    question:this.userPrompt
  }
    this.workbechService.promptDashboard(payload).subscribe({
      next:(data)=>{
      console.log(data);
        this.datafromApi = [];
        this.datafromApi = data;
        // this.storeDashbaord_data = data.
        this.jsonTosendBackToAPI();
        this.dashboardName = this.datafromApi.dashboard.dashboard.dashboard_title;
        this.buildGenieDashbaordJson();
      },
      error:(error)=>{
        console.log(error);
        this.toasterService.error(error.error.message,'error',{ positionClass: 'toast-top-right'});
      }
    })
}

buildGenieDashbaordJson(){
      this.datafromApi.dashboard_json = this.datafromApi.dashboard_json.map((chartItem:any) => {
      const title = chartItem?.data?.title?.trim();
      const sheet = this.datafromApi.dashboard_data.sheets.find((s:any) => s.sheet_name === title);

      if (!sheet) return chartItem; // no matching sheet found

  const xAxisCategories = sheet.columns?.[0]?.result || [];
    const multiSeriesChartData = sheet.rows?.map((row: any) => ({
      name: row.metric_name || row.name || 'Series',
      data: row.result || [],
    })) || [];

    let updatedOptions: any = {};

    // ✅ Skip service for Table (1) and KPI (25)
    if (chartItem.chartId === 1) {
     const headers = [
        ...(sheet.columns?.map((col: any) => col.column) || []),
        ...(sheet.rows?.map((row: any) => row.column) || [])
      ];
      const columnsData = sheet.columns || [];
      const rowsData = sheet.rows || [];

      const combined = [...columnsData, ...rowsData];

      const rows = combined[0]?.result?.map((_: any, index: number) => {
        const obj: any = {};
        combined.forEach((item: any) => {
          obj[item.column] = item.result[index];
        });
        return obj;
      }) || [];

      console.log(rows);

      updatedOptions = {
        ...chartItem,
        tableData: {
          ...chartItem?.tableData,
          headers: headers,
          rows: rows
        }
      };
      } else if (chartItem.chartId === 25) {
      const firstMetric = multiSeriesChartData[0];
      const kpiValue = firstMetric?.data?.[0] ?? 0;

      updatedOptions = {
        ...chartItem,
        kpiData: {
          ...chartItem?.kpiData,
          kpiNumber: kpiValue, // only update value, keep rest (label, prefix, suffix)
          rows:[{
            col: firstMetric?.name || 'Metric',
            result_data: [kpiValue]
          }]
        }
      };

    } else {
      // --- Other chart types use the service ---
      updatedOptions = this.dashbaordTransferService.updateChartOptions(
        chartItem.isEChart ? chartItem.echartOptions : chartItem.chartOptions,
        chartItem.chartId,
        !chartItem.isEChart, // isApexChart = true if not EChart
        xAxisCategories,
        multiSeriesChartData
      );
    }


      // ✅ Store locally (optional)
      this.allChartOptions[title] = updatedOptions;

      // ✅ Replace inside dashboard_json
      if(chartItem.chartId === 1){
        return { ...chartItem, tableData: updatedOptions.tableData };
      }
      else if(chartItem.chartId === 25){
        return { ...chartItem, kpiData: updatedOptions.kpiData };
      }
      else if (chartItem.isEChart) {
        return { ...chartItem, echartOptions: updatedOptions };
      } else {
        return { ...chartItem, chartOptions: updatedOptions };
      }
    });
    console.log('Updated dashboard_json:', this.datafromApi.dashboard_json);

this.dash1 = this.datafromApi.dashboard_json;
            this.showDashboardView = true;

             if (!this.userPrompt.trim()) return;
            const currentPrompt = this.userPrompt;
            // Push user message
            this.chatHistory.push({
              sender: 'User',
              text: this.userPrompt,
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
            this.loaderService.hide();
}
responceTosendBackToApi:any;
jsonTosendBackToAPI(){
  
  // Method to clean response
    // Create a shallow copy to avoid mutating original
    // const cleaned = { ...this.datafromApi };

    // // Remove unwanted keys if they exist
    // delete cleaned.dashboard_data;
    // delete cleaned.dashboard_json;
    // delete cleaned.tables;
    // delete cleaned.status;
    const cleaned = this.datafromApi?.dashboard 
    ? { dashboard: this.datafromApi.dashboard }
    : {};
   this.responceTosendBackToApi = cleaned.dashboard;
  console.log('Cleaned response to send back to API:', this.responceTosendBackToApi);
  return cleaned;

  //   try {
  //   // Step 1: Parse the inner JSON (string to object)
  //   const parsedJson = JSON.parse(this.datafromApi);

  //   // Step 2: Remove unwanted keys recursively
  //   const cleanedJson = this.removeKeys(parsedJson, ['dashboard_data', 'dashboard_json', 'tables']);

  //  this.responceTosendBackToApi = cleanedJson

  //   return cleanedJson; // ✅ Ready to send as normal JSON object
  // } catch (e) {
  //   console.error('Invalid JSON format in API response:', e);
  //   return null;
  // }
}
// removeKeys(obj: any, keysToRemove: string[]): any {
//   if (Array.isArray(obj)) {
//     return obj.map(item => this.removeKeys(item, keysToRemove));
//   } else if (typeof obj === 'object' && obj !== null) {
//     const cleaned: any = {};
//     for (const key of Object.keys(obj)) {
//       if (!keysToRemove.includes(key)) {
//         cleaned[key] = this.removeKeys(obj[key], keysToRemove);
//       }
//     }
//     return cleaned;
//   }
//   return obj;
// }

customizeDashboard(){
  this.jsonTosendBackToAPI();
const obj ={
    "question": this.userPrompt,
    "h_id":this.hierarchyId,
    "json":this.responceTosendBackToApi
  }
this.workbechService.promptDetect(obj).subscribe({
  next:(data)=>{
    console.log(data);
     this.datafromApi = data;
    this.buildGenieDashbaordJson();
  }
})
  if (!this.userPrompt.trim()) return;
    const currentPrompt = this.userPrompt; 
    // Push user message
    this.chatHistory.push({
      sender: 'User',
      text: this.userPrompt,
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

// customizeDashboard(){
//   const data = this.dash1;
//   this.loaderService.show();
//   this.openAi.getChartOptions(data, this.openAiKey, this.userPrompt + "/n" + "do not remove any other charts, do update only relative chart only")
//   .then(chartOptions => {
//     console.log("Chart Options:", chartOptions);

//     // Assign result
//     this.dash1 = chartOptions;
//     // this.showDashboardView = true;
//     this.loaderService.hide();
//   })
//   .catch(err => {
//     console.error("Error fetching chart options", err);
//     this.loaderService.hide();
//   });


//    if (!this.userPrompt.trim()) return;
//     const currentPrompt = this.userPrompt; 
//     // Push user message
//     this.chatHistory.push({
//       sender: 'User',
//       text: this.userPrompt,
//       timestamp: new Date()
//     });

//     // Simulate AI response (replace with real API call)
//     setTimeout(() => {
//       this.chatHistory.push({
//         sender: 'AI',
//         text: `Got it! I’ll process: "${currentPrompt}"`,
//         timestamp: new Date()
//       });
//       this.scrollToBottom();
//     }, 800);

//     this.userPrompt = '';
//     this.scrollToBottom();
// }

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
    custom_query: data?.dashboard?.queryset?.custom_query,
    query_name:data?.dashboard?.queryset?.queryset_name
  }
  this.workbechService.executeQuery(obj).subscribe({
    next: (data) => {
      console.log(data);
      this.querySetId = data.query_set_id;
      const object = {
        database_id: this.hierarchyId,
        query_set_id: this.querySetId,
        query_name: data.query_name
      }
      this.workbechService.saveQueryName(object).subscribe({
        next: (data: any) => {
          console.log(data);
          this.builSheets(this.datafromApi.dashboard_data.sheets, this.dash1);
        },
        error: (error: any) => {
          console.log(error);
        }
      })
    }
  });
}
builSheets(data:any, dashboard:any){
  let sheetIds : any = [];
  from(dashboard).pipe(
    concatMap((sheetData: any, index: number) =>
      {
      if (sheetData.chartType === 'text' || sheetData.type === 'text') {
        return of({ res: null, index });
      }
      const currenrSheet = data.find((f:any)=> f.sheet_name === sheetData.data.title);
      return this.sheetSave(sheetData, currenrSheet, index).pipe(
        map(res => ({ res, index }))
      );
    }
      // this.sheetSave(sheetData, data[index], index).pipe(
      //   map(res => ({ res, index }))
      // )
    )
  ).subscribe({
    next: ({ res, index }) => {
      // console.log("Sheet saved:", res);
      // sheetIds.push(res.sheet_id);
      // this.dash1[index].sheetId = res.sheet_id; 

      if (res) {
        console.log("Sheet saved:", res);
        sheetIds.push(res.sheet_id);
        this.dash1[index].sheetId = res.sheet_id;
      }
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

    const sheetRows = data?.rows.map((item: any) => {
      return {
        column: item.column,
        data_type: item.data_type,
        type: item.type[0] ? item.type[0] : ""
      };
    });
    const sheetColumns = data?.columns.map((item: any) => {
      return {
        column: item.column,
        data_type: item.data_type,
        type: item.type[0] ? item.type[0] : ""
      };
    });
    const sheet_rows_data = data?.rows.map((item: any) => {
      return [
        item.column,
        item.type ? "aggregate" : item.data_type,
        item.type[0] ? item.type[0] : "",
        ""
      ];
    });
    const sheet_column_data = data?.columns.map((item: any) => {
      return [
        item.column,
        item.data_type,
        (item?.type[0] ? item?.type[0] : "") ?? "",
        ""
      ];
    });

    if(sheetData?.chartId == 25){
      sheetData.customizeOptions.kpiColor = sheetData?.kpiData?.color;
      sheetData.customizeOptions.kpiColorSwitch = true;
      sheetData.customizeOptions.kpiShowTrendline = sheetData?.kpiData?.kpiShowTrendline;
    }

    const obj = {
      "chart_id": sheetData?.chartId,
      "queryset_id": this.querySetId,
      "server_id": this.hierarchyId,
      "sheet_name": sheetData?.data?.title,
      "sheet_tag_name": sheetData?.data?.sheetTagName,
      "filter_id": [],
      "sheetfilter_querysets_id": null,
      "filter_data": [],
      "datasource_querysetid": null,
      "col": data?.dimensions ?? [],
      "row": data?.metrics ?? [],
      "custom_query": data?.sql_query,
      "data": {
        "columns": sheetColumns ?? [],
        "columns_data": sheet_column_data ?? [],
        "col": data?.columns.map((col:any)=>{ return {column: col.column, result_data: col.result} }) ?? [],
        "row": data?.rows.map((col:any)=>{ return {column: col.column, result_data: col.result} }) ?? [],
        "rows": sheetRows ?? [],
        "rows_data": sheet_rows_data ?? [],
        "results": {
          "kpiData": sheetData?.chartId === 25 ? data?.rows.map((col:any)=>{ return {column: col.column, result_data: col.result[0]} })[0] : [],
          "kpiFontSize": sheetData?.chartId === 25 ? sheetData?.kpiData?.fontSize : 3,
          "kpiNumber": sheetData?.chartId === 25 ? sheetData?.kpiData?.kpiNumber : '',
          "kpiPrefix": sheetData?.chartId === 25 ? sheetData?.kpiData?.kpiPrefix : '',
          "kpiSuffix": sheetData?.chartId === 25 ? sheetData?.kpiData?.kpiSuffix : '',
          "kpiDecimalPlaces": sheetData?.chartId === 25 ? sheetData?.kpiData?.kpiDecimalPlaces : 2,
          "kpiDecimalUnit": "none",
          "kpicolor": sheetData?.chartId === 25 ? sheetData?.kpiData?.color : '#000',
          "kpiShowTrendline": sheetData?.chartId === 25 ? sheetData?.kpiData?.kpiShowTrendline : false,
          "kpiTarget": sheetData?.chartId === 25 ? sheetData?.kpiData?.kpiTarget : '',
          "trendData": sheetData?.chartId === 25 ? sheetData?.kpiData?.trendData : [],
          "trendLabels": sheetData?.chartId === 25 ? sheetData?.kpiData?.trendLabels : [],
          "indicatorIsIncreased": sheetData?.chartId === 25 ? sheetData?.kpiData?.indicatorIsIncreased : 'up',
          "indicatorValue": sheetData?.chartId === 25 ? sheetData?.kpiData?.indicatorValue : '',
          "showKpiIndicator": sheetData?.chartId === 25 ? sheetData?.kpiData?.showKpiIndicator : false,

          "tableData": sheetData?.chartId === 1 ? sheetData?.tableData?.headers : [],  
          "tableColumns": sheetData?.chartId === 1 ? sheetData?.tableData?.rows : [],
          "banding": sheetData?.chartId === 1 ? sheetData?.tableData?.banding : false,
          "color1": sheetData?.chartId === 1 ? sheetData?.tableData?.color1 : "#f5f5f5",
          "color2": sheetData?.chartId === 1 ? sheetData?.tableData?.color2 : "#ffffff",
          "items_per_page": sheetData?.chartId === 1 ? sheetData?.tableData?.tableItemsPerPage : 10,
          "total_items": sheetData?.chartId === 1 ? sheetData?.tableData?.tableTotalItems : 0
        },
        "isApexChart": sheetData?.isEChart ? false : true,
        "isEChart": sheetData?.isEChart,
        "savedChartOptions": chartData,
        "customizeOptions": sheetData?.customizeOptions
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

  saveGeenieDashboard(){
    this.dashboardTagName = this.dashboardName;

    this.buildDashboardprocess(this.datafromApi);
  }

  goBackToGeenieDatasource(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Leaving this page will discard your generated dashboard. Do you still want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go back',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Execute your logic
        this.showDashboardView = false;
        this.dash1 = [];
        this.chatHistory = [];
        this.selectedConnection = null;
        this.selectedTables = [];
      }
    });
  }
  openAiKey:any;
getOpenAiKey(){
    this.workbechService.getOpenAiKey().subscribe({
      next:(data)=>{
      console.log(data);
      this.openAiKey = base64DecodeUtf8(data.data);
    },
      error:(error)=>{
        console.log(error);
                   Swal.fire({
                    icon: 'warning',
                    title: 'Oops!',
                    html: 'You haven\'t configured OpenAI API key.<br><small>Please configure your OpenAI key to continue.</small>',
                    width: '400px',
                    confirmButtonText: 'Go Configure'

                  }).then((result) => {
                    // result.isConfirmed is true if user clicked "OK"
                    if (result.isConfirmed) {
                      this.router.navigate(['/analytify/configure-page/configure']);
                    }
                  });
      }
    })
}
datafromApi1={
    "status": "success",
    "dashboard": {
        "dashboard": {
            "dashboard_title": "Sales Data Dashboard",
            "height": "",
            "width": "",
            "dashboard_data": ""
        },
        "queryset": {
            "custom_query": "SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\"",
            "queryset_name": "Sales Data Dashboard"
        },
        "sheets": [
            {
                "sheet_name": "Revenue by Region",
                "sql_query": "SELECT \"Region\", sum(\"Revenue\") FROM (SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\") temp_table GROUP BY \"Region\" ORDER BY \"Region\" ASC NULLS FIRST",
                "dimensions": [
                    "Region"
                ],
                "metrics": [
                    "sum(Revenue)"
                ],
                "chart_type": "bar",
                "chart_id": 6,
                "sheet_data": ""
            },
            {
                "sheet_name": "Profit Over Time",
                "sql_query": "SELECT \"Date & Time\", sum(\"Profit\") FROM (SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\") temp_table GROUP BY \"Date & Time\" ORDER BY \"Date & Time\" ASC NULLS FIRST",
                "dimensions": [
                    "Date & Time"
                ],
                "metrics": [
                    "sum(Profit)"
                ],
                "chart_type": "line",
                "chart_id": 13,
                "sheet_data": ""
            },
            {
                "sheet_name": "Sales by Channel",
                "sql_query": "SELECT \"Channel\", sum(\"Revenue\") FROM (SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\") temp_table GROUP BY \"Channel\" ORDER BY \"Channel\" ASC NULLS FIRST",
                "dimensions": [
                    "Channel"
                ],
                "metrics": [
                    "sum(Revenue)"
                ],
                "chart_type": "TABLE",
                "chart_id": 1,
                "sheet_data": ""
            },
            {
                "sheet_name": "Total Revenue KPI",
                "sql_query": "SELECT sum(\"Revenue\") FROM (SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\") temp_table",
                "dimensions": [],
                "metrics": [
                    "sum(Revenue)"
                ],
                "chart_type": "KPI",
                "chart_id": 25,
                "sheet_data": ""
            },
            {
                "sheet_name": "Total Profit KPI",
                "sql_query": "SELECT sum(\"Profit\") FROM (SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\") temp_table",
                "dimensions": [],
                "metrics": [
                    "sum(Profit)"
                ],
                "chart_type": "KPI",
                "chart_id": 25,
                "sheet_data": ""
            }
        ],
        "overall_insights": "The dashboard provides insights into revenue distribution by region and channel, profit trends over time, and key performance indicators for total revenue and profit."
    },
    "message": "Dashboard generated successfully",
    "dashboard_data": {
        "dashboard": {
            "dashboard_title": "Sales Data Dashboard",
            "height": "",
            "width": "",
            "dashboard_data": ""
        },
        "queryset": {
            "custom_query": "SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\"",
            "queryset_name": "Sales Data Dashboard"
        },
        "sheets": [
            {
                "sheet_name": "Revenue by Region",
                "sql_query": "SELECT \"Region\", sum(\"Revenue\") FROM (SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\") temp_table GROUP BY \"Region\" ORDER BY \"Region\" ASC NULLS FIRST",
                "dimensions": [
                    "Region"
                ],
                "metrics": [
                    "sum(Revenue)"
                ],
                "chart_type": "bar",
                "chart_id": 6,
                "sheet_data": "",
                "structure_valid": false,
                "structure_error": "Query doesn't follow the required structure",
                "is_echart": false,
                "columns": [
                    {
                        "column": "Region",
                        "result": [
                            "Central",
                            "East",
                            "North",
                            "South",
                            "West"
                        ],
                        "data_type": "String",
                        "type": []
                    }
                ],
                "rows": [
                    {
                        "column": "Revenue",
                        "result": [
                            1007605.4000000001,
                            558180.26,
                            839993.2799999999,
                            1281203.4100000001,
                            1159773.1800000002
                        ],
                        "data_type": "Float64",
                        "type": [
                            "sum"
                        ]
                    }
                ]
            },
            {
                "sheet_name": "Profit Over Time",
                "sql_query": "SELECT \"Date & Time\", sum(\"Profit\") FROM (SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\") temp_table GROUP BY \"Date & Time\" ORDER BY \"Date & Time\" ASC NULLS FIRST",
                "dimensions": [
                    "Date & Time"
                ],
                "metrics": [
                    "sum(Profit)"
                ],
                "chart_type": "line",
                "chart_id": 13,
                "sheet_data": "",
                "structure_valid": false,
                "structure_error": "Query doesn't follow the required structure",
                "is_echart": false,
                "columns": [
                    {
                        "column": "Date & Time",
                        "result": [
                            "2023-01-21T08:39:50",
                            "2023-01-24T12:57:40",
                            "2023-01-27T13:57:13",
                            "2023-01-31T10:16:33",
                            "2023-02-02T08:13:05",
                            "2023-02-03T08:55:43",
                            "2023-02-09T16:49:13",
                            "2023-02-17T14:43:52",
                            "2023-02-18T11:14:51",
                            "2023-02-26T08:43:07",
                            "2023-03-05T08:05:10",
                            "2023-03-09T13:04:22",
                            "2023-03-21T10:59:03",
                            "2023-04-03T08:29:26",
                            "2023-04-07T09:39:57",
                            "2023-04-18T14:36:02",
                            "2023-04-19T16:36:14",
                            "2023-04-20T17:32:29",
                            "2023-04-26T08:29:29",
                            "2023-04-28T08:04:55",
                            "2023-04-28T10:47:40",
                            "2023-04-28T17:53:08",
                            "2023-05-05T13:31:53",
                            "2023-05-08T09:57:32",
                            "2023-05-20T11:47:45",
                            "2023-05-23T11:28:07",
                            "2023-05-28T14:29:08",
                            "2023-06-08T15:38:00",
                            "2023-06-20T10:59:39",
                            "2023-06-25T11:46:07",
                            "2023-07-15T14:42:26",
                            "2023-07-17T15:45:00",
                            "2023-07-25T15:17:54",
                            "2023-07-29T09:39:47",
                            "2023-08-08T17:49:16",
                            "2023-08-17T11:59:07",
                            "2023-08-19T12:56:29",
                            "2023-08-23T13:52:30",
                            "2023-09-06T15:06:06",
                            "2023-09-19T14:59:49",
                            "2023-09-26T09:47:33",
                            "2023-10-12T09:27:17",
                            "2023-10-16T14:43:58",
                            "2023-10-16T16:10:20",
                            "2023-10-27T15:35:23",
                            "2023-11-10T15:44:53",
                            "2023-11-15T09:19:50",
                            "2023-12-02T12:35:25",
                            "2023-12-04T10:41:09",
                            "2023-12-30T12:17:22",
                            "2024-01-06T13:11:59",
                            "2024-01-07T11:27:25",
                            "2024-01-20T12:43:11",
                            "2024-01-21T16:11:31",
                            "2024-01-23T13:23:17",
                            "2024-01-25T09:56:40",
                            "2024-02-01T15:06:47",
                            "2024-02-11T09:36:23",
                            "2024-02-14T12:15:07",
                            "2024-02-15T13:12:58",
                            "2024-02-15T15:56:03",
                            "2024-02-23T12:41:40",
                            "2024-02-26T14:15:23",
                            "2024-03-12T15:41:23",
                            "2024-03-18T08:05:37",
                            "2024-03-22T17:50:41",
                            "2024-03-27T14:29:20",
                            "2024-03-28T09:24:08",
                            "2024-04-06T15:56:59",
                            "2024-04-23T13:47:42",
                            "2024-04-25T15:12:12",
                            "2024-05-12T16:47:18",
                            "2024-05-14T12:04:30",
                            "2024-05-16T17:05:25",
                            "2024-05-26T12:15:29",
                            "2024-06-08T10:32:00",
                            "2024-06-24T16:07:45",
                            "2024-07-26T08:01:29",
                            "2024-07-31T12:50:47",
                            "2024-07-31T13:37:13",
                            "2024-08-04T10:16:30",
                            "2024-08-22T15:50:10",
                            "2024-08-31T10:10:52",
                            "2024-09-05T17:22:08",
                            "2024-10-01T15:09:14",
                            "2024-10-08T17:27:12",
                            "2024-10-09T17:36:10",
                            "2024-10-23T11:26:51",
                            "2024-10-24T09:38:15",
                            "2024-10-28T10:41:29",
                            "2024-11-03T13:17:19",
                            "2024-11-05T15:49:18",
                            "2024-11-11T09:35:01",
                            "2024-11-23T10:09:44",
                            "2024-11-23T16:39:04",
                            "2024-11-25T16:42:55",
                            "2024-12-16T16:28:32",
                            "2024-12-18T13:19:37",
                            "2024-12-26T13:33:35",
                            "2024-12-30T13:16:53"
                        ],
                        "data_type": "DateTime64(3)",
                        "type": []
                    }
                ],
                "rows": [
                    {
                        "column": "Profit",
                        "result": [
                            7273.68,
                            5303.57,
                            9016.14,
                            5291.26,
                            12673.2,
                            246349.64,
                            5931.54,
                            200390.51,
                            12098.32,
                            9795.57,
                            7486.13,
                            8549.97,
                            8234.19,
                            10676.15,
                            10408.77,
                            13002.37,
                            11212.4,
                            10968.4,
                            4954.23,
                            4428.95,
                            9916.09,
                            9547.26,
                            16802.31,
                            6020.05,
                            8138.17,
                            8106.61,
                            4025.65,
                            11533.94,
                            113922.06,
                            6561.72,
                            9046.25,
                            139594.91,
                            5915.85,
                            10173.62,
                            10043.43,
                            142959.24,
                            7417.74,
                            10890.23,
                            8274.12,
                            11997.94,
                            11549.02,
                            94984.44,
                            12369.53,
                            11372.75,
                            4207.78,
                            8225.1,
                            12194.43,
                            6691.08,
                            5584.92,
                            157445.83,
                            10480.35,
                            10274.78,
                            6013.44,
                            8731.11,
                            10857.55,
                            3063.66,
                            6583.06,
                            10896.15,
                            5779.4,
                            4190.88,
                            13868.36,
                            14073.16,
                            190737.62,
                            7524.7,
                            13817.22,
                            8065.13,
                            7512.96,
                            7228.63,
                            13520.83,
                            4792.67,
                            2888.65,
                            7785.82,
                            224273.25,
                            9812.93,
                            6263.85,
                            14840.75,
                            4225.19,
                            7679.51,
                            10765.21,
                            4846.43,
                            10015.69,
                            10160.99,
                            5561.69,
                            6566.26,
                            5865.62,
                            14338.38,
                            7073.82,
                            4738.56,
                            10050.21,
                            4432.27,
                            10043.54,
                            11177.2,
                            5993.19,
                            16326.81,
                            11260.79,
                            4158.25,
                            7977.42,
                            7361.67,
                            198519.24,
                            145464.91
                        ],
                        "data_type": "Float64",
                        "type": [
                            "sum"
                        ]
                    }
                ]
            },
            {
                "sheet_name": "Sales by Channel",
                "sql_query": "SELECT \"Channel\", sum(\"Revenue\") FROM (SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\") temp_table GROUP BY \"Channel\" ORDER BY \"Channel\" ASC NULLS FIRST",
                "dimensions": [
                    "Channel"
                ],
                "metrics": [
                    "sum(Revenue)"
                ],
                "chart_type": "TABLE",
                "chart_id": 1,
                "sheet_data": "",
                "structure_valid": false,
                "structure_error": "Query doesn't follow the required structure",
                "is_echart": false,
                "columns": [
                    {
                        "column": "Channel",
                        "result": [
                            "Direct Sales",
                            "Online",
                            "Partner",
                            "Retail"
                        ],
                        "data_type": "String",
                        "type": []
                    }
                ],
                "rows": [
                    {
                        "column": "Revenue",
                        "result": [
                            1396222.52,
                            678237.8400000001,
                            1656015.34,
                            1116279.8299999996
                        ],
                        "data_type": "Float64",
                        "type": [
                            "sum"
                        ]
                    }
                ]
            },
            {
                "sheet_name": "Total Revenue KPI",
                "sql_query": "SELECT sum(\"Revenue\") FROM (SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\") temp_table",
                "dimensions": [],
                "metrics": [
                    "sum(Revenue)"
                ],
                "chart_type": "KPI",
                "chart_id": 25,
                "sheet_data": "",
                "structure_valid": false,
                "structure_error": "Query doesn't follow the required structure",
                "is_echart": false,
                "columns": [],
                "rows": [
                    {
                        "column": "Revenue",
                        "result": [
                            4846755.529999999
                        ],
                        "data_type": "Float64",
                        "type": [
                            "sum"
                        ]
                    }
                ]
            },
            {
                "sheet_name": "Total Profit KPI",
                "sql_query": "SELECT sum(\"Profit\") FROM (SELECT \"Sales Data\".\"Transaction ID\" AS \"Transaction ID\", \"Sales Data\".\"Date & Time\" AS \"Date & Time\", \"Sales Data\".\"Customer\" AS \"Customer\", \"Sales Data\".\"Product\" AS \"Product\", \"Sales Data\".\"Sales Rep\" AS \"Sales Rep\", \"Sales Data\".\"Region\" AS \"Region\", \"Sales Data\".\"Revenue\" AS \"Revenue\", \"Sales Data\".\"Cost\" AS \"Cost\", \"Sales Data\".\"Profit\" AS \"Profit\", \"Sales Data\".\"Quantity\" AS \"Quantity\", \"Sales Data\".\"Margin %\" AS \"Margin %\", \"Sales Data\".\"Channel\" AS \"Channel\" FROM \"Financial_Sales_Data_4KPSSN.xlsx\".\"Sales Data\" AS \"Sales Data\") temp_table",
                "dimensions": [],
                "metrics": [
                    "sum(Profit)"
                ],
                "chart_type": "KPI",
                "chart_id": 25,
                "sheet_data": "",
                "structure_valid": false,
                "structure_error": "Query doesn't follow the required structure",
                "is_echart": false,
                "columns": [],
                "rows": [
                    {
                        "column": "Profit",
                        "result": [
                            2628036.82
                        ],
                        "data_type": "Float64",
                        "type": [
                            "sum"
                        ]
                    }
                ]
            }
        ],
        "overall_insights": "The dashboard provides insights into revenue distribution by region and channel, profit trends over time, and key performance indicators for total revenue and profit."
    },
    "dashboard_json": [
        {
            "id": "84cddaf7-7c3e-4b3e-862c-611145ff551b",
            "x": 0,
            "y": 0,
            "rows": 10,
            "cols": 6,
            "data": {
                "title": "Revenue by Region",
                "sheetTagName": "<p>Revenue by Region</p>"
            },
            "sheetType": "Chart",
            "chartType": "bar",
            "chartId": 6,
            "isEChart": false,
            "kpiData": null,
            "tableData": null,
            "chartData": [
                {
                    "Region": "North",
                    "sum(Revenue)": 5000
                },
                {
                    "Region": "South",
                    "sum(Revenue)": 5000
                },
                {
                    "Region": "East",
                    "sum(Revenue)": 4000
                },
                {
                    "Region": "West",
                    "sum(Revenue)": 4000
                }
            ],
            "column_Data": [
                "Region",
                "sum(Revenue)"
            ],
            "row_Data": [
                [
                    "North",
                    5000
                ],
                [
                    "South",
                    5000
                ],
                [
                    "East",
                    4000
                ],
                [
                    "West",
                    4000
                ]
            ],
            "numberFormat": {
                "decimalPlaces": 2,
                "prefix": "",
                "suffix": ""
            },
            "customizeOptions": {
                "backgroundColor": "#ffffff",
                "color": "#2392c1",
                "selectedColorScheme": [
                    "#1d2e92",
                    "#088ed2",
                    "#2392c1",
                    "#4CAF50",
                    "#FF9800",
                    "#9C27B0"
                ],
                "isMeasureDistribution": false,
                "xLabelSwitch": true,
                "yLabelSwitch": true,
                "xLabelFontSize": 12,
                "yLabelFontSize": 12,
                "xLabelFontFamily": "sans-serif",
                "yLabelFontFamily": "sans-serif",
                "xlabelFontWeight": 400,
                "ylabelFontWeight": 400,
                "dimensionAlignment": "center",
                "measureAlignment": "center",
                "gridColor": "#e0e0e0",
                "xGridSwitch": true,
                "yGridSwitch": true,
                "barCornerRadius": 4,
                "dataLabels": true,
                "dataLabelsFontSize": 12,
                "dataLabelsFontFamily": "sans-serif",
                "dataLabelsColor": "#2392c1",
                "isBold": false,
                "dataLabelsFontPosition": "top",
                "legendSwitch": true,
                "legendsAllignment": "bottom",
                "donutSize": 70,
                "donutDecimalPlaces": 2
            },
            "echartOptions": {},
            "chartOptions": {
                "series": [
                    {
                        "name": "sum(Revenue)",
                        "data": [
                            5000,
                            5000,
                            4000,
                            4000
                        ],
                        "group": "apexcharts-axis-0"
                    }
                ],
                "chart": {
                    "type": "bar",
                    "height": 320,
                    "background": "#ffffff"
                },
                "xaxis": {
                    "categories": [
                        "North",
                        "South",
                        "East",
                        "West"
                    ],
                    "labels": {
                        "show": true,
                        "style": {
                            "fontSize": 12,
                            "fontFamily": "sans-serif",
                            "fontWeight": 400,
                            "colors": "#2392c1"
                        }
                    }
                },
                "yaxis": {
                    "labels": {
                        "show": true,
                        "style": {
                            "fontSize": 12,
                            "fontFamily": "sans-serif",
                            "fontWeight": 400,
                            "colors": "#2392c1"
                        }
                    }
                },
                "colors": [
                    "#1d2e92",
                    "#088ed2",
                    "#2392c1",
                    "#4CAF50",
                    "#FF9800"
                ],
                "dataLabels": {
                    "enabled": true,
                    "style": {
                        "fontSize": "12px",
                        "fontFamily": "sans-serif",
                        "colors": [
                            "#2392c1"
                        ]
                    }
                },
                "legend": {
                    "show": true,
                    "position": "bottom"
                }
            }
        },
        {
            "id": "9652d3a2-a648-405d-8061-3e2660549805",
            "x": 6,
            "y": 0,
            "rows": 10,
            "cols": 6,
            "data": {
                "title": "Profit Over Time",
                "sheetTagName": "<p>Profit Over Time</p>"
            },
            "sheetType": "Chart",
            "chartType": "line",
            "chartId": 13,
            "isEChart": false,
            "kpiData": null,
            "tableData": null,
            "chartData": [
                {
                    "Date & Time": "North",
                    "sum(Profit)": 5000
                },
                {
                    "Date & Time": "South",
                    "sum(Profit)": 5000
                },
                {
                    "Date & Time": "East",
                    "sum(Profit)": 4000
                },
                {
                    "Date & Time": "West",
                    "sum(Profit)": 4000
                }
            ],
            "column_Data": [
                "Date & Time",
                "sum(Profit)"
            ],
            "row_Data": [
                [
                    "North",
                    5000
                ],
                [
                    "South",
                    5000
                ],
                [
                    "East",
                    4000
                ],
                [
                    "West",
                    4000
                ]
            ],
            "numberFormat": {
                "decimalPlaces": 2,
                "prefix": "",
                "suffix": ""
            },
            "customizeOptions": {
                "backgroundColor": "#ffffff",
                "color": "#2392c1",
                "selectedColorScheme": [
                    "#1d2e92",
                    "#088ed2",
                    "#2392c1",
                    "#4CAF50",
                    "#FF9800",
                    "#9C27B0"
                ],
                "isMeasureDistribution": false,
                "xLabelSwitch": true,
                "yLabelSwitch": true,
                "xLabelFontSize": 12,
                "yLabelFontSize": 12,
                "xLabelFontFamily": "sans-serif",
                "yLabelFontFamily": "sans-serif",
                "xlabelFontWeight": 400,
                "ylabelFontWeight": 400,
                "dimensionAlignment": "center",
                "measureAlignment": "center",
                "gridColor": "#e0e0e0",
                "xGridSwitch": true,
                "yGridSwitch": true,
                "barCornerRadius": 4,
                "dataLabels": true,
                "dataLabelsFontSize": 12,
                "dataLabelsFontFamily": "sans-serif",
                "dataLabelsColor": "#2392c1",
                "isBold": false,
                "dataLabelsFontPosition": "top",
                "legendSwitch": true,
                "legendsAllignment": "bottom",
                "donutSize": 70,
                "donutDecimalPlaces": 2
            },
            "echartOptions": {},
            "chartOptions": {
                "series": [
                    {
                        "name": "sum(Profit)",
                        "data": [
                            5000,
                            5000,
                            4000,
                            4000
                        ],
                        "group": "apexcharts-axis-0"
                    }
                ],
                "chart": {
                    "type": "line",
                    "height": 320,
                    "background": "#ffffff"
                },
                "xaxis": {
                    "categories": [
                        "North",
                        "South",
                        "East",
                        "West"
                    ],
                    "labels": {
                        "show": true,
                        "style": {
                            "fontSize": 12,
                            "fontFamily": "sans-serif",
                            "fontWeight": 400,
                            "colors": "#2392c1"
                        }
                    }
                },
                "yaxis": {
                    "labels": {
                        "show": true,
                        "style": {
                            "fontSize": 12,
                            "fontFamily": "sans-serif",
                            "fontWeight": 400,
                            "colors": "#2392c1"
                        }
                    }
                },
                "colors": [
                    "#1d2e92",
                    "#088ed2",
                    "#2392c1",
                    "#4CAF50",
                    "#FF9800"
                ],
                "dataLabels": {
                    "enabled": true,
                    "style": {
                        "fontSize": "12px",
                        "fontFamily": "sans-serif",
                        "colors": [
                            "#2392c1"
                        ]
                    }
                },
                "legend": {
                    "show": true,
                    "position": "bottom"
                }
            }
        },
        {
            "id": 1,
            "x": 0,
            "y": 10,
            "cols": 6,
            "rows": 10,
            "data": {
                "title": "Sales by Channel",
                "sheetTagName": "Sales by Channel"
            },
            "sheetType": "TABLE",
            "chartType": "TABLE",
            "chartId": 1,
            "isEChart": false,
            "tableData": {
                "headers": [
                    "Channel",
                    "Revenue"
                ],
                "rows": [
                    {
                        "Channel": "Online",
                        "Revenue": 120000
                    },
                    {
                        "Channel": "Retail",
                        "Revenue": 180000
                    },
                    {
                        "Channel": "Wholesale",
                        "Revenue": 150000
                    }
                ],
                "banding": true,
                "color1": "#e1bee7",
                "color2": "#b2ebf2",
                "tableItemsPerPage": 10,
                "tableTotalItems": 100,
                "tablePage": 1
            },
            "chartData": [],
            "column_Data": [],
            "row_Data": [],
            "numberFormat": {},
            "customizeOptions": {
                "showTitle": true,
                "showLegend": false,
                "showGrid": true,
                "showAxis": true,
                "showValues": true,
                "showLabels": true,
                "showTooltips": true
            },
            "chartOptions": {
                "theme": "light",
                "responsive": true
            }
        },
        {
            "id": 25,
            "x": 6,
            "y": 10,
            "cols": 6,
            "rows": 10,
            "data": {
                "title": "Total Revenue KPI",
                "sheetTagName": "Total Revenue KPI"
            },
            "sheetType": "KPI",
            "chartType": "KPI",
            "chartId": 25,
            "isEChart": false,
            "kpiData": {
                "kpiNumber": "450000",
                "kpiPrefix": "$",
                "kpiSuffix": "",
                "kpiDecimalUnit": "none",
                "kpiDecimalPlaces": 2,
                "rows": [
                    {
                        "col": "Total Revenue",
                        "result_data": [
                            450000
                        ]
                    }
                ],
                "fontSize": 1.5,
                "color": "#4caf50",
                "kpiChartColor": "#4caf50",
                "trendData": [
                    400000,
                    420000,
                    430000,
                    450000
                ],
                "trendLabels": [
                    "Q1",
                    "Q2",
                    "Q3",
                    "Q4"
                ],
                "kpiShowTrendline": true,
                "showKpiIndicator": true,
                "indicatorIsIncreased": "up",
                "indicatorValue": 5,
                "kpiTarget": 500000
            },
            "chartData": [],
            "column_Data": [],
            "row_Data": [],
            "numberFormat": {},
            "customizeOptions": {
                "showTitle": true,
                "showLegend": false,
                "showGrid": false,
                "showAxis": false,
                "showValues": true,
                "showLabels": false,
                "showTooltips": false
            },
            "chartOptions": {
                "theme": "light",
                "responsive": true
            }
        },
        {
            "id": "chart_25",
            "x": 0,
            "y": 20,
            "cols": 6,
            "rows": 10,
            "data": {
                "title": "Total Profit KPI",
                "sheetTagName": "Total Profit KPI"
            },
            "sheetType": "chart",
            "chartType": "KPI",
            "chartId": 25,
            "isEChart": false,
            "kpiData": {
                "kpiNumber": "1500000",
                "kpiPrefix": "$",
                "kpiSuffix": "",
                "kpiDecimalUnit": "none",
                "kpiDecimalPlaces": 2,
                "rows": [
                    {
                        "col": "sum(Profit)",
                        "result_data": [
                            1500000
                        ]
                    }
                ],
                "fontSize": 1.5,
                "color": "#4caf50",
                "kpiChartColor": "#81c784",
                "trendData": [
                    1400000,
                    1450000,
                    1500000
                ],
                "trendLabels": [
                    "Q1",
                    "Q2",
                    "Q3"
                ],
                "kpiShowTrendline": true,
                "showKpiIndicator": true,
                "indicatorIsIncreased": "up",
                "indicatorValue": 5,
                "kpiTarget": 1600000
            },
            "column_Data": [],
            "row_Data": [],
            "numberFormat": {
                "decimalPlaces": 2,
                "prefix": "$",
                "suffix": ""
            },
            "customizeOptions": {
                "backgroundColor": "#ffffff",
                "borderColor": "#e0e0e0",
                "borderWidth": 1,
                "borderRadius": 5,
                "fontFamily": "Arial, sans-serif",
                "fontSize": 12,
                "fontColor": "#333333"
            },
            "chartOptions": {
                "chart": {
                    "type": "kpi",
                    "height": 350
                },
                "plotOptions": {
                    "kpi": {
                        "dataLabels": {
                            "enabled": true,
                            "style": {
                                "colors": [
                                    "#333333"
                                ]
                            }
                        }
                    }
                },
                "colors": [
                    "#4caf50"
                ],
                "title": {
                    "text": "Total Profit",
                    "align": "center"
                }
            }
        }
    ],
    "tables": []
}

}


export interface ChatMessage {
  sender: 'User' | 'AI';
  text: string;
  timestamp: Date;
}