import { TestBed } from '@angular/core/testing';

import { DashboardTransferService } from './dashboard-transfer.service';

describe('DashboardTransferService', () => {
  let service: DashboardTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
