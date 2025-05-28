import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { InsightsButtonComponent } from '../insights-button/insights-button.component';
import { ViewTemplateDrivenService } from '../view-template-driven.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [NgbModule,CommonModule,SharedModule,FormsModule,NgxPaginationModule,InsightsButtonComponent,NgSelectModule],
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
  gridView = true;
  viewDashboardList = false;
  dashboardId:any;
  dashboardPropertyTitle:any;
  roleDetails = [] as any;
  selectedRoleIds = [] as any;
  selectedRoleIdsToNumbers = [] as any;
  selectedUserIds = [] as any;
  selectedUserIdsToNumbers = [] as any;
  usersOnSelectedRole = [] as any;
  createUrl =false;
  publicUrl:any;
  shareAsPrivate = false;
  dashboardPropertyId:any;
  publishedDashboard = false;
  port:any;
  host:any; 
  @ViewChild('propertiesModal') propertiesModal : any;
  frequency! : number;
  refreshNow: boolean = false;
  lastRefresh: any;
  nextRefresh: any;
  
constructor(private workbechService:WorkbenchService,private router:Router,private templateViewService:ViewTemplateDrivenService,private toasterService:ToastrService,
  private modalService:NgbModal,private toasterservice:ToastrService,private loaderService:LoaderService){
  this.viewDashboardList=this.templateViewService.viewDashboard()

}
ngOnInit(){
  this.loaderService.hide();
  if(this.viewDashboardList){
  this.getuserDashboardsListput();
  }
  this.getHostAndPort();
}
getHostAndPort(): void {
  const { hostname, port } = window.location;
  this.host = hostname;
  this.port = port;
  console.log('port',this.port,'host',this.host)
}
pageChangeUserDashboardsList(page:any){
this.pageNo=page;
this.getuserDashboardsListput();
}
searchDashboarList(){
  this.pageNo=1;
  this.getuserDashboardsListput();
}
 onPageSizeChange() {
  // Reset to page 1 if you're on the last page and items may not fit
  const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  if (this.pageNo > totalPages) {
    this.pageNo = 1;
    this.page =1;
  }
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
deleteDashboard(dashboardId:any){
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
      this.workbechService.deleteDashboard(dashboardId)
      .subscribe(
        {
          next:(data:any) => {
            console.log(data);      
            if(data){
              // Swal.fire({
              //   icon: 'success',
              //   title: 'Deleted!',
              //   text: 'Dashboard Deleted Successfully',
              //   width: '400px',
              //   timer: 2000, 
              //   showConfirmButton: false 
              // })
               this.toasterservice.success('Deleted Successfully','success',{ positionClass: 'toast-top-right'});
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
  // const encodedServerId = btoa(serverId.toString());
  // const encodedQuerySetId = btoa(querysetId.toString());
  const encodedDashboardId = btoa(dashboardId.toString());

  this.router.navigate(['/analytify/home/sheetsdashboard/'+encodedDashboardId])
}
dashboardRoute(){
this.router.navigate(['/analytify/sheetsdashboard']);
}



viewPropertiesTab(name:any,dashboardId:any){
  this.modalService.open(this.propertiesModal);
  this.getRoleDetailsDshboard();
  this.dashboardPropertyTitle = name;
  this.dashboardId = dashboardId;
  this.dashboardPropertyId = dashboardId;
   this.publishedDashboard = false;
   this.shareAsPrivate = false;
   this.applyButtonEnableOnEditUser = false;
  this.getAddedDashboardProperties();

}
onRolesChange(selected: string[]) {
  this.selectedRoleIds = selected
  this.selectedRoleIdsToNumbers = selected.map(value => Number(value));
  console.log('selectedRoles',this.selectedRoleIdsToNumbers)
  if (this.selectedRoleIds.length === 0) {
    this.selectedUserIds = [];
    this.selectedUserIdsToNumbers = [];
    return;
  } 
 const obj = { role_ids: this.selectedRoleIdsToNumbers };

    this.workbechService.getUsersOnRole(obj).subscribe({
      next: (data) => {
        console.log('Updated users for selected roles:', data);
        this.usersOnSelectedRole = data;
        const validUserIds = new Set(data.map((user: { user_id: any; }) => String(user.user_id)));  
  
        const prevSelectedUsers = [...this.selectedUserIds]; // Backup for debugging
        this.selectedUserIds = this.selectedUserIds.filter((userId: any) =>
          validUserIds.has(String(userId)) // Convert to string for safe comparison
        );
  
        this.selectedUserIdsToNumbers = this.selectedUserIds.map((value: any) => Number(value));
        
        // Debugging logs
        console.log('Previous selected users:', prevSelectedUsers);
        console.log('Valid user IDs after role change:', [...validUserIds]);
        console.log('Filtered selected users:', this.selectedUserIds);
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: error.error.message,
          width: '400px',
        });
      }
    });}
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
  role_ids:this.selectedRoleIdsToNumbers
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
this.selectedUserIds = selected;
this.selectedUserIdsToNumbers = this.selectedUserIds.map((value: any) => Number(value));
console.log('selectedUsers',this.selectedUserIdsToNumbers)

}

saveDashboardProperties(){
const obj ={
  dashboard_id:this.dashboardId,
  role_ids:this.selectedRoleIdsToNumbers,
  user_ids:this.selectedUserIdsToNumbers
}
this.workbechService.saveDashboardProperties(obj).subscribe({
  next:(data)=>{
    console.log('properties save',data);
    this.modalService.dismissAll();
    Swal.fire({
      icon: 'success',
      title: 'Done!',
      text: data.message,
      timer: 2000, 
      showConfirmButton: false 
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
applyButtonEnableOnEditUser = false;
getAddedDashboardProperties(){
  this.workbechService.getAddedDashboardProperties(this.dashboardId).subscribe({
    next:(data)=>{
      this.selectedRoleIds = Array.isArray(data?.roles) ? data.roles.map((role: any) => role.id): [];
      this.selectedUserIds = data?.users?.map((user:any)=>user.user_id);
      console.log('savedrolesandUsers',data);
      // this.selectedRoleIdsToNumbers = data.roles?.map((role:any) => role.id);
      // this.selectedUserIdsToNumbers = data.users?.map((user:any) => user.user_id);
      this.selectedRoleIdsToNumbers =  (this.selectedRoleIds || []).map((id: string) => Number(id));;
        this.selectedUserIdsToNumbers = (this.selectedUserIds || []).map((id: string) => Number(id));
      console.log('Loaded selected roles:', this.selectedRoleIds);
      console.log('Loaded selected users:', this.selectedUserIds);
      if(this.selectedRoleIds.length > 0){
        this.getUsersforRole();
      }
      if(this.selectedUserIds.length > 0){
        this.applyButtonEnableOnEditUser = true;
      }
   
     },
    error:(error)=>{
      console.log(error);
      this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-top-right'});
      this.selectedUserIds = [];
      this.selectedRoleIds = [];
    }
  }) 
}

sharePublish(value:any){
  console.log(value);
  if(value === 'public'){
    this.createUrl = true;
    this.shareAsPrivate = false
    const publicDashboardId = btoa(this.dashboardId.toString());
    this.publicUrl = 'https://'+this.host+':'+this.port+'/public/dashboard/'+publicDashboardId;
    this.publishDashboard();
  } else if(value === 'private'){
    this.createUrl = false;
    this.shareAsPrivate = true;
    this.publishedDashboard = false;
  }
  }
copyUrl(): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(this.publicUrl).then(() => {
      console.log(this.publicUrl);
      this.toasterservice.success('Link Copied', 'success', { positionClass: 'toast-center-center' });
    }).catch(err => {
      console.error('Could not copy text: ', err);
      this.fallbackCopyTextToClipboard(this.publicUrl);
    });
  } else {
    // Fallback if navigator.clipboard is not available
    this.fallbackCopyTextToClipboard(this.publicUrl);
  }
}

fallbackCopyTextToClipboard(text: string): void {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';  // Avoid scrolling to bottom
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      this.toasterservice.success('Link Copied', 'success', { positionClass: 'toast-center-center' });
    } else {
      console.error('Fallback: Could not copy text');
    }
  } catch (err) {
    console.error('Fallback: Unable to copy', err);
  }
  document.body.removeChild(textArea);
}
publishDashboard(){
  this.workbechService.publishDashbord(this.dashboardPropertyId).subscribe({
    next:(data)=>{
      console.log(data);
      this.toasterservice.success('Dashboard Published','success',{ positionClass: 'toast-center-center'})
      this.publishedDashboard = true;
     },
    error:(error)=>{
      console.log(error);
      this.toasterservice.error('Dashboard Published','error',{ positionClass: 'toast-center-center'})

    }
  })
}
autoFrequencyRefresh(){
  let object;
  if(this.frequency > 0){
    object = {
      "dashboard_id": this.dashboardId,
      "is_scheduled": true,
      "frequency": this.frequency,
      "refresh_now": this.refreshNow
  }
  } else {
    object = {
      "dashboard_id": this.dashboardId,
      "is_scheduled": false,
      "refresh_now": this.refreshNow
  }
  }
  this.workbechService.autoRefreshFrequency(object).subscribe({
    next:(data)=>{
      this.toasterservice.success('Dashboard refresh scheduled','success',{ positionClass: 'toast-center-center'})
      },
    error:(error)=>{
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
  });
}

viewSchedular(dashboardId:any,modal: any){
  this.dashboardId = dashboardId;
  this.workbechService.fetchSchedularData(this.dashboardId).subscribe({
    next:(data)=>{
      this.frequency = data.frequency;
      this.lastRefresh = data.last_refresh;
      this.nextRefresh = data.next_refresh_in_minutes;
      this.modalService.open(modal);
      },
    error:(error)=>{
      this.lastRefresh = null;
      this.nextRefresh = null;
      this.modalService.open(modal);
    }
  });
}
gotoConfigureEmailAlerts(id:any){
    const encodedDatabaseId = btoa(id.toString());

this.router.navigate(['/analytify/configure-page/email/'+encodedDatabaseId])
}


}
