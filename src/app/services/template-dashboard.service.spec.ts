import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WorkbenchService } from '../components/workbench/workbench.service';
import { TemplateDashboardService } from './template-dashboard.service';

describe('TemplateDashboardService', () => {
  let service: TemplateDashboardService;

  beforeEach(() => {
    const workbenchStub = {
      buildSampleImmybotDashboard: jasmine.createSpy('buildSampleImmybotDashboard').and.returnValue(of({}))
    };
    TestBed.configureTestingModule({
      providers: [
        TemplateDashboardService,
        { provide: WorkbenchService, useValue: workbenchStub },
        { provide: Router, useValue: {} },
        { provide: ToastrService, useValue: { error: () => {} } }
      ]
    });
    service = TestBed.inject(TemplateDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('withBuildLock prevents double build', (done) => {
    (service as any).withBuildLock('test', () => of(1));
    const second = (service as any).withBuildLock('test', () => of(2));
    let emitted = false;
    second.subscribe({
      next: () => { emitted = true; },
      complete: () => {
        expect(emitted).toBeFalse();
        done();
      }
    });
  });

  it('buildSampleGieneAiqDashbaordOnce caches result', () => {
    const wb = TestBed.inject(WorkbenchService) as any;
    service.buildSampleGieneAiqDashbaordOnce(1).subscribe();
    service.buildSampleGieneAiqDashbaordOnce(1).subscribe();
    expect(wb.buildSampleImmybotDashboard).toHaveBeenCalledTimes(1);
  });
});
