import {Injectable, Injector} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ErrorService} from "./ErrorService";
import {throwError} from "rxjs";

@Injectable()
export class AllHttpInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private errorService: ErrorService,
    private injector: Injector
  ) {}

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * Clone request with updated Authorization token.
   * @param {HttpRequest<any>} req
   * @param {string} token
   * @return {HttpRequest<any>}
   */
  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: token }});
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
      message = _.isArray(response.error.errors) ? this.generateMultipleErrorsMessage(response) :  response.error.message;
    } else {
      message = response.error || response.message;
    }

    this.errorService.emitError(message);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
  return next.handle(req)
    .catch((response: any) => {
      // handle 200 response empty data. it causes error in angular.
      if (response.status >= 200 && response.status < 300) {
        const res = new HttpResponse({
          body: null,
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });

        return Observable.of(res);
      }

      switch (response.status) {
        case 401: {
          // unauthorize response, try to refresh session.
          if (req.url.indexOf('/api/signin') !== -1) {
            this.redirectToLoginPage();
            return;
          }
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
    });
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
