import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/sharedmodule';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-saved-queries',
  standalone: true,
  imports: [SharedModule,CommonModule,NgxPaginationModule,NgbModule,FormsModule],
  templateUrl: './saved-queries.component.html',
  styleUrl: './saved-queries.component.scss'
})
export class SavedQueriesComponent {
  itemsPerPage!:number;
  pageNo = 1;
  page: number = 1;
  totalItems:any;
  searchName:any;
  savedQueryList:any[]=[];
constructor(private workbechService:WorkbenchService){}

  ngOnInit(){
    this.getSavedQueries();
  }

  getSavedQueries(){
    const Obj ={
      search : this.searchName,
      page_no : this.pageNo
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
  pageChangeSavedQueries(page:any){
    this.pageNo=page;
    this.getSavedQueries();
  }
}
