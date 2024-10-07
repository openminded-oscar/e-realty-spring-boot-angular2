import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {Observable} from 'rxjs';
import {Review, ReviewDto, ReviewSelectTimeDto} from '../domain/review';
import {tap} from 'rxjs/operators';
import {RealtyObj} from '../domain/realty-obj';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';



@Injectable()
export class ReviewsService extends AbstractService<ReviewDto> {
  private currentUserReviews = new BehaviorSubject<Review[]>([]);
  public currentUserReviews$ = this.currentUserReviews.asObservable();

  constructor(http: HttpClient) {
    super(http, endpoints.review);
  }

  public save(reviewSelectTimeDto: ReviewSelectTimeDto): Observable<HttpResponse<Review>> {
    const reviewDate = reviewSelectTimeDto.reviewDate;
    const reviewTime = reviewSelectTimeDto.reviewTime;
    const utcDatetime = new Date(
      reviewDate.year,
      reviewDate.month - 1,
      reviewDate.day,
      reviewTime.hour,
      reviewTime.minute,
      reviewTime.second
    );

    const review = {
      realtyObjId: reviewSelectTimeDto.realtyObjId,
      dateTime: utcDatetime
    };

    return this.sendRequest<Review>('post', '', review).pipe(
      tap(res => {
        const currentReviews = this.currentUserReviews.value;
        const updatedReviews = [...currentReviews, res.body as Review];
        this.currentUserReviews.next(updatedReviews);
      })
    );
  }

  public remove(realtyObjId: number): Observable<HttpResponse<ReviewDto>> {
    return this.sendRequest<ReviewDto>('delete', `/${realtyObjId}`, {}).pipe(
      tap(() => {
        // Remove the review from the current list and update the BehaviorSubject
        const currentReviews = this.currentUserReviews.value;
        const updatedReviews = currentReviews.filter(
          review => review.realtyObj.id !== realtyObjId
        );
        this.currentUserReviews.next(updatedReviews);
      })
    );
  }

  public getAllReviewsForUser(): Observable<HttpResponse<Review[]>> {
    return this.sendRequest<Review[]>('get', `/my-reviews-list`, {}).pipe(
      tap(res => {
        const realtyObjects = res.body.map(r => r.realtyObj);
        (realtyObjects ?? []).forEach(value => {
          value.mainPhotoPath = RealtyObj.getMainPhoto(value);
        });
        this.currentUserReviews.next(res.body);
      })
    );
  }

  public get(realtyObjId: number): Observable<HttpResponse<ReviewDto>> {
    return this.sendRequest('get', `/${realtyObjId}`, {});
  }
}
