import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalytifyDashboardComponent } from './analytify-dashboard.component';

describe('AnalytifyDashboardComponent', () => {
  let component: AnalytifyDashboardComponent;
  let fixture: ComponentFixture<AnalytifyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalytifyDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalytifyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
