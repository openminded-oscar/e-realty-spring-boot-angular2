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

  public trackById(index: number, obj: Review): number {
    return obj.id;
  }

  ngOnInit(): void {
    this.reviewService.getAllReviewsForUser()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(reviewsResponse => {
        this.reviews = reviewsResponse.body;
        this.reviewMappedObjects = this.reviews.map(review => review.realtyObj);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
