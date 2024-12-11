import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReviewsService} from '../../app-services/reviews.service';
import {Review, ReviewFilter} from '../../app-models/review';
import {RealtyObj} from '../../app-models/realty-obj';
import {ConfirmModalComponent} from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss']
})
export class UserReviewsComponent implements OnInit, OnDestroy {
  public reviews: Review[] = [];
  public filteredReviews: Review[] = [];
  private destroy$ = new Subject<boolean>();
  public filter: ReviewFilter = 'all';

  constructor(public reviewService: ReviewsService,
              public modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.reviewService.currentUserReviews$
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(reviewsResponse => {
      this.reviews = reviewsResponse;
      this.applyFilter();
    });
  }

  public isFutureDate(dateTime: Date): boolean {
    const currentDate = new Date();
    return new Date(dateTime) > currentDate;
  }

  public trackById(index: number, obj: Review): number {
    return obj.id;
  }

  public cancelReview(realtyObj: RealtyObj): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to cancel this review?';
    modalRef.result.then(res => {
      this.reviewService.removeByObject(realtyObj.id).subscribe();
    });
  }

  public applyFilter(): void {
    if (this.filter === 'all') {
      this.filteredReviews = this.reviews;
    } else if (this.filter === 'future') {
      this.filteredReviews = this.reviews.filter(review => this.isFutureDate(review.dateTime));
    } else if (this.filter === 'past') {
      this.filteredReviews = this.reviews.filter(review => !this.isFutureDate(review.dateTime));
    } else if (this.filter === 'unapproved') {
      this.filteredReviews = this.reviews.filter(review => !review.approved);
    }
  }

  public setFilter(filter: ReviewFilter): void {
    this.filter = filter;
    this.applyFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  // public rateReview(realtyObj: RealtyObj) {}
}
