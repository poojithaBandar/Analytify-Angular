import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SheetsComponent } from '../sheets/sheets.component';
import { WorkbenchService } from '../workbench.service';

interface SheetSdkPayload {
  sheet_retrieve_data: any;
  sheet_filter_data?: any;
}

@Component({
  selector: 'app-sheet-sdk',
  standalone: true,
  imports: [CommonModule, SheetsComponent],
  templateUrl: './sheet-sdk.component.html',
  styleUrl: './sheet-sdk.component.scss'
})
export class SheetSdkComponent {
  sheetId!: number;
  loading = true;
  error: string | null = null;
  clientId!: string;
  sheetToken!: string;
  sdkQuerySetID!: number;
  sdkDatabaseID!: number;
  embedFilters: any;
  sdkPayload: SheetSdkPayload | null = null;

  constructor(
    private route: ActivatedRoute,
    private workbenchService: WorkbenchService
  ) {}

  ngOnInit(): void {
    this.sheetToken = this.route.snapshot.params['sheetToken'];
    this.clientId = this.route.snapshot.params['clientId'];
    this.route.queryParams.subscribe(params => {
      const rawFilters = params['filters'];
      if (rawFilters) {
        try {
          this.embedFilters = JSON.parse(rawFilters);
          console.log('Filters object:', this.embedFilters);
        } catch (e) {
          console.error('Error parsing filters:', e);
        }
      }
    });
    const accessToken = this.route.snapshot.params['token'];
    const userToken = { Token: accessToken };
    localStorage.setItem('currentUser', JSON.stringify(userToken));
    if (this.sheetToken) {
      const sheetPayload = { sheet_token: this.sheetToken };
      this.workbenchService.fetchSheetId(sheetPayload).subscribe({
        next: (data: any) => {
          this.sheetId = data.dashboard_id;
          this.sdkQuerySetID = data.queryset_id;
          this.sdkDatabaseID = data.server_id;
          this.fetchData(1);
        },
        error: (err: any) => {
          console.error(err);
          this.error = 'Failed to load chart data';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Sheet Token is required';
      this.loading = false;
    }
  }

  private fetchData(attempt: number): void {
    this.loading = true;
    let payload: any;
    if (this.embedFilters) {
      const filterKeys = Object.keys(this.embedFilters);
      const filterValues = Object.values(this.embedFilters);
      payload = {
        filter_name: filterKeys,
        sheet_id: this.sheetId,
        input_list: filterValues
      };
    } else {
      payload = { sheet_id: this.sheetId };
    }
    this.workbenchService.getSheetSdkData(payload).subscribe({
      next: (data: SheetSdkPayload | '<Response [404]>' | null) => {
        console.log(data);
        if (data === '<Response [404]>' && attempt <= 2) {
          this.fetchData(attempt + 1);
        } else if (data && data !== '<Response [404]>') {
          this.sdkPayload = data as SheetSdkPayload;
          this.loading = false;
        } else {
          this.error = 'Failed to load chart data';
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Failed to load chart data';
        this.loading = false;
      }
    });
  }
}
