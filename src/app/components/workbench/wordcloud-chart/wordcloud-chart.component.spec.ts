import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import * as echarts from 'echarts';

import { WordcloudChartComponent } from './wordcloud-chart.component';

describe('WordcloudChartComponent', () => {
  let component: WordcloudChartComponent;
  let fixture: ComponentFixture<WordcloudChartComponent>;
  const setOptionSpy = jasmine.createSpy('setOption');

  beforeEach(async () => {
    spyOn(echarts, 'init').and.returnValue({ setOption: setOptionSpy, resize: () => {} } as any);
    await TestBed.configureTestingModule({
      imports: [WordcloudChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WordcloudChartComponent);
    component = fixture.componentInstance;
    component.chartsColumnData = [{ name: 'A', value: 10 }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render word cloud on init', () => {
    component.ngAfterViewInit();
    expect(setOptionSpy).toHaveBeenCalled();
    const option = setOptionSpy.calls.mostRecent().args[0];
    expect(option.series[0].type).toBe('wordCloud');
  });

  it('should update chart on input changes', () => {
    component.ngAfterViewInit();
    setOptionSpy.calls.reset();
    component.chartsColumnData = [{ name: 'B', value: 5 }];
    component.ngOnChanges({ chartsColumnData: new SimpleChange(null, component.chartsColumnData, false) });
    expect(setOptionSpy).toHaveBeenCalled();
  });
});
