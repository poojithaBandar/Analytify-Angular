import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/sharedmodule';

@Component({
  selector: 'app-users-dashboard',
  standalone: true,
  imports: [SharedModule,CommonModule,FormsModule,NgbModule,NgxPaginationModule],
  templateUrl: './users-dashboard.component.html',
  styleUrl: './users-dashboard.component.scss'
})
export class UsersDashboardComponent {

  constructor(public modalService:NgbModal){}
  gridView = true;
  userName ='';
  itemsPerPage:any;
  pageNo = 1;
  page: number = 1;
  totalItems:any;
  savedUsersList =[] as any
  ngOnInit(){

  }

  searchUserList(){

  }
  getUserList(){

  }
  pageChangegetUserList(pageNo:any){

  }
  addUserModal(OpenmdoModal: any) {
    this.modalService.open(OpenmdoModal);
  }
}
