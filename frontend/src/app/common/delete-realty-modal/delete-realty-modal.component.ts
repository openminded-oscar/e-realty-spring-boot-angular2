import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-realty-modal',
  templateUrl: './delete-realty-modal.component.html',
  styleUrls: ['./delete-realty-modal.component.scss']
})
export class DeleteRealtyModalComponent {
  constructor(public modal: NgbActiveModal) { }
}
