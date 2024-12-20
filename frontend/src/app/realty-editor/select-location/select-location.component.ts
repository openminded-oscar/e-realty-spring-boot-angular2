import {Component, EventEmitter, Input, Output} from '@angular/core';
import {latLng, Layer, LayerGroup, LeafletMouseEvent, Map, MapOptions, tileLayer} from 'leaflet';
import {blueMarkerOfLngAndLat} from '../../utils/location-utils';
import {Geolocation} from '../../app-models/geolocation';

export const LVIV_COORDINATES: Geolocation = {lat: 49.83, lng: 24.01};

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent {
  public options: MapOptions = {
    zoomControl: true,
    zoom: 11
  };
  public layers: Layer[] = [
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      noWrap: true
    })
  ];
  public markers: LayerGroup = new LayerGroup();

  @Output()
  public locationSelected = new EventEmitter<Geolocation>();

  private _initialLocation: Geolocation;
  private map: Map;

  @Input()
  public set initialLocation(value: Geolocation) {
    this._initialLocation = value;
    if (value?.lat && value?.lng) {
      this.currentLocation = {
        lng: value.lng,
        lat: value.lat
      };
      this.options.center = this.currentLocation;
      this.addMarkerOnMap(value.lat, value.lng);
      if (this.map) {
        this.map.setView(value, this.map.getZoom(), {animate: true});
      }
    }
  }

  public get initialLocation(): Geolocation {
    return this._initialLocation;
  }

  public currentLocation: Geolocation;


  constructor() {
    this.layers.push(new LayerGroup([this.markers]));
  }

  public onMapClick(mouseClickData: LeafletMouseEvent) {
    const {lat, lng} = mouseClickData.latlng;

    this.addMarkerOnMap(lat, lng);

    this.currentLocation = mouseClickData.latlng;
    this.locationSelected.emit(this.currentLocation);
  }

  private addMarkerOnMap(lat: number, lng: number) {
    const newMarker = blueMarkerOfLngAndLat(lat, lng);
    this.markers.clearLayers();
    this.markers.addLayer(newMarker);
  }

  public onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
}
