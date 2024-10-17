import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/sharedmodule';
// import { PagesService } from '../pages/pages.service';
import { authGuard } from '../../auth.guard';
import { canDeactivateGuard } from '../../can-deactivate.guard';
import { HelpGuideComponent } from './help-guide/help-guide.component';
import { HelpGuideQuestionariesComponent } from './help-guide-questionaries/help-guide-questionaries.component';

const routes: Routes = [
    {path:'insights',children:[ 
    { path: '', redirectTo: 'help-guide', pathMatch: 'full' },
      { path: 'help-guide', component: HelpGuideComponent },
      { path: 'help-guide/:slug', component: HelpGuideQuestionariesComponent },
    //   { path: 'search', component: GuideLeftMenuComponent},
    //   { path: 'search/:moduleName', component:GuideLeftMenuComponent},
    //   { path: 'help-guide/:moduleName', component: HelpGuideComponent },
    ]}
  ];


  @NgModule({
    declarations: [],
    imports: [
      CommonModule,RouterModule.forChild(routes),
    ],
    exports:[RouterModule]
  })
  export class HelpGuideModule { 
  }