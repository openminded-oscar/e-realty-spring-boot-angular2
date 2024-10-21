import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReviewsService} from '../../services/reviews.service';
import {Review} from '../../domain/review';
import {takeUntil} from 'rxjs/operators';
import {RealtyObj} from '../../domain/realty-obj';
import {ConfirmModalComponent} from '../../shared/confirm-modal/confirm-modal.component';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss']
})
export class UserReviewsComponent implements OnInit, OnDestroy {
  public reviews: Review[] = [];
  public filteredReviews: Review[] = [];
  private destroy$ = new Subject<boolean>();
  public filter: 'all' | 'future' | 'past' = 'all';

  constructor(public reviewService: ReviewsService,
              public modalService: NgbModal) {
  }


  public isFutureDate(dateTime: Date): boolean {
    const currentDate = new Date();
    return new Date(dateTime) > currentDate;
  }

  public trackById(index: number, obj: Review): number {
    return obj.id;
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

  public cancelReview(realtyObj: RealtyObj): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to cancel this review?';
    modalRef.result.then(res => {
      this.reviewService.remove(realtyObj.id).subscribe();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public applyFilter(): void {
    if (this.filter === 'all') {
      this.filteredReviews = this.reviews;
    } else if (this.filter === 'future') {
      this.filteredReviews = this.reviews.filter(review => this.isFutureDate(review.dateTime));
    } else if (this.filter === 'past') {
      this.filteredReviews = this.reviews.filter(review => !this.isFutureDate(review.dateTime));
    }
  }

  public setFilter(filter: 'all' | 'future' | 'past'): void {
    this.filter = filter;
    this.applyFilter();
  }

  // public rateReview(realtyObj: RealtyObj) {}
}
