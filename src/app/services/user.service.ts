import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userNameSubject = new BehaviorSubject<string>(this.getUserNameFromStorage());
  userName$ = this.userNameSubject.asObservable();

  constructor() {}

  private getUserNameFromStorage(): string {
    return localStorage.getItem('firstName') || '';
  }

  setUserName(newName: string) {
    localStorage.setItem('firstName', newName);
    this.userNameSubject.next(newName);
  }
}
