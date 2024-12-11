import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ReviewsService} from '../../../app-services/reviews.service';
import {filterByReviewType, Review, ReviewFilter} from '../../../app-models/review';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styles: ``
})
export class UserReviewsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  public allUserReviews: Review[] = [];
  public filteredReviews: Review[] = [];
  public filter: ReviewFilter = 'all';

  constructor(public reviewService: ReviewsService) {
  }

  ngOnInit(): void {
    this.reviewService.currentUserReviews$
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(reviewsResponse => {
      this.allUserReviews = reviewsResponse;
      this.applyFilter();
    });
  }

  public applyFilter(): void {
    this.filteredReviews = filterByReviewType(this.allUserReviews, this.filter);
  }

  public onFilterChanged($event: ReviewFilter) {
    this.filter = $event;
    this.applyFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
