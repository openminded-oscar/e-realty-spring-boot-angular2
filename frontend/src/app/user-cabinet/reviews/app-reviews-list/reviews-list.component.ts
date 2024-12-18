import {Component, Input} from '@angular/core';
import {RelatedReviewDto} from '../../../app-models/review';

@Component({
    selector: 'app-reviews-list',
    templateUrl: './reviews-list.component.html',
    styles: ``
})
export class ReviewsListComponent {
    @Input()
    public reviews: RelatedReviewDto[] = [];
    @Input()
    showActionButtons!: boolean;
    @Input()
    revieweeShouldBeDisplayed: boolean;


    constructor() {
    }

    public trackById(index: number, obj: RelatedReviewDto): number {
        return obj.id;
    }
}
