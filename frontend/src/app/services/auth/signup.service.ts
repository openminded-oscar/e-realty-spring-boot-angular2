import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Credentials} from '../../domain/credentials.model';
import {AbstractService} from '../common/abstract.service';
import {endpoints} from '../../commons';
import {Observable} from 'rxjs';

@Injectable()
export class SignupService extends AbstractService<Credentials> {
  constructor(http: HttpClient) {
    super(http, endpoints.signup);
  }

  public signUp(credentials: Credentials): Observable<HttpResponse<any>> {
    return this.sendRequest<any>('post', '', credentials);
  }
}
