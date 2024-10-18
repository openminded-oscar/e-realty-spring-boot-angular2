import {Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Credentials} from '../../domain/credentials.model';
import {SigninSignoutService} from '../../services/auth/signin-signout.service';
import {UserService} from '../../services/user.service';
import {takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {SocialAuthService, SocialUser} from '@abacritt/angularx-social-login';

@Component({
  selector: 'signin-button',
  templateUrl: './signin-button.component.html',
  styleUrls: ['./signin-button.component.scss']
})
export class SigninButtonComponent implements OnInit, OnDestroy {
  public customSignInText = null;
  public login: string;
  public password: string;

  @ViewChild('content', {static: true})
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
      tap(text => {
        this.customSignInText = text;
        this.openModal();
      })
    ).subscribe();

    this.socialAuthService.authState.subscribe((googleUser: SocialUser) => {
      const {email, idToken, authToken, authorizationCode} = googleUser;
      this.authService.signinGoogleData({email, idToken, authToken, authorizationCode, type: 'google'})
        .subscribe(res => {
          console.log(JSON.stringify(res));
          this.userService.fetchUserStatus();
          this.modalService.dismissAll();
          this.onSignin.emit();
        });
    });
  }


  public openModal() {
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'})
      .result
      .then((credentials: Credentials) => {
        this.customSignInText = null;
        this.sendLoginRequest(credentials);
      }, (reason) => {
        this.customSignInText = null;
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
