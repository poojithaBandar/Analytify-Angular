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

@Component({
  selector: 'app-database',
  standalone: true,
  imports: [SharedModule,CdkDropListGroup, CdkDropList, CdkDrag,NgbModule,FormsModule,NgbModule],
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
  cutmquryTableError:any;
  remainingTables = [] as any;
  qurtySetId:any;
  enableJoinBtn = true;
  customSql = false;
  tableJoiningUI = true;
  isOpen = true;

  menus = [
    {
      name: 'Schema1',
      expanded: false,
      submenus: [
        { name: 'Table 1' },
        { name: 'Table 2' }
      ]
    },
    {
      name: 'Schema 2',
      expanded: false,
      submenus: [
        { name: 'Table 1' },
        { name: 'Table 2' }
      ]
    }
  ]
  constructor( private workbechService:WorkbenchService,private router:Router,private route:ActivatedRoute,private modalService: NgbModal){
    const currentUrl = this.router.url;
     this.databaseId = route.snapshot.params['id']
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
  }
  toggleCard() {
    this.isOpen = !this.isOpen;
  }
  toggleSubMenu(menu: any) {
    menu.expanded = !menu.expanded;
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
    this.databaseName = responce.database.database_name
    this.databaseId = responce.database.database_id
  },
  error:(error)=>{
    console.log(error);
  }
})
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
    // transferArrayItem(event.previousContainer.data,
    //                   event.container.data,
    //                   event.previousIndex,
    //                   event.currentIndex);
    //                   console.log('previouscont:'+event.previousContainer.data,
    //                   'eventcont:'+event.container.data)
    //                  console.log(event.previousContainer.data,'inex:'+event.currentIndex)


    let item: any = event.previousContainer.data[event.previousIndex];
    console.log('item' + JSON.stringify(item));
    let copy: any = JSON.parse(JSON.stringify(item));

    console.log('copy' + JSON.stringify(copy));
    let element: any = {};
    for (let attr in copy) {
      console.log('attr' + attr);
      if (attr == 'title') {
        element[attr] = copy[attr];
      } else {
        element[attr] = copy[attr];
      }
    }
   // this.draggedtables.splice(event.currentIndex, 0, element);
   //this.draggedtables.push(element);
    this.pushToDraggedTables(element)
    console.log('darggedtable',this.draggedtables)
   }
   //this.joiningTables();
   if(this.draggedtables.length !== 0){
    this.joiningTables();
    //   database_id : this.databaseId,
    //   tables : [[this.draggedtables[0].schema,this.draggedtables[0].table],[this.draggedtables[1].schema,this.draggedtables[1].table]]
    // }
    // this.workbechService.tableRelation(obj)
    // .subscribe(
    //   {
    //     next:(data:any) =>{
    //       console.log(data)
    //       this.relationOfTables = data[2]?.relation?.condition
    //       console.log('relation',this.relationOfTables)
    //     },
    //     error:(error:any)=>{
    //     console.log(error)
    //   }
    //   })w
   }
}

pushToDraggedTables(newTable:any): void {
  // if(!newTable.hasOwnProperty('alias')){
  //   newTable['alias']=newTable.table;
  //   this.draggedtables.push(newTable);
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

  // newTable.alias = tableName;
  // this.draggedtables.push(newTable);
  //console.log('tname',newTable.table)
// }else{
// console.log('something wrong')
// }
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
getTableData(){
  const obj ={
    database_id:this.databaseId,
    tables:[[this.draggedtables[0].schema,this.draggedtables[0].table]]
  }
  this.workbechService.getTableData(obj).subscribe({
    next:(data:any)=>{
      console.log(data);
      // this.getTableColumns = data.column_data;
      // this.getTableRows = data.row_data;
      // this.tableName = data?.column_data[0]?.table
      this.cutmquryTable = data

    },
    error:(error:any)=>{
      console.log(error)
    }
  })
}

onDeleteItem(index: number) {
   this.draggedtables.splice(index, 1); // Remove the item from the droppedItems array
   console.log(this.draggedtables);
   if(this.draggedtables.length !== 0){
   this.joiningTables();
   }
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


joiningTables(){
  const schemaTablePairs = this.draggedtables.map((item: { schema: any; table: any; alias:any }) => [item.schema, item.table, item.alias]);
  console.log(schemaTablePairs)
  const obj ={
    query_set_id:'0',
    database_id:this.databaseId,
    joining_tables: schemaTablePairs,
    join_type:[],
    joining_conditions:[]
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
  this.relationOfTables[MaxInex - 1].push(customJoinCndn)
  console.log('customrelation',this.relationOfTables)
  this.joinTypes[MaxInex - 1] = this.selectedJoin
  console.log(this.joinTypes)
  if(schemaTablePairs.length >= 2){
  const obj ={
    query_set_id:'0',
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
    query_id:this.qurtySetId
  }
  this.workbechService.getTableJoiningData(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.cutmquryTable = data
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
  if (index > -1 && index < this.displayJoiningCndnsList.length) {
    this.displayJoiningCndnsList.splice(index, 1);
  }
  console.log('removedjoining',this.displayJoiningCndnsList)
}

openSuperScaled(modal: any) {
  this.modalService.open(modal, {
    centered: true,
    windowClass: 'animate__animated animate__zoomIn',
  });
}
openRowsData(modal: any) {
  this.modalService.open(modal, {
    centered: true,
    windowClass: 'animate__animated animate__zoomIn',
  });
}
}

// import { trigger, state, style, transition, animate } from '@angular/animations';

// export const toggleAnimation = trigger('toggle', [
//   state('open', style({
//     width: '300px', // Adjust as needed
//     opacity: 1,
//   })),
//   state('closed', style({
//     width: '0px',
//     opacity: 0,
//     display: 'none'
//   })),
//   transition('open <=> closed', [
//     animate('0.3s ease-in-out')
//   ]),
// ]);