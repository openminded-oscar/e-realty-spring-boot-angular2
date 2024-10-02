import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from '../services/user.service';
import {User} from '../domain/user';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public user: User;
  constructor(private userService: UserService) {
    this.userService.user$.subscribe((user) => this.user = user);
  }

  canActivate(
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('can activate ' + !!this.user);
    return !!this.user;
  }
}
