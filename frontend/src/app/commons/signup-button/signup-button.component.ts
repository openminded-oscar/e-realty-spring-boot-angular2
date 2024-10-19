import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Credentials} from '../../domain/credentials.model';
import {SignupService} from '../../services/auth/signup.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'signup-button',
  templateUrl: './signup-button.component.html',
  styleUrls: ['./signup-button.component.scss']
})
export class SignupButtonComponent implements OnInit {
  public signUpForm: FormGroup;

  constructor(private modalService: NgbModal,
              private activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private signupService: SignupService) {
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  public openModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((credentials: Credentials) => {
      this.sendSignupRequest(credentials);
    }, (reason) => {
      console.log(reason);
    });
  }

  public sendSignupRequest(credentials: Credentials) {
    this.signupService.signUp(credentials)
      .subscribe();
  }

  public submit() {
    this.activeModal.close(this.signUpForm.value);
  }
}
