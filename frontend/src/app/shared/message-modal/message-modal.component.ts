import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent {
  @Input() message = '';

  constructor(public activeModal: NgbActiveModal) {
  }

  public confirm() {
    this.activeModal.close(true);
  }

  public cancel() {
    this.activeModal.dismiss('cancel');
  }
}

