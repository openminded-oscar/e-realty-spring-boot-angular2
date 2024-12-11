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

@Component({
  selector: 'app-realty-obj-review-card',
  templateUrl: './realty-obj-review-card.component.html',
  styleUrl: './realty-obj-review-card.component.scss'
})
export class RealtyObjReviewCardComponent implements OnDestroy {
  private _review!: Review;
  private destroy$ = new Subject<boolean>();

  @Input()
  public set review(value: Review) {
    this._review = value;
    this.realtyObject = value?.realtyObj;
  }

  public get review(): Review {
    return this._review;
  }

  public realtyObject!: RealtyObj;
  @Input()
  public showRealtyObjectCreatedAt!: boolean;

  protected readonly isFutureDate = isFutureDate;
  @Input()
  public showActionButtons!: boolean;

  constructor(public modalService: NgbModal, public reviewsService: ReviewsService) {
  }

  public cancelReview(review: Review): void {
    const modalRef = this.modalService.open(CancelReviewModalComponent);
    modalRef.result.then(resultMessage => {
      this.reviewsService.removeReviewById(review.id, resultMessage)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    });
  }

  public approveReview(review: Review) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to approve the review?';  // Passing custom message
    modalRef.result.then((result) => {
      if (result) {
        this.reviewsService.approveReview(review.id)
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
