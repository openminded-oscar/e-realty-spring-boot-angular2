import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SignupService} from '../../app-services/auth/signup.service';

@Component({
  selector: 'app-sign-in-modal',
  templateUrl: './sign-in-modal.component.html',
  styleUrls: ['./sign-in-modal.component.scss']
})
export class SignInModalComponent implements OnInit {
  public signInForm: FormGroup;
  public customSignInText: string;

  constructor(public fb: FormBuilder,
              public signupService: SignupService,
              public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  public switchToSignUp() {
    this.signupService.signUp();
  }
}
