import { Component, OnInit } from '@angular/core';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { SharedModule } from '../../../shared/sharedmodule';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule, PaginatePipe, PaginationControlsComponent } from 'ngx-pagination';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sheets-list-page',
  standalone: true,
  imports: [SharedModule,CommonModule,FormsModule,NgbModule,NgxPaginationModule],
  templateUrl: './sheets-list-page.component.html',
  styleUrl: './sheets-list-page.component.scss'
})
export class SheetsListPageComponent implements OnInit {
  sheetName:any;
  savedSheetsList:any[]=[];

  itemsPerPage:any;
  pageNo = 1;
  page: number = 1;
  totalItems:any;
  gridView = true;
constructor(private workbechService:WorkbenchService,private router:Router){}

ngOnInit(){
this.getUserSheetsList();
}

pageChangegetUserSheetsList(page:any){
this.pageNo=page;
this.getUserSheetsList();
}
searchUserList(){
  this.pageNo=1
  this.getUserSheetsList();
}
onChangeofPagecount(count:any){

}
getUserSheetsList(){
  const Obj ={
    search:this.sheetName,
    page_no:this.pageNo,
    page_count:this.itemsPerPage
  }
  if(Obj.search == '' || Obj.search == null){
    delete Obj.search;
  }
  if(Obj.page_count == undefined || Obj.page_count == null){
    delete Obj.page_count;
  }
  this.workbechService.getUserSheetListPut(Obj).subscribe(
    {
      next:(data:any) =>{
        this.savedSheetsList=data.sheets
        this.itemsPerPage = data.items_per_page;
        this.totalItems = data.total_items
        console.log('sheetsList',data)


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
viewSheet(serverId:any,querysetId:any,sheetId:any,sheetname:any){
  const encodedServerId = btoa(serverId.toString());
  const encodedQuerySetId = btoa(querysetId.toString());
  const encodedSheetId = btoa(sheetId.toString());
  const encodedSheetName = btoa(sheetname);

  this.router.navigate(['/workbench/landingpage/sheets/'+encodedServerId+'/'+encodedQuerySetId+'/'+encodedSheetId+'/'+encodedSheetName])
}
deleteSheet(serverId:any,qurysetId:any,sheetId:any){
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
                    this.getUserSheetsList();
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
sheetsRoute(){
  this.router.navigate(['/workbench/sheets'])  
}
}
