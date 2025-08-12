import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BambooHRIntegrationService {
  private accessToken: string | null = null;

  constructor(private http: HttpClient) {}

  private get token(): string | null {
    if (!this.accessToken) {
      const currentUser = localStorage.getItem('currentUser');
      this.accessToken = currentUser ? JSON.parse(currentUser)['Token'] : null;
    }
    return this.accessToken;
  }

  createIntegration(config: { api_key: string; display_name: string; domain: string }) {
    return this.http.post(`${environment.apiUrl}/bamboohr_authentication/${this.token}`, config);
  }

  updateIntegration(config: { api_key: string; display_name: string; domain: string; hierarchy_id: number }) {
    return this.http.put(`${environment.apiUrl}/bamboohr_authentication/${this.token}`, config);
  }

  getIntegrationStatus() {
    return this.http.get(`${environment.apiUrl}/bamboohr_authentication/${this.token}`);
  }

  deleteIntegration() {
    const payload = { api_key: null, display_name: null, domain: null, hierarchy_id: null };
    return this.http.put(`${environment.apiUrl}/bamboohr_authentication/${this.token}`, payload);
  }
}

