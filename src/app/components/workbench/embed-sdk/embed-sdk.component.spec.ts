import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedSdkComponent } from './embed-sdk.component';

describe('EmbedSdkComponent', () => {
  let component: EmbedSdkComponent;
  let fixture: ComponentFixture<EmbedSdkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbedSdkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmbedSdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
