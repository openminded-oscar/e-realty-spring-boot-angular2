import {Component, Input} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RealtyObj} from '../../app-models/realty-obj';
import {Review} from '../../app-models/review';
import {isFutureDate} from '../../utils/time-utils';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';
import {ReviewsService} from '../../app-services/reviews.service';

@Component({
  selector: 'app-realty-obj-review-card',
  templateUrl: './realty-obj-review-card.component.html',
  styleUrl: './realty-obj-review-card.component.scss'
})
export class RealtyObjReviewCardComponent {
  private _review!: Review;
  @Input()
  public set review(value: Review) {
    this._review = value;
    this.realtyObject = value?.realtyObj;
  }
  public get review(): Review {
    return this._review;
  }
  public realtyObject!: RealtyObj;
  @Input()
  public showRealtyObjectCreatedAt!: boolean;

  protected readonly isFutureDate = isFutureDate;

  constructor(public modalService: NgbModal, public reviewsService: ReviewsService) {
  }

  public cancelReview(realtyObj: RealtyObj): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to cancel this review?';
    modalRef.result.then(res => {
      this.reviewsService.removeByObject(realtyObj.id).subscribe();
    });
  }
}
