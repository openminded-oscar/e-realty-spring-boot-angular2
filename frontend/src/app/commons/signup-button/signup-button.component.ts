import { Component } from '@angular/core';
import {UserService} from "../../services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Credentials} from "../../domain/credentials.model";
import {SigninSignoutService} from "../../services/auth/signin-signout.service";
import {SignupService} from "../../services/auth/signup.service";

@Component({
  selector: 'signup-button',
  templateUrl: './signup-button.component.html',
  styleUrls: ['./signup-button.component.scss']
})
export class SignupButtonComponent {
  login: string;
  password: string;
  isRealter: boolean = false;

  constructor(private modalService: NgbModal, private signupService: SignupService) {
  }

  openModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((credentials: Credentials) => {
      this.sendSignupRequest(credentials);
    }, (reason) => {
      console.log(reason);
    });
  }

  sendSignupRequest(credentials: Credentials) {
    this.signupService.signUp(credentials)
      .subscribe(res => {
        if(this.isRealter) {
          console.log('is realter');
        } else {
          console.log('is  not  realter');
        }
      });
  }
}
