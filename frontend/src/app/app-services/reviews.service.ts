import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, from, Observable, of, Subject, switchMap} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {Review, ReviewDto, ReviewPostDto, ReviewSelectTimeDto} from '../app-models/review';
import {RealtyObj} from '../app-models/realty-obj';
import {UserService} from './user.service';
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

@Injectable()
export class ReviewsService extends AbstractService<ReviewDto> implements OnDestroy {
    private destroy$ = new Subject<boolean>();
    private currentUserReviews = new BehaviorSubject<Review[]>([]);
    public currentUserReviews$ = this.currentUserReviews.asObservable();

    private currentRealtorReviews = new BehaviorSubject<Review[]>([]);
    public currentRealtorReviews$ = this.currentRealtorReviews.asObservable();


    constructor(public http: HttpClient,
                public modalService: NgbModal,
                public userService: UserService) {
        super(http, endpoints.review);
    }

    public getMyAsRealtorReviews(): Observable<Review[]> {
        return this.http.get<Review[]>(endpoints.realtorReview).pipe(
            tap(res => {
                const realtyObjects = res.map(r => r.realtyObj);
                (realtyObjects ?? []).forEach(value => {
                    value.mainPhotoPath = RealtyObj.getMainPhoto(value);
                });
                this.currentRealtorReviews.next(res);
            })
        );
    }

    public saveReview(reviewSelectTimeDto: ReviewSelectTimeDto): Observable<ReviewPostDto> {
        const review = {
            realtyObjId: reviewSelectTimeDto.realtyObjId,
            realtorId: reviewSelectTimeDto.realtorId,
            dateTime: reviewSelectTimeDto.dateTime
        };

        return this.sendRequest<ReviewPostDto>('post', '', {body: review}).pipe(
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
                // TODO update currentRealtorReviews if related to current realtor
                // const currentRealtorReviews = this.currentRealtorReviews.value;
                // const updatedRealtorReviews = [updatedReview, ...currentRealtorReviews];
                // this.currentRealtorReviews.next(updatedRealtorReviews);
            }),
            map(res => res.body)
        );
    }

    public removeReviewById(reviewId: number, reason: string) {
        return this.sendRequest<ReviewDto>('delete', `/${reviewId}`, {
            body: {reason: reason ?? null}
        }).pipe(
            tap(() => {
                const currentReviews = this.currentUserReviews.value;
                const updatedReviews = currentReviews.filter(
                    review => review.id !== reviewId
                );
                this.currentUserReviews.next(updatedReviews);

                const currentRealtorReviews = this.currentRealtorReviews.value;
                const updatedRealtorReviews = currentRealtorReviews.filter(
                    review => review.realtyObj.id !== reviewId
                );
                this.currentRealtorReviews.next(updatedRealtorReviews);
            })
        );
    }

    public approveReview(reviewId: number) {
        return this.sendRequest<ReviewDto>('post', `/${reviewId}/approve`).pipe(
            tap(() => {
                const currentReviews = this.currentUserReviews.value;
                currentReviews.forEach(
                    review => {
                        if (review.id === reviewId) {
                            review.approved = true;
                        }
                    }
                );
                this.currentUserReviews.next(currentReviews.slice());

                const currentRealtorReviews = this.currentRealtorReviews.value;
                currentRealtorReviews.forEach(
                    review => {
                        if (review.id === reviewId) {
                            review.approved = true;
                        }
                    }
                );
                this.currentRealtorReviews.next(currentRealtorReviews.slice());
            })
        );
    }

    public getAllReviewsForUser(): Observable<HttpResponse<Review[]>> {
        return this.sendRequest<Review[]>('get', `/my-reviews-list`).pipe(
            tap(res => {
                const realtyObjects = res.body.map(r => r.realtyObj);
                (realtyObjects ?? []).forEach(value => {
                    value.mainPhotoPath = RealtyObj.getMainPhoto(value);
                });
                this.currentUserReviews.next(res.body);
            })
        );
    }

    public getForObjectAndCurrentUser(realtyObjId: number): Observable<HttpResponse<ReviewDto>> {
        return this.sendRequest('get', `/by-object/${realtyObjId}`);
    }

    public getForObjectAndDate(realtyObjId: number, date: Date): Observable<HttpResponse<Date[]>> {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return this.sendRequest('get', `/slots-for-object/${realtyObjId}/${date.toISOString()}?timezone=${timezone}`);
    }


    public getById(reviewId: number): Observable<Review> {
        return this.sendRequest<Review>('get', `/${reviewId}`).pipe(
            map(r => r.body)
        );
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

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
