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
import { OpenaiService } from '../../../services/openai.service';
import { LoaderService } from '../../../shared/services/loader.service';

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

    @ViewChild('sheetcontainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  constructor(private workbechService:WorkbenchService, private toasterService:ToastrService, private templateDashboardService:TemplateDashboardService, private openAi: OpenaiService, private loaderService:LoaderService){

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
promptDashboard(){
  // const payload ={
  //   h_id: this.hierarchyId,
  //   question:this.userPrompt
  // }
  //     this.workbechService.promptDashboard(payload).subscribe({
  //     next:(data)=>{
  //     console.log(data);
  //     if(this.datafromApi){
  //       this.buildDashboardprocess(this.datafromApi);
  //     }
  //     },
  //     error:(error)=>{
  //       console.log(error);
  //       this.toasterService.error(error.error.message,'error',{ positionClass: 'toast-top-right'});
  //     }
  //   })
  const data = [
    {
      "sheet_name": "Sheet Data Overview",
      "sql_query": "SELECT \"chart_id\", count(\"chart_id\") FROM (select * from sheet_data) temp_table GROUP BY \"chart_id\" ORDER BY \"chart_id\" ASC NULLS FIRST",
      "dimensions": [
        "chart_id"
      ],
      "metrics": [
        "count(chart_id)"
      ],
      "chart_type": "bar",
      "chart_id": 6,
      "is_echart": true,
      "sheet_data": "",
      "structure_valid": true,
      "columns": [
        {
          "column": "chart_id",
          "result": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            17,
            18,
            24,
            25,
            26,
            27,
            28,
            29
          ]
        }
      ],
      "rows": [
        {
          "column": "count(chart_id)",
          "result": [
            289,
            65,
            78,
            62,
            1,
            295,
            8,
            4,
            5,
            224,
            1,
            65,
            12,
            2,
            34,
            6,
            184,
            1215,
            64,
            97,
            2,
            71
          ]
        }
      ]
    },
    {
      "sheet_name": "Top Sheet Users",
      "sql_query": "SELECT \"user_id\", count(\"chart_id\") FROM (select * from sheet_data) temp_table GROUP BY \"user_id\" ORDER BY count(\"chart_id\") DESC",
      "dimensions": [
        "user_id"
      ],
      "metrics": [
        "count(chart_id)"
      ],
      "chart_type": "line",
      "chart_id": 13,
      "is_echart": false,
      "sheet_data": "",
      "structure_valid": true,
      "columns": [
        {
          "column": "user_id",
          "result": [
            12,
            1,
            17,
            10,
            62,
            73,
            15,
            4,
            2,
            78,
            70,
            50,
            3,
            6,
            74,
            42,
            7,
            75,
            32,
            26,
            64,
            48,
            44,
            43,
            71,
            5,
            27,
            28,
            25,
            45,
            49,
            36,
            56,
            35,
            9,
            21,
            14,
            18,
            72,
            30,
            34,
            57,
            37,
            19,
            40,
            76,
            8,
            47,
            51,
            31,
            23,
            11,
            61,
            33,
            58,
            38,
            24,
            77,
            46,
            22,
            13,
            41,
            59,
            29,
            69,
            20
          ]
        }
      ],
      "rows": [
        {
          "column": "count(chart_id)",
          "result": [
            282,
            153,
            87,
            72,
            58,
            53,
            53,
            48,
            48,
            44,
            42,
            39,
            38,
            38,
            36,
            35,
            35,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            34,
            22,
            3
          ]
        }
      ]
    }
  ]
  this.loaderService.show();
  this.openAi.getChartOptions(data)
  .then(chartOptions => {
    console.log("Chart Options:", chartOptions);

    // Assign result
    this.dash1 = chartOptions;
    this.showDashboardView = true;
    this.loaderService.hide();
  })
  .catch(err => {
    console.error("Error fetching chart options", err);
    this.loaderService.hide();
  });
}
customizeDashboard(){
  const data = this.dash1;
  this.loaderService.show();
  this.openAi.getChartOptions(data, this.userPrompt + "/n" + "do not remove any other charts, do update only relative chart only")
  .then(chartOptions => {
    console.log("Chart Options:", chartOptions);

    // Assign result
    this.dash1 = chartOptions;
    // this.showDashboardView = true;
    this.loaderService.hide();
  })
  .catch(err => {
    console.error("Error fetching chart options", err);
    this.loaderService.hide();
  });
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
    this.builSheets(data);
  }
})
}
builSheets(data:any){

}
datafromApi =[
  {
    "status": "success",
    "dashboard": {
        "dashboard": {
            "dashboard_title": "Dashboard for Selected Datasource Analysis",
            "height": "",
            "width": "",
            "dashboard_data": ""
        },
        "queryset": {
            "custom_query": "select * from project, users",
            "queryset_name": "Datasource: Project and Users"
        },
        "sheets": [
            {
                "sheet_name": "Project Types Analysis",
                "sheet_description": "Analyzes the distribution of project types",
                "sql_query": "SELECT \"projectTypeKey\", count(\"id\") FROM (select * from project) temp_table GROUP BY \"projectTypeKey\" ORDER BY \"projectTypeKey\" ASC NULLS FIRST",
                "dimensions": [
                    "projectTypeKey"
                ],
                "metrics": [
                    "count(id)"
                ],
                "chart_type": "bar",
                "business_insight": "Insight into the number of projects per project type",
                "sheet_data": "",
                "structure_valid": true,
                "columns": [
                    {
                        "column": "projectTypeKey",
                        "result": [
                            "software"
                        ]
                    }
                ],
                "rows": [
                    {
                        "column": "count(id)",
                        "result": [
                            1
                        ]
                    }
                ]
            },
            {
                "sheet_name": "Active Users Analysis",
                "sheet_description": "Analyzes the distribution of active users",
                "sql_query": "SELECT \"active\", count(\"self\") FROM (select * from users) temp_table GROUP BY \"active\" ORDER BY \"active\" ASC NULLS FIRST",
                "dimensions": [
                    "active"
                ],
                "metrics": [
                    "count(self)"
                ],
                "chart_type": "pie",
                "business_insight": "Insight into the number of active and inactive users",
                "sheet_data": "",
                "structure_valid": true,
                "columns": [
                    {
                        "column": "active",
                        "result": [
                            "true"
                        ]
                    }
                ],
                "rows": [
                    {
                        "column": "count(self)",
                        "result": [
                            14
                        ]
                    }
                ]
            },
            {
                "sheet_name": "Private Projects Analysis",
                "sheet_description": "Analyzes the distribution of private projects",
                "sql_query": "SELECT \"isPrivate\", count(\"id\") FROM (select * from project) temp_table GROUP BY \"isPrivate\" ORDER BY \"isPrivate\" ASC NULLS FIRST",
                "dimensions": [
                    "isPrivate"
                ],
                "metrics": [
                    "count(id)"
                ],
                "chart_type": "donut",
                "business_insight": "Insight into the number of private and public projects",
                "sheet_data": "",
                "structure_valid": true,
                "columns": [
                    {
                        "column": "isPrivate",
                        "result": [
                            "false"
                        ]
                    }
                ],
                "rows": [
                    {
                        "column": "count(id)",
                        "result": [
                            1
                        ]
                    }
                ]
            },
            {
                "sheet_name": "Project Style Analysis",
                "sheet_description": "Analyzes the distribution of project styles",
                "sql_query": "SELECT \"style\", count(\"id\") FROM (select * from project) temp_table GROUP BY \"style\" ORDER BY \"style\" ASC NULLS FIRST",
                "dimensions": [
                    "style"
                ],
                "metrics": [
                    "count(id)"
                ],
                "chart_type": "line",
                "business_insight": "Insight into the number of projects based on style",
                "sheet_data": "",
                "structure_valid": true,
                "columns": [
                    {
                        "column": "style",
                        "result": [
                            "next-gen"
                        ]
                    }
                ],
                "rows": [
                    {
                        "column": "count(id)",
                        "result": [
                            1
                        ]
                    }
                ]
            },
            {
                "sheet_name": "KPI: Total Projects",
                "sheet_description": "Key Performance Indicator for Total Projects",
                "sql_query": "SELECT count(\"id\") FROM (select * from project) temp_table",
                "dimensions": [],
                "metrics": [
                    "count(id)"
                ],
                "chart_type": "kpi",
                "business_insight": "Total number of projects in the datasource",
                "sheet_data": "",
                "structure_valid": false,
                "structure_error": "Query doesn't follow the required structure",
                "columns": [],
                "rows": [
                    {
                        "column": "count(id)",
                        "result": [
                            1
                        ]
                    }
                ]
            }
        ],
        "overall_insights": "Key overall insights from the dashboard: Provides detailed analysis of project and user data from the selected datasource"
    },
    "message": "Dashboard generated successfully"
}
]

}
