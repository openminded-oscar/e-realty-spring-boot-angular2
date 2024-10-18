import {Component, OnInit} from '@angular/core';
import {filter} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {User} from '../domain/user';
import {SocialAuthService} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
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
              public userService: UserService) {
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
  }
}
