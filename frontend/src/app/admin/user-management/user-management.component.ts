import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserManagementService} from '../../services/user-management.service';
import {User, UserRole} from '../../domain/user';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  constructor(public userManagementService: UserManagementService) { }
  private destroy$ = new Subject<boolean>();

  public users: User[] = [];

  public filteredUsers: User[] = this.users;
  public searchQuery = '';

  ngOnInit(): void {
    this.userManagementService.getAllUsers().pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      users => {
        this.users = users;
        this.searchUsers();
      }
    );
  }

  public makeRealtor(id: number) {
    this.userManagementService.grantRealtor(id)
      .subscribe();
  }

  public makePlainUser(id: number) {
    this.userManagementService.removeRealtorRole(id)
      .subscribe();
  }

  public isRealtor(user: User) {
    return user.roles.includes(UserRole.Realtor);
  }

  public searchUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      user.email?.toLowerCase().includes(this.searchQuery?.toLowerCase())
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
