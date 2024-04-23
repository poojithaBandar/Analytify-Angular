import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
 {path:'authentication',children:[ {
  path: 'login',
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
  }, {
    path: 'under-maintainance',
    loadComponent: () =>
      import('./under-maintainance/under-maintainance.component').then((m) => m.UnderMaintainanceComponent),
  },


]}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class authenticationRoutingModule {
  static routes = admin;
}