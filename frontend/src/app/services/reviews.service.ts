import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {Observable} from 'rxjs';
import {Review, ReviewDto} from '../domain/review';
import {tap} from 'rxjs/operators';
import {RealtyObj} from '../domain/realty-obj';

@Injectable()
export class ReviewsService extends AbstractService <ReviewDto> {
  constructor(http: HttpClient) {
    super(http, endpoints.review);
  }

  public save(review: ReviewDto): Observable<HttpResponse<ReviewDto>> {
    return this.sendRequest('post', '', review);
  }

  public getAllReviewsForUser(): Observable<HttpResponse<Review[]>> {
    return this.sendRequest<Review[]>('get', `/my-reviews-list`, {}).pipe(
      tap(res => {
        const realtyObjects = res.body.map(r => r.realtyObj);
        (realtyObjects ?? []).forEach(value => {
          value.mainPhotoPath = RealtyObj.getMainPhoto(value);
        });
      })
    );
  }

  public get(realtyObjId: number): Observable<HttpResponse<ReviewDto>> {
    return this.sendRequest('get', `/${realtyObjId}`, {});
  }

  public remove(realtyObjId: number): Observable<HttpResponse<ReviewDto>> {
    return this.sendRequest('delete', `/${realtyObjId}`, {});
  }
}

