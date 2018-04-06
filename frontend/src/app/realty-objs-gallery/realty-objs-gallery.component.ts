import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'realty-objs-gallery',
  templateUrl: './realty-objs-gallery.component.html',
  styleUrls: ['./realty-objs-gallery.component.css']
})
export class RealtyObjsGalleryComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }

  public realtyObjects = [];

  public filter = {
    "limit": 12,
    "offset": 0
  };

  searchObjects() {

  }

  trimDescription(fullDescr) {
    return fullDescr.substr(0, 52) + '...';
  }

  transformCityToString = function (city) {
    return (city.name
      + (city.district ? (', ' + city.district + ' distr.')
        : '') + (city.region ? (', '
        + city.region + ' reg.') : ''));
  };
}
