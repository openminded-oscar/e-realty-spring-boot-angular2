import {Component, OnInit} from '@angular/core';
import {icon, latLng, Layer, LayerGroup, LeafletMouseEvent, MapOptions, marker, tileLayer} from 'leaflet';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-location-dialog',
  templateUrl: './select-location-dialog.component.html',
  styleUrls: ['./select-location-dialog.component.scss']
})
export class SelectLocationDialogComponent implements OnInit {
  public options: MapOptions = {
    zoomControl: true,
    zoom: 8,
    center: latLng({lat: 49.86, lng: 24.01}),
  };
  public layers: Layer[] = [
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    })
  ];
  public markers: LayerGroup = new LayerGroup();

  public lat: number;
  public lng: number;


  constructor(public ngbActiveModal: NgbActiveModal) {
    this.layers.push(new LayerGroup([this.markers]));
  }

  ngOnInit(): void {
  }

  public onMapClick(mouseClickData: LeafletMouseEvent) {
    const {lat, lng} = mouseClickData.latlng;
    this.lat = lat;
    this.lng = lng;
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

  public closeAndPassLocation() {
    this.ngbActiveModal.close({
      lat: this.lat, lng: this.lng
    });
  }
}
