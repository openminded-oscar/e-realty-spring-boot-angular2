import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Geolocation} from '../../../app-models/geolocation';

@Component({
  selector: 'app-geolocation-widget-modal',
  templateUrl: './geolocation-widget-modal.component.html',
  styleUrls: ['./geolocation-widget-modal.component.scss']
})
export class GeolocationWidgetModalComponent {
  @Input()
  public initialLocation: Geolocation;
  @Input()
  public zoomLevel: number;

  constructor(public modal: NgbActiveModal) { }
}
