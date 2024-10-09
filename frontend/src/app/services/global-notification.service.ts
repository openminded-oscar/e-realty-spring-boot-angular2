import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalNotificationService {
  public notificationSubject = new Subject<string>();

  constructor() {
  }

  public showNotification(message: string) {
    this.notificationSubject.next(message);
  }
}

