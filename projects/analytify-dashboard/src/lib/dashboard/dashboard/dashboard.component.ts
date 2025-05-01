import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @Input() dashboardId!: string;
  @Input() clientId!: string;
  
  dashboardUrl!: string;

  ngOnInit() {
    const publicDashboardId = btoa(this.dashboardId.toString());
    this.dashboardUrl = `https://qa.insightapps.ai/public/dashboard/${publicDashboardId}`;
    // ?clientId=${this.clientId}
  }
}
