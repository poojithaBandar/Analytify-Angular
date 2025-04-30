import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { SafeUrlPipe } from './pipes/safeurl.pipe';
import { AnalytifyDashboardService } from './analytify-dashboard.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [],
  providers: [AnalytifyDashboardService],
})
export class AnalytifyDashboardModule { }
