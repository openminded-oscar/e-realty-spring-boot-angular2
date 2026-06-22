import {Component, DestroyRef, inject, Input} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {ReviewsService} from '../../app-services/reviews.service';
import {RelatedReviewDto} from '../../app-models/review';

@Component({
  selector: 'app-approve-review-modal',
  templateUrl: './approve-review-modal.component.html',
  styleUrl: './approve-review-modal.component.scss'
})
export class ApproveReviewModalComponent {
    private destroyRef = inject(DestroyRef);
    @Input() message = 'Are you sure?';
    public review: RelatedReviewDto = null;

    constructor(public activeModal: NgbActiveModal, public reviewsService: ReviewsService) {

    }

    public confirm() {
        this.approveReview(this.review)
            .subscribe({
                complete: () => this.activeModal.close(true)
            });
    }

    public approveReview(review: RelatedReviewDto): Observable<any> {
        return this.reviewsService.approveReview(review)
            .pipe(takeUntilDestroyed(this.destroyRef));
    }

    public cancel() {
        this.activeModal.dismiss('cancel');
    }
}
