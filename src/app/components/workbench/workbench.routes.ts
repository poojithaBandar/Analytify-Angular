import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/sharedmodule';
import { PagesService } from '../pages/pages.service';
import { authGuard } from '../../auth.guard';

export const admin: Routes = [
  {path:'workbench',children:[ {
   path: 'work-bench',
   canActivate:[authGuard],
   loadComponent: () =>
     import('./workbench/workbench.component').then((m) => m.WorkbenchComponent),
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
