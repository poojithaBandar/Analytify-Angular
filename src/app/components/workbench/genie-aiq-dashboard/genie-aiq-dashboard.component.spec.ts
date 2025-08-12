import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenieAiqDashboardComponent } from './genie-aiq-dashboard.component';

describe('GenieAiqDashboardComponent', () => {
  let component: GenieAiqDashboardComponent;
  let fixture: ComponentFixture<GenieAiqDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenieAiqDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenieAiqDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
