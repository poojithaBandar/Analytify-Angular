import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtlListComponent } from './etl-list.component';

describe('EtlListComponent', () => {
  let component: EtlListComponent;
  let fixture: ComponentFixture<EtlListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtlListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
