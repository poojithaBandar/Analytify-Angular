import { Injectable } from '@angular/core';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CustomThemeService {

  currentTheme : any;
  apiCustomTheme : any;

  constructor(private themeService: CustomThemeService) { }

  setApiCustomTheme(customTheme : any){
    this.apiCustomTheme = _.cloneDeep(customTheme);
  }

  getApiCustomTheme(){
    if(this.apiCustomTheme){
      return this.apiCustomTheme;
    }
    return JSON.parse(localStorage.getItem("apiCustomTheme")!);
  }

  setThemeVariable(variable: string, value: string): void {
    this.currentTheme[variable] = value;
    this.themeService.setCurrentTheme(JSON.stringify(this.currentTheme));
  }

  setCurrentTheme(customTheme : any){
    this.currentTheme = customTheme;
  }

  getCurrentTheme(){
    if(this.currentTheme){
      return this.currentTheme;
    }
    return JSON.parse(localStorage.getItem("customTheme")!);
  }
}
