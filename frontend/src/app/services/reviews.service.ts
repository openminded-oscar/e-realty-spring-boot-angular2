import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Review, ReviewDto, ReviewPostDto, ReviewSelectTimeDto} from '../domain/review';
import {tap} from 'rxjs/operators';
import {RealtyObj} from '../domain/realty-obj';
import {UserService} from './user.service';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export const dateBasedOnNGBDatePicker = (reviewDate: NgbDateStruct) => {
  return new Date(
    reviewDate.year,
    reviewDate.month - 1,
    reviewDate.day,
    0,
    0,
    0
  );
};

@Injectable()
export class ReviewsService extends AbstractService<ReviewDto> {
  private currentUserReviews = new BehaviorSubject<Review[]>([]);
  public currentUserReviews$ = this.currentUserReviews.asObservable();

  constructor(public http: HttpClient,
              public userService: UserService) {
    super(http, endpoints.review);
  }

  public save(reviewSelectTimeDto: ReviewSelectTimeDto): Observable<HttpResponse<ReviewPostDto>> {
    const utcDatetime = reviewSelectTimeDto.dateTime;

    const review = {
      realtyObjId: reviewSelectTimeDto.realtyObjId,
      dateTime: utcDatetime
    };

    return this.sendRequest<ReviewPostDto>('post', '', review).pipe(
      tap(res => {
        const currentReviews = this.currentUserReviews.value;
        const updatedReview = {
          ...res.body,
          realtyObj: {
            ...res.body.realtyObj,
            mainPhotoPath: RealtyObj.getMainPhoto(res.body.realtyObj)
          },
          user: this.userService.getCurrentUserValue()
        };
        const updatedReviews = [updatedReview, ...currentReviews];
        this.currentUserReviews.next(updatedReviews);
      })
    );
  }

  public remove(realtyObjId: number): Observable<HttpResponse<ReviewDto>> {
    return this.sendRequest<ReviewDto>('delete', `/${realtyObjId}`, {}).pipe(
      tap(() => {
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

  public getForObjectAndUser(realtyObjId: number): Observable<HttpResponse<ReviewDto>> {
    return this.sendRequest('get', `/${realtyObjId}`, {});
  }

  public getForObjectAndDate(realtyObjId: number, date: Date): Observable<HttpResponse<Date[]>> {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this.sendRequest('get', `/for-object/${realtyObjId}/${date.toISOString()}?timezone=${timezone}`, {});
  }
}
