import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {User} from '../../app-models/user';
import {UserService} from '../../app-services/user.service';

@Component({
  selector: 'app-user-objects',
  templateUrl: './user-objects.component.html',
  styleUrls: ['./user-objects.component.scss']
})
export class UserObjectsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  public user: User;
  public realtyObjects = [];
  public filter: 'all' | 'active' | 'archived' | 'drafts' = 'all';

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.user$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      user => {
        this.user = user;
        this.realtyObjects = user?.realtyObjects ?? [];
      }
    );
  }

  public setFilter(filterSelected: 'all' | 'active' | 'archived' | 'drafts') {
    this.filter = filterSelected;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
