import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/sharedmodule';
import { WorkbenchService } from '../workbench.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ViewTemplateDrivenService } from '../view-template-driven.service';
import { LoaderService } from '../../../shared/services/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transformation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, NgxPaginationModule, SharedModule],
  templateUrl: './transformation-list.component.html',
  styleUrl: './transformation-list.component.scss'
})
export class TransformationListComponent {
  gridView : boolean = true;
  searchTransformation : string = '';
  viewTransformationList : boolean = false;
  transformationList : any[] = [];
  itemsPerPage!:any;
  totalItems:any;
  page: number = 1;

  constructor(private workbechService:WorkbenchService,private router:Router,private toasterservice:ToastrService,private route:ActivatedRoute,private viewTemplateService:ViewTemplateDrivenService,private loaderService:LoaderService){
    this.viewTransformationList = this.viewTemplateService.viewTransformations();
  }
  ngOnInit(): void {
    this.loaderService.hide();
    if(this.viewTransformationList){
      this.getTransformationList();
    }
  }


  getTransformationList(){
    this.transformationList = [
      {display_name: 'sample1', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample2', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample3', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample4', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample5', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample6', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample7', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample8', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample9', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample10', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample11', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample12', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'},
      {display_name: 'sample13', server_type: 'POSTGRESQL', created_at: '12-03-2025', created_by:'narendra', updated_at: '21-03-2025'}
    ]
    this.totalItems = 13;
    this.itemsPerPage = 10;

    // let object = {};
    // this.workbechService.getTransformationList(object).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //   },
    //   error: (error) => {
    //     console.log(error);
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'oops!',
    //       text: error.error.message,
    //       width: '400px',
    //     })
    //   }
    // })
  }
  goToTransformationLayer(hierarchyId:any){
    const encodedId = btoa(hierarchyId.toString());
    this.router.navigate(['/analytify/transformationList/dataTransformation/' + encodedId]);
  }
  deleteTransformation(hierarchyId: any) {
    Swal.fire({
      position: "center",
      icon: "question",
      title: "Are you sure you want to delete the Transformation?",
      text: "This action will also remove the related saved queries, sheets and dashboard.",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {

      }
    })
  }
  searchTransformationList(){
  }
  pageChangeGetTransformationList(page:any){
  }
}
