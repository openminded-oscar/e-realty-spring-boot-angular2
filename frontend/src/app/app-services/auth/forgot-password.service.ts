import {Injectable} from '@angular/core';
import {delay, from, Observable, of, switchMap, take} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {MessageModalComponent} from '../../shared/message-modal/message-modal.component';
import {GlobalNotificationService} from '../global-notification.service';
import {AbstractService} from '../common/abstract.service';
import {Credentials} from '../../app-models/credentials.model';
import {endpoints} from '../../commons';
import {dismissAllModal} from './auth.util';
import {ForgotPasswordModalComponent} from '../../core/forgot-password-modal/forgot-password-modal.component';

@Injectable({
    providedIn: 'root'
})
export class ForgotPasswordService extends AbstractService<Credentials> {
    // No teardown: root singleton; the inner modal+HTTP flow completes on its own.

    constructor(public modalService: NgbModal,
                public http: HttpClient,
                public globalNotificationService: GlobalNotificationService) {
        super(http, endpoints.signup);
    }

    public forgotPassword() {
        dismissAllModal(this.modalService)
            .pipe(
                take(1),
                // wait delay for prev modals closed
                delay(200),
                switchMap(() => {
                    const modalRef = this.modalService.open(ForgotPasswordModalComponent, {ariaLabelledBy: 'modal-basic-title'});
                    return from(modalRef.result);
                }),
                tap(res => {
                    const modal = this.modalService.open(MessageModalComponent);
                    modal.componentInstance.message = 'Password Changed Successfully!';
                }),
                catchError(e => {
                    console.log('modal closed');
                    return of(null);
                })
            )
            .subscribe();
    }

    public forgotPasswordRequest(email: string): Observable<HttpResponse<string>> {
        return this.sendRequest<string>('post', '/forgot-password', {body: email});
    }

    public resetPasswordRequest(newPassword: string, confirmationCode: string): Observable<HttpResponse<string>> {
        return this.sendRequest<string>('post', '/reset-password', {body: {newPassword, confirmationCode}});
    }
}
