import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [NgbModule,CommonModule,FormsModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})

export class LandingpageComponent implements OnInit {
  searchDbName:any
userSheetsList :any[] =[];
savedDashboardList: any[] =[];
connectionList:any[]=[];
showAllSheets = true;
showAllDasboards = true;
wholeSearch:any
constructor(private router:Router,private workbechService:WorkbenchService){
}

ngOnInit(){
  this.getuserSheets();
  this.getuserDashboardsList();
  this.getDbConnectionList();
}
totalSearch(){
  this.getuserSheets();
  this.getuserDashboardsList();
}
getDbConnectionList(){
  const Obj ={
    search : this.searchDbName
  }
  if(Obj.search == '' || Obj.search == null){
    delete Obj.search;
  }
  this.workbechService.getdatabaseConnectionsList(Obj).subscribe({
    next:(data)=>{
      this.connectionList = data.connections
      console.log('jdhcvjsh',this.connectionList);

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
getuserSheets(){
  const Obj ={
    search:this.wholeSearch
  }
  if(Obj.search == '' || Obj.search == null){
    delete Obj.search;
  }
  this.workbechService.getUserSheetListPut(Obj).subscribe(
    {
      next:(data:any) =>{
        this.userSheetsList=data?.sheets
        console.log(this.userSheetsList)

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
getuserDashboardsList(){
  const Obj ={
    search:this.wholeSearch
  }
  if(Obj.search == '' || Obj.search == null){
    delete Obj.search;
  }
  this.workbechService.getuserDashboardsListput(Obj).subscribe(
    {
      next:(data:any) =>{
        this.savedDashboardList=data.sheets
        console.log(this.savedDashboardList)

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
viewDashboard(serverId:any,querysetId:any,dashboardId:any){
  const encodedServerId = btoa(serverId.toString());
  const encodedQuerySetId = btoa(querysetId.toString());
  const encodedDashboardId = btoa(dashboardId.toString());

  this.router.navigate(['/workbench/landingpage/sheetsdashboard/'+encodedServerId+'/'+encodedQuerySetId+'/'+encodedDashboardId])
}
viewSheet(serverId:any,querysetId:any,sheetId:any,sheetname:any){
  const encodedServerId = btoa(serverId.toString());
  const encodedQuerySetId = btoa(querysetId.toString());
  const encodedSheetId = btoa(sheetId.toString());
  const encodedSheetName = btoa(sheetname);

  this.router.navigate(['/workbench/landingpage/sheets/'+encodedServerId+'/'+encodedQuerySetId+'/'+encodedSheetId+'/'+encodedSheetName])
}

 dashboardRoute(){
    this.router.navigate(['/workbench/sheets'])  
  }
  newConnections(){
    this.router.navigate(['workbench/work-bench/new-connections']) 
  }
  goToConnections(){
    this.router.navigate(['workbench/work-bench/view-connections']) 

  }
  getTablesFromConnectedDb(id:any){
    const encodedId = btoa(id.toString());
    this.router.navigate(['/workbench/database-connection/tables/'+encodedId]);
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
              this.getuserDashboardsList();
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
  deleteSheet(serverId:any,qurysetId:any,sheetId:any){
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
        this.workbechService.deleteSheet(serverId,qurysetId,sheetId)
        .subscribe(
          {
            next:(data:any) => {
              console.log(data);      
              if(data){
                Swal.fire({
                  icon: 'success',
                  title: 'Deleted!',
                  text: 'Sheet Deleted Successfully',
                  width: '400px',
                })
              }
              this.getuserSheets();
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
}
