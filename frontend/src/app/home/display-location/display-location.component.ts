import {  Component, Input  } from '@angular/core';
import { LatLngExpression, Layer, MapOptions, tileLayer } from 'leaflet';
import { WindowService } from '../../app-services/window.service';
import {Geolocation} from '../../app-models/geolocation';

@Component({
  selector: 'app-location',
  templateUrl: './display-location.component.html',
  styleUrls: ['./display-location.component.scss']
})
export class DisplayLocationComponent {
  public options: MapOptions = {
    zoomControl: false,
    zoom: 15,
  };

  @Input()
  public set center(value: LatLngExpression) {
    this.options.center = value;
  }

  public get center(): LatLngExpression {
    return this.options.center;
  }

  public layers: Layer[] = [
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    })
  ];

  constructor(private windowService: WindowService) {
  }

  public openOnGoogleMaps(center: Geolocation) {
    const url = `https://www.google.com/maps?q=${center.lat},${center.lng}`;
    const test = 'test';
    this.windowService.nativeWindow?.open(url, '_blank');
  }
}
