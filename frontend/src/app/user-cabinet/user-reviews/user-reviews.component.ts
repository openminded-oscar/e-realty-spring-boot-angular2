import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReviewsService} from '../../services/reviews.service';
import {Review} from '../../domain/review';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {RealtyObj} from '../../domain/realty-obj';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss']
})
export class UserReviewsComponent implements OnInit, OnDestroy {
  public reviews: Review[] = [];
  public reviewMappedObjects: RealtyObj[] = [];
  private destroy$ = new Subject<boolean>();

  constructor(public reviewService: ReviewsService) {
  }


  public isFutureDate(dateTime: Date): boolean {
    const currentDate = new Date();
    return new Date(dateTime) > currentDate;
  }

  public trackById(index: number, obj: Review): number {
    return obj.id;
  }

  ngOnInit(): void {
    this.fetchUserReviews();
  }

  private fetchUserReviews() {
    this.reviewService.getAllReviewsForUser()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(reviewsResponse => {
        this.reviews = reviewsResponse.body;
        this.reviewMappedObjects = this.reviews.map(review => review.realtyObj);
      });
  }

  public cancelReview(realtyObj: RealtyObj): void {
    this.reviewService.remove(realtyObj.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchUserReviews();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // public rateReview(realtyObj: RealtyObj) {}
}
