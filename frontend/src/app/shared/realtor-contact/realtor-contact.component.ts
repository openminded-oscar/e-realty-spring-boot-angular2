import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Realtor} from '../../app-models/realtor';

@Component({
  selector: 'app-realtor-contact',
  templateUrl: './realtor-contact.component.html',
  styleUrls: ['./realtor-contact.component.scss']
})
export class RealtorContactComponent {
  public realtor: Realtor;

  constructor(public activeModal: NgbActiveModal) { }
}
