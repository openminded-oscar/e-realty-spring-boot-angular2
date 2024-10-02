import { Component, OnInit } from '@angular/core';
import {Realter} from '../../domain/realter';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-realtor-contact',
  templateUrl: './realtor-contact.component.html',
  styleUrls: ['./realtor-contact.component.scss']
})
export class RealtorContactComponent implements OnInit {
  public realtor: Realter;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
}
