import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../app-services/user.service';
import {SignInSignOutService} from '../../app-services/auth/sign-in-sign-out.service';

@Component({
  selector: 'signout-button',
  templateUrl: './sign-out-button.component.html',
  styleUrls: ['./sign-out-button.component.scss']
})
export class SignOutButtonComponent {
  constructor(private authService: SignInSignOutService,
              private router: Router,
              private userService: UserService) {
  }

  public signOut() {
    this.authService.signOut();
    this.userService.clearUserInState();
    this.router.navigate(['/']).then();
  }
}
