import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {endpoints} from "./commons";
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";
import {SampleSocketService} from "./services/socket/sample-socket.service";
import {NotificationsService} from "angular2-notifications";
import {Subscription} from "rxjs";

declare var gapi: any;

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
              private router: Router,
              private socketService: SampleSocketService,
              private _notification: NotificationsService,
              private userService: UserService,
              private zone: NgZone) {
  }

  ngOnInit(): void {
    this.loadClient().then(
      result => {
        gapi.auth2.authorize({
          client_id: '510686946042-rijrprort52tnmpm0e0ir20qgngt9cha.apps.googleusercontent.com',
          scope: 'email profile openid https://www.googleapis.com/auth/calendar',
          response_type: 'email profile openid code'
        }, function(response) {
          if (response.error) {
            return;
          }
          console.log(JSON.stringify(response));
        });
        console.log('loaded successfully!!!')
      },
        err => console.log('loading failure!!!')
    );

    this.reset();

    this.socketSubscription = this.socketService.currentDocument.subscribe(object => {
      this.handleAddToFavoritesSocketUpdate(object);
    });
  }

  loadClient(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {
        gapi.load('client:auth2', {
          callback: resolve,
          onerror: reject,
          timeout: 1000, // 5 seconds.
          ontimeout: reject
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
  }


  public handleAddToFavoritesSocketUpdate(object: any) {
    let realter = this.userService.user.realterDetails;
    if (object.realtyObjId && this.userService.user.realterDetails) {
      const suitableObjects = realter.realtyObjects.filter(realtyObject => realtyObject.id === object.realtyObjId);
      if(suitableObjects.length) {
        this._notification.success('Success!', 'Somebody interested with your object!' + object.realtyObjId);
      }
    }
  }

  fetchUserStatus() {
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': localStorage.getItem('token') || ''
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

    if (localStorage.getItem('token')) {
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
