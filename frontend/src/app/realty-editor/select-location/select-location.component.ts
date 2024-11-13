import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {icon, latLng, Layer, LayerGroup, LeafletMouseEvent, Map, MapOptions, marker, tileLayer} from 'leaflet';
import {RealtyObjService} from '../../app-services/realty-obj.service';

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
  private map: Map;

  @Input()
  public set initialLocation(value: Geolocation) {
    this._initialLocation = value;
    if (value?.lat && value?.lng) {
      this.currentLocation = {
        lng: value.lng,
        lat: value.lat
      };
      this.addMarkerAndNeighborsOnMap(value.lat, value.lng);
      if (this.map) {
        this.map.setView(value, this.map.getZoom(), {animate: true});
      }
    }
  }

  public get initialLocation(): Geolocation {
    return this._initialLocation;
  }

  public currentLocation: Geolocation;


  constructor(public realtyObjectService: RealtyObjService) {
    this.layers.push(new LayerGroup([this.markers]));
  }

  ngOnInit(): void {
  }

  public onMapClick(mouseClickData: LeafletMouseEvent) {
    const {lat, lng} = mouseClickData.latlng;

    this.addMarkerAndNeighborsOnMap(lat, lng);

    this.currentLocation = mouseClickData.latlng;
    this.locationSelected.emit(this.currentLocation);
  }

  private addMarkerAndNeighborsOnMap(lat: number, lng: number) {
    const newMarker = this.blueMarkerOfLngAndLat(lat, lng);
    this.markers.clearLayers();
    this.markers.addLayer(newMarker);
    // this.realtyObjectService.findByLatLngAndZoomLevel(
    //   lat, lng, this.map.getZoom()
    // ).subscribe(objects => {
    //   objects.forEach(object => {
    //     if (this.currentLocation?.lat !== object.address.lat || this.currentLocation?.lng !== object.address.lng) {
    //       const newRelatedMarker = this.redMarkerOfLatAndLng(object.address.lat, object.address.lng);
    //       this.markers.addLayer(newRelatedMarker);
    //     }
    //   });
    // });
  }

  private blueMarkerOfLngAndLat(lat: number, lng: number) {
    return marker([lat, lng], {
      icon: icon({
        iconUrl: '/assets/house-icon.png',
        iconSize: [25, 25],
      })
    });
  }

  private redMarkerOfLatAndLng(lat: number, lng: number) {
    return marker([lat, lng], {
      icon: icon({
        iconUrl: '/assets/house-red-icon.png',
        iconSize: [20, 20],
      })
    });
  }

  public onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
}
