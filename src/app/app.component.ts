import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/loader/loader.component';
import { NotificationService } from './services/notification.service';
import { CommonModule } from '@angular/common';


export interface InAppNotification {
  title: string;
  body: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LoaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Analytify';
  notification: InAppNotification | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    const notificationId = localStorage.getItem('notificationId') === "null" ? null : localStorage.getItem('notificationId');
    console.log(notificationId);
    if(notificationId){
      this.notificationService.requestPermission();
      // this.notificationService.listenMessages();
    }
    this.notificationService.notificationsObservable$.subscribe(msg => {
      if (msg) {
        this.notification = msg;
      }

      setTimeout(() => {
        this.notification = null; // hide after 10 sec
      }, 10000);
    });
  }

  close() {
    this.notification = null;
  }
}
