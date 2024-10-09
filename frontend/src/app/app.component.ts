import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from './services/user.service';
import {Router} from '@angular/router';
import {SampleSocketService} from './services/socket/sample-socket.service';
import {CookieService} from './services/common/CookieService';
import {Subject} from 'rxjs';
import {map, switchMap, takeUntil} from 'rxjs/operators';
import {GlobalNotificationService} from './services/global-notification.service';
import {User} from './domain/user';
import {RealtyObj} from './domain/realty-obj';
import {SocialAuthService} from '@abacritt/angularx-social-login';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(public http: HttpClient,
              public cookieService: CookieService,
              public router: Router,
              public socketService: SampleSocketService,
              public socialAuthService: SocialAuthService,
              public notificationService: GlobalNotificationService,
              public userService: UserService) {
  }

  public ngOnInit(): void {
    if (localStorage.getItem('token') || this.cookieService.getCookie('GOOGLE_OAUTH_TOKEN')) {
      this.userService.fetchUserStatus();
    } else {
      this.userService.clearUserInState();
    }
    this.userService.user$
      .pipe(
        switchMap(user =>
          this.socketService.currentDocument.pipe(
            map(object => ({object, user})),
            takeUntil(this.destroy$)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({object, user}) => this.handleAddToFavoritesSocketUpdate(object, user),
        error: err => console.error('Error in socket subscription:', err)
      });
  }

  public handleAddToFavoritesSocketUpdate(interest: any, user: User) {
    if (interest.realtyObjId && user && user.realtorDetails) {
      const realtor = user.realtorDetails;
      const suitableObjects = realtor.realtyObjects.filter((realtyObject: RealtyObj) => {
        return realtyObject.id === interest.realtyObjId;
      });
      if (suitableObjects.length) {
        this.notificationService.showNotification('Success! Somebody interested with your object!' + interest.realtyObjId);
      }
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
