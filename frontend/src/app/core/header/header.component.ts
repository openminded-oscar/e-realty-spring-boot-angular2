import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {UserService} from '../../app-services/user.service';
import {User} from '../../app-models/user';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  constructor(public router: Router,
              public userService: UserService) {
    this.userService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        if (user) {
          this.user = user;
          this.isAuthenticated = !!user;
        } else {
          this.user = null;
          this.isAuthenticated = false;
        }
      });
  }
  public isAuthenticated: boolean;
  public isAdmin: boolean;

  public currentRoute: string;
  public user: User;

  public isMenuCollapsed = true;

  public isActiveRoute(route: string): boolean {
    return this.currentRoute?.endsWith(route);
  }

  public isDefaultRoute() {
    return this.currentRoute === '/';
  }

  public closeMenu() {
    this.isMenuCollapsed = true;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }
}
