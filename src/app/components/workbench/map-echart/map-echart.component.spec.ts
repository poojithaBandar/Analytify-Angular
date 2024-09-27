import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEchartComponent } from './map-echart.component';

describe('MapEchartComponent', () => {
  let component: MapEchartComponent;
  let fixture: ComponentFixture<MapEchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapEchartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapEchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
