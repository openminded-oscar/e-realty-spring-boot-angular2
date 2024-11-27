import {Component} from '@angular/core';
import {SignupService} from '../../app-services/auth/signup.service';

@Component({
  selector: 'signup-button',
  templateUrl: './signup-button.component.html',
  styleUrls: ['./signup-button.component.scss']
})
export class SignupButtonComponent {
  constructor(private signupService: SignupService) {
  }


  public openModal() {
    this.signupService.signUp();
  }
}
