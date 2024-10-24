import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {UserManagementService} from '../../app-services/user-management.service';
import {User, UserRole} from '../../app-models/user';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  public defaultUserPhoto = 'https://placehold.co/400x450?text=User+photo';

  constructor(public userManagementService: UserManagementService, public cdr: ChangeDetectorRef) {
  }

  private destroy$ = new Subject<boolean>();

  public users: User[] = [];

  public filteredUsers: User[] = this.users;
  public searchQuery = '';

  ngOnInit(): void {
    this.userManagementService.getUsers().pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      users => {
        this.users = users;
        this.searchUsers();
      }
    );
  }

  public searchUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      user.email?.toLowerCase().includes(this.searchQuery?.toLowerCase())
    );
  }

  public makeRealtor(id: number) {
    this.userManagementService.grantRealtor(id);
  }

  public makePlainUser(id: number) {
    this.userManagementService.removeRealtorRole(id);
  }

  public isRealtor(user: User) {
    return user.roles.includes(UserRole.Realtor);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
