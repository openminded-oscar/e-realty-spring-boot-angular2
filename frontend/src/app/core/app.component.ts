import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../app-services/user.service';
import {Router} from '@angular/router';
import {SampleSocketService} from '../app-services/socket/sample-socket.service';
import {Subject} from 'rxjs';
import {map, switchMap, takeUntil} from 'rxjs/operators';
import {GlobalNotificationService} from '../app-services/global-notification.service';
import {User} from '../app-models/user';
import {RealtyObj} from '../app-models/realty-obj';
import {SocialAuthService, SocialUser} from '@abacritt/angularx-social-login';
import {SignInSignOutService} from '../app-services/auth/sign-in-sign-out.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(public http: HttpClient,
              public signinSignoutService: SignInSignOutService,
              public router: Router,
              public socketService: SampleSocketService,
              public socialAuthService: SocialAuthService,
              public notificationService: GlobalNotificationService,
              public userService: UserService) {
  }

  public ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.userService.fetchUserStatus();
    } else {
      this.userService.clearUserInState();
    }
    this.socialAuthService.authState.pipe(takeUntil(this.destroy$)).subscribe((googleUser: SocialUser) => {
      const {email, idToken, authToken, authorizationCode} = googleUser;
      this.signinSignoutService.signInWithGoogleData({email, idToken, authToken, authorizationCode, type: 'google'});
    });
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
