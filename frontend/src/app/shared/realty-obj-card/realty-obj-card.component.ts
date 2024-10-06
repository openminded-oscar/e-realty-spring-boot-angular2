import {Component, Input, OnInit} from '@angular/core';
import {RealtyObj} from '../../domain/realty-obj';

@Component({
  selector: 'app-realty-obj-card',
  templateUrl: './realty-obj-card.component.html',
  styleUrls: ['./realty-obj-card.component.scss']
})
export class RealtyObjCardComponent implements OnInit {
  @Input() realtyObject: RealtyObj;
  @Input() isMyObject: Boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
