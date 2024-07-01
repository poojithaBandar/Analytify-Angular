import { Component } from '@angular/core';
import { WorkbenchService } from '../workbench.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { SharedModule } from '../../../shared/sharedmodule';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-database',
  standalone: true,
  imports: [SharedModule,CdkDropListGroup, CdkDropList, CdkDrag,NgbModule,FormsModule,NgbModule,CommonModule],
  templateUrl: './database.component.html',
  styleUrl: './database.component.scss',
  animations:[
    trigger('toggle', [
      state('open', style({
        width: '610px', // Adjust as needed
        // flex: '1 1 610px',
        opacity: 1,
      })),
      state('closed', style({
        width: '0px',
        opacity: 0,
        display: 'none'
      })),
      transition('open <=> closed', [
        animate('0.3s ease-in-out')
      ]),
    ])
  ]
})
export class DatabaseComponent {
  databaseName:any;
  tableName:any;
  selectedClmnT1:any;
  selectedClmnT2:any;
  getSelectedT1:any;
  getSelectedT2:any;
  selectedSchema1:any;
  selectedSchema2:any;
  selectedCndn:any;
  selectedJoin:any;
  selectedAliasT1:any;
  selectedAliasT2:any;
  tableRelationUi = true;
  custmT1Data = [] as any;
  custmT2Data = [] as any;
  connectionList =[] as any;
  tableList = [] as any;
  schematableList = [] as any;
  filteredSchematableList = [] as any;
  hostName:any;
  dragedTableName: any;
  databaseconnectionsList=true;
  draggedtables = [] as any;
  getTableColumns = [] as any;
  getTableRows = [] as any;
  relationOfTables = [] as any;
  displayJoiningCndnsList =[] as any;
  joinTypes = [] as any;
  databaseId:any;  
  sqlQuery ='';
  cutmquryTable = [] as any;
  TabledataJoining = [] as any;
  qryTime:any;
  qryRows:any;
  custmQryRows:any;
  custmQryTime:any;
  cutmquryTableError:any;
  remainingTables = [] as any;
  qurtySetId:any;
  enableJoinBtn = true;
  customSql = false;
  tableJoiningUI = true;
  isOpen = false;
  searchTables : any;
  columnsInFilters = [] as any;
  tableColumnFilter!:boolean;
  columnRowFilter!:any;
  datasourceFilterId:any;;
  datasourceFilterIdArray:any[] =[];
  selectedRows = [];
  datasourceQuerysetId = null;
  filteredList = [] as any;
  editFilterList = [] as any;
  columnWithTablesData = [] as any;
  constructor( private workbechService:WorkbenchService,private router:Router,private route:ActivatedRoute,private modalService: NgbModal){
    const currentUrl = this.router.url;
    if(currentUrl.includes('/workbench/database-connection/tables/')){
     this.databaseId = +atob(route.snapshot.params['id']);
    }
     if(currentUrl.includes('/workbench/database-connection/sheets/')){
     if (route.snapshot.params['id1'] && route.snapshot.params['id2'] ) {
      this.databaseId = +atob(route.snapshot.params['id1']);
      this.qurtySetId = +atob(route.snapshot.params['id2']);
      localStorage.setItem('QuerySetId', JSON.stringify(this.qurtySetId));

      }
    }
  }
  ngOnInit(){
    {
      document.querySelector('html')?.getAttribute('data-toggled') != null
        ? document.querySelector('html')?.removeAttribute('data-toggled')
        : document
            .querySelector('html')
            ?.setAttribute('data-toggled', 'icon-overlay-close');    
    }
    this.getTablesFromConnectedDb();
    this.getSchemaTablesFromConnectedDb();
    this.getTablesfromPrevious()
  }
  toggleCard() {
    this.isOpen = !this.isOpen;
  }
  toggleSubMenu(menu: any) {
    menu.expanded = !menu.expanded;
  }
  getTablesfromPrevious(){
    const querysetId = localStorage.getItem( 'QuerySetId' );
    this.qurtySetId = querysetId
    if(querysetId !== ''||null){
    this.workbechService.getTablesfromPrevious(this.databaseId,querysetId).subscribe({next: (data) => {
      console.log(data);
      this.relationOfTables= data.dragged_data.relation_tables
      console.log('tablerelation',this.relationOfTables)
      this.draggedtables = data.dragged_data.json_data
      if(this.draggedtables.length > 0){
        this.joiningTables();
      }
  },
  error:(error)=>{
   console.log(error);
  }
  })
    }
  }
  getTablesFromConnectedDb(){
     this.workbechService.getTablesFromConnectedDb(this.databaseId).subscribe({next: (responce) => {
    if(Array.isArray(responce.data)){
      this.tableList= responce.data
    }
    else{
    this.tableList = this.combineArrays(responce.data)
    }
    console.log('tablelist',this.tableList)
    // this.databaseName = responce.database.database_name
    this.databaseId = responce.database.database_id
  },
  error:(error)=>{
    console.log(error);
  }
})
}
getSchemaTablesFromConnectedDb(){
  const obj ={
    search:this.searchTables
  }
  if(obj.search == '' || obj.search == null){
    delete obj.search;
  }
  this.workbechService.getSchemaTablesFromConnectedDb(this.databaseId,obj).subscribe({next: (data) => {
   this.schematableList= data?.data?.schemas;
   this.filteredSchematableList = this.schematableList?.data?.schemas
       this.databaseName = data.database.database;
        this.hostName = data.database.hostname;
    console.log(data)

},
error:(error)=>{
 console.log(error);
}
})
}
//filter tables from schemas
filterTables(){
  if (Array.isArray(this.schematableList)) {
    const filteredSchemas = this.schematableList.map((schemaObj: { schema: any; tables: any[] }) => {
      return {
        schema: schemaObj.schema,
        tables: schemaObj.tables.filter(tableObj => tableObj.table.includes(this.searchTables))
      };
    }).filter((schemaObj: { tables: string | any[]; }) => schemaObj.tables.length > 0); // Filter out schemas with no matching tables
  
    if (filteredSchemas.length > 0) {
      console.log('Filtered data:', filteredSchemas);
      this.schematableList = filteredSchemas
    } else {
      console.log('No matching tables found');
    }
  } else {
    console.log('Something went wrong');
  }
}

private combineArrays(arraysOfObjects: { data: any[] }[]): any[]{
  let result: any[] = [];
for (const obj of arraysOfObjects) {
  if (Array.isArray(obj.data)) {
    result = result.concat(obj.data);
  }
}
return result;
}
drop(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    console.log('Transfering item to new container')
    let item: any = event.previousContainer.data[event.previousIndex];
    // console.log('item' + JSON.stringify(item));
    let copy: any = JSON.parse(JSON.stringify(item));
    // console.log('copy' + JSON.stringify(copy));
    let element: any = {};
    for (let attr in copy) {
      // console.log('attr' + attr);
      if (attr == 'title') {
        element[attr] = copy[attr];
      } else {
        element[attr] = copy[attr];
      }
    }
   // this.draggedtables.splice(event.currentIndex, 0, element);
   //this.draggedtables.push(element);
   console.log('element',element)
    this.pushToDraggedTables(element)
    console.log('darggedtable',this.draggedtables)
   }
   if(parseInt(this.qurtySetId) !== 0){
    this.joiningTables();
   }
   else if(parseInt(this.qurtySetId) === 0){
     this.joiningTablesWithoutQuerySetId()
   }
}

pushToDraggedTables(newTable:any): void {

  const existingTableNames = this.draggedtables.map((table: { table: any; }) => table.table);
  const baseTableName = newTable.table
  const occurrences = existingTableNames.filter((name: string) => name.startsWith(baseTableName)).length;
  let tableName = newTable.table;
  let suffix = occurrences;
    while (existingTableNames.includes(tableName)) {
      tableName = `${newTable.table}_${suffix}`;
      suffix++;
    }
    newTable['alias']=tableName;
    this.draggedtables.push(newTable);
}

getTablerowclms(table:any,schema:any){
  const obj ={
    database_id:this.databaseId,
    tables:[[schema,table]]
  }
  this.workbechService.getTableData(obj).subscribe({
    next:(data:any)=>{
      console.log(data);
      this.getTableColumns = data.column_data;
      this.getTableRows = data.row_data;
      this.tableName = data?.column_data[0]?.table
    },
    error:(error:any)=>{
      console.log(error)
    }
  })
}
// getTableData(){
//   const obj ={
//     database_id:this.databaseId,
//     tables:[[this.draggedtables[0].schema,this.draggedtables[0].table]]
//   }
//   this.workbechService.getTableData(obj).subscribe({
//     next:(data:any)=>{
//       console.log('single table data',data);
//       this.cutmquryTable = data
//       this.qryTime = data.query_exection_time;
//       this.qryRows = data.no_of_rows;
//     },
//     error:(error:any)=>{
//       console.log(error)
//     }
//   })
// }

onDeleteItem(index: number) {
   this.draggedtables.splice(index, 1); // Remove the item from the droppedItems array
   console.log(this.draggedtables);
  //  const schema = this.draggedtables[index].schema
  //  const tablename = this.draggedtables[index].table
  //  const tablealias = this.draggedtables[index].alias


  //  if(this.draggedtables.length !== 0){
    const deleteIndex = index - 1
    this.relationOfTables.splice(deleteIndex,1)
   this.joiningTablesFromDelete();
  //  }
}
buildCustomRelation(){
  const parts = this.selectedClmnT1.split('(');
  this.selectedClmnT1 = parts[0].trim()
  const parst = this.selectedClmnT2.split('(');
  this.selectedClmnT2 = parst[0].trim()
  const obj ={
    database_id:this.databaseId,
    tables : [[this.draggedtables[0].schema,this.draggedtables[0].table],[this.draggedtables[1].schema,this.draggedtables[1].table]],
    condition:[[this.draggedtables[0].schema+'.'+this.draggedtables[0].table+'.'+this.selectedClmnT1 +'=' +this.draggedtables[1].schema+'.'+this.draggedtables[1].table+'.'+this.selectedClmnT2]]
  }
  this.workbechService.tableRelation(obj)
    .subscribe(
      {
        next:(data:any) =>{
          console.log(data)
          this.relationOfTables = data[2]?.relation?.condition
          console.log('relation',this.relationOfTables)
        },
        error:(error:any)=>{
        console.log(error)
      }
      })

}
clrQuery(){
  this.sqlQuery = ''
}
executeQuery(){
  const obj ={
    database_id: this.databaseId,
    custom_query: this.sqlQuery
  }
  this.workbechService.executeQuery(obj)
  .subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        // this.relationOfTables = data[2]?.relation?.condition
        // console.log('relation',this.relationOfTables)
        this.cutmquryTable = data
        this.custmQryTime = data.query_exection_time;
        this.custmQryRows = data.no_of_rows;
        console.log('dkjshd',this.cutmquryTable)
      },
      error:(error:any)=>{
      console.log(error)
      this.cutmquryTableError = error;
    }
    })
}

updateRemainingTables() {
  this.remainingTables = this.draggedtables.filter((table: { alias: string; }) => table.alias !== this.selectedAliasT1);
  this.selectedAliasT2 = this.remainingTables.length > 0 ? this.remainingTables[0].alias : '';
}

joiningTablesWithoutQuerySetId(){
  const schemaTablePairs = this.draggedtables.map((item: { schema: any; table: any; alias:any }) => [item.schema, item.table, item.alias]);
  // console.log(schemaTablePairs)
  const obj ={
    query_set_id:null,
    database_id:this.databaseId,
    joining_tables: schemaTablePairs,
    join_type:[],
    joining_conditions:[],
    dragged_array:this.draggedtables
  }
  this.workbechService.joiningTables(obj)
  .subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.relationOfTables = data.table_columns_and_rows?.joining_condition;
        this.displayJoiningCndnsList = data.table_columns_and_rows?.joining_condition_list;
        this.qurtySetId = data?.table_columns_and_rows?.query_set_id
        localStorage.setItem('QuerySetId', JSON.stringify(this.qurtySetId));
        this.joinTypes = data?.table_columns_and_rows?.join_types        
        console.log('joining',data)
        console.log('relation',this.relationOfTables);
        this.getJoiningTableData();
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
  
}
joiningTables(){
  const schemaTablePairs = this.draggedtables.map((item: { schema: any; table: any; alias:any }) => [item.schema, item.table, item.alias]);
   console.log(schemaTablePairs)
   this.relationOfTables.push([])
  const obj ={
    query_set_id:this.qurtySetId,
    database_id:this.databaseId,
    joining_tables: schemaTablePairs,
    join_type:[],
    joining_conditions:this.relationOfTables,
    dragged_array:this.draggedtables
  }
  this.workbechService.joiningTables(obj)
  .subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.relationOfTables = data.table_columns_and_rows?.joining_condition;
        this.displayJoiningCndnsList = data.table_columns_and_rows?.joining_condition_list;
        this.qurtySetId = data?.table_columns_and_rows?.query_set_id
        this.joinTypes = data?.table_columns_and_rows?.join_types        
        console.log('joining',data)
        console.log('relation',this.relationOfTables);
        this.getJoiningTableData();
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
  
  // else if(schemaTablePairs.length > 2){
  //   const obj ={
  //     query_set_id:this.qurtySetId,
  //     database_id:this.databaseId,
  //     joining_tables: schemaTablePairs,
  //     join_type:[],
  //     joining_conditions:[]
  //   }
  //   this.workbechService.joiningTables(obj)
  //   .subscribe(
  //     {
  //       next:(data:any) =>{
  //         console.log(data)
  //         this.relationOfTables = data.table_columns_and_rows?.joining_condition;
  //         this.displayJoiningCndnsList = data.table_columns_and_rows?.joining_condition_list;
  //         console.log('relation',this.relationOfTables);
  //         this.getJoiningTableData();
  //       },
  //       error:(error:any)=>{
  //       console.log(error)
  //     }
  //     })
  // }
}
joiningTablesFromDelete(){
  const schemaTablePairs = this.draggedtables.map((item: { schema: any; table: any; alias:any }) => [item.schema, item.table, item.alias]);
   console.log(schemaTablePairs)
  const obj ={
    query_set_id:this.qurtySetId,
    database_id:this.databaseId,
    joining_tables: schemaTablePairs,
    join_type:[],
    joining_conditions:this.relationOfTables,
    dragged_array:this.draggedtables
  }
  this.workbechService.joiningTables(obj)
  .subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.relationOfTables = data.table_columns_and_rows?.joining_condition;
        this.displayJoiningCndnsList = data.table_columns_and_rows?.joining_condition_list;
        this.qurtySetId = data?.table_columns_and_rows?.query_set_id
        if(this.qurtySetId === 0){
          localStorage.setItem('QuerySetId','0')
        }
        this.joinTypes = data?.table_columns_and_rows?.join_types        
        console.log('joining',data)
        console.log('relation',this.relationOfTables);
        this.getJoiningTableData();
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
}
customTableJoin(){
  const schemaTablePairs = this.draggedtables.map((item: { schema: any; table: any;alias:any }) => [item.schema, item.table, item.alias]);
  console.log(schemaTablePairs)
  const t1Index = this.draggedtables.findIndex((x: { alias: any; }) => x.alias === this.selectedAliasT1)
  const t2Index = this.draggedtables.findIndex((x: { alias: any; }) => x.alias === this.selectedAliasT2)

  console.log('indexoftable1',t1Index);
   console.log('indexoftable2',t2Index);
  const customJoinCndn = this.selectedAliasT1+'.'+this.selectedClmnT1+' '+this.selectedCndn+' '+this.selectedAliasT2+'.'+this.selectedClmnT2
   const MaxInex = Math.max(t1Index,t2Index);
  console.log('custcon',customJoinCndn, 'maxind',MaxInex)
  if (!this.relationOfTables[MaxInex - 1]) {
    this.relationOfTables[MaxInex - 1] = [];
  }
  this.relationOfTables[MaxInex - 1].push(customJoinCndn)
  console.log('customrelation',this.relationOfTables)
  this.joinTypes[MaxInex - 1] = this.selectedJoin
  console.log(this.joinTypes)
  if(schemaTablePairs.length >= 2){
  const obj ={
    query_set_id:this.qurtySetId,
    database_id:this.databaseId,
    joining_tables: schemaTablePairs,
    join_type:this.joinTypes,
    joining_conditions:this.relationOfTables
  }
  this.workbechService.joiningTables(obj)
  .subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.relationOfTables = data.table_columns_and_rows?.joining_condition;
        this.displayJoiningCndnsList = data.table_columns_and_rows?.joining_condition_list;
        this.qurtySetId = data?.table_columns_and_rows?.query_set_id;       
        console.log('joining',data)
        console.log('relation',this.relationOfTables);
        this.getJoiningTableData();
        this.clearJoinCondns();
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
      this.relationOfTables.pop();
    }
    })
  }
}

// populateDropdown() {
//   const dropdownMenu = document.getElementById('dropdownMenu');
//   const selectedTableDiv = document.getElementById('selectedTable');

//   if(dropdownMenu){
//     dropdownMenu.innerHTML = '';
//   this.draggedtables.forEach((tableData: { schema: any; table: any; columns: any[]; }) => {
//     // Add table name as header
//     const tableHeader = document.createElement('li');
//     tableHeader.className = 'dropdown-header';
//     tableHeader.textContent = `${tableData.schema}.${tableData.table}`;
//     dropdownMenu.appendChild(tableHeader);

//     // Add columns
//     tableData.columns.forEach(column => {
//       console.log("Column:", column.columns); //
//       const columnItem = document.createElement('li');
//       columnItem.textContent = `${column.columns} (${column.datatypes})`;
//       columnItem.onclick = function() {
//         // Handle column selection
//         selectedTableDiv!.innerHTML = `${tableData.schema}<br>${tableData.table}`;
//         const dropdownButton = document.getElementById('dropdownMenuButton');
//         dropdownButton!.textContent = `${column.columns}`;
//         console.log("Selected column:", column.columns, "Table:", tableData.table, "Schema:", tableData.schema);
//       };
//       dropdownMenu.appendChild(columnItem);
//     });

//     // Add divider
//     const divider = document.createElement('li');
//     divider.className = 'divider';
//     dropdownMenu.appendChild(divider);
//   });
// }else{
//   console.log('erriieor')
// }
// this.enableJoinButton();
// }
// s

enableJoinButton(){

if( this.selectedJoin && this.selectedCndn)
  {
    this.enableJoinBtn = false;
  }else {
    this.enableJoinBtn = true;
  }
  
}
clearJoinCondns(){
 
  this.selectedJoin ='Condition';
  this.selectedCndn ='Operator';
  this.selectedClmnT1 = 'Select Column';
  this.selectedClmnT2 = 'Select Column'
  this.enableJoinButton();
}

getJoiningTableData(){
  const obj ={
    database_id:this.databaseId,
    query_id:this.qurtySetId,
    datasource_queryset_id:this.datasourceQuerysetId
  }
  this.workbechService.getTableJoiningData(obj).subscribe(
    {
      next:(data:any) =>{
        console.log('qury_data/tablejoined_data',data)
        this.TabledataJoining = data;
        this.qryTime = data.query_exection_time;
        this.qryRows = data.no_of_rows;
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
}
deleteJoiningRelation(index:number){

  const deleteCondtin = this.displayJoiningCndnsList[index][0]
  console.log(deleteCondtin)
  this.relationOfTables = this.relationOfTables.map((subArray: any[]) =>
    subArray.filter(item => item !== deleteCondtin)
  ).filter((subArray: string | any[]) => subArray.length > 0);
  console.log('deletedcondfromrelatiion',this.relationOfTables)

  if (index > -1 && index < this.displayJoiningCndnsList.length) {
    this.displayJoiningCndnsList.splice(index, 1);
    //this.relationOfTables.splice(index,1);
  }
  // console.log('removedjoining',this.displayJoiningCndnsList)
}

openSuperScaled(modal: any) {
  this.modalService.open(modal, {
    centered: true,
    windowClass: 'animate__animated animate__zoomIn',
  });
  this.tableColumnFilter = true;
  this.columnRowFilter = false;
  this.callColumnWithTable();
}
openRowsData(modal: any) {
  this.modalService.open(modal, {
    centered: true,
    windowClass: 'animate__animated animate__zoomIn',
  });
}
callColumnWithTable(){
  const obj ={
    database_id:this.databaseId,
    query_set_id :this.qurtySetId,
    type_of_filter:'datasource'
  }
  this.workbechService.callColumnWithTable(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
       this.columnWithTablesData= data
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
}
selectedColumnGetRows(col:any,datatype:any){
  const obj ={
    database_id:this.databaseId,
    query_set_id:this.qurtySetId,
    datasource_queryset_id:this.datasourceQuerysetId,
    type_of_filter:'datasource',
    col_name:col,
    data_type:datatype,
  }
  this.workbechService.selectedColumnGetRows(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.columnsInFilters= data.col_data.map((item: any) => ({ label: item, selected: false }))
        this.datasourceFilterId=data.filter_id;
        this.datasourceFilterIdArray.push(data.filter_id);
        this.tableColumnFilter =false;
        this.columnRowFilter = true;
        console.log('colmnfilterrows',this.columnsInFilters)
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
}

getSelectedRows() {
  this.selectedRows = this.columnsInFilters
  .filter((row: { selected: any; }) => row.selected)
  .map((row: { label: any; }) => row.label);
  console.log('selected rows',this.selectedRows);

  const obj = {
    filter_id:this.datasourceFilterId,
    database_id:this.databaseId,
    queryset_id:this.qurtySetId,
    type_of_filter:'datasource',
    datasource_querysetid:null,
    select_values:this.selectedRows,
    range_values:null
  }

  this.workbechService.getSelectedRowsFilter(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.datasourceFilterId = data.filter_id;
        this.getDsQuerysetId();
        this.modalService.dismissAll('close')
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })

}
getDsQuerysetId(){
  const obj ={
    datasource_queryset_id:this.datasourceQuerysetId,
    queryset_id:this.qurtySetId,
    filter_id:this.datasourceFilterIdArray,
    database_id:this.databaseId
  }
  this.workbechService.getDsQuerysetId(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.datasourceQuerysetId = data.data.datasource_queryset_id;
        this.getJoiningTableData();
        this.getFilteredList();
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
}
getFilteredList(){
  const obj ={
    query_set_id:this.qurtySetId,
    database_id:this.databaseId,
    type_of_filter:'datasource'
  }
  this.workbechService.getFilteredList(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.filteredList = data.filters_data;
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
}
editFilter(id:any){
  const obj ={
    type_filter:'datasource',
    database_id:this.databaseId,
    filter_id:id
  }
  this.workbechService.editFilter(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.editFilterList = data.result;
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })

}
deleteFilter(id:any){
  this.modalService.dismissAll('close')
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result)=>{
    if(result.isConfirmed){
  this.workbechService.deleteFilter(this.databaseId,id).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        if(data){
          Swal.fire({
            icon: 'success',
            title: 'Removed!',
            text: ' Filter Removed Successfully',
            width: '400px',
          })
        }
        console.log('filter ids',this.datasourceFilterIdArray)
        this.datasourceFilterIdArray = this.datasourceFilterIdArray.filter(item => item !== id);
        this.getDsQuerysetId()
        this.getFilteredList();
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
  }})


}
getSelectedRowsFromEdit() {
  this.selectedRows = this.editFilterList
  .filter((row: { selected: any; }) => row.selected)
  .map((row: { label: any; }) => row.label);
  console.log('selected rows',this.selectedRows);

  const obj = {
    filter_id:this.datasourceFilterId,
    database_id:this.databaseId,
    queryset_id:this.qurtySetId,
    type_of_filter:'datasource',
    datasource_querysetid:null,
    select_values:this.selectedRows,
    range_values:null
  }

  this.workbechService.getSelectedRowsFilter(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.datasourceFilterId = data.filter_id;
        this.getDsQuerysetId();
         this.modalService.dismissAll('close')
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })

}
goToConnections(){
  this.router.navigate(['/workbench/work-bench/view-connections'])
}

goToSheet(){
  const encodedDatabaseId = btoa(this.databaseId.toString());
  const encodedQuerySetId = btoa(this.qurtySetId.toString());
  this.router.navigate(['/workbench/sheets'+'/'+ encodedDatabaseId +'/' +encodedQuerySetId])
}

}
