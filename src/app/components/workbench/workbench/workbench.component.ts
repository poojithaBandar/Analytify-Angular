import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';
import { FormsModule } from '@angular/forms';
import { WorkbenchService } from '../workbench.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { of } from 'rxjs';
import { data } from '../../charts/echarts/echarts';
@Component({
  selector: 'app-workbench',
  standalone: true,
  imports: [RouterModule,NgbModule,SharedModule,FormsModule,CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './workbench.component.html',
  styleUrl: './workbench.component.scss'
})
export class WorkbenchComponent implements OnInit{
  tableList = [] as any;
  dragedTableName: any;
  databaseconnectionsList=true;
  draggedtables = [] as any;
  getTableColumns = [] as any;
  getTableRows = [] as any;
  relationOfTables = [] as any;
  databaseId:any;
  openPostgreSqlForm= false;
  openTablesUI = false;
  databaseName:any;
  tableName:any;
  selectedClmnT1:any;
  selectedClmnT2:any;
  selectedCndn:any;
  tableRelationUi = false;
  custmT1Data = [] as any;
  custmT2Data = [] as any;
  constructor(private modalService: NgbModal, private workbechService:WorkbenchService){   
  }
  
    postGreServerName = "e-commerce.cj3oddyv0bsk.us-west-1.rds.amazonaws.com";
    postGrePortName = "5432";
    postGreDatabaseName = "insightapps";
    postGreUserName = "postgres";
    PostGrePassword = "Welcome!234";
  


    openPostgreSql(){
    this.openPostgreSqlForm=true;
    this.databaseconnectionsList= false;
    }
    postgreSignIn(){
      const obj={
          "database_type":"postgresql",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "database": this.postGreDatabaseName
      }
        this.workbechService.postGreSqlConnection(obj).subscribe({next: (responce) => {
              console.log(responce);
              // this.tableList = responce.data
              if(Array.isArray(responce.data)){
                this.tableList= responce.data
              }
              else{
              this.tableList = this.combineArrays(responce.data)
              }
              console.log('tablelist',this.tableList)
              this.databaseName = responce.database.database_name
              this.databaseId = responce.database.database_id
              if(responce){
                // this.modalService.dismissAll();
                this.openPostgreSqlForm = false;
                this.openTablesUI = true;
              }
            },
            error: (error) => {
              console.log(error);
            }
          }
        )

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
    // dragItem(item:any){
    //   this.dragedTableName = item;
    //   const obj={
    //     "db_url":"postgresql://postgres:Welcome!234@e-commerce.cj3oddyv0bsk.us-west-1.rds.amazonaws.com/HMS_Production",
    //     "tables":this.dragedTableName
    // }
    //   this.workbechService.getTableData(obj).subscribe({next: (responce:any) => {
    //         console.log(responce);
    //        // this.tablePreview = responce;
    //       },
    //       error: (error) => {
    //         console.log(error);
    //       }
    //     }
    //   )
    // }
    Openmdo(OpenmdoModal: any) {
      this.modalService.open(OpenmdoModal);
    }

  ngOnInit(): void {
    {
      document.querySelector('html')?.getAttribute('data-toggled') != null
        ? document.querySelector('html')?.removeAttribute('data-toggled')
        : document
            .querySelector('html')
            ?.setAttribute('data-toggled', 'icon-overlay-close');

            
    }
  }


  // drop(event: CdkDragDrop<string[]>) {
  //   if (event?.previousContainer === event?.container) {
  //     moveItemInArray(event?.container?.data, event?.previousIndex, event?.currentIndex);
  //   } else {
  //     event.previousContainer.data,
  //     event.container.data,
  //     event.previousIndex,
  //     event.currentIndex
  //   }
  // }

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
      this.draggedtables.splice(event.currentIndex, 0, element);
      console.log('darggedtable',this.draggedtables)
     }
     this.getTableData();
     if(this.draggedtables.length > 1){
      const obj ={
        database_id : this.databaseId,
        tables : [[this.draggedtables[0].schema,this.draggedtables[0].table],[this.draggedtables[1].schema,this.draggedtables[1].table]]
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
        this.getTableColumns = data.column_data;
        this.getTableRows = data.row_data;
        this.tableName = data?.column_data[0]?.table

      },
      error:(error:any)=>{
        console.log(error)
      }
    })

    
  }

  onDeleteItem(index: number) {
     this.draggedtables.splice(index, 1); // Remove the item from the droppedItems array
     console.log(this.draggedtables)
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
}
