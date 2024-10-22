import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';


export interface Notification {
  message: string;
  type: 'info' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class GlobalNotificationService {
  public notificationSubject = new Subject<Notification>();

  constructor() {
  }

  public showNotification(message: string) {
    this.notificationSubject.next({type: 'info', message});
  }

  public showErrorNotification(message: string) {
    this.notificationSubject.next({type: 'error', message});
  }
}

