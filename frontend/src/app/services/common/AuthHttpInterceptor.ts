import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CookieService} from "./CookieService";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(public cookieService: CookieService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const googleAuthToken = this.cookieService.getCookie("GOOGLE_OAUTH_TOKEN");

    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', token?token:'').set("GAuthorization", googleAuthToken?googleAuthToken:'')
    });
    return next.handle(clonedRequest);
  }
}
