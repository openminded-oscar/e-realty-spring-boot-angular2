import {Component, EventEmitter, Output} from '@angular/core';
import {UserService} from '../../services/user.service';
import {SigninSignoutService} from '../../services/auth/signin-signout.service';

@Component({
  selector: 'signout-button',
  templateUrl: './signout-button.component.html',
  styleUrls: ['./signout-button.component.scss']
})
export class SignoutButtonComponent {
  @Output()
  onSignout = new EventEmitter();

  constructor(private authService: SigninSignoutService, private userService: UserService) {
  }

  public signout() {
    this.authService.signout();
    this.userService.clearUserInState();
    this.onSignout.emit();
  }
}
