import {Component, OnInit} from '@angular/core';
import {SignupService} from '../../services/auth/signup.service';

@Component({
  selector: 'signup-button',
  templateUrl: './signup-button.component.html',
  styleUrls: ['./signup-button.component.scss']
})
export class SignupButtonComponent implements OnInit {
  constructor(private signupService: SignupService) {
  }

  ngOnInit(): void {
  }


  public openModal() {
    this.signupService.signUp();
  }
}
