import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {filterByReviewType, Review, ReviewFilter} from '../../../app-models/review';
import {ReviewsService} from '../../../app-services/reviews.service';

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

    constructor(public reviewsService: ReviewsService) {
    }

    ngOnInit(): void {
        this.reviewsService.currentRealtorReviews$
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
