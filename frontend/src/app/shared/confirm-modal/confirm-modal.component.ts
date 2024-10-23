import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  @Input() message = 'Are you sure?';  // Default message if none is provided

  constructor(public activeModal: NgbActiveModal) {}

  public confirm() {
    this.activeModal.close(true);  // Closes the modal with 'confirm' result
  }

  public cancel() {
    this.activeModal.dismiss('cancel');  // Dismisses the modal with 'cancel' result
  }
}
