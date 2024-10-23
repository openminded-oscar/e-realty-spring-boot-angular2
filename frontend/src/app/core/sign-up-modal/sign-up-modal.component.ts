import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SignInSignOutService} from '../../app-services/auth/sign-in-sign-out.service';

@Component({
  selector: 'app-sign-up-modal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.scss']
})
export class SignUpModalComponent implements OnInit {
  public signUpForm: FormGroup;
  constructor(public modal: NgbActiveModal,
              public signinSignoutService: SignInSignOutService,
              public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  switchToSignIn() {
    this.signinSignoutService.signIn();
  }
}
