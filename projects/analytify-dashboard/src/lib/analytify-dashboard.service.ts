import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalytifyDashboardService {

  constructor() { }
  private config: { clientId?: string } = {};

  init(config: { clientId: string }) {
    this.config = { ...config };
  }

  getClientId(): string | undefined {
    return this.config.clientId;
  }
}
