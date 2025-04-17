import { TestBed } from '@angular/core/testing';

import { TemplateDashboardService } from './template-dashboard.service';

describe('TemplateDashboardService', () => {
  let service: TemplateDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
