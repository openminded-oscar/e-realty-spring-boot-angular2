import {Component, OnDestroy} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, Validators} from '@angular/forms';
import {map, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {ReviewsService} from '../../app-services/reviews.service';
import {ReviewDto} from '../../app-models/review';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './cancel-review-modal.component.html',
    styleUrls: ['./cancel-review-modal.component.scss']
})
export class CancelReviewModalComponent implements OnDestroy {
    public message = 'Please provide a reason to notify all parties included:';
    public review = null;
    public reasonFormControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]);
    private destroy$ = new Subject<boolean>();

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

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private removeReview(reason: string): Observable<ReviewDto> {
        return this.reviewsService.removeReviewById(this.review?.id, reason)
            .pipe(
                takeUntil(this.destroy$),
                map(r => r.body)
            );
    }
}
