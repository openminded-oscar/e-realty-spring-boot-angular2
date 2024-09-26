import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {endpoints} from './commons';
import {UserService} from './services/user.service';
import {Router} from '@angular/router';
import {SampleSocketService} from './services/socket/sample-socket.service';
import {SocialAuthService} from 'angularx-social-login';
import {CookieService} from './services/common/CookieService';
import {GlobalNotificationService} from './services/global-notification.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'RealPerfect';
  dataInitialised = false;
  isAuthenticated = false;

  buySelected = true;
  rentSelected = false;
  realtersSelected = false;

  private destroy$ = new Subject<boolean>();

  constructor(public http: HttpClient,
              public cookieService: CookieService,
              public router: Router,
              public socketService: SampleSocketService,
              public socialAuthService: SocialAuthService,
              public notificationService: GlobalNotificationService,
              public userService: UserService) {
  }

  ngOnInit(): void {
    this.reset();
    this.socketService.currentDocument.pipe(
      takeUntil(this.destroy$)
    ).subscribe(object => {
      this.handleAddToFavoritesSocketUpdate(object);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  public handleAddToFavoritesSocketUpdate(object: any) {
    if (object.realtyObjId && this.userService.user && this.userService.user.realterDetails) {
      const realter = this.userService.user.realterDetails;
      const suitableObjects = realter.realtyObjects.filter(realtyObject => realtyObject.id === object.realtyObjId);
      if (suitableObjects.length) {
        this.notificationService.showNotification('Success! Somebody interested with your object!' + object.realtyObjId);
      }
    }
  }

  public fetchUserStatus() {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
    });

    this.http.get(endpoints.userStatus, {headers}).subscribe(
      (userInfo: any) => {
        const isAuthenticated = !!userInfo;
        this.userService.user = userInfo;
        this.userService.isAuthenticated = isAuthenticated;
        this.isAuthenticated = isAuthenticated;
        this.dataInitialised = true;
      }, error => {
        this.dataInitialised = true;
      });
  }

  reset() {
    this.dataInitialised = false;

    if (localStorage.getItem('token') || this.cookieService.getCookie('GOOGLE_OAUTH_TOKEN')) {
      this.fetchUserStatus();
    } else {
      this.userService.isAuthenticated = false;
      this.userService.user = null;
      this.isAuthenticated = false;
      this.dataInitialised = true;
    }
  }

  resetMenuItemsActive() {
    this.buySelected = false;
    this.rentSelected = false;
    this.realtersSelected = false;
  }

  goToBuy() {
    this.router.navigateByUrl('/buy');
    this.resetMenuItemsActive();
    this.buySelected = true;
  }

  goToRent() {
    this.router.navigateByUrl('/rent');
    this.resetMenuItemsActive();
    this.rentSelected = true;
  }

  goToRealtors() {
    this.router.navigateByUrl('/realtors');
    this.resetMenuItemsActive();
    this.realtersSelected = true;
  }
}
