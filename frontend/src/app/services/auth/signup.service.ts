import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Credentials} from '../../domain/credentials.model';
import {AbstractService} from '../common/abstract.service';
import {endpoints} from '../../commons';
import {delay, from, Observable, of, Subject, switchMap, take} from 'rxjs';
import {SignUpModalComponent} from '../../shared/sign-up-modal/sign-up-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {catchError, filter} from 'rxjs/operators';
import {GlobalNotificationService} from '../global-notification.service';

@Injectable({providedIn: 'root'})
export class SignupService extends AbstractService<Credentials> implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(public http: HttpClient,
              public globalNotificationService: GlobalNotificationService,
              public modalService: NgbModal) {
    super(http, endpoints.signup);
  }

  public signUp() {
    this.dismissAllModal().pipe(
      take(1),
      // wait delay for prev modals closed
      delay(200),
      switchMap(() => this.openSignUpModal()),
      filter(credentials => credentials !== null),
      switchMap((credentials: Credentials) => {
        return this.signUpRequest(credentials);
      }),
      catchError((error) => {
        const errorMessage = error?.message || 'Sign-Up failed. Please try again.';
        this.globalNotificationService.showErrorNotification(errorMessage);
        return this.dismissAllModal().pipe(switchMap(() => of(null)));
      })
    ).subscribe();
  }

  private dismissAllModal(): Observable<void> {
    return new Observable((observer) => {
      this.modalService.dismissAll();
      observer.next();
      observer.complete();
    });
  }

  private openSignUpModal(): Observable<Credentials> {
    const modalRef = this.modalService.open(SignUpModalComponent, {ariaLabelledBy: 'modal-basic-title'});
    return from(modalRef.result)
      .pipe(
        catchError(e => {
          console.log('modal closed');
          return of(null);
        })
      );
  }

  public signUpRequest(credentials: Credentials): Observable<HttpResponse<any>> {
    return this.sendRequest<any>('post', '', {}, credentials);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
