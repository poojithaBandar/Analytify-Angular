import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [NgbModule,CommonModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})

export class LandingpageComponent implements OnInit {

userSheetsList :any[] =[];
showAllSheets = true;
constructor(private router:Router,private workbechService:WorkbenchService){
}

ngOnInit(){
  this.getuserSheets()
}
getuserSheets(){
  this.workbechService.getUserSheetList().subscribe(
    {
      next:(data:any) =>{
        this.userSheetsList=data
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
  dashboardRoute(){
    this.router.navigate(['/workbench/sheetsdashboard'])  
  }
  newConnections(){
    this.router.navigate(['workbench/work-bench/view-connections']) 
  }
}
