import {Component, OnInit} from '@angular/core';
import {SignInSignOutService} from '../../app-services/auth/sign-in-sign-out.service';
import {UserService} from '../../app-services/user.service';

@Component({
  selector: 'signin-button',
  templateUrl: './sign-in-button.component.html',
  styleUrls: ['./sign-in-button.component.scss']
})
export class SignInButtonComponent implements OnInit {
  constructor(public authService: SignInSignOutService,
              public userService: UserService) {
  }

  public ngOnInit() {
  }

  public openModal(): void {
    this.authService.signIn();
  }
}
