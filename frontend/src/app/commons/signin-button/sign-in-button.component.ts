import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Credentials} from '../../domain/credentials.model';
import {SigninSignoutService} from '../../services/auth/signin-signout.service';
import {UserService} from '../../services/user.service';
import {takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'signin-button',
  templateUrl: './sign-in-button.component.html',
  styleUrls: ['./sign-in-button.component.scss']
})
export class SignInButtonComponent implements OnInit, OnDestroy {
  public customSignInText = null;
  public email: string;
  public password: string;

  @ViewChild('content', {static: true})
  public content: TemplateRef<any>;
  private destroy$ = new Subject<boolean>();
  public signInForm: FormGroup;

  constructor(public modalService: NgbModal,
              public activeModal: NgbActiveModal,
              public fb: FormBuilder,
              public authService: SigninSignoutService,
              public userService: UserService) {
  }

  public ngOnInit() {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
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

  public submit() {
    this.activeModal.close(this.signInForm.value);
  }
}
