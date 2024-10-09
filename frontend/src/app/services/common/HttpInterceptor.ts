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
import {ErrorService} from './ErrorService';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AllHttpInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private errorService: ErrorService,
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

    this.errorService.emitError(message);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((response: any) => {
        // Handle 200 response with empty data
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
            // Unauthorized response, try to refresh session.
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


  redirectToLoginPage(): void {
    localStorage.removeItem('token');
    localStorage.setItem('redirectedFrom', window.location.pathname);
    this.router.navigate(['/']);
  }

  redirectToMainPage(): void {
    this.router.navigate(['/']);
  }
}
