import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Credentials} from '../../domain/credentials.model';
import {AbstractService} from '../common/abstract.service';
import {endpoints} from '../../commons';
import {delay, from, Observable, of, take} from 'rxjs';
import {catchError, filter, switchMap, takeUntil, tap} from 'rxjs/operators';

import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../user.service';
import {SignInModalComponent} from '../../shared/sign-in-modal/sign-in-modal.component';
import {GlobalNotificationService} from '../global-notification.service';
import {HTTP_CONSTANTS} from '../common/HttpErrorInterceptor';

export interface SignInResponse {
  token: string;
}

@Injectable({providedIn: 'root'})
export class SignInSignOutService extends AbstractService<Credentials> implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(public http: HttpClient,
              public userService: UserService,
              public globalNotificationService: GlobalNotificationService,
              public modalService: NgbModal) {
    super(http, '');
  }

  public signIn(text?: string) {
    this.dismissAllModal().pipe(
      take(1),
      // wait delay for prev modals closed
      delay(200),
      switchMap(() => this.openSignInModal(text)),
      filter(credentials => credentials !== null),
      switchMap((credentials) => {
        return this.signInRequest(credentials);
      }),
      tap((reqResult) => {
        this.userService.fetchUserStatus();
      }),
      catchError((error) => {
        const errorMessage = error?.message || 'Sign-in failed. Please try again.';
        this.globalNotificationService.showErrorNotification(errorMessage);
        return this.dismissAllModal().pipe(switchMap(() => of(null)));
      })
    ).subscribe();
  }

  public signInWithGoogleData(googleCredentialsData: any) {
    this.signInGoogleRequest(googleCredentialsData).pipe(
      takeUntil(this.destroy$),
      tap(() => {
        this.userService.fetchUserStatus();
        this.modalService.dismissAll();
      }),
      catchError((error) => {
        const errorMessage = error?.message || 'Google sign-in failed. Please try again.';
        this.globalNotificationService.showErrorNotification(errorMessage);
        return of(null);
      })
    ).subscribe();
  }


  private signInGoogleRequest(googleCredentialsData: any) {
    return this.sendRequest<SignInResponse>('post', endpoints.signinGoogleData, {
      body: googleCredentialsData
    })
      .pipe(
        tap(res => {
            localStorage.setItem('token', res.body.token);
          }
        ));
  }

  private dismissAllModal(): Observable<void> {
    return new Observable((observer) => {
      this.modalService.dismissAll();
      observer.next();
      observer.complete();
    });
  }

  private openSignInModal(text: string) {
    const modalRef = this.modalService.open(SignInModalComponent, {ariaLabelledBy: 'modal-basic-title'});
    modalRef.componentInstance.customSignInText = text;
    return from(modalRef.result)
      .pipe(
        catchError(e => {
          console.log('modal closed');
          return of(null);
        })
      );
  }

  private signInRequest(credentials: Credentials): Observable<HttpResponse<SignInResponse>> {
    return this.sendRequest<SignInResponse>('post', endpoints.signin, {
      customHeaders: {[HTTP_CONSTANTS.SKIP_INTERCEPTOR_HEADER]: 'true'},
      body: credentials,
    })
      .pipe(
        tap(res => {
            localStorage.setItem('token', res.body.token);
          }
        ));
  }

  public signOut() {
    localStorage.removeItem('token');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
