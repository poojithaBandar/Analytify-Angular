import { Injectable } from '@angular/core';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CustomThemeService {

  currentTheme : any;
  apiCustomTheme : any;

  constructor() { }

  setApiCustomTheme(customTheme : any){
    this.apiCustomTheme = _.cloneDeep(customTheme);
  }

  getApiCustomTheme(){
  return this.apiCustomTheme;
  }

  setThemeVariable(variable: string, value: string): void {
    this.currentTheme[variable] = value;
  }

  setCurrentTheme(customTheme : any){
    this.currentTheme = customTheme;
  }

  getCurrentTheme(){
    return this.currentTheme;
  }
}
