import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-zoho',
  standalone: true,
  imports: [],
  templateUrl: './zoho.component.html',
  styleUrl: './zoho.component.scss'
})
export class ZohoComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const hierarchyId = localStorage.getItem('zohoHierarchyId');
    if (hierarchyId) {
      const payload = {
        hierarchy_id: hierarchyId,
        redirect_uri: window.location.href
      };
      this.authService.zohoCallBack(payload).subscribe({
        next: () => {
          localStorage.removeItem('zohoHierarchyId');
          const encoded = btoa(hierarchyId.toString());
          this.router.navigate(['/analytify/database-connection/zoho/' + encoded]);
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
