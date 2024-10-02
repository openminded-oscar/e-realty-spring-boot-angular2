import { Subject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root',
})
export class InitializeAppService implements OnDestroy {
  constructor(
    private userService: UserService
  ) {}

  private destroy$ = new Subject<boolean>();

  init(): void {
    console.log('InitService Not yet implemented!!!!!');
    // this.store.dispatch(CheckTokenInBrowserStorage());
    // const url = window.location.href;
    // const loadContent = NotLoadDataUrls.findIndex((item) => url.includes(item)) === -1;
    // if (loadContent) {
    //   this.store.dispatch(GetCountries());
    //   this.store.dispatch(GetTimeZonesList());
    //   this.store.dispatch(GetSettings());
    // }
    // if (!this.cookieService.get('token')) {
    //   return;
    // } else {
    //
    //   this.userDataService
    //       .getUserInfo(true)
    //       .pipe(
    //           switchMap((user: IUser) => {
    //             this.store.dispatch(GetUserSuccess({ payload: user }));
    //             return of(user);
    //           })
    //       )
    //       .subscribe();
    // }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
