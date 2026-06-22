import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ReviewsService} from '../../../app-services/reviews.service';
import {filterByReviewType, RelatedReviewDto, ReviewFilter} from '../../../app-models/review';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styles: ``
})
export class UserReviewsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  public allUserReviews: RelatedReviewDto[] = [];
  public filteredReviews: RelatedReviewDto[] = [];
  public filter: ReviewFilter = 'all';

  constructor(public reviewService: ReviewsService) {
  }

  ngOnInit(): void {
    this.reviewService.currentUserReviews$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
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
}
