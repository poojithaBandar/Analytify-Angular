import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private requestCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private hideTimeout: any = null;
  private showTimestamp: number | null = null;
  private MIN_VISIBLE_TIME = 500; // milliseconds

  show() {
    this.requestCount++;
    // console.log('LoaderService: show loader, request count:', this.requestCount); // Detailed log
    if (this.requestCount === 1) {
      // First API call -> Show the loader
      this.showTimestamp = Date.now();
      this.loadingSubject.next(true);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  hide() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    // console.log('LoaderService: hide loader, request count:', this.requestCount); // Detailed log
    if (this.requestCount === 0) {
      const now = Date.now();
      const visibleDuration = now - (this.showTimestamp ?? now);

      if (visibleDuration >= this.MIN_VISIBLE_TIME) {
        // Visible enough time already, hide immediately
        this.loadingSubject.next(false);
      } else {
        // Not enough visible time, wait remaining time
        const remainingTime = this.MIN_VISIBLE_TIME - visibleDuration;
        this.hideTimeout = setTimeout(() => {
          this.loadingSubject.next(false);
        }, remainingTime);
      }
    }
    
  }
}
