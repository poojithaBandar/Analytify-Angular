import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormatMeasurePipe } from '../../../shared/pipes/format-measure.pipe';

@Component({
  selector: 'app-custom-sheets',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormatMeasurePipe],
  templateUrl: './custom-sheets.component.html',
  styleUrls: ['./custom-sheets.component.scss']
})
export class CustomSheetsComponent implements OnChanges {
  @Input() table = false;
  @Input() chartId: any;
  @Input() tableColumnsDisplay: string[] = [];
  @Input() tableDataDisplay: any[] = [];
  @Input() itemsPerPage = 10;
  @Input() page = 1;
  @Input() totalItems = 0;
  @Input() bandingSwitch = false;
  @Input() color1 = '#ffffff';
  @Input() color2 = '#f3f3f3';
  @Input() headerFontFamily = '';
  @Input() headerFontStyle = '';
  @Input() headerFontDecoration = '';
  @Input() headerFontColor = '';
  @Input() headerFontAlignment: 'left' | 'center' | 'right' = 'left';
  @Input() headerFontWeight = '';
  @Input() headerFontSize = '';
  @Input() tableDataFontFamily = '';
  @Input() tableDataFontWeight = '';
  @Input() tableDataFontStyle = '';
  @Input() tableDataFontDecoration = '';
  @Input() tableDataFontColor = '';
  @Input() tableDataFontAlignment: 'left' | 'center' | 'right' = 'left';
  @Input() tableDataFontSize = '';
  @Input() decimalPlaces = 0;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() displayUnits = '';
  // KPI display inputs
  @Input() kpi = false;
  @Input() KPINumber: any;
  @Input() kpiColor = '';
  @Input() kpiFontSize = '3';
  @Input() draggedRows: any[] = [];
  @Input() draggedColumns: any[] = [];
  @Output() pageChange = new EventEmitter<number>();

  trackByColumn(_index: number, column: string): string {
    return column;
  }
  /**
   * Local style objects for template binding, updated on input changes
   */
  headerStyleObj: { [key: string]: string } = {};
  dataStyleObj: { [key: string]: string } = {};

  /**
   * Compute header cell styles as a plain method (avoids accessor syntax)
   */
  headerStyles(): { [key: string]: string } {
    return {
      'font-family': this.headerFontFamily,
      'font-style': this.headerFontStyle,
      'text-decoration': this.headerFontDecoration,
      'color': this.headerFontColor,
      'text-align': this.headerFontAlignment,
      'font-weight': this.headerFontWeight,
      'font-size': this.headerFontSize
    };
  }

  /**
   * Compute data cell styles as a plain method (avoids accessor syntax)
   */
  dataStyles(): { [key: string]: string } {
    return {
      'font-family': this.tableDataFontFamily,
      'font-style': this.tableDataFontStyle,
      'text-decoration': this.tableDataFontDecoration,
      'color': this.tableDataFontColor,
      'text-align': this.tableDataFontAlignment,
      'font-weight': this.tableDataFontWeight,
      'font-size': this.tableDataFontSize
    };
  }

  onPageChange(newPage: number) {
    this.pageChange.emit(newPage);
  }
  /**
   * Get the font-size value for KPI display (in rem).
   */
  getFontSize(): string {
    return `${this.kpiFontSize}rem`;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Recompute header cell styles on any header font/decoration change
    if (
      changes['headerFontFamily']  || changes['headerFontStyle']     ||
      changes['headerFontDecoration'] || changes['headerFontColor']  ||
      changes['headerFontAlignment'] || changes['headerFontWeight'] ||
      changes['headerFontSize']
    ) {
      this.headerStyleObj = {
        'font-family': this.headerFontFamily,
        'font-style': this.headerFontStyle,
        'text-decoration': this.headerFontDecoration,
        'color': this.headerFontColor,
        'text-align': this.headerFontAlignment,
        'font-weight': this.headerFontWeight,
        'font-size': this.headerFontSize
      };
    }
    // Recompute data cell styles on any table data font change
    if (
      changes['tableDataFontFamily']    || changes['tableDataFontStyle']       ||
      changes['tableDataFontDecoration'] || changes['tableDataFontColor']      ||
      changes['tableDataFontAlignment']  || changes['tableDataFontWeight']     ||
      changes['tableDataFontSize']
    ) {
      this.dataStyleObj = {
        'font-family': this.tableDataFontFamily,
        'font-style': this.tableDataFontStyle,
        'text-decoration': this.tableDataFontDecoration,
        'color': this.tableDataFontColor,
        'text-align': this.tableDataFontAlignment,
        'font-weight': this.tableDataFontWeight,
        'font-size': this.tableDataFontSize
      };
    }
  }
}