import {Injectable, OnDestroy} from '@angular/core';
import {delay, from, Observable, of, Subject, switchMap, take} from 'rxjs';
import {catchError, filter, tap} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {MessageModalComponent} from '../../shared/message-modal/message-modal.component';
import {ForgotPasswordModalComponent} from '../../core/forgot-password-modal/forgot-password-modal.component';
import {GlobalNotificationService} from '../global-notification.service';
import {AbstractService} from '../common/abstract.service';
import {Credentials} from '../../app-models/credentials.model';
import {endpoints} from '../../commons';
import {dismissAllModal} from './auth.util';

@Injectable({
    providedIn: 'root'
})
export class ForgotPasswordService extends AbstractService<Credentials> implements OnDestroy {
    private destroy$ = new Subject<boolean>();

    constructor(public modalService: NgbModal,
                public http: HttpClient,
                public globalNotificationService: GlobalNotificationService) {
        super(http, endpoints.signup);
    }

    private openForgotPasswordModal(): Observable<string> {
        const modalRef = this.modalService.open(ForgotPasswordModalComponent, {ariaLabelledBy: 'modal-basic-title'});
        return from(modalRef.result)
            .pipe(
                catchError(e => {
                    console.log('modal closed');
                    return of(null);
                })
            );
    }

    public forgotPassword() {
        dismissAllModal(this.modalService)
            .pipe(
                take(1),
                // wait delay for prev modals closed
                delay(200),
                switchMap(() => this.openForgotPasswordModal()),
                filter(email => email !== null),
                switchMap((email: string) => {
                    return this.forgotPasswordRequest(email);
                }),
                tap(res => {
                    const modal = this.modalService.open(MessageModalComponent);
                    modal.componentInstance.message = 'Recovery code Created! Check your email for confirmation!';
                }),
                catchError((error) => {
                    const errorMessage = error?.message || 'Password recovery failed. Please try again.';
                    this.globalNotificationService.showErrorNotification(errorMessage);
                    return dismissAllModal(this.modalService).pipe(switchMap(() => of(null)));
                })
            )
            .subscribe();
    }

    public forgotPasswordRequest(email: string): Observable<HttpResponse<string>> {
        return this.sendRequest<string>('post', '/forgot-password', {body: email});
    }

    public resetPasswordRequest(newPassword: string, confirmationCode: string): Observable<HttpResponse<string>> {
        return this.sendRequest<string>('post', '/reset-password', {body: {password: newPassword}});
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
