import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {Interest} from '../domain/interest';
import {Observable} from 'rxjs';

@Injectable()
export class InterestService extends AbstractService <Interest> {
  constructor(http: HttpClient) {
    super(http, endpoints.interest);
  }

  public getMyInterests(): Observable<HttpResponse<Interest>> {
    return this.sendRequest('get', `/my`, {});
  }

  public save(interest: Interest): Observable<HttpResponse<Interest>> {
    return this.sendRequest('post', '', interest);
  }

  public get(realtyObjId: number): Observable<HttpResponse<Interest>> {
    return this.sendRequest('get', `/${realtyObjId}`, {});
  }

  public remove(realtyObjId: number): Observable<HttpResponse<Interest>> {
    return this.sendRequest('delete', `/${realtyObjId}`, {});
  }
}

