import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, take} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RealtorService} from '../../../app-services/realtor.service';
import {Review, ReviewFilter} from '../../../app-models/review';
import {RealtyObj} from '../../../app-models/realty-obj';
import {ConfirmModalComponent} from '../../../shared/confirm-modal/confirm-modal.component';
import {ReviewsService} from '../../../app-services/reviews.service';


@Component({
  selector: 'app-realtor-reviews',
  templateUrl: './realtor-reviews.component.html',
  styles: ``
})
export class RealtorReviewsComponent implements OnInit, OnDestroy {
  public destroy$ = new Subject<boolean>();
  public reviews: Review[];
  public filteredReviews: Review[] = [];
  public filter: ReviewFilter = 'all';

  constructor(public realtorService: RealtorService,
              public reviewService: ReviewsService,
              public modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.realtorService.getMyAsRealtorReviews()
      .pipe(
        takeUntil(this.destroy$),
        tap(reviews => {
          this.reviews = reviews;
          this.applyFilter();
        })
      )
      .subscribe();
  }

  public trackById(index: number, obj: Review): number {
    return obj.id;
  }

  public cancelReview(realtyObj: RealtyObj): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to cancel this apartment review? Owner and User will be notified!';
    modalRef.result.then(res => {
      this.reviewService.removeByObject(realtyObj.id)
        .pipe(take(1))
        .subscribe();
    });
  }

  public isFutureDate(dateTime: Date): boolean {
    const currentDate = new Date();
    return new Date(dateTime) > currentDate;
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
}
