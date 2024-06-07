import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private requestCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show() {
    console.log('Show loader'); 
    this.requestCount++;
    this.loadingSubject.next(true);
  }

  hide() {
    this.requestCount--;

    console.log('Hide loader, request count:', this.requestCount); 
    if (this.requestCount === 0) {

    this.loadingSubject.next(false);
    }
  }
}
