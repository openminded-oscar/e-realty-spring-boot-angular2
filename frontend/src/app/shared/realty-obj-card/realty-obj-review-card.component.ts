import {Component, DestroyRef, inject, Input} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {RealtyObj} from '../../app-models/realty-obj';
import {RelatedReviewDto} from '../../app-models/review';
import {isFutureDate} from '../../utils/time-utils';
import {ReviewsService} from '../../app-services/reviews.service';
import {CancelReviewModalComponent} from '../cancel-review-modal/cancel-review-modal.component';
import {ApproveReviewModalComponent} from '../approve-review-modal/approve-review-modal.component';
import {UserProfile} from '../../app-models/user';
import {UserContactModalComponent} from '../realtor-contact/user-contact-modal.component';

@Component({
    selector: 'app-realty-obj-review-card',
    templateUrl: './realty-obj-review-card.component.html',
    styleUrl: './realty-obj-review-card.component.scss'
})
export class RealtyObjReviewCardComponent {
    private destroyRef = inject(DestroyRef);
    public realtyObject!: RealtyObj;
    @Input()
    public showRealtyObjectCreatedAt!: boolean;
    @Input()
    public isRealtorMode!: boolean;
    protected readonly isFutureDate = isFutureDate;

    constructor(public modalService: NgbModal, public reviewsService: ReviewsService) {
    }

    private _review!: RelatedReviewDto;

    public get review(): RelatedReviewDto {
        return this._review;
    }

    @Input()
    public set review(value: RelatedReviewDto) {
        this._review = value;
        this.realtyObject = value?.realtyObj;
    }

    public cancelReview(review: RelatedReviewDto): void {
        const modalRef = this.modalService.open(CancelReviewModalComponent);
        modalRef.componentInstance.review = review;
        modalRef.result.then();
    }

    public approveReview(review: RelatedReviewDto) {
        const modalRef = this.modalService.open(ApproveReviewModalComponent);
        modalRef.componentInstance.review = review;
        modalRef.componentInstance.message = 'Are you sure you want to approve the review?';  // Passing custom message
        modalRef.result.then((result) => {
            if (result) {
                this.reviewsService.approveReview(review)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe();
            }
        });
    }

    public openUserDetailsDialog(user: UserProfile) {
        const modalRef = this.modalService.open(UserContactModalComponent);
        (modalRef.componentInstance as UserContactModalComponent).user = this.review.user;
        (modalRef.componentInstance as UserContactModalComponent).message = 'User Contact Information';
        (modalRef.componentInstance as UserContactModalComponent).userTitle = 'will review the object';
        modalRef.result.then();
    }
}
