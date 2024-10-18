import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Credentials} from '../../domain/credentials.model';
import {AbstractService} from '../common/abstract.service';
import {endpoints} from '../../commons';
import {Observable} from 'rxjs';
import {CookieService} from '../common/CookieService';
import {tap} from 'rxjs/operators';

import {Subject} from 'rxjs';
import {SocialUser} from '@abacritt/angularx-social-login';

export interface SignInResponse {
  token: string;
}

@Injectable({providedIn: 'root'})
export class SigninSignoutService extends AbstractService<Credentials> {
  private signInPrompt = new Subject<string>();
  public signinPrompt(text?: string) {
    this.signInPrompt.next(text);
  }
  public signinPromptSubscribe() {
    return this.signInPrompt.asObservable();
  }

  constructor(public http: HttpClient, public cookieService: CookieService) {
    super(http, '');
  }

  public signIn(credentials: Credentials): Observable<HttpResponse<SignInResponse>> {
    return this.sendRequest<SignInResponse>('post', endpoints.signin, credentials)
      .pipe(
        tap(res => {
            localStorage.setItem('token', res.body.token);
          }
        ));
  }

  public signInGoogleData(googleCredentialsData: any): Observable<HttpResponse<any>> {
    return this.sendRequest<SignInResponse>('post', endpoints.signinGoogleData, googleCredentialsData)
      .pipe(
        tap(res => {
            localStorage.setItem('token', res.body.token);
          }
        ));
  }

  public signout() {
    localStorage.removeItem('token');
    this.cookieService.deleteCookie('GOOGLE_OAUTH_TOKEN');
  }
}
