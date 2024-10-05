import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReviewsService} from '../../services/reviews.service';
import {Review} from '../../domain/review';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss']
})
export class UserReviewsComponent implements OnInit, OnDestroy {
  public reviews: Review[] = [];
  private destroy$ = new Subject<boolean>();

  constructor(public reviewService: ReviewsService) {
  }

  ngOnInit(): void {
    this.reviewService.getAllReviewsForUser()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(reviewsResponse => this.reviews = reviewsResponse.body);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
