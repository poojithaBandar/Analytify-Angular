import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-jira',
  standalone: true,
  imports: [],
  templateUrl: './jira.component.html',
  styleUrl: './jira.component.scss'
})
export class JiraComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const hierarchyId = localStorage.getItem('jiraHierarchyId');
    if (hierarchyId) {
      const payload = {
        hierarchy_id: hierarchyId,
        redirect_uri: window.location.href
      };
      this.authService.jiraCallBack(payload).subscribe({
        next: () => {
          localStorage.removeItem('jiraHierarchyId');
          const encoded = btoa(hierarchyId.toString());
          this.router.navigate(['/analytify/database-connection/jira/' + encoded]);
        },
        error: (error: any) => {
          console.log(error);
          if (error) {
            Swal.fire({
              icon: 'warning',
              title: 'Oops!',
              text: error.error.message,
              width: '400px',
            });
          }
        }
      });
    } else {
      this.router.navigate(['/analytify/datasources/view-connections']);
    }
  }
}
