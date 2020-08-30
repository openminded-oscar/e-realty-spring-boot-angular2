import {Component, EventEmitter, Output} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Credentials} from "../../domain/credentials.model";
import {SigninSignoutService} from "../../services/auth/signin-signout.service";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";

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

  constructor(private modalService: NgbModal, private authService: SigninSignoutService, private socialAuthService: SocialAuthService) {
  }

  openModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result
      .then((credentials: Credentials) => {
        this.sendLoginRequest(credentials);
      }, (reason) => {
        console.log(reason);
      });
  }

  sendLoginRequest(credentials) {
    credentials.type = 'plain';
    this.authService.signin(credentials)
      .subscribe(res => {
        this.onSignin.emit();
      });
  }

  signInViaGoogle(): void {
    this.socialAuthService.authState.subscribe((googleUser: SocialUser) => {
      let {email, idToken, authToken, authorizationCode} = googleUser;
      this.authService.signinGoogleData( {email, idToken, authToken, authorizationCode, type: 'google'})
        .subscribe(res => {
          this.onSignin.emit();
        });
    });

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
