import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {UserService} from '../app-services/user.service';
import {SignInSignOutService} from '../app-services/auth/sign-in-sign-out.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private signinSignoutService: SignInSignOutService, private router: Router) {
  }

  // No teardown: canActivate returns an Observable the router subscribes to and manages.
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.isAuthenticated$
      .pipe(
        filter(isAuthenticated => isAuthenticated !== null),
        // convert to boolean
        map(v => !!v),
        tap(v => {
          if (!v) {
            this.router.navigate(['/']).then();
            this.signinSignoutService.signIn('Sign In To Access All Features!');
          }
        })
      );
  }
}
