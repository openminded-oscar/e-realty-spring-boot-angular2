import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../domain/user';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  public user: User;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.user$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      user => {
        this.user = user;
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
