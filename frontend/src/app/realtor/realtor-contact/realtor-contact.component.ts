import { Component } from '@angular/core';
import {Realtor} from '../../domain/realtor';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-realtor-contact',
  templateUrl: './realtor-contact.component.html',
  styleUrls: ['./realtor-contact.component.scss']
})
export class RealtorContactComponent {
  public realtor: Realtor;

  constructor(public activeModal: NgbActiveModal) { }
}
