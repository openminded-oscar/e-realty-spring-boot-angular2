import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {ReviewsService} from '../../app-services/reviews.service';
import {Review, ReviewAction} from '../../app-models/review';
import {ConfirmModalComponent} from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-realty-obj-details-container',
  template: `
    <app-realty-obj-details></app-realty-obj-details>
  `,
  styles: ``
})
export class RealtyObjDetailsContainerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(public reviewsService: ReviewsService,
              public modalService: NgbModal,
              public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const reviewActionType: ReviewAction = this.route.snapshot.data['reviewActionType'];
        const reviewId = params['reviewId'];
        if (reviewId) {
          this.requestReviewDetails(reviewId)
            .subscribe((review: Review) => {
              if (reviewActionType === ReviewAction.CONFIRM) {
                this.openReviewApproveDialog(review);
              } else if (reviewActionType === ReviewAction.CANCEL) {
                this.openReviewRemoveDialog(review);
              }
            });
        }
      });
  }

  public removeReview(reviewId: number) {
    this.reviewsService.removeReviewById(reviewId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  public approveReview(reviewId: number) {
    this.reviewsService.approveReview(reviewId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  public openReviewApproveDialog(review: Review) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to approve the review?';  // Passing custom message
    modalRef.result.then((result) => {
      if (result) {
        this.approveReview(review.id);
      }
    });
  }

  public openReviewRemoveDialog(review: Review) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to cancel this review?';  // Passing custom message
    modalRef.result.then((result) => {
      if (result) {
        this.removeReview(review.id);
      }
    });
  }

  private requestReviewDetails(reviewId: number): Observable<Review> {
    return this.reviewsService.getById(reviewId);
  }


  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
