import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {RealtorService} from '../../../app-services/realtor.service';
import {filterByReviewType, Review, ReviewFilter} from '../../../app-models/review';

@Component({
  selector: 'app-realtor-reviews',
  templateUrl: './realtor-reviews.component.html',
  styles: ``
})
export class RealtorReviewsComponent implements OnInit, OnDestroy {
  public destroy$ = new Subject<boolean>();

  public allRealtorReviews: Review[];
  public filteredReviews: Review[] = [];
  public filter: ReviewFilter = 'all';

  constructor(public realtorService: RealtorService) {
  }

  ngOnInit(): void {
    this.realtorService.getMyAsRealtorReviews()
      .pipe(
        takeUntil(this.destroy$),
        tap(reviews => {
          this.allRealtorReviews = reviews;
          this.applyFilter();
        })
      )
      .subscribe();
  }


  public applyFilter(): void {
    this.filteredReviews = filterByReviewType(this.allRealtorReviews, this.filter)
  }

  public onFilterChanged(filter: ReviewFilter): void {
    this.filter = filter;
    this.applyFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
