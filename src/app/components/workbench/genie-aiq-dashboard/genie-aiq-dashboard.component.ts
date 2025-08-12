import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/sharedmodule';
import { RouterModule } from '@angular/router';
import { WorkbenchComponent } from '../workbench/workbench.component';
import { TemplateDashboardService } from '../../../services/template-dashboard.service';

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
    @ViewChild('sheetcontainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  constructor(private workbechService:WorkbenchService, private toasterService:ToastrService, private templateDashboardService:TemplateDashboardService){

  }
  ngOnInit(){
    this.step = 1;
    console.log(this.step);
    this.getConnectionList();
  }

  getConnectionList(){
    const Obj ={ }
    this.workbechService.getdatabaseConnectionsList(Obj).subscribe({
      next:(data)=>{
        this.connectionList = data.sheets;
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
     if (this.selectedConnection && typeof this.selectedConnection === 'object') {
    const hierarchyId = this.selectedConnection.hierarchy_id;
    console.log('Selected hierarchy_id:', hierarchyId);
    this.hierarchyId = hierarchyId;
    // Use hierarchyId as needed
  const obj ={
    hierarchy_ids:[hierarchyId]
  }
  const IdToPass = hierarchyId;
  this.schematableList = [];
  this.workbechService.getSchemaTablesFromConnectedDb(IdToPass, obj).subscribe({
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
      this.step = 2;
      console.log('All tables:', this.tables);
      console.log('schematableList:', this.schematableList);
    },
    error: (error) => {
      console.log(error);
      this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
    }
})
  } else {
    // Handle case where no connection is selected
    this.toasterService.error('Please select a display name', 'Error');
  }
  }

  onCancel() {
    this.step = 1;
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
      this.step = 3;
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
      dashboard_name: 'dbcjgv'
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
}
