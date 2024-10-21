import {Component, OnDestroy, OnInit} from '@angular/core';
import {RealtorService} from '../../services/realtor.service';
import {Subject} from 'rxjs';
import {Review} from '../../domain/review';
import {takeUntil, tap} from 'rxjs/operators';
import {RealtyObj} from '../../domain/realty-obj';
import {ConfirmModalComponent} from '../../shared/confirm-modal/confirm-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReviewsService} from '../../services/reviews.service';

@Component({
  selector: 'app-realtor-reviews',
  templateUrl: './realtor-reviews.component.html',
  styleUrls: ['./realtor-reviews.component.scss']
})
export class RealtorReviewsComponent implements OnInit, OnDestroy {
  public destroy$ = new Subject<boolean>();
  public reviews: Review[];
  public filteredReviews: Review[] = [];
  public filter: 'all' | 'future' | 'past' = 'all';

  constructor(public realtorService: RealtorService,
              public reviewService: ReviewsService,
              public modalService: NgbModal) {
  }

  public trackById(index: number, obj: Review): number {
    return obj.id;
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public cancelReview(realtyObj: RealtyObj): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to cancel this apartment review? Owner and User will be notified!';
    modalRef.result.then(res => {
      this.reviewService.remove(realtyObj.id).subscribe();
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
    }
  }

  public setFilter(filter: 'all' | 'future' | 'past'): void {
    this.filter = filter;
    this.applyFilter();
  }
}
