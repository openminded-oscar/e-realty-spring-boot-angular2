import {Component, OnDestroy} from '@angular/core';

import {Subject} from 'rxjs';
import {UserService} from '../../app-services/user.service';

@Component({
  selector: 'app-google-sign-in-button',
  templateUrl: './google-sign-in-button.component.html',
  styleUrls: ['./google-sign-in-button.component.scss']
})
export class GoogleSignInButtonComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(public userService: UserService) {
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
