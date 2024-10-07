import {Injectable} from '@angular/core';
import 'rxjs/add/observable/of';
import {User} from '../domain/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {endpoints} from '../commons';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Realtor} from '../domain/realtor';
import {Observable, throwError} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Photo} from '../domain/photo';
import {RealtyObj} from '../domain/realty-obj';

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
      .pipe(tap((userFromServer: User) => {
        userFromServer.profilePicUrl = Photo.getLinkByFilename(userFromServer.profilePic as unknown as string);
      }))
      .catch((error: any) => throwError(error));
  }

  public fetchUserStatus() {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
    });

    this.http.get(endpoints.userStatus, {headers}).subscribe(
      (userInfo: User) => {
        userInfo.profilePicUrl = userInfo.profilePic ?
          Photo.getLinkByFilename(userInfo.profilePic as unknown as string) : null;
        userInfo.realtyObjects.forEach(o => o.mainPhotoPath = RealtyObj.getMainPhoto(o));
        this.userSubject.next(userInfo);
        this.isAuthenticatedSubject.next(!!userInfo);
      });
  }

  public getCurrentUserValue(): User | null {
    return this.userSubject.getValue();
  }

  public clearUserInState() {
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
  }
}
