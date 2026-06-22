import {Component, Input} from '@angular/core';
import {RealtyObj} from '../../../app-models/realty-obj';

@Component({
  selector: 'app-realty-obj-card-details',
  templateUrl: './realty-obj-card-details.component.html',
  styleUrls: ['./realty-obj-card-details.component.scss']
})
export class RealtyObjCardDetailsComponent {
  private _realtyObject: RealtyObj;
  @Input()
  public set realtyObject(value: RealtyObj) {
    this._realtyObject = value;
  }

  public get realtyObject(): RealtyObj {
    return this._realtyObject;
  }

  @Input()
  public showCreatedAt = false;

  @Input()
  public isMyObject: boolean;

  protected readonly RealtyObj = RealtyObj;

  constructor() {
  }
}
