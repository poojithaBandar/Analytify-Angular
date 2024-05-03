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
  constructor(private modalService: NgbModal, private workbechService:WorkbenchService){

  }
  
    postGreServerName = "e-commerce.cj3oddyv0bsk.us-west-1.rds.amazonaws.com";
    postGrePortName = "5432";
    postGreDatabaseName = "insightapps";
    postGreUserName = "postgres";
    PostGrePassword = "Welcome!234";
  
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
}
