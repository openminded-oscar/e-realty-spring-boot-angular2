import {Injectable} from '@angular/core';
import 'rxjs/add/observable/of';
import {User} from '../domain/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {endpoints} from '../commons';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Realter} from '../domain/realter';
import {Observable, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {
  private isAuthenticatedSubject = new BehaviorSubject<Boolean>(null);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userSubject = new BehaviorSubject<User>(null);
  public user$ = this.userSubject.asObservable();

  constructor(public http: HttpClient) {
  }

  public updateUserProfileOnServer(user: User): Observable<any> {
    return this.http.patch(`${endpoints.userUpdate}`, user)
      .catch((error: any) => throwError(error));
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
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
  }
}
