import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {Interest, InterestDto} from '../domain/interest';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {RealtyObj} from '../domain/realty-obj';

@Injectable()
export class InterestService extends AbstractService <InterestDto> {
  constructor(http: HttpClient) {
    super(http, endpoints.interest);
  }

  public getAllInterestsForUser(): Observable<HttpResponse<Interest[]>> {
    return this.sendRequest<Interest[]>('get', `/my-interests-list`, {}).pipe(
      tap(res => {
        const realtyObjects = res.body.map(r => r.realtyObj);
        (realtyObjects ?? []).forEach(value => {
          value.mainPhotoPath = RealtyObj.getMainPhoto(value);
        });
      })
    );
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

