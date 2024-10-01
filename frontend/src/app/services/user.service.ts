import {Injectable} from '@angular/core';
import 'rxjs/add/observable/of';
import {User} from '../domain/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {endpoints} from '../commons';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable({providedIn: 'root'})
export class UserService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public user$ = this.userSubject.asObservable();

  constructor(public http: HttpClient) {
  }

  public fetchUserStatus() {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
    });

    this.http.get(endpoints.userStatus, {headers}).subscribe(
      (userInfo: any) => {
        this.userSubject.next(userInfo);
        this.isAuthenticatedSubject.next(!!userInfo);
      });
  }

  public clearUserInState() {
    if (this.isAuthenticatedSubject.value) {
      this.isAuthenticatedSubject.next(false);
    }
    if (this.userSubject.value) {
      this.userSubject.next(null);
    }
  }
}
