import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {BehaviorSubject, from, Observable, of, Subject, switchMap} from 'rxjs';
import {Review, ReviewDto, ReviewPostDto, ReviewSelectTimeDto} from '../domain/review';
import {map, tap} from 'rxjs/operators';
import {RealtyObj} from '../domain/realty-obj';
import {UserService} from './user.service';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ScheduleFormModalComponent} from '../shared/schedule-form-modal/schedule-form-modal.component';

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

@Injectable({providedIn: 'root'})
export class ReviewsService extends AbstractService<ReviewDto> implements OnDestroy {
  private destroy$ = new Subject<boolean>();
  private currentUserReviews = new BehaviorSubject<Review[]>([]);
  public currentUserReviews$ = this.currentUserReviews.asObservable();

  constructor(public http: HttpClient,
              public modalService: NgbModal,
              public userService: UserService) {
    super(http, endpoints.review);
  }

  public scheduleReviewFlow(object: RealtyObj): Observable<ReviewPostDto> {
    const modalRef = this.modalService.open(ScheduleFormModalComponent, {ariaLabelledBy: 'modal-basic-title'});
    modalRef.componentInstance.realtyObject = object;

    return from(modalRef.result).pipe(
      switchMap((value: ReviewPostDto) => {
        if (value) {
          return of(value);
        } else {
          return of(null);
        }
      })
    );
  }

  public saveReview(reviewSelectTimeDto: ReviewSelectTimeDto): Observable<ReviewPostDto> {
    const utcDatetime = reviewSelectTimeDto.dateTime;

    const review = {
      realtyObjId: reviewSelectTimeDto.realtyObjId,
      dateTime: utcDatetime
    };

    return this.sendRequest<ReviewPostDto>('post', '', {}, review).pipe(
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
      }),
      map(res => res.body)
    );
  }

  public remove(realtyObjId: number): Observable<HttpResponse<ReviewDto>> {
    return this.sendRequest<ReviewDto>('delete', `/${realtyObjId}`, {}, {}).pipe(
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
    return this.sendRequest<Review[]>('get', `/my-reviews-list`, {}, {}).pipe(
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
    return this.sendRequest('get', `/${realtyObjId}`, {}, {});
  }

  public getForObjectAndDate(realtyObjId: number, date: Date): Observable<HttpResponse<Date[]>> {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this.sendRequest('get', `/slots-for-object/${realtyObjId}/${date.toISOString()}?timezone=${timezone}`, {}, {});
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
