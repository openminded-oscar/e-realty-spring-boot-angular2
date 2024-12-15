import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpResponse} from '@angular/common/http';
import {combineLatest, of, skip, Subject, switchMap} from 'rxjs';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {latLng} from 'leaflet';
import {RealtyObj, RealtyObjectStatus} from '../../app-models/realty-obj';
import {RealtyObjService} from '../../app-services/realty-obj.service';
import {Photo, RealtyPhoto} from '../../app-models/photo';
import {UserService} from '../../app-services/user.service';
import {InterestService} from '../../app-services/interest.service';
import {InterestDto} from '../../app-models/interest';
import {ReviewsService} from '../../app-services/reviews.service';
import {Review, ReviewAction, ReviewDto} from '../../app-models/review';
import {User, UserRole} from '../../app-models/user';

import {RealtorContactComponent} from '../../shared/realtor-contact/realtor-contact.component';
import {DeleteRealtyModalComponent} from '../../shared/delete-realty-modal/delete-realty-modal.component';
import {CancelReviewModalComponent} from '../../shared/cancel-review-modal/cancel-review-modal.component';
import {ApproveReviewModalComponent} from '../../shared/approve-review-modal/approve-review-modal.component';


@Component({
    selector: 'app-realty-obj-details',
    templateUrl: './realty-obj-details.component.html',
    styleUrls: ['./realty-obj-details.component.scss']
})
export class RealtyObjDetailsComponent implements OnInit, OnDestroy {
    public RealtyObjectStatus = RealtyObjectStatus;

    public currentObject: RealtyObj;
    public currentReview: ReviewDto = null;
    public enlargedPhoto: string;
    public isInterested = false;
    public defaultRealtyObjectPhoto = 'https://placehold.co/650x400?text=Main+photo';
    public user: User;
    public isRealtorOrAdmin = false;
    public isMyObject = false;

    private destroy$ = new Subject<boolean>();

    constructor(public realtyObjService: RealtyObjService,
                public userService: UserService,
                public interestService: InterestService,
                public reviewsService: ReviewsService,
                public modalService: NgbModal,
                public route: ActivatedRoute) {
    }

    public get geolocation() {
        return this.currentObject?.address?.lat && this.currentObject?.address?.lng && latLng({
            lat: this.currentObject.address.lat,
            lng: this.currentObject.address.lng
        });
    }

    ngOnInit() {
        combineLatest([
            this.userService.user$.pipe(
                tap(user => {
                    this.user = user;
                    this.isRealtorOrAdmin = user?.roles.includes(UserRole.Realtor) || user?.roles.includes(UserRole.Admin);
                })
            ),
            this.route.params
        ]).pipe(
                takeUntil(this.destroy$),
                switchMap(([user, params]) => {
                    const id = params['objectId'];
                    if (!id) {
                        return of(null);
                    }
                    return this.realtyObjService.findById(id)
                        .pipe(
                            takeUntil(this.destroy$),
                            tap(realtyObj => {
                                this.enlargedPhoto = RealtyObj.getMainPhoto(realtyObj);
                                this.currentObject = realtyObj;
                            }),
                            filter(r => !!user),
                            tap(() => {
                                this.initFavoritesAndReviewsData();
                                this.checkForRouteReviewAction(params);
                            })
                        );

                })
            )
            .subscribe();
    }

    public setEnlargedPhoto(photo: RealtyPhoto) {
        this.enlargedPhoto = Photo.getLinkByFilename(photo.filename);
    }

    public toggleInterested() {
        if (this.isInterested) {
            this.interestService.remove(this.currentObject.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(interest => {
                    this.isInterested = false;
                });
        } else {
            const interest: InterestDto = {
                userId: this.user.id,
                realtyObjId: this.currentObject.id
            };
            this.interestService.save(interest)
                .pipe(takeUntil(this.destroy$))
                .subscribe(interestFromServer => {
                    this.isInterested = true;
                });
        }
    }

    public setDefaultRealtyObjectPhoto(event: ErrorEvent) {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = this.defaultRealtyObjectPhoto;
    }

    public openRealtorContacts() {
        const modalRef = this.modalService.open(RealtorContactComponent);
        (modalRef.componentInstance as RealtorContactComponent).realtor = this.currentObject.realtor;
    }

    public promptDelete() {
        this.modalService.open(DeleteRealtyModalComponent).result.then(data => {
            if (data) {
                this.realtyObjService.deleteById(this.currentObject.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe();
            }
        }, error => {
            console.log('data dismissed');
        });
    }

    public openScheduleReviewModal() {
        this.reviewsService.scheduleReviewFlow(this.currentObject)
            .pipe(
                takeUntil(this.destroy$),
                tap(reviewDto => {
                    if (reviewDto) {
                        this.currentReview = {
                            ...reviewDto,
                            userId: this.user.id,
                            realtyObjId: this.currentObject.id,
                        };
                    }
                })
            )
            .subscribe();
    }

    public openReviewApproveDialog(review: Review) {
        const modalRef = this.modalService.open(ApproveReviewModalComponent);
        modalRef.componentInstance.review = review;
        modalRef.componentInstance.message = 'Are you sure you want to approve the review?';  // Passing custom message
        modalRef.result.then();
    }

    public openReviewRemoveDialog(review: Review | ReviewDto) {
        const modalRef = this.modalService.open(CancelReviewModalComponent);
        modalRef.componentInstance.review = review;
        modalRef.result.then();
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private initFavoritesAndReviewsData() {
        const id = this.currentObject.id;
        const currentUserObjects = this.user?.realtyObjects ?? [];

        if (currentUserObjects.length) {
            const object = currentUserObjects.find((obj) => obj.id === id);
            this.isMyObject = !!object;
        }

        this.interestService.getForObjectAndCurrentUser(this.currentObject.id)
            .pipe(
                tap(interestResponse => {
                    if (interestResponse.body) {
                        this.isInterested = true;
                    }
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();

        this.reviewsService.getForObjectAndCurrentUser(this.currentObject.id)
            .pipe(
                takeUntil(this.destroy$),
                tap((reviewsResponse: HttpResponse<ReviewDto>) => {
                    if (reviewsResponse.body) {
                        this.currentReview = reviewsResponse.body;
                    }
                }),
                switchMap((v) => {
                    return this.reviewsService.currentUserReviews$.pipe(
                        takeUntil(this.destroy$),
                        // takes 1st time review data from request above
                        skip(1),
                        tap((v) => {
                            const findReview = v.find(v => v.realtyObj.id === this.currentObject.id);
                            this.currentReview = findReview ? {
                                ...findReview,
                                userId: findReview.user.id,
                                realtyObjId: findReview.realtyObj.id
                            } : null;
                        }))
                }),
            ).subscribe();
    }

    private checkForRouteReviewAction(params) {
        const reviewActionType: ReviewAction = this.route.snapshot.data['reviewActionType'];
        const reviewId = params['reviewId'];
        if (reviewId) {
            this.reviewsService.getById(reviewId)
                .subscribe((review: Review) => {
                    if (reviewActionType === ReviewAction.CONFIRM) {
                        this.openReviewApproveDialog(review);
                    } else if (reviewActionType === ReviewAction.CANCEL) {
                        this.openReviewRemoveDialog(review);
                    }
                });
        }
    }
}
