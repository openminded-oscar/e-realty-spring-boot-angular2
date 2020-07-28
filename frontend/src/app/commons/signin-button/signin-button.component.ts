import {Component, EventEmitter, Output} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Credentials} from "../../domain/credentials.model";
import {SigninSignoutService} from "../../services/auth/signin-signout.service";

@Component({
  selector: 'signin-button',
  templateUrl: './signin-button.component.html',
  styleUrls: ['./signin-button.component.scss']
})
export class SigninButtonComponent {
  login: string;
  password: string;

  @Output()
  onSignin = new EventEmitter();

  constructor(private modalService: NgbModal, private authService: SigninSignoutService) {
  }

  openModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result
      .then((credentials: Credentials) => {
        this.sendLoginRequest(credentials);
      }, (reason) => {
        console.log(reason);
      });
  }

  sendLoginRequest(credentials: Credentials) {
    this.authService.signin(credentials)
      .subscribe(res => {
        this.onSignin.emit();
      });
  }
}
