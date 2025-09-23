import { Injectable, inject } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { WorkbenchService } from '../components/workbench/workbench.service';
import { ToastrService } from 'ngx-toastr';

export interface InAppNotification {
  title: string;
  body: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messaging = inject(Messaging);
  public notifications$ = new BehaviorSubject<InAppNotification | null>(null);

  constructor(private workbenchService: WorkbenchService, private toasterService: ToastrService){

  }

  async requestPermission() {
    try {
      const token = await getToken(this.messaging, {
        vapidKey: 'BLWVBWUZLgPm5Cbv6ljQUzGQOiySfsu4bNZWsMptAkgko_88nJPguaHIiNVShcALKufIBO5U830qHc-oHsXaSfc'
      });
      console.log('FCM Token:', token);
      const notificationId = localStorage.getItem( 'notificationId' );
      let object = {
        ...(notificationId && { id: notificationId }),
        user_token: token
      }
        if (notificationId) {
            this.workbenchService.disableLoaderForNextRequest();
            this.workbenchService.updateNotificationToken(object).subscribe({
                next: (responce) => {
                    console.log(responce);
                    localStorage.setItem('notificationId', responce.notification_id);
                    this.toasterService.info('Push Notifications are Enabled.','info',{ positionClass: 'toast-top-center'});
                },
                error: (error) => {
                    console.log(error);
                }
            });
        } else {
            this.workbenchService.disableLoaderForNextRequest();
            this.workbenchService.saveNotificationToken(object).subscribe({
                next: (responce) => {
                    console.log(responce);
                    localStorage.setItem('notificationId', responce.notification_id);
                    this.toasterService.info('Push Notifications are Enabled.','info',{ positionClass: 'toast-top-center'});
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
      return token;
    } catch (err) {
      console.error('Permission denied or error occurred.', err);
      return null;
    }
  }

    listenMessages() {
        onMessage(this.messaging, (payload) => {
            console.log('Foreground message:', payload);
            const notification: InAppNotification = {
                title: payload.notification?.title || 'Notification',
                body: payload.notification?.body || '',
                icon: payload.notification?.image || ''
            };
            this.notifications$.next(notification);
        });
    }

    get notificationsObservable$() {
        return this.notifications$.asObservable();
    }
  }