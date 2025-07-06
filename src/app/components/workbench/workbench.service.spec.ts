import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WorkbenchService } from './workbench.service';
import { environment } from '../../environments/environment';

describe('WorkbenchService', () => {
  let service: WorkbenchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(WorkbenchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST to protected-share', () => {
    const payload = { dashboardId: 1, passKey: 'secret' };
    service.protectedShare(payload).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/protected-share`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should POST to verify-passkey', () => {
    const payload = { dashboardId: 1, passKey: 'secret' };
    service.verifyPassKey(payload).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/verify-passkey`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
