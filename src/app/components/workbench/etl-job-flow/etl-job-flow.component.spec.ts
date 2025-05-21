import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtlJobFlowComponent } from './etl-job-flow.component';

describe('EtlJobFlowComponent', () => {
  let component: EtlJobFlowComponent;
  let fixture: ComponentFixture<EtlJobFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtlJobFlowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtlJobFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
