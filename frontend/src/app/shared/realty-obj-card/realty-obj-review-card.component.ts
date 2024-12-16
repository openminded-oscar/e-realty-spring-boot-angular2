import {Component, Input, OnDestroy} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {RealtyObj} from '../../app-models/realty-obj';
import {Review} from '../../app-models/review';
import {isFutureDate} from '../../utils/time-utils';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';
import {ReviewsService} from '../../app-services/reviews.service';
import {CancelReviewModalComponent} from '../cancel-review-modal/cancel-review-modal.component';
import {ApproveReviewModalComponent} from '../approve-review-modal/approve-review-modal.component';

@Component({
    selector: 'app-realty-obj-review-card',
    templateUrl: './realty-obj-review-card.component.html',
    styleUrl: './realty-obj-review-card.component.scss'
})
export class RealtyObjReviewCardComponent implements OnDestroy {
    public realtyObject!: RealtyObj;
    @Input()
    public showRealtyObjectCreatedAt!: boolean;
    @Input()
    public showActionButtons!: boolean;
    protected readonly isFutureDate = isFutureDate;
    private destroy$ = new Subject<boolean>();

    constructor(public modalService: NgbModal, public reviewsService: ReviewsService) {
    }

    private _review!: Review;

    public get review(): Review {
        return this._review;
    }

    @Input()
    public set review(value: Review) {
        this._review = value;
        this.realtyObject = value?.realtyObj;
    }

    public cancelReview(review: Review): void {
        const modalRef = this.modalService.open(CancelReviewModalComponent);
        modalRef.componentInstance.review = review;
        modalRef.result.then();
    }

    public approveReview(review: Review) {
        const modalRef = this.modalService.open(ApproveReviewModalComponent);
        modalRef.componentInstance.review = review;
        modalRef.componentInstance.message = 'Are you sure you want to approve the review?';  // Passing custom message
        modalRef.result.then((result) => {
            if (result) {
                this.reviewsService.approveReview(review)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe();
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
