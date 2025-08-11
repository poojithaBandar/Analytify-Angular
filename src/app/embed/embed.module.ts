import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkbenchLayoutsComponent } from '../shared/layout-components/layouts/workbench-layouts/workbench-layouts.component';
import { workbench } from '../shared/routes/workbenckroutes';
import { sdkAuthGuard } from './sdk-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: WorkbenchLayoutsComponent,
    canActivate: [sdkAuthGuard],
    children: workbench
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmbedModule {}

