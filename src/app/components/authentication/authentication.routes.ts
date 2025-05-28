import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { noAuthGuard } from '../../no-auth.guard';

export const admin: Routes = [
 {path:'authentication',children:[ {
  path: 'login',
        canActivate: [noAuthGuard],
  loadComponent: () =>
    import('./login/login.component').then((m) => m.LoginComponent),
},
{
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  }, {
    path: 'lock-screen',
    loadComponent: () =>
      import('./lock-screen/lock-screen.component').then((m) => m.LockScreenComponent),
  }, {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },  {
    path: 'under-maintainance',
    loadComponent: () =>
      import('./under-maintainance/under-maintainance.component').then((m) => m.UnderMaintainanceComponent),
  },
  {
    path: 'email-activation/:token',
    loadComponent: () =>
      import('./email-activation/email-activation.component').then((m) => m.EmailActivationComponent),
  },
  {
    path: 'email-reactivation',
    loadComponent: () =>
      import('./email-reactivation/email-reactivation.component').then((m) => m.EmailReactivationComponent),
  },
  {
    path: 'quickbooks/:id',
    loadComponent: () =>
      import('./quickbooks/quickbooks.component').then((m) => m.QuickbooksComponent),
  },
  {
    path: 'quickbooks/?code=',
    loadComponent: () =>
      import('./quickbooks/quickbooks.component').then((m) => m.QuickbooksComponent),
  },
  {
    path: 'quickbooks',
    loadComponent: () =>
      import('./quickbooks/quickbooks.component').then((m) => m.QuickbooksComponent),
  },
  {
    path: 'salesforce',
    loadComponent: () =>
      import('./quickbooks/quickbooks.component').then((m) => m.QuickbooksComponent),
  },
]}
];
@NgModule({
  imports: [RouterModule.forChild(admin),HttpClientModule],
  exports: [RouterModule],
})
export class authenticationRoutingModule {
  static routes = admin;
}