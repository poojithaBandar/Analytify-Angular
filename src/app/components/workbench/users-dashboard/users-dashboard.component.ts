import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/sharedmodule';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-dashboard',
  standalone: true,
  imports: [SharedModule,CommonModule,FormsModule,NgbModule,NgxPaginationModule],
  templateUrl: './users-dashboard.component.html',
  styleUrl: './users-dashboard.component.scss'
})
export class UsersDashboardComponent {

  constructor(public modalService:NgbModal,private workbechService:WorkbenchService){}
  gridView = true;
  userName ='';
  itemsPerPage:any;
  pageNo = 1;
  page: number = 1;
  totalItems:any;
  savedUsersList =[] as any;
  searchUser :any
  ngOnInit(){
    this.getUserList()
  }

  searchUserList(){

  }
  getUserList(){
    const obj ={
      search : this.searchUser
    }
    if(obj.search === '' || obj.search === null){
      delete obj.search
    }
    this.workbechService.getUserList(obj).subscribe({
      next:(data)=>{
        console.log(data);
        this.savedUsersList=data
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
  pageChangegetUserList(pageNo:any){

  }
  addUserModal(OpenmdoModal: any) {
    this.modalService.open(OpenmdoModal);
  }
}
