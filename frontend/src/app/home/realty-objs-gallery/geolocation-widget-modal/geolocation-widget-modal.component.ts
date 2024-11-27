import {Component, Input} from '@angular/core';
import {Geolocation} from '../../../app-models/geolocation';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

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
