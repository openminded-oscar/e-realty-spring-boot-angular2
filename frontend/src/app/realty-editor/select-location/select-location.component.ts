import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {icon, latLng, Layer, LayerGroup, LeafletMouseEvent, MapOptions, marker, tileLayer, Map} from 'leaflet';

export interface Geolocation {
  lat: number;
  lng: number;
}

export const LVIV_COORDINATES: Geolocation = {lat: 49.83, lng: 24.01};

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent implements OnInit {
  public options: MapOptions = {
    zoomControl: true,
    zoom: 11,
    center: latLng(LVIV_COORDINATES),
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
  @Input()
  public set initialLocation(value: Geolocation) {
    this._initialLocation = value;
    if (value?.lat && value?.lng) {
      this.currentLocation = {
        lng: value.lng,
        lat: value.lat
      };
      this.addMarkerOnMap(value.lat, value.lng);
    }
  }

  public get initialLocation(): Geolocation {
    return this._initialLocation;
  }

  public currentLocation: Geolocation;


  constructor() {
    this.layers.push(new LayerGroup([this.markers]));
  }

  ngOnInit(): void {
  }

  public onMapClick(mouseClickData: LeafletMouseEvent) {
    const {lat, lng} = mouseClickData.latlng;
    this.addMarkerOnMap(lat, lng);

    this.currentLocation = mouseClickData.latlng;
    this.locationSelected.emit(this.currentLocation);
  }

  private addMarkerOnMap(lat: number, lng: number) {
    const newMarker = marker([lat, lng], {
      icon: icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    });
    this.markers.clearLayers();
    this.markers.addLayer(newMarker);
  }

  public onMapReady(map: Map) {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
}
