import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {User} from '../../app-models/user';
import {UserService} from '../../app-services/user.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-objects',
  templateUrl: './user-objects.component.html',
  styleUrls: ['./user-objects.component.scss']
})
export class UserObjectsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  public user: User;
  public realtyObjects = [];

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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
