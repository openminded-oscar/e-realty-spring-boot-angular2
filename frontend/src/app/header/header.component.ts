import {Component, OnDestroy, OnInit} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {User} from '../domain/user';
import {SocialAuthService, SocialUser} from '@abacritt/angularx-social-login';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SigninSignoutService} from '../services/auth/signin-signout.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  public isAuthenticated: boolean;
  public isAdmin: boolean;

  public currentRoute: string;
  public user: User;

  public isActiveRoute(route: string): boolean {
    return this.currentRoute?.endsWith(route);
  }

  public isDefaultRoute() {
    return this.currentRoute === '/';
  }

  constructor(public router: Router,
              public userService: UserService,
              public modalService: NgbModal,
              public authService: SigninSignoutService,
              public socialAuthService: SocialAuthService) {
    this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.isAuthenticated = !!user;
      } else {
        this.user = null;
        this.isAuthenticated = false;
      }
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });

    this.socialAuthService.authState.subscribe((googleUser: SocialUser) => {
      const {email, idToken, authToken, authorizationCode} = googleUser;
      this.authService.signInGoogleData({email, idToken, authToken, authorizationCode, type: 'google'})
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.userService.fetchUserStatus();
          this.modalService.dismissAll();
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
