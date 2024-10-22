import {Injectable, Injector} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {catchError} from 'rxjs/operators';
import {SignInSignOutService} from '../auth/sign-in-sign-out.service';
import {GlobalNotificationService} from '../global-notification.service';

@Injectable()
export class AllHttpInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private signInService: SignInSignOutService,
    private globalNotificationService: GlobalNotificationService,
    private injector: Injector
  ) {}

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

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
      message = _.isArray(response.error.errors) ? this.generateMultipleErrorsMessage(response) :  response.error.message;
    } else {
      message = response.error || response.message;
    }

    this.globalNotificationService.showNotification(message);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
            if (req.url.indexOf('/api/signin') !== -1) {
              this.redirectToLoginPage();
              return of(null);  // return an observable
            }
            break;
          }
          case 404: {
            this.redirectToMainPage();
            break;
          }
          default: {
            this.showError(response);
          }
        }

        return throwError(response);
      })
    );
  }


  public redirectToLoginPage(): void {
    this.signInService.signIn();
  }

  public redirectToMainPage(): void {
    this.router.navigate(['/']).then();
  }
}
