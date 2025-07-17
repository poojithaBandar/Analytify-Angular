import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TemplateDashboardService } from './template-dashboard.service';
import { WorkbenchService } from '../components/workbench/workbench.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

describe('TemplateDashboardService buildSampleNinjaRMMDashboard', () => {
  let service: TemplateDashboardService;
  let workbenchServiceSpy: jasmine.SpyObj<WorkbenchService>;
  const routerSpy = {} as Router;
  const toastrSpy = { error: () => {} } as ToastrService;
  const containerStub = { createComponent: () => ({ instance: {} }) } as any;

  beforeEach(() => {
    workbenchServiceSpy = jasmine.createSpyObj('WorkbenchService', ['buildSampleNinjaRMMDashboard', 'joiningTablesTest']);
    workbenchServiceSpy.joiningTablesTest.and.returnValue(of({ sheets: [] }));

    TestBed.configureTestingModule({
      providers: [
        TemplateDashboardService,
        { provide: WorkbenchService, useValue: workbenchServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    });

    service = TestBed.inject(TemplateDashboardService);
  });

  it('uses provided response without calling service', () => {
    const res = { datasource_query: {}, sheets: [] } as any;
    service.buildSampleNinjaRMMDashboard(containerStub, 1, res);
    expect(workbenchServiceSpy.buildSampleNinjaRMMDashboard).not.toHaveBeenCalled();
  });

  it('calls service when response not provided', () => {
    workbenchServiceSpy.buildSampleNinjaRMMDashboard.and.returnValue(of({ datasource_query: {}, sheets: [] }));
    service.buildSampleNinjaRMMDashboard(containerStub, 1);
    expect(workbenchServiceSpy.buildSampleNinjaRMMDashboard).toHaveBeenCalledWith(1);
  });
});
