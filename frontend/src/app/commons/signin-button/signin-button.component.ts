import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Credentials} from '../../domain/credentials.model';
import {SigninSignoutService} from '../../services/auth/signin-signout.service';
import {UserService} from '../../services/user.service';
import {takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

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
  private destroy$ = new Subject<boolean>();

  constructor(private modalService: NgbModal,
              private authService: SigninSignoutService,
              private userService: UserService) {
  }

  public ngOnInit() {
    this.authService.signinPromptSubscribe().pipe(
      takeUntil(this.destroy$),
      tap(text => {
        this.customSignInText = text;
        this.openModal();
      })
    ).subscribe();
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
    this.authService.signIn(credentials)
      .subscribe(res => {
        this.userService.fetchUserStatus();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
