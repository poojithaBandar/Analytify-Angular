import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitcherComponent } from './switcher.component';
import { NavService } from '../../services/navservice';
import { WorkbenchService } from '../../../components/workbench/workbench.service';
import { SharedService } from '../../services/shared.service';
import { DefaultColorPickerService } from '../../../services/default-color-picker.service';
import { ToastrService } from 'ngx-toastr';
import { CustomThemeService } from '../../../services/custom-theme.service';

describe('SwitcherComponent', () => {
  let component: SwitcherComponent;
  let fixture: ComponentFixture<SwitcherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwitcherComponent],
      providers: [
        { provide: NavService, useValue: {} },
        { provide: WorkbenchService, useValue: { setChartType: () => ({ subscribe: () => {} }), saveThemes: () => ({ subscribe: () => {} }) } },
        { provide: SharedService, useValue: { setValue: () => {} } },
        { provide: DefaultColorPickerService, useValue: { setColor: () => {} } },
        { provide: ToastrService, useValue: { success: () => {}, error: () => {} } },
        { provide: CustomThemeService, useValue: { getGlassBackground: () => null, setGlassBackground: () => {}, setThemeVariable: () => {}, getCurrentTheme: () => ({}), setApiCustomTheme: () => {}, setCurrentTheme: () => {} } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
