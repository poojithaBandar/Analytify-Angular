import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';
import { WorkbenchService } from '../../workbench/workbench.service';

@Component({
  selector: 'app-protected-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule, SharedModule],
  templateUrl: './protected-home.component.html',
  styleUrls: ['./protected-home.component.scss']
})
export class ProtectedHomeComponent implements OnInit {
  dashboards: any[] = [];
  gridView = true;

  constructor(private workbenchService: WorkbenchService, private router: Router) {}

  ngOnInit(): void {
    const email = localStorage.getItem('protected_email');
    if (!email) {
      return;
    }
    this.workbenchService.getProtectedDashboards(email).subscribe({
      next: (data) => {
        this.dashboards = data.sheets|| [];
      },
      error: () => {}
    });
  }

  openDashboard(id: number): void {
    const encoded = btoa(id.toString());
    this.router.navigate(['/dashboard/share/protected', encoded]);
  }
}
