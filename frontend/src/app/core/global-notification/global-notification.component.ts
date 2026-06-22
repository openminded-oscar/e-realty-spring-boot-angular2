import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GlobalNotificationService, Notification} from '../../app-services/global-notification.service';

@Component({
  selector: 'app-global-notification',
  templateUrl: './global-notification.component.html',
  styleUrls: ['./global-notification.component.scss']
})
export class GlobalNotificationComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  notifications: Notification[] = []; // Store notification objects

  constructor(public notificationService: GlobalNotificationService) {}

  ngOnInit(): void {
    this.notificationService.notificationSubject.asObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(notification => {
        this.addNotification(notification);
      });
  }

  private addNotification(notification: Notification) {
    this.notifications.push(notification);
    setTimeout(() => {
      this.removeNotification(notification);
    }, 2000);
  }

  private removeNotification(notification: Notification) {
    this.notifications = this.notifications.filter(n => n !== notification);
  }
}
