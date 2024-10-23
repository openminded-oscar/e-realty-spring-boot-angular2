import {Injectable, OnDestroy} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {UserService} from '../app-services/user.service';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {SignInSignOutService} from '../app-services/auth/sign-in-sign-out.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnDestroy {
  private destroy$ = new Subject<Boolean>();

  constructor(private userService: UserService, private signinSignoutService: SignInSignOutService, private router: Router) {
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
            this.signinSignoutService.signIn('Sign In To Access All Features!');
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
