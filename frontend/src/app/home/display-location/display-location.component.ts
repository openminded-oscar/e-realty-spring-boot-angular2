import {Component, Input, OnInit} from '@angular/core';
import {LatLng, LatLngExpression, Layer, MapOptions, tileLayer} from 'leaflet';

@Component({
  selector: 'app-location',
  templateUrl: './display-location.component.html',
  styleUrls: ['./display-location.component.scss']
})
export class DisplayLocationComponent implements OnInit {
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

  constructor() {
  }

  ngOnInit(): void {
  }
}
