import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {Observable} from 'rxjs';
import {Review} from '../domain/review';
import {tap} from 'rxjs/operators';

@Injectable()
export class ReviewsService extends AbstractService <Review> {
  constructor(http: HttpClient) {
    super(http, endpoints.review);
  }

  public save(review: Review): Observable<HttpResponse<Review>> {
    return this.sendRequest('post', '', review);
  }

  public get(realtyObjId: number): Observable<HttpResponse<Review>> {
    return this.sendRequest('get', `/${realtyObjId}`, {})
      .pipe(
        tap((httpResponse: HttpResponse<Review>) => {
          if (httpResponse.body && httpResponse.body.dateTime) {
            httpResponse.body.dateTime = new Date(httpResponse.body.dateTime);
          }
        })
      );
  }

  public remove(realtyObjId: number): Observable<HttpResponse<Review>> {
    return this.sendRequest('delete', `/${realtyObjId}`, {});
  }
}

