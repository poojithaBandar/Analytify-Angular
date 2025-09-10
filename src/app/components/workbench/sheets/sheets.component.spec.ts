import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetsComponent } from './sheets.component';

describe('SheetsComponent', () => {
  let component: SheetsComponent;
  let fixture: ComponentFixture<SheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should activate wordcloud chart', () => {
    component.chartDisplay(false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,21);
    expect(component.wordcloud).toBeTrue();
    expect(component.chartId).toBe(21);
  });
});
