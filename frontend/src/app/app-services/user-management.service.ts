import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {User, UserRole} from '../app-models/user';
import {Photo} from '../app-models/photo';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  // No teardown: root singleton; the inner HTTP requests complete on their own.
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
      .subscribe(() => {
        const users = this.users$.getValue(); // Get current users
        const user = users.find(u => u.id === userId);
        if (user) {
          user.roles = user.roles.filter(role => role !== UserRole.Realtor); // Remove the realtor role
          this.users$.next(users); // Emit the updated user list
        }
      });
  }
}
