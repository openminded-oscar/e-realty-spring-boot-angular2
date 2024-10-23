import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subject} from 'rxjs';
import {UserService} from '../../app-services/user.service';

@Component({
  selector: 'app-google-sign-in-button',
  templateUrl: './google-sign-in-button.component.html',
  styleUrls: ['./google-sign-in-button.component.scss']
})
export class GoogleSignInButtonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
