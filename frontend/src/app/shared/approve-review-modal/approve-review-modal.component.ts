import {Component, Input, OnDestroy} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {ReviewsService} from '../../app-services/reviews.service';
import {Review} from '../../app-models/review';

@Component({
  selector: 'app-approve-review-modal',
  templateUrl: './approve-review-modal.component.html',
  styleUrl: './approve-review-modal.component.scss'
})
export class ApproveReviewModalComponent implements OnDestroy {
    @Input() message = 'Are you sure?';
    public review: Review = null;
    private destroy$ = new Subject<boolean>();

    constructor(public activeModal: NgbActiveModal, public reviewsService: ReviewsService) {

    }

    public confirm() {
        this.approveReview(this.review.id)
            .subscribe({
                complete: () => this.activeModal.close(true)
            });
    }

    public approveReview(reviewId: number): Observable<any> {
        return this.reviewsService.approveReview(reviewId)
            .pipe(takeUntil(this.destroy$));
    }

    public cancel() {
        this.activeModal.dismiss('cancel');
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
