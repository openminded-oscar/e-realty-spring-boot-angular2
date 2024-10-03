import {Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Credentials} from '../../domain/credentials.model';
import {SigninSignoutService} from '../../services/auth/signin-signout.service';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {UserService} from '../../services/user.service';
import {takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'signin-button',
  templateUrl: './signin-button.component.html',
  styleUrls: ['./signin-button.component.scss']
})
export class SigninButtonComponent implements OnInit, OnDestroy {
  login: string;
  password: string;

  @ViewChild('content', { static: true })
  public content: TemplateRef<any>;
  @Output()
  public onSignin = new EventEmitter();
  private destroy$ = new Subject<boolean>();

  constructor(private modalService: NgbModal,
              private authService: SigninSignoutService,
              private userService: UserService,
              private socialAuthService: SocialAuthService) {
  }

  public ngOnInit() {
    this.authService.signinPromptSubscribe().pipe(
      takeUntil(this.destroy$),
      tap(v => {
        if (v) {
          this.openModal();
        }
      })
    ).subscribe();
  }

  public openModal() {
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'})
      .result
      .then((credentials: Credentials) => {
        this.sendLoginRequest(credentials);
      }, (reason) => {
        console.log(reason);
      });
  }

  public sendLoginRequest(credentials: Credentials) {
    credentials.type = 'plain';
    this.authService.signin(credentials)
      .subscribe(res => {
        this.userService.fetchUserStatus();
        this.onSignin.emit();
      });
  }

  public signInViaGoogle(): void {
    this.socialAuthService.authState.subscribe((googleUser: SocialUser) => {
      const {email, idToken, authToken, authorizationCode} = googleUser;
      this.authService.signinGoogleData( {email, idToken, authToken, authorizationCode, type: 'google'})
        .subscribe(res => {
          this.modalService.dismissAll();
          this.userService.fetchUserStatus();
          this.onSignin.emit();
        });
    });

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
