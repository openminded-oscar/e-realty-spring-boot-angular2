import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {User} from '../domain/user';
import {map, takeUntil, tap} from 'rxjs/operators';
import {Photo} from '../domain/photo';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService implements OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  constructor(public http: HttpClient) {
  }

  public grantRealtor(userId: number): Observable<User[]> {
    return this.http.post<User[]>(`/api/manage-users/set-realtor/${userId}`, {})
      .pipe(
        takeUntil(this.onDestroy$)
      );
  }

  public removeRealtorRole(userId: number): Observable<User[]> {
    return this.http.delete<User[]>(`/api/manage-users/set-realtor/${userId}`, {})
      .pipe(
        takeUntil(this.onDestroy$)
      );
  }

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/manage-users')
      .pipe(
        takeUntil(this.onDestroy$),
        tap(users => {
          users.map(user => {
            user.profilePicUrl = Photo.getLinkByFilename(user.profilePic as unknown as string);
          });
        })
      );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
