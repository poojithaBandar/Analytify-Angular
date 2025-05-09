import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetSdkComponent } from './sheet-sdk.component';

describe('SheetSdkComponent', () => {
  let component: SheetSdkComponent;
  let fixture: ComponentFixture<SheetSdkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetSdkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SheetSdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
