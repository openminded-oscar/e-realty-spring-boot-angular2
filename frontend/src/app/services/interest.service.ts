import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {Interest, InterestDto} from '../domain/interest';
import {Observable} from 'rxjs';

@Injectable()
export class InterestService extends AbstractService <InterestDto> {
  constructor(http: HttpClient) {
    super(http, endpoints.interest);
  }

  public getAllInterestsForUser(): Observable<HttpResponse<Interest[]>> {
    return this.sendRequest('get', `/my-interests-list`, {});
  }

  public save(interest: InterestDto): Observable<HttpResponse<InterestDto>> {
    return this.sendRequest('post', '', interest);
  }

  public get(realtyObjId: number): Observable<HttpResponse<InterestDto>> {
    return this.sendRequest('get', `/${realtyObjId}`, {});
  }

  public remove(realtyObjId: number): Observable<HttpResponse<InterestDto>> {
    return this.sendRequest('delete', `/${realtyObjId}`, {});
  }
}

