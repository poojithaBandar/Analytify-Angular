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
  itemsPerPage : any = 10;
  totalItems:any;
  page: any = 1;

  constructor(private workbechService:WorkbenchService,private router:Router,private toasterservice:ToastrService,private viewTemplateService:ViewTemplateDrivenService,private loaderService:LoaderService){
    this.viewTransformationList = this.viewTemplateService.viewTransformations();
  }
  ngOnInit(): void {
    this.loaderService.hide();
    if(this.viewTransformationList){
      this.getTransformationList();
    }
  }


  getTransformationList(){
    this.workbechService.getTransformationList(this.page, this.itemsPerPage, this.searchTransformation).subscribe({
      next: (response) => {
        console.log(response);
        this.transformationList = response.data.data;
        this.itemsPerPage = response.data.items_per_page;
        this.totalItems = response.data.total_items;
        if(this.transformationList.length === 0){
          this.itemsPerPage = '';
          this.page = '';
        }
      },
      error: (error) => {
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
  goToTransformationLayer(hierarchyId:any){
    const encodedId = btoa(hierarchyId.toString());
    this.router.navigate(['/analytify/transformationList/dataTransformation/' + encodedId]);
  }
  deleteTransformation(hierarchyId: any) {
    this.workbechService.getDeleteTransformationMessage(hierarchyId).subscribe({
      next: (response) => {
        console.log(response);
        Swal.fire({
          position: "center",
          icon: "question",
          title: response.message === 'Are you sure to continue to Delete Data Transformation?' ? response.message : "Are you sure?",
          text: (response.message === 'Are you sure to continue to Delete Data Transformation?' ? '' : response.message),
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            this.workbechService.deleteTransformation(hierarchyId).subscribe({
              next: (response) => {
                console.log(response);
                this.getTransformationList();
                this.toasterservice.info(response.message, 'info', { positionClass: 'toast-top-right' });
              },
              error: (error) => {
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
        })
      },
      error: (error) => {
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
