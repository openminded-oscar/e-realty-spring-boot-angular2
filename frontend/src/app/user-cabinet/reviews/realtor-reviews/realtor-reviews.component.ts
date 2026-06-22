import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {tap} from 'rxjs/operators';
import {filterByReviewType, RelatedReviewDto, ReviewFilter} from '../../../app-models/review';
import {ReviewsService} from '../../../app-services/reviews.service';

@Component({
    selector: 'app-realtor-reviews',
    templateUrl: './realtor-reviews.component.html',
    styles: ``
})
export class RealtorReviewsComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    public allRealtorReviews: RelatedReviewDto[];
    public filteredReviews: RelatedReviewDto[] = [];
    public filter: ReviewFilter = 'all';

    constructor(public reviewsService: ReviewsService) {
    }

    ngOnInit(): void {
        this.reviewsService.currentRealtorReviews$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
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
}
