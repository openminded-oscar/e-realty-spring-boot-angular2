import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {latLng, Layer, LayerGroup, LeafletMouseEvent, Map, MapOptions, marker, tileLayer} from 'leaflet';
import {RealtyObjService} from '../../../app-services/realty-obj.service';
import {blueMarkerOfLngAndLat, LVIV_COORDINATES, redMarkerOfLatAndLng} from '../../../utils/location-utils';
import {Geolocation} from '../../../app-models/geolocation';

@Component({
  selector: 'app-geolocation-widget',
  templateUrl: './geolocation-widget.component.html',
  styleUrls: ['./geolocation-widget.component.scss']
})
export class GeolocationWidgetComponent implements OnInit {
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

  private _initialLocation: Geolocation;
  private map: Map;

  @Input()
  public set initialLocation(value: Geolocation) {
    // setting  timeout for initial map initialization
    setTimeout(() => {
      this._initialLocation = value;
      if (value?.lat && value?.lng) {
        this.currentLocation = {
          lng: value.lng,
          lat: value.lat
        };
        if (this.map) {
          this.addMarkerAndNeighborsOnMap(value.lat, value.lng);
          this.map.setView(value, this.map.getZoom(), {animate: true});
        }
      }
    }, 100);
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
  }

  private addMarkerAndNeighborsOnMap(lat: number, lng: number) {
    const newMarker = blueMarkerOfLngAndLat(lat, lng);
    this.markers.clearLayers();
    this.markers.addLayer(newMarker);
    this.realtyObjectService.findByLatLngAndZoomLevel(
      lat, lng, this.map.getZoom()
    ).subscribe(objects => {
      objects.forEach(object => {
        if (this.currentLocation?.lat !== object.address.lat || this.currentLocation?.lng !== object.address.lng) {
          const newRelatedMarker = redMarkerOfLatAndLng(object.address.lat, object.address.lng);
          this.markers.addLayer(newRelatedMarker);
        }
      });
    });
  }

  public onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
}
