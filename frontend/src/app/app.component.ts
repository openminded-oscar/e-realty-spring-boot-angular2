import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {endpoints} from "./commons";
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";
import {SampleSocketService} from "./services/socket/sample-socket.service";
import {NotificationsService} from "angular2-notifications";
import {Subscription} from "rxjs";
import {GoogleLoginProvider, SocialAuthService} from "angularx-social-login";
import {CookieService} from "./services/common/CookieService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'RealPerfect';
  dataInitialised = false;
  isAuthenticated = false;

  buySelected: boolean = true;
  rentSelected: boolean = false;
  realtersSelected: boolean = false;

  socketSubscription: Subscription;

  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private router: Router,
              private socketService: SampleSocketService,
              private _notification: NotificationsService,
              public socialAuthService: SocialAuthService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.reset();

    this.socketSubscription = this.socketService.currentDocument.subscribe(object => {
      this.handleAddToFavoritesSocketUpdate(object);
    });
  }

  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
  }


  public handleAddToFavoritesSocketUpdate(object: any) {
    if (object.realtyObjId && this.userService.user && this.userService.user.realterDetails) {
      let realter = this.userService.user.realterDetails;
      const suitableObjects = realter.realtyObjects.filter(realtyObject => realtyObject.id === object.realtyObjId);
      if(suitableObjects.length) {
        this._notification.success('Success!', 'Somebody interested with your object!' + object.realtyObjId);
      }
    }
  }

  fetchUserStatus() {
    let headers = new HttpHeaders({
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
