import {Component, EventEmitter, Output} from '@angular/core';
import {UserService} from "../../services/user.service";
import {SigninSignoutService} from "../../services/auth/signin-signout.service";

@Component({
  selector: 'signout-button',
  templateUrl: './signout-button.component.html',
  styleUrls: ['./signout-button.component.css']
})
export class SignoutButtonComponent {
  @Output()
  onSignout = new EventEmitter();

  constructor(private authService: SigninSignoutService) {
  }

  signout() {
    this.authService.signout();
    this.onSignout.emit();
  }
}
