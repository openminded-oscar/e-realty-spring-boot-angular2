import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, from, Observable, of, Subject, switchMap} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {endpoints} from '../commons';
import {AbstractService} from './common/abstract.service';
import {RelatedReviewDto, ReviewDto, ReviewSelectTimeDto} from '../app-models/review';
import {RealtyObj} from '../app-models/realty-obj';
import {UserService} from './user.service';
import {ScheduleFormModalComponent} from '../shared/schedule-form-modal/schedule-form-modal.component';
import {Photo} from '../app-models/photo';

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
    private approvedReviewId = new BehaviorSubject<number>(null);
    public approvedReviewId$ = this.approvedReviewId.asObservable();

    private canceledReviewId = new BehaviorSubject<number>(null);
    public canceledReviewId$ = this.canceledReviewId.asObservable();


    private currentUserReviews = new BehaviorSubject<RelatedReviewDto[]>([]);
    public currentUserReviews$ = this.currentUserReviews.asObservable();

    private currentRealtorReviews = new BehaviorSubject<RelatedReviewDto[]>([]);
    public currentRealtorReviews$ = this.currentRealtorReviews.asObservable();


    constructor(public http: HttpClient,
                public modalService: NgbModal,
                public userService: UserService) {
        super(http, endpoints.review);
    }

    public getMyAsRealtorReviews(): Observable<RelatedReviewDto[]> {
        return this.http.get<RelatedReviewDto[]>(endpoints.realtorReview).pipe(
            tap(res => {
                const users = res.map(r=>r.user);
                users.forEach((user) => {
                    user.profilePicUrl = user.profilePic ? Photo.getLinkByFilename(user.profilePic?.filename) : null;
                })
                const realtyObjects = res.map(r => r.realtyObj);
                (realtyObjects ?? []).forEach(value => {
                    value.mainPhotoPath = RealtyObj.getMainPhoto(value);
                });
                this.currentRealtorReviews.next(res);
            })
        );
    }

    public getAllReviewsForUser(): Observable<HttpResponse<RelatedReviewDto[]>> {
        return this.sendRequest<RelatedReviewDto[]>('get', `/my-reviews-list`).pipe(
            tap(res => {
                const users = res.body.map(r=>r.user);
                users.forEach((user) => {
                    user.profilePicUrl = user.profilePic ? Photo.getLinkByFilename(user.profilePic?.filename) : null;
                })
                const realtyObjects = res.body.map(r => r.realtyObj);
                (realtyObjects ?? []).forEach(value => {
                    value.mainPhotoPath = RealtyObj.getMainPhoto(value);
                });
                this.currentUserReviews.next(res.body);
            })
        );
    }

    public saveReview(reviewSelectTimeDto: ReviewSelectTimeDto): Observable<RelatedReviewDto> {
        const review = {
            realtyObjId: reviewSelectTimeDto.realtyObjId,
            realtorId: reviewSelectTimeDto.realtorId,
            dateTime: reviewSelectTimeDto.dateTime
        };

        return this.sendRequest<RelatedReviewDto>('post', '', {body: review}).pipe(
            tap((res: HttpResponse<RelatedReviewDto>) => {
                const user = this.userService.getCurrentUserValue();

                const currentReviews = this.currentUserReviews.value;
                const createdReview = {
                    ...res.body,
                    realtyObj: {
                        ...res.body.realtyObj,
                        mainPhotoPath: RealtyObj.getMainPhoto(res.body.realtyObj)
                    },
                    user
                } as RelatedReviewDto;
                const updatedReviews = [createdReview, ...currentReviews];
                this.currentUserReviews.next(updatedReviews);

                const realtorId = user.realtorId;
                if (realtorId && res.body.realtorId === realtorId) {
                    const currentRealtorReviews = this.currentRealtorReviews.value;
                    const createdRealtorReview = {
                        ...res.body,
                        realtyObj: {
                            ...res.body.realtyObj,
                            mainPhotoPath: RealtyObj.getMainPhoto(res.body.realtyObj)
                        },
                        user
                    } as RelatedReviewDto;
                    const updatedRealtorReviews = [createdRealtorReview, ...currentRealtorReviews];

                    this.currentRealtorReviews.next(updatedRealtorReviews);
                }
            }),
            map(res => res.body)
        );
    }

    public removeReviewById(reviewId: number, reason: string) {
        return this.sendRequest<ReviewDto>('delete', `/${reviewId}`, {
            body: {reason: reason ?? null}
        }).pipe(
            tap(() => {
                this.canceledReviewId.next(reviewId);

                const currentReviews = this.currentUserReviews.value;
                const updatedReviews = currentReviews.filter(
                    review => review.id !== reviewId
                );
                this.currentUserReviews.next(updatedReviews);

                const currentRealtorReviews = this.currentRealtorReviews.value;
                const updatedRealtorReviews = currentRealtorReviews.filter(
                    review => review.id !== reviewId
                );
                this.currentRealtorReviews.next(updatedRealtorReviews);
            })
        );
    }

    public approveReview(currentReview: RelatedReviewDto) {
        return this.sendRequest<ReviewDto>('post', `/${currentReview.id}/approve`).pipe(
            tap(() => {
                this.approvedReviewId.next(currentReview.id);

                const currentReviews = this.currentUserReviews.value;
                currentReviews.forEach(
                    review => {
                        if (review.id === currentReview.id) {
                            review.approved = true;
                        }
                    }
                );

                this.currentUserReviews.next(currentReviews.slice());

                const currentRealtorReviews = this.currentRealtorReviews.value;
                currentRealtorReviews.forEach(
                    review => {
                        if (review.id === currentReview.id) {
                            review.approved = true;
                        }
                    }
                );
                this.currentRealtorReviews.next(currentRealtorReviews.slice());
            })
        );
    }

    public getForObjectAndCurrentUser(realtyObjId: number): Observable<HttpResponse<ReviewDto>> {
        return this.sendRequest('get', `/by-object/${realtyObjId}`);
    }

    public getById(reviewId: number): Observable<RelatedReviewDto> {
        return this.sendRequest<RelatedReviewDto>('get', `/${reviewId}`).pipe(
            map(r => r.body)
        );
    }

    public getForObjectAndDate(realtyObjId: number, date: Date): Observable<HttpResponse<Date[]>> {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return this.sendRequest('get', `/slots-for-object/${realtyObjId}/${date.toISOString()}?timezone=${timezone}`);
    }



    public scheduleReviewFlow(object: RealtyObj): Observable<RelatedReviewDto> {
        const modalRef = this.modalService.open(ScheduleFormModalComponent, {ariaLabelledBy: 'modal-basic-title'});
        modalRef.componentInstance.realtyObject = object;

        return from(modalRef.result).pipe(
            switchMap((value: RelatedReviewDto) => {
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
