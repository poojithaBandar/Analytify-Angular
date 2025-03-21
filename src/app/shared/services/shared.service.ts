import { Injectable } from '@angular/core';
import _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  [x: string]: any;
    private downloadRequestSource = new Subject<void>();
    private refreshRequestSource = new Subject<void>();

    downloadRequested$ = this.downloadRequestSource.asObservable();
    refreshRequested$ = this.refreshRequestSource.asObservable();

    private localStorageValue = new BehaviorSubject<string | null>(localStorage.getItem('myValue'));
    public localStorageValue$ = this.localStorageValue.asObservable();

    private pivotFilterStates: Map<string, any> = new Map();

  saveFilters(pivotId: string, filterData: any) {
    if (filterData) {
      console.log("*****************"+pivotId+"***************************")
      console.log(filterData)
      console.log("********************************************")

      // filterData = _.cloneDeep(filterData);
      this.pivotFilterStates.set(pivotId, filterData);
    }
  }

  getFilters(pivotId: string): any {
    console.log("$$$$$$$$$$$$$$$$"+pivotId+"$$$$$$$$$$$$$$$$$")
console.log(this.pivotFilterStates.get(pivotId))
    console.log("*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$444")

    return this.pivotFilterStates.get(pivotId) || null;
  }

  removeFilters(pivotId: string) {
    this.pivotFilterStates.delete(pivotId);
  }

  clearAllFilters() {
    this.pivotFilterStates.clear();
  }

    setValue(newValue: string): void {
      localStorage.setItem('myValue', newValue);
      this.localStorageValue.next(newValue); // Notify subscribers
    }
  
    // Method to get the current value
    getValue(): string | null {
      return this.localStorageValue.getValue();
    }


  download() {
       this.downloadRequestSource.next(); 
  }

  refresh() {
    this.refreshRequestSource.next(); // Notify subscribers that a refresh has been requested

  }
}