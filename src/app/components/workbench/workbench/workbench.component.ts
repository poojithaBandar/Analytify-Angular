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
  openPostgreSqlForm= false;
  openTablesUI = false;
  databaseName:any;
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
              this.tableList = responce.data
              this.databaseName = responce.database.database_name
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
    dragItem(item:any){
      this.dragedTableName = item;
      const obj={
        "db_url":"postgresql://postgres:Welcome!234@e-commerce.cj3oddyv0bsk.us-west-1.rds.amazonaws.com/HMS_Production",
        "tables":this.dragedTableName
    }
      this.workbechService.getTableData(obj).subscribe({next: (responce:any) => {
            console.log(responce);
           // this.tablePreview = responce;
          },
          error: (error) => {
            console.log(error);
          }
        }
      )
    }
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
     }
  }
  onDeleteItem(index: number) {
     this.draggedtables.splice(index, 1); // Remove the item from the droppedItems array
     console.log(this.draggedtables)
  }
}
