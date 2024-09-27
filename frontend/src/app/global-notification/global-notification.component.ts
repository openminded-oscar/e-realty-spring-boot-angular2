import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbToast} from '@ng-bootstrap/ng-bootstrap';
import {GlobalNotificationService} from '../services/global-notification.service';
import {bufferTime, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-global-notification',
  templateUrl: './global-notification.component.html',
  styleUrls: ['./global-notification.component.scss']
})
export class GlobalNotificationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('toast', {static: false})
  toast: NgbToast;
  notificationTexts = [];
  notificationBufferTimeSpan = 2500;
  notificationShowTime = 2000;

  private destroy$ = new Subject<boolean>();

  constructor(
    public notificationService: GlobalNotificationService) {
  }

  ngOnInit(): void {
    this.notificationService.notificationSubject.asObservable().pipe(
      bufferTime(this.notificationBufferTimeSpan),
      takeUntil(this.destroy$)
    ).subscribe(notificationTexts => {
      if (notificationTexts.length > 0) {
        this.showNotification(notificationTexts);
      }
    });
  }

  private showNotification(notificationTexts: string[]) {
    this.notificationTexts = notificationTexts;
    this.toast.show();
    setTimeout(() => {
      this.toast.hide();
    }, this.notificationShowTime);
  }


  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.toast.hide();
  }
}
