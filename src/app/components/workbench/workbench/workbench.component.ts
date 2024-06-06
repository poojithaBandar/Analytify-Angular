import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
import Swal from 'sweetalert2';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { ToastrModule, ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-workbench',
  standalone: true,
  imports: [RouterModule,NgbModule,SharedModule,FormsModule,CdkDropListGroup, CdkDropList, CdkDrag,GalleryModule,LightboxModule,ToastrModule],
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
  connectionList =[] as any;

  viewNewDbs = false;
  imageData3 = data3;
  showPassword1 = false;
  toggleClass = "off-line";
toggleClass1 = "off-line";
  constructor(private modalService: NgbModal, private workbechService:WorkbenchService,private router:Router,private toasterservice:ToastrService){   
  }
  
    postGreServerName = '';
    postGrePortName = '';
    postGreDatabaseName = '';
    postGreUserName = '';
    PostGrePassword = '';
    OracleServiceName = '';
    displayName ='';

    openPostgreSql(){
    this.openPostgreSqlForm=true;
    this.databaseconnectionsList= false;
    this.viewNewDbs = false;
    }
    postgreSignIn(){
      const obj={
          "database_type":"postgresql",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "database": this.postGreDatabaseName,
          "display_name":this.displayName
      }
        this.workbechService.postGreSqlConnection(obj).subscribe({next: (responce) => {
              console.log(responce);
              console.log('tablelist',this.tableList)
              this.databaseName = responce.database.database_name
              this.databaseId = responce.database.database_id
              if(responce){
                Swal.fire({
                  icon: 'success',
                  title: 'Connected',
                  width: '400px',
                })
                this.databaseId=responce.database?.database_id
                this.modalService.dismissAll();
                this.openPostgreSqlForm = false;
                this.router.navigate(['/workbench/database-connection/tables/'+this.databaseId]);
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
              // Swal.fire({
              //   icon:'error',
              //   title:'error',
              //   text:error.error.message,
              //   width:'600px'
              // })

            }
          }
        )

    }
    OracleSignIn(){
      const obj={
          "database_type":"oracle",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName
      }
        this.workbechService.postGreSqlConnection(obj).subscribe({next: (responce) => {
              console.log(responce);
              console.log('tablelist',this.tableList)
              this.databaseName = responce.database.database_name
              this.databaseId = responce.database.database_id
              if(responce){
                Swal.fire({
                  icon: 'success',
                  title: 'Connected',
                  width: '400px',
                })
                this.databaseId=responce.database?.database_id
                this.modalService.dismissAll();
                this.openPostgreSqlForm = false;
                this.router.navigate(['/workbench/database-connection/tables/'+this.databaseId]);
              }
            },
            error: (error) => {
              console.log(error);
              Swal.fire({
                icon: 'warning',
                text: error.error.message,
                width: '300px',
              })
            }
          }
        )

    }

    deleteDbConnection(id:any){
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
          this.workbechService.deleteDbConnection(id)
          .subscribe(
            {
              next:(data:any) => {
                console.log(data);      
                if(data){
                  Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Databse Deleted Successfully',
                    width: '400px',
                  })
                }
                this.getDbConnectionList();
              },
              error:(error:any)=>{
                Swal.fire({
                  icon: 'warning',
                  text: error.error.message,
                  width: '300px',
                })
                console.log(error)
              }
            } 
          )
        }})
    }
    editDbConnectionModal(OpenmdoModal: any) {
      this.modalService.open(OpenmdoModal);
    }
    editDbDetails(id:any){
      const editDataArray  = this.connectionList.filter((item: { database_id: number; }) => item.database_id == id);
      console.log(editDataArray)
      const editData = editDataArray[0] 
    this.postGreServerName =editData.hostname;
    this.postGrePortName = editData.port;
    this.postGreDatabaseName = editData.database;
    this.postGreUserName = editData.username;
    this.PostGrePassword = '';
    this.OracleServiceName = '';
    this.displayName = editData.display_name;



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
    toggleVisibility1() {
      this.showPassword1 = !this.showPassword1;
      if (this.toggleClass1 === "off-line") {
        this.toggleClass1 = "line";
      } else {
        this.toggleClass1 = "off-line";
      }
    }
  ngOnInit(): void {
    {
      document.querySelector('html')?.getAttribute('data-toggled') != null
        ? document.querySelector('html')?.removeAttribute('data-toggled')
        : document
            .querySelector('html')
            ?.setAttribute('data-toggled', 'icon-overlay-close');    
    }
   this.getDbConnectionList();
  }
  getDbConnectionList(){
    this.workbechService.getdatabaseConnectionsList().subscribe({
      next:(data)=>{
        console.log(data);
        this.connectionList = data.connections
       },
      error:(error)=>{
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
  getTablesFromConnectedDb(id:any){
    this.router.navigate(['/workbench/database-connection/tables/'+id]);
    //     this.workbechService.getTablesFromConnectedDb(id).subscribe({next: (responce) => {

//     if(Array.isArray(responce.data)){
//       this.tableList= responce.data
//     }
//     else{
//     this.tableList = this.combineArrays(responce.data)
//     }
//     console.log('tablelist',this.tableList)
//     this.databaseName = responce.database.database_name
//     this.databaseId = responce.database.database_id
//     if(responce){
//       this.databaseconnectionsList= false
//       this.openTablesUI = true;
//     }
//   },
//   error:(error)=>{
//     console.log(error);
//   }
// })
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
const data3 = [
  {
    srcUrl: "./assets/images/Db_server_images/ibmdb2.png",
    previewUrl: "./assets/images/Db_server_images/ibmdb2.png",
  },
  {
    srcUrl: "./assets/images/Db_server_images/MongoDB_Logo.png",
    previewUrl: "./assets/images/Db_server_images/MongoDB_Logo.png",
  },
  {
    srcUrl: "./assets/images/Db_server_images/mysql.png",
    previewUrl: "./assets/images/Db_server_images/mysql.png",
  },
  {
    srcUrl: "./assets/images/Db_server_images/Oracle_logosvg.png",
    previewUrl: "./assets/images/Db_server_images/Oracle_logosvg.png"
  },
  {
    srcUrl: './assets/images/Db_server_images/postgreSql.png',
    previewUrl: './assets/images/Db_server_images/postgreSql.png',
  },
  {
    srcUrl: './assets/images/Db_server_images/sql_server.png',
    previewUrl: './assets/images/Db_server_images/sql_server.png',
  },
  {
    srcUrl: './assets/images/Db_server_images/sqlite.png',
    previewUrl: './assets/images/Db_server_images/sqlite.png',
  },

];