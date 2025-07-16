import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';
import { WorkbenchService } from '../../workbench/workbench.service';

@Component({
  selector: 'app-protected-dashboards',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule, SharedModule],
  templateUrl: './protected-dashboards.component.html',
  styleUrls: ['./protected-dashboards.component.scss']
})
export class ProtectedDashboardsComponent implements OnInit {
  dashboards: any[] = [];
  gridView = true;

  constructor(private workbenchService: WorkbenchService, private router: Router) {}

  ngOnInit(): void {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').Token;
    if (!token) {
      return;
    }
    this.workbenchService.getProtectedDashboardsList(token).subscribe({
      next: (data) => {
        this.dashboards = data?.sheets || [];
      },
      error: () => {}
    });
  }

  openDashboard(id: number): void {
    const encoded = btoa(id.toString());
    this.router.navigate(['/dashboard/share/protected', encoded]);
  }
}
