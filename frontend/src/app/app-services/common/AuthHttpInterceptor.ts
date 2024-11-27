import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {CookieService} from './CookieService';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(public cookieService: CookieService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', token ? ('Bearer ' + token) : '')
    });
    return next.handle(clonedRequest);
  }
}
