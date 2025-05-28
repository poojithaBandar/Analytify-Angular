import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/sharedmodule';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { WorkbenchService } from '../workbench.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-etl-list',
  standalone: true,
  imports: [SharedModule,CommonModule,FormsModule,NgbModule,NgxPaginationModule],
  templateUrl: './etl-list.component.html',
  styleUrl: './etl-list.component.scss'
})
export class EtlListComponent {
  gridView = true;
  page: any = 1;
  pageSize: any = 10;
  totalItems: any;
  search: string = '';
  dataFlowList: any[] = [];
  listType: string = 'dataFlow';

  constructor(private toasterService: ToastrService, private workbechService: WorkbenchService, private loaderService: LoaderService, private router: Router,private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loaderService.hide();
    this.getEtlList();
  }

  getDataFlowList(){
    this.workbechService.getEtlDataFlowList(this.page, this.pageSize, this.search).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataFlowList = data.data;
        this.totalItems = data?.total_records;
        this.pageSize = data?.page_size;
        this.page = data?.page_number;
        if(this.dataFlowList.length === 0){
          this.pageSize = 10;
          this.page = 1;
          this.totalItems = 0;
        }
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }

  deleteDataFlow(dataFlow:any){
    Swal.fire({
      position: "center",
      icon: "question",
      title: `Delete "${dataFlow.data_flow_name}" Data Flow?`,
      text: "This action cannot be undone. Are you sure you want to proceed?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.workbechService.deleteDataFlow(dataFlow.id).subscribe({
          next: (response) => {
            console.log(response);
            this.getDataFlowList();
            this.toasterService.info(response.message, 'info', { positionClass: 'toast-top-right' });
          },
          error: (error) => {
            console.log(error);
            this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
          }
        })
      }
    })
  }

  goToDataFlow(){
    this.router.navigate(['/analytify/etlList/etl']);
  }

  editDataFlow(id:any){
    const encodedId = btoa(id.toString());
    this.router.navigate(['/analytify/etlList/etl/'+encodedId]);
  }

  goToJobFlow(){
    this.router.navigate(['/analytify/etlList/jobFlow']);
  }

  onPageSizeChange() {
    // Reset to page 1 if you're on the last page and items may not fit
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.page > totalPages) {
      this.page = 1;
    }
    this.getDataFlowList();
  }
  getEtlList(){
    if(this.listType === 'dataFlow'){
      this.getDataFlowList();
    } else{
      this.getDataFlowList();
    }
  }
}
