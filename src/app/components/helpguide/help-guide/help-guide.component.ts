import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkbenchService } from '../../workbench/workbench.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-help-guide',
  standalone: true,
  imports: [SharedModule,NgbModule,CommonModule,FormsModule],
  templateUrl: './help-guide.component.html',
  styleUrl: './help-guide.component.scss'
})
export class HelpGuideComponent {
  defaults = ['Collapse Group Item #1','Collapse Group Item #2','Collapse Group Item #3'];
  isModules : boolean = true;
  userGuideData : any[] = [];
  ModulesData : any[] = [];
  isSearch : boolean = false;
  searchValue : string = '';
  searchData : any[] = [];

  constructor(private router:Router,private route:ActivatedRoute,private workbenchService:WorkbenchService){
  }

  ngOnInit(): void {
    this.getModulesData();
  }

  onModule(moduleId:number){
    let object ={
      "module_id":moduleId
    }
    this.workbenchService.getUserHelpGuide(object).subscribe({next: (responce:any) => {
      console.log(responce);
      // window.location.href = window.location.href + '/' + responce.angular_path;
      this.isModules = false;
      this.userGuideData = responce.user_guide_data;
    },
    error: (error) => {
      console.log(error);
    }
  }) 
  }

  getModulesData(){
    this.workbenchService.getModulesData().subscribe({next: (responce:any) => {
      console.log(responce);
      this.ModulesData = responce.data;
    },
    error: (error) => {
      console.log(error);
    }
  })
  }

  goToQuestionary(slug:string){
    this.router.navigate(['/insights/help-guide/'+slug])
  }

  getSearchData(searchValue : string){
    this.isSearch = true;
    let object = {
       "search": searchValue
    }
    this.workbenchService.getUserHelpGuideSearch(object).subscribe({next: (responce:any) => {
      console.log(responce);
      this.searchData = responce.user_guide_data;
    },
    error: (error) => {
      console.log(error);
    }
  })
  }
}
