import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WorkbenchService } from '../workbench.service';

import { LandingpageComponent } from './landingpage.component';

describe('LandingpageComponent', () => {
  let component: LandingpageComponent;
  let fixture: ComponentFixture<LandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingpageComponent],
      providers: [{provide: WorkbenchService, useValue: {protectedShare: jasmine.createSpy('protectedShare').and.returnValue(of({protectedShareUrl: 'url'}))}}]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call protectedShare when passkey is short', () => {
    const service = TestBed.inject(WorkbenchService);
    component.passKey = '123';
    component.createProtectedShare();
    expect(service.protectedShare).not.toHaveBeenCalled();
  });
});
