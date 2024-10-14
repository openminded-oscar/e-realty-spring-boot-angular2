import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {User, UserRole} from '../domain/user';
import { takeUntil, tap } from 'rxjs/operators';
import { Photo } from '../domain/photo';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService implements OnDestroy {
  private onDestroy$ = new Subject<boolean>();
  private users$ = new BehaviorSubject<User[]>([]); // Store users as a BehaviorSubject

  constructor(public http: HttpClient) {
    this.loadAllUsers(); // Initial load of users
  }

  // Method to expose users as Observable to other components
  public getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }

  // Method to load all users and update the BehaviorSubject
  private loadAllUsers(): void {
    this.http.get<User[]>('/api/manage-users')
      .pipe(
        takeUntil(this.onDestroy$),
        tap(users => {
          users.forEach(user => {
            user.profilePicUrl = user.profilePic ? Photo.getLinkByFilename(user.profilePic?.filename) : null;
          });
          this.users$.next(users); // Emit the updated user list
        })
      ).subscribe();
  }

  public grantRealtor(userId: number): void {
    this.http.post(`/api/manage-users/set-realtor/${userId}`, {})
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        // Update the local user roles
        const users = this.users$.getValue(); // Get current users
        const user = users.find(u => u.id === userId);
        if (user) {
          user.roles.push(UserRole.Realtor); // Add the realtor role
          this.users$.next(users); // Emit the updated user list
        }
      });
  }

  public removeRealtorRole(userId: number): void {
    this.http.delete(`/api/manage-users/set-realtor/${userId}`, {})
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        const users = this.users$.getValue(); // Get current users
        const user = users.find(u => u.id === userId);
        if (user) {
          user.roles = user.roles.filter(role => role !== UserRole.Realtor); // Remove the realtor role
          this.users$.next(users); // Emit the updated user list
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
