import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {Interest, InterestDto} from '../domain/interest';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {RealtyObj} from '../domain/realty-obj';

@Injectable()
export class InterestService extends AbstractService <InterestDto> {
  private currentUserInterests = new BehaviorSubject<Interest[]>([]);
  public currentUserInterest$ = this.currentUserInterests.asObservable();


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
        this.currentUserInterests.next(res.body);
      })
    );
  }

  public save(interest: InterestDto): Observable<HttpResponse<Interest>> {
    return this.sendRequest<Interest>('post', '', interest).pipe(
      tap(res => {
        const currentInterests = this.currentUserInterests.value;
        const updatedInterests = [...currentInterests, res.body as Interest];
        this.currentUserInterests.next(updatedInterests);
      })
    );
  }

  public remove(realtyObjId: number): Observable<HttpResponse<InterestDto>> {
    return this.sendRequest<InterestDto>('delete', `/${realtyObjId}`, {}).pipe(
      tap(() => {
        const currentInterests = this.currentUserInterests.value;
        const updatedInterests = currentInterests.filter(
          interest => interest.realtyObj.id !== realtyObjId
        );
        this.currentUserInterests.next(updatedInterests);
      })
    );
  }

  public get(realtyObjId: number): Observable<HttpResponse<InterestDto>> {
    return this.sendRequest('get', `/${realtyObjId}`, {});
  }
}

