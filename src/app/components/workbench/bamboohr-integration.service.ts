import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface BambooHRConfig {
  api_key: string | null;
  display_name: string | null;
  domain: string | null;
  hierarchy_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BambooHRIntegrationService {
  private accessToken: any;

  constructor(private http: HttpClient) {}

  private getToken(): string {
    const currentUser = localStorage.getItem('currentUser');
    this.accessToken = currentUser ? JSON.parse(currentUser)['Token'] : '';
    return this.accessToken;
  }

  createIntegration(config: BambooHRConfig): Observable<any> {
    const token = this.getToken();
    return this.http
      .post(`${environment.apiUrl}/bamboohr_authentication/` + token, config)
      .pipe(
        catchError((err) => {
          console.error('BambooHR create error', err);
          return throwError(() => err);
        })
      );
  }

  updateIntegration(config: BambooHRConfig): Observable<any> {
    const token = this.getToken();
    return this.http
      .put(`${environment.apiUrl}/bamboohr_authentication/` + token, config)
      .pipe(
        catchError((err) => {
          console.error('BambooHR update error', err);
          return throwError(() => err);
        })
      );
  }

  getIntegrationStatus(id: any): Observable<any> {
    const token = this.getToken();
    return this.http
      .get(`${environment.apiUrl}/bamboohr_authentication/${id}/` + token)
      .pipe(
        catchError((err) => {
          console.error('BambooHR get status error', err);
          return throwError(() => err);
        })
      );
  }

  deleteIntegration(id: any): Observable<any> {
    const token = this.getToken();
    return this.http
      .delete(`${environment.apiUrl}/bamboohr_authentication/${id}/` + token)
      .pipe(
        catchError((err) => {
          console.error('BambooHR delete error', err);
          return throwError(() => err);
        })
      );
  }
}

