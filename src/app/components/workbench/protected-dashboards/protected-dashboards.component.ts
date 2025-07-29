import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';
import { WorkbenchService } from '../workbench.service';
import { LoaderService } from '../../../shared/services/loader.service';

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

  constructor(private workbenchService: WorkbenchService, private router: Router, private loaderService: LoaderService) {}

  ngOnInit(): void {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').Token;
    if (!token) {
      return;
    }
    this.workbenchService.getProtectedDashboardsList(token).subscribe({
      next: (data) => {
        this.dashboards = data?.sheets || [];
        this.loaderService.hide();
      },
      error: () => {}
    });
  }

  openDashboard(id: number): void {
    localStorage.setItem('protected_access','true');
    const encoded = btoa(id.toString());
    this.router.navigate(['/analytify/home/sheetsdashboard', encoded], {
      queryParams: { protected: true }
    });  }
}
