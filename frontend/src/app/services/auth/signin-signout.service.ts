import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import "rxjs/add/observable/of";
import {Credentials} from "../../domain/credentials.model";
import {AbstractService} from "../common/abstract.service";
import {endpoints} from "../../commons";
import {Observable} from "rxjs";
import {SocialUser} from "angularx-social-login";
import {CookieService} from "../common/CookieService";

@Injectable()
export class SigninSignoutService extends AbstractService<Credentials>{

  constructor(public http: HttpClient, public cookieService: CookieService) {
    super(http, '');
  }

  public signin(credentials: Credentials): Observable<HttpResponse<any>> {
    return this.sendRequest<any>('post', endpoints.signin, credentials)
      .map(res => {
        localStorage.setItem('token', res.body.token);
        return res;
      });
  }

  public signinGoogleData(googleCredentialsData: any): Observable<HttpResponse<any>> {
    return this.sendRequest<any>('post', endpoints.signinGoogleData, googleCredentialsData)
      .map(res => {
        localStorage.setItem('token', res.body.token);
        return res;
      });
  }

  public signout() {
    localStorage.removeItem('token');
    this.cookieService.deleteCookie('GOOGLE_OAUTH_TOKEN');
  }
}
