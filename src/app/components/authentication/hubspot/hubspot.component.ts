import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hubspot',
  standalone: true,
  imports: [],
  templateUrl: './hubspot.component.html',
  styleUrl: './hubspot.component.scss'
})
export class HubspotComponent implements OnInit {
  constructor(private router: Router){}

  ngOnInit(): void {
    const hierarchyId = localStorage.getItem('hubspotHierarchyId');
    if(hierarchyId){
      const encoded = btoa(hierarchyId.toString());
      this.router.navigate(['/analytify/database-connection/hubspot/' + encoded]);
    } else {
      this.router.navigate(['/analytify/datasources/view-connections']);
    }
  }
}
