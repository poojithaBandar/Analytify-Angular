import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [NgbModule,],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {
constructor(private router:Router){

}



  dashboardRoute(){
    this.router.navigate(['/workbench/sheetsdashboard'])  
  }
  newConnections(){
    this.router.navigate(['workbench/work-bench/view-connections']) 
  }
}
