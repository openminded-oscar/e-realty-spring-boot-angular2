import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {Observable} from 'rxjs';
import {Review, ReviewDto, ReviewPostDto, ReviewSelectTimeDto} from '../domain/review';
import {tap} from 'rxjs/operators';
import {RealtyObj} from '../domain/realty-obj';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {UserService} from './user.service';
import {RealtyObjService} from './realty-obj.service';


export const dateTimeBasedOnNGBDateTimePicker = (reviewSelectTimeDto: ReviewSelectTimeDto) => {
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
  return utcDatetime;
};



@Injectable()
export class ReviewsService extends AbstractService<ReviewDto> {
  private currentUserReviews = new BehaviorSubject<Review[]>([]);
  public currentUserReviews$ = this.currentUserReviews.asObservable();

  constructor(public http: HttpClient,
              public objectsService: RealtyObjService,
              public userService: UserService) {
    super(http, endpoints.review);
  }

  public save(reviewSelectTimeDto: ReviewSelectTimeDto): Observable<HttpResponse<ReviewPostDto>> {
    const utcDatetime = dateTimeBasedOnNGBDateTimePicker(reviewSelectTimeDto);

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

  public get(realtyObjId: number): Observable<HttpResponse<ReviewDto>> {
    return this.sendRequest('get', `/${realtyObjId}`, {});
  }
}
