import { TestBed } from '@angular/core/testing';

import { AnalytifyDashboardService } from './analytify-dashboard.service';

describe('AnalytifyDashboardService', () => {
  let service: AnalytifyDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalytifyDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
