import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/sharedmodule';
import { PagesService } from '../pages/pages.service';
import { authGuard } from '../../auth.guard';

export const admin: Routes = [
  {path:'workbench',children:[ {
   path: 'work-bench/new-connections',
   canActivate:[authGuard],
   loadComponent: () =>
     import('./workbench/workbench.component').then((m) => m.WorkbenchComponent),
 },
 {
  path: 'work-bench/view-connections',
  canActivate:[authGuard],
  loadComponent: () =>
    import('./workbench/workbench.component').then((m) => m.WorkbenchComponent),
},
//  {
//   path: 'database-connection/tables/:id',
//   canActivate:[authGuard],
//   loadComponent: () =>
//     import('./workbench/workbench.component').then((m) => m.WorkbenchComponent),
// },
{
  path: 'database-connection/tables/:id',
  canActivate:[authGuard],
  loadComponent: () =>
    import('./database/database.component').then((m)=> m.DatabaseComponent)
},
{
  path: 'sheets/:id1/:id2',
  canActivate:[authGuard],
  loadComponent: () =>
    import('./sheets/sheets.component').then((m)=> m.SheetsComponent)
},
{
  path: 'sheets',
  canActivate:[authGuard],
  loadComponent: () =>
    import('./sheets/sheets.component').then((m)=> m.SheetsComponent)
},
{
  path: 'sheetsdashboard',
  canActivate:[authGuard],
  loadComponent: () =>
    import('./sheetsdashboard/sheetsdashboard.component').then((m)=> m.SheetsdashboardComponent)
},
{
  path: 'sheets/sheetsdashboard/:id1/:id2',
  canActivate:[authGuard],
  loadComponent: () =>
    import('./sheetsdashboard/sheetsdashboard.component').then((m)=> m.SheetsdashboardComponent)
},
{
  path: 'landingpage/sheetsdashboard/:id1/:id2',
  canActivate:[authGuard],
  loadComponent: () =>
    import('./sheetsdashboard/sheetsdashboard.component').then((m)=> m.SheetsdashboardComponent)
},
{
  path: 'landingpage',
  canActivate:[authGuard],
  loadComponent: () =>
    import('./landingpage/landingpage.component').then((m)=> m.LandingpageComponent)
},
 
 ]}
 ];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(admin),
  ],
  exports:[RouterModule]
})
export class WorkbenchModule { 
  static routes = admin;


}
