import { Route } from '@angular/router';
import { ContentLayoutComponent } from './shared/layout-components/layouts/content-layout/content-layout.component';
import { content } from './shared/routes/contentroutes';
import { AuthenticationLayoutComponent } from './shared/layout-components/layouts/authentication-layout/authentication-layout.component';
import { authen } from './shared/routes/authenticationroutes';
import { LandingpageLayoutComponent } from './shared/layout-components/layouts/landingpage-layout/landingpage-layout.component';
import { landing } from './shared/routes/landingroutes';
export const App_Route: Route[] = [
      { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
      {
        path: 'auth/login',
        loadComponent: () =>
          import('../app/authentication/login/login.component').then((m) => m.LoginComponent),
      },
      { path: '', component: ContentLayoutComponent, children: content },
      { path: '', component: AuthenticationLayoutComponent, children: authen },
      { path: '', component: LandingpageLayoutComponent, children: landing },

    ]