import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  @Input() message = 'Are you sure?';

  constructor(public activeModal: NgbActiveModal) {}

  public confirm() {
    this.activeModal.close(true);
  }

  public cancel() {
    this.activeModal.dismiss('cancel');
  }
}
