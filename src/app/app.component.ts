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
    this.notificationService.notificationsObservable$.subscribe(msg => {
      if (msg) {
        this.notification = msg;
      }
    });
  }

  close() {
    this.notification = null;
  }
}
