import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsightD3Component } from './insight-d3.component';

describe('InsightD3Component', () => {
  let component: InsightD3Component;
  let fixture: ComponentFixture<InsightD3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightD3Component]
    }).compileComponents();

    fixture = TestBed.createComponent(InsightD3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
