import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalNotificationService } from '../services/global-notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Notification } from '../services/global-notification.service';

@Component({
  selector: 'app-global-notification',
  templateUrl: './global-notification.component.html',
  styleUrls: ['./global-notification.component.scss']
})
export class GlobalNotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = []; // Store notification objects
  private destroy$ = new Subject<boolean>();

  constructor(public notificationService: GlobalNotificationService) {}

  ngOnInit(): void {
    this.notificationService.notificationSubject.asObservable()
      .pipe(takeUntil(this.destroy$))
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
