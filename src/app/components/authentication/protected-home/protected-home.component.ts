import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WorkbenchService } from '../../workbench/workbench.service';

@Component({
  selector: 'app-protected-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './protected-home.component.html',
  styleUrls: ['./protected-home.component.scss']
})
export class ProtectedHomeComponent implements OnInit {
  dashboards: any[] = [];

  constructor(private workbenchService: WorkbenchService, private router: Router) {}

  ngOnInit(): void {
    this.workbenchService.getProtectedDashboards().subscribe({
      next: (data) => {
        // expect array or object with "dashboards" key
        this.dashboards = (data && (data.dashboards || data)) || [];
      },
      error: () => {}
    });
  }

  openDashboard(id: number): void {
    const encoded = btoa(id.toString());
    this.router.navigate(['/dashboard/share/protected', encoded]);
  }
}
