import {Component, Input, OnInit} from '@angular/core';
import {filter} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {User} from '../domain/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isAuthenticated: boolean;

  public currentRoute: string;
  public user: User;

  public isActiveRoute(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  constructor(public router: Router,
              public userService: UserService) {
    this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.isAuthenticated = !!user;
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

  public fetchUserStatus() {
    this.userService.fetchUserStatus();
  }
}
