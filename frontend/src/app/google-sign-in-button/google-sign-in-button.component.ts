import {Component, OnDestroy, OnInit} from '@angular/core';
import {SocialAuthService, SocialUser} from '@abacritt/angularx-social-login';
import {takeUntil} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {Subject} from 'rxjs';
import {UserService} from '../services/user.service';
import {SigninSignoutService} from '../services/auth/signin-signout.service';

@Component({
  selector: 'app-google-sign-in-button',
  templateUrl: './google-sign-in-button.component.html',
  styleUrls: ['./google-sign-in-button.component.scss']
})
export class GoogleSignInButtonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(public modalService: NgbModal,
              public userService: UserService,
              public authService: SigninSignoutService,
              public socialAuthService: SocialAuthService) {
  }

  ngOnInit(): void {
    this.socialAuthService.authState.pipe(takeUntil(this.destroy$)).subscribe((googleUser: SocialUser) => {
      const {email, idToken, authToken, authorizationCode} = googleUser;
      this.authService.signInGoogleData({email, idToken, authToken, authorizationCode, type: 'google'})
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.userService.fetchUserStatus();
          this.modalService.dismissAll();
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
