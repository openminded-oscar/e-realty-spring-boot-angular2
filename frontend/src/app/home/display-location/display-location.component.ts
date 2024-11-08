import {Component, OnInit} from '@angular/core';
import {Layer, MapOptions, tileLayer} from 'leaflet';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './display-location.component.html',
  styleUrls: ['./display-location.component.scss']
})
export class DisplayLocationComponent implements OnInit {
  public options: MapOptions = {
    zoomControl: true,
    zoom: 15,
  };
  public layers: Layer[] = [
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    })
  ];

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  public closeAndPassLocation() {
    this.ngbActiveModal.close();
  }
}
