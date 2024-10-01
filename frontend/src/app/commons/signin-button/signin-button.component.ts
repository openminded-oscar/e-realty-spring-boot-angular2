import {Component, EventEmitter, Output} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Credentials} from "../../domain/credentials.model";
import {SigninSignoutService} from "../../services/auth/signin-signout.service";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";
import {User} from '../../domain/user';
import {UserService} from '../../services/user.service';

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

  constructor(private modalService: NgbModal,
              private authService: SigninSignoutService,
              private userService: UserService,
              private socialAuthService: SocialAuthService) {
  }

  openModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result
      .then((credentials: Credentials) => {
        this.sendLoginRequest(credentials);
      }, (reason) => {
        console.log(reason);
      });
  }

  public sendLoginRequest(credentials) {
    credentials.type = 'plain';
    this.authService.signin(credentials)
      .subscribe(res => {
        this.userService.fetchUserStatus();
        this.onSignin.emit();
      });
  }

  public signInViaGoogle(): void {
    this.socialAuthService.authState.subscribe((googleUser: SocialUser) => {
      let {email, idToken, authToken, authorizationCode} = googleUser;
      this.authService.signinGoogleData( {email, idToken, authToken, authorizationCode, type: 'google'})
        .subscribe(res => {
          this.modalService.dismissAll();
          this.userService.fetchUserStatus();
          this.onSignin.emit();
        });
    });

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
