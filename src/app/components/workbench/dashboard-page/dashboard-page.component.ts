import { Component, OnInit } from '@angular/core';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [NgbModule,CommonModule,SharedModule,FormsModule,NgxPaginationModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit{
  savedDashboardList:any[]=[];
  dashboardName :any;
  itemsPerPage!:any;
  pageNo = 1;
  page: number = 1;
  totalItems:any;
  gridView = false;
constructor(private workbechService:WorkbenchService,private router:Router){}
ngOnInit(){
this.getuserDashboardsListput();
}
pageChangeUserDashboardsList(page:any){
this.pageNo=page;
this.getuserDashboardsListput();
}
searchDashboarList(){
  this.pageNo=1;
  this.getuserDashboardsListput();
}
getuserDashboardsListput(){
  const Obj ={
    search:this.dashboardName,
    page_no:this.pageNo,
    page_count:this.itemsPerPage

  }
  if(Obj.search == '' || Obj.search == null){
    delete Obj.search;
  }
  if(Obj.page_count == undefined || Obj.page_count == null){
    delete Obj.page_count;
  }
  this.workbechService.getuserDashboardsListput(Obj).subscribe(
    {
      next:(data:any) =>{
        this.savedDashboardList=data.sheets
        this.itemsPerPage = data.items_per_page;
        this.totalItems = data.total_items;
        console.log('dashboardList',this.savedDashboardList)

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
deleteDashboard(serverId:any,qurysetId:any,dashboardId:any){
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
      this.workbechService.deleteDashboard(serverId,qurysetId,dashboardId)
      .subscribe(
        {
          next:(data:any) => {
            console.log(data);      
            if(data){
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Dashboard Deleted Successfully',
                width: '400px',
              })
            }
            this.getuserDashboardsListput();
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
viewDashboard(serverId:any,querysetId:any,dashboardId:any){
  const encodedServerId = btoa(serverId.toString());
  const encodedQuerySetId = btoa(querysetId.toString());
  const encodedDashboardId = btoa(dashboardId.toString());

  this.router.navigate(['/workbench/landingpage/sheetsdashboard/'+encodedServerId+'/'+encodedQuerySetId+'/'+encodedDashboardId])
}
dashboardRoute(){
  
}
}
