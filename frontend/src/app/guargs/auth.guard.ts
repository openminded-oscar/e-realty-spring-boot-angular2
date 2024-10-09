import {Injectable, OnDestroy} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {SigninSignoutService} from '../services/auth/signin-signout.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnDestroy {
  private destroy$ = new Subject<Boolean>();

  constructor(private userService: UserService, private signinSignoutService: SigninSignoutService, private router: Router) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.isAuthenticated$
      .pipe(
        filter(isAuthenticated => isAuthenticated !== null),
        // convert to boolean
        map(v => !!v),
        tap(v => {
          if (!v) {
            this.router.navigate(['/']);
            this.signinSignoutService.signinPrompt('Sign In To Access All Features!');
          }
        }),
        takeUntil(this.destroy$)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(false);
    this.destroy$.complete();
  }
}
