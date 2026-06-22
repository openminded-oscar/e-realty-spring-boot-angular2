import {Component} from '@angular/core';

import {UserService} from '../../app-services/user.service';

@Component({
  selector: 'app-google-sign-in-button',
  templateUrl: './google-sign-in-button.component.html',
  styleUrls: ['./google-sign-in-button.component.scss']
})
export class GoogleSignInButtonComponent {
  constructor(public userService: UserService) {
  }
}
