import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './cancel-review-modal.component.html',
  styleUrls: ['./cancel-review-modal.component.scss']
})
export class CancelReviewModalComponent {
  public message = 'Please provide a reason to notify all parties included:';

  public reasonFormControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]);

  constructor(public activeModal: NgbActiveModal) {}

  public confirm() {
    this.activeModal.close(this.reasonFormControl.value);
  }

  public cancel() {
    this.activeModal.dismiss('cancel');
  }
}
