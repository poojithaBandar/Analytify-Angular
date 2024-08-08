import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsightsButtonComponent } from '../insights-button/insights-button.component';
import { ViewTemplateDrivenService } from '../view-template-driven.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [NgbModule,CommonModule,FormsModule,InsightsButtonComponent,NgSelectModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})

export class LandingpageComponent implements OnInit {
searchDbName:any
userSheetsList :any[] =[];
savedDashboardList: any[] =[];
connectionList:any[]=[];
savedQueryList:any[]=[];
showAllSheets = true;
showAllDasboards = true;
showAllSavedQueries = true;
wholeSearch:any
viewDatabbses = false;
viewSheets = false;
viewDashboardList = false;
viewCustomSql = false;
roleDetails = [] as any;
selectedRoleIds = [] as any;
usersOnSelectedRole =[] as any;
selectedUserIds = [] as any;
dashboardPropertyTitle :any;
dashboardId :any
@ViewChild('propertiesModal') propertiesModal : any;

constructor(private router:Router,private workbechService:WorkbenchService,private templateService:ViewTemplateDrivenService,public modalService:NgbModal){
  localStorage.setItem('QuerySetId', '0');
  this.viewDatabbses=this.templateService.viewDtabase();
  this.viewSheets = this.templateService.viewSheets();
  this.viewDashboardList = this.templateService.viewDashboard();
  this.viewCustomSql = this.templateService.viewCustomSql();
}

ngOnInit(){
  if(this.viewDatabbses){
    this.getDbConnectionList();
  }if(this.viewSheets){
    this.getuserSheets();
  }if(this.viewDashboardList){
    this.getuserDashboardsList();
  }if(this.viewCustomSql){
  this.getSavedQueries();
  }
}
totalSearch(){
  this.getuserSheets();
  this.getuserDashboardsList();
  this.getSavedQueries();
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
      this.connectionList = data.sheets
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
    search:this.wholeSearch,
    page_count:'12'
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
    search:this.wholeSearch,
    page_count:'12'

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
getSavedQueries(){
  const Obj ={
    search : this.wholeSearch,
    page_count:'12'

  }
  if(Obj.search == '' || Obj.search == null){
    delete Obj.search;
  }
  this.workbechService.getSavedQueryList(Obj).subscribe({
    next:(data)=>{
      console.log(data);
      this.savedQueryList = data.sheets
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
viewDashboard(serverId:any,querysetId:any,dashboardId:any){
  const encodedServerId = btoa(serverId.toString());
  const encodedQuerySetId = btoa(querysetId.toString());
  const encodedDashboardId = btoa(dashboardId.toString());

  this.router.navigate(['/workbench/landingpage/sheetsdashboard/'+encodedServerId+'/'+encodedQuerySetId+'/'+encodedDashboardId])
}
viewSheet(serverId:any,fileId:any,querysetId:any,sheetId:any){
  const encodedQuerySetId = btoa(querysetId.toString());
  const encodedSheetId = btoa(sheetId.toString());

  if (serverId === null ) {
    const encodedFileId = btoa(fileId.toString());
    this.router.navigate(['/workbench/landingpage/fileId/sheets/'+encodedFileId+'/'+encodedQuerySetId+'/'+encodedSheetId])

  }

  if(fileId === null){
    const encodedServerId = btoa(serverId.toString());
    this.router.navigate(['/workbench/landingpage/dbId/sheets/'+encodedServerId+'/'+encodedQuerySetId+'/'+encodedSheetId])

  }
 
}

 sheetsRoute(){
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
  deleteSheet(serverId:any,fileId:any,qurysetId:any,sheetId:any){
    const obj ={
      sheet_id:sheetId,
    }
    this.workbechService.deleteSheetMessage(obj)
    .subscribe(
      {
        next:(data:any) => {
          console.log(data);      
          if(data){
            Swal.fire({
              title: 'Are you sure?',
              text: data.message,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result)=>{
              if(result.isConfirmed){
                const idToPass = fileId == null ? serverId : fileId;
                this.workbechService.deleteSheet(idToPass,qurysetId,sheetId)
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
  }


  deleteSavedQuery(qrysetId:any){
    const obj ={
      queryset_id:qrysetId,
    }
    this.workbechService.deleteSavedQueryMessage(obj)
    .subscribe(
      {
        next:(data:any) => {
          console.log(data);      
          if(data){
            Swal.fire({
              title: 'Are you sure?',
              text: data.message,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result)=>{
              if(result.isConfirmed){
                this.workbechService.deleteSavedQuery(qrysetId)
                .subscribe(
                  {
                    next:(data:any) => {
                      console.log(data);      
                      if(data){
                        Swal.fire({
                          icon: 'success',
                          title: 'Deleted!',
                          text: 'Query Deleted Successfully',
                          width: '400px',
                        })
                      }
                      this.getSavedQueries();
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


  }

  viewAllSheets(){
    this.router.navigate(['/workbench/sheets-dashboard']) 

  }
  viewAllDashboards(){
    this.router.navigate(['/workbench/dashboard-page']) 

  }
  viewAllSavedQueries(){
    this.router.navigate(['/workbench/saved-queries']) 

  }
  gotoSavedQuery(dbId:any,qrySetId:any){
    const encodedServerId = btoa(dbId.toString());
    const encodedQuerySetId = btoa(qrySetId.toString());

    this.router.navigate(['workbench/database-connection/savedQuery/'+encodedServerId+'/'+encodedQuerySetId])
  }


  viewPropertiesTab(name :any,dashboardId:any){
  this.modalService.open(this.propertiesModal);
  this.getRoleDetailsDshboard();
  this.dashboardPropertyTitle = name;
  this.dashboardId = dashboardId

  }
  onRolesChange(selected: string[]) {
    console.log(selected);
    this.selectedRoleIds = selected
    // You can store or process the selected values here
}
getRoleDetailsDshboard(){
  this.workbechService.getRoleDetailsDshboard().subscribe({
    next:(data)=>{
      console.log('dashboardroledetails',data);
      this.roleDetails = data;
      // this.getUsersforRole();
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
getUsersforRole(){
  const obj ={
    role_ids:this.selectedRoleIds
  }
  this.workbechService.getUsersOnRole(obj).subscribe({
    next:(data)=>{
      this.usersOnSelectedRole = data
      console.log('usersOnselecetdRoles',data);
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
getSelectedUsers(selected: string[]){
console.log(selected)
this.selectedUserIds = selected
}

saveDashboardProperties(){
  const obj ={
    dashboard_id:this.dashboardId,
    role_ids:this.selectedRoleIds,
    user_ids:this.selectedUserIds
  }
  this.workbechService.saveDashboardProperties(obj).subscribe({
    next:(data)=>{
      console.log('properties save',data);
      this.modalService.dismissAll();
      Swal.fire({
        icon: 'success',
        title: 'Done!',
        text: data.message,
        width: '400px',
      })
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
}
