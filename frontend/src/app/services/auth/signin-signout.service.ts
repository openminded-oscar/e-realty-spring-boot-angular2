import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import "rxjs/add/observable/of";
import {Credentials} from "../../domain/credentials.model";
import {AbstractService} from "../common/abstract.service";
import {endpoints} from "../../commons";
import {Observable} from "rxjs";

@Injectable()
export class SigninSignoutService extends AbstractService<Credentials>{
  constructor(http: HttpClient) {
    super(http, endpoints.signin);
  }

  public signin(credentials: Credentials): Observable<HttpResponse<any>> {
    return this.sendRequest<any>('post', '', credentials)
      .map(res => {
        localStorage.setItem('token', res.body.token);
        return res;
      });
  }

  public signout() {
    localStorage.removeItem('token');
  }
}
