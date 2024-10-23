import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {catchError} from 'rxjs/operators';
import {GlobalNotificationService} from '../global-notification.service';
import {SignInSignOutService} from '../auth/sign-in-sign-out.service';

export const HTTP_CONSTANTS = {
    SKIP_INTERCEPTOR_HEADER: 'Skip-Interceptor'
};

@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private signInService: SignInSignOutService,
        private globalNotificationService: GlobalNotificationService,
    ) {
    }

    private generateMultipleErrorsMessage(response): string {
        let message = '';

        if (!response.error.errors) {
            return '';
        }

        response.error.errors.forEach(function (error) {
            message += `${error.field || ''} ${error.defaultMessage}. \n`;
        });
        return message;
    }

    private showError(response: HttpErrorResponse): void {
        let message = '';

        if (typeof response.error === 'object') {
            message = _.isArray(response.error.errors) ? this.generateMultipleErrorsMessage(response) : response.error.message;
        } else {
            message = response.error || response.message;
        }
        if (message) {
            this.globalNotificationService.showErrorNotification(message);
        } else {
            this.globalNotificationService.showErrorNotification('Error occurred while http request!');
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let skipError = false;
        if (req.headers.has(HTTP_CONSTANTS.SKIP_INTERCEPTOR_HEADER)) {
            const headers = req.headers.delete(HTTP_CONSTANTS.SKIP_INTERCEPTOR_HEADER);
            req = req.clone({headers});
            skipError = true;
        }

        return next.handle(req).pipe(
            catchError((response: any) => {
                if (response.status >= 200 && response.status < 300) {
                    const res = new HttpResponse({
                        body: null,
                        headers: response.headers,
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url
                    });

                    return of(res);
                }

                switch (response.status) {
                    case 401: {
                        this.openSignIn();
                        return throwError(() => response);
                    }
                    default: {
                        if (!skipError) {
                            this.showError(response);
                            return throwError(() => response);
                        } else {
                            return throwError(() => response);
                        }
                    }
                }
            })
        );
    }

    public openSignIn(): void {
        this.signInService.signIn();
    }
}
