import {Component, Input} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Review} from '../../../app-models/review';
import {RealtyObj} from '../../../app-models/realty-obj';
import {ConfirmModalComponent} from '../../../shared/confirm-modal/confirm-modal.component';
import {ReviewsService} from '../../../app-services/reviews.service';
import {isFutureDate} from '../../../utils/time-utils';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styles: ``
})
export class ReviewsListComponent {
  @Input()
  public reviews: Review[] = [];

  constructor() {
  }

  public trackById(index: number, obj: Review): number {
    return obj.id;
  }
}
