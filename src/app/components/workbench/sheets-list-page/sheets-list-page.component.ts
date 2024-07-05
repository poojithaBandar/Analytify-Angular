import { Component, OnInit } from '@angular/core';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { SharedModule } from '../../../shared/sharedmodule';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule, PaginatePipe, PaginationControlsComponent } from 'ngx-pagination';

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

  itemsPerPage!:number;
  pageNo = 1;
  page: number = 1;
  totalItems:any;

constructor(private workbechService:WorkbenchService){}

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
getUserSheetsList(){
  const Obj ={
    search:this.sheetName,
    page_no:this.pageNo
  }
  if(Obj.search == '' || Obj.search == null){
    delete Obj.search;
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

}
