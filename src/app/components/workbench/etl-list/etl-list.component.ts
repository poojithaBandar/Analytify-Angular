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
  search: string = '';
  dataFlowList: any[] = [];

  constructor(private toasterService: ToastrService, private workbechService: WorkbenchService, private loaderService: LoaderService, private router: Router,private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loaderService.hide();
    this.getDataFlowList();
  }

  getDataFlowList(){
    this.workbechService.getEtlDataFlowList(this.page, this.pageSize, this.search).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataFlowList = data.data;
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }

  goToDataFlow(){
    this.router.navigate(['/analytify/etlList/etl']);
  }

  editDataFlow(id:any){
    const encodedId = btoa(id.toString());
    this.router.navigate(['/analytify/etlList/etl/'+encodedId]);
  }

  pageChangegetUserSheetsList(page:any){
    
  }
}
