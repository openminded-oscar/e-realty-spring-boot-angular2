import {Injectable} from '@angular/core';
import {User, UserRole} from '../domain/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {endpoints} from '../commons';
import {BehaviorSubject} from 'rxjs';

import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Photo} from '../domain/photo';
import {RealtyObj} from '../domain/realty-obj';

@Injectable({providedIn: 'root'})
export class UserService {
  private userSubject = new BehaviorSubject<User>(null);
  public user$ = this.userSubject.asObservable();

  private isSignedInUserSubject = new BehaviorSubject<boolean>(null);
  public isSignedInUser$ = this.isSignedInUserSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(null);
  public isAdmin$ = this.isAdminSubject.asObservable();

  private isRealtorSubject = new BehaviorSubject<boolean>(null);
  public isRealtor$ = this.isRealtorSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<Boolean>(null);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(public http: HttpClient) {
  }

  public updateUserProfileOnServer(user: User): Observable<any> {
    return this.http.patch(`${endpoints.userUpdate}`, user)
      .pipe(
        catchError((error: any) => throwError(error)),
        tap((userFromServer: User) => {
          userFromServer.profilePicUrl = Photo.getLinkByFilename(userFromServer.profilePic.filename);
        })
      );
  }

  public fetchUserStatus() {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
    });

    this.http.get(endpoints.userStatus, {headers}).subscribe(
      (userInfo: User) => {
        userInfo.profilePicUrl = userInfo.profilePic ?
          Photo.getLinkByFilename(userInfo.profilePic.filename) : null;
        userInfo.realtyObjects.forEach(o => o.mainPhotoPath = RealtyObj.getMainPhoto(o));
        this.userSubject.next(userInfo);
        this.isSignedInUserSubject.next(userInfo.roles?.includes(UserRole.User));
        this.isRealtorSubject.next(userInfo.roles?.includes(UserRole.Realtor));
        this.isAdminSubject.next(userInfo.roles?.includes(UserRole.Admin));
        this.isAuthenticatedSubject.next(!!userInfo);
      });
  }

  public getCurrentUserValue(): User | null {
    return this.userSubject.getValue();
  }

  public clearUserInState() {
    this.isAdminSubject.next(false);
    this.isRealtorSubject.next(false);
    this.isSignedInUserSubject.next(false);
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
  }
}
