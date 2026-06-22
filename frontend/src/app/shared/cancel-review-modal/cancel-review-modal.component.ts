import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ReviewsService} from '../../app-services/reviews.service';
import {ReviewDto} from '../../app-models/review';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './cancel-review-modal.component.html',
    styleUrls: ['./cancel-review-modal.component.scss']
})
export class CancelReviewModalComponent {
    private destroyRef = inject(DestroyRef);
    public message = 'Please provide a reason to notify all parties included:';
    public review = null;
    public reasonFormControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]);

    constructor(public activeModal: NgbActiveModal,
                public reviewsService: ReviewsService) {
    }

    public confirm() {
        this.removeReview(this.reasonFormControl.value)
            .subscribe({
                complete: () => {
                    this.activeModal.close(this.reasonFormControl.value);
                }
            });
    }

    public cancel() {
        this.activeModal.dismiss('cancel');
    }

    private removeReview(reason: string): Observable<ReviewDto> {
        return this.reviewsService.removeReviewById(this.review?.id, reason)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                map(r => r.body)
            );
    }
}
