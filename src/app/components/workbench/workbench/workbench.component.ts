import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/layout-components/page-header/page-header.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from '../../../shared/layout-components/header/header.component';
import { SharedModule } from '../../../shared/sharedmodule';
import { PagesService } from '../../pages/pages.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workbench',
  standalone: true,
  imports: [RouterModule,NgbModule,SharedModule,FormsModule],
  templateUrl: './workbench.component.html',
  styleUrl: './workbench.component.scss'
})
export class WorkbenchComponent implements OnInit{
  constructor(private pageService: PagesService,private modalService: NgbModal){

  }
  
    postGreServerName = "e-commerce.cj3oddyv0bsk.us-west-1.rds.amazonaws.com";
    postGrePortName = "5432";
    postGreDatabaseName = "insightapps";
    postGreUserName = "postgres";
    PostGrePassword = "Welcome!234";
  
    postgreSignIn(){
      const obj={
          "database_type":"postgresql",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "database": this.postGreDatabaseName
      }
        this.pageService.postGreSqlConnection(obj).subscribe({next: (data) => {
              console.log(data);
            },
            error: (error) => {
              console.log(error);
            }
          }
        )
      
    }

    Openmdo(OpenmdoModal: any) {
      this.modalService.open(OpenmdoModal);
    }

  ngOnInit(): void {
    {
      document.querySelector('html')?.getAttribute('data-toggled') != null
        ? document.querySelector('html')?.removeAttribute('data-toggled')
        : document
            .querySelector('html')
            ?.setAttribute('data-toggled', 'icon-overlay-close');

            
    }
  }
}
