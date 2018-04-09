import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'realty-objs-list',
  templateUrl: './realty-objs-list.component.html',
  styleUrls: ['./realty-objs-gallery.component.css']
})
export class RealtyObjsListComponent implements OnInit {
  @Input()
  public realtyObjects = [];

  constructor() { }

  ngOnInit() {
  }

  trimDescription(fullDescr) {
    return fullDescr.substr(0, 52) + '...';
  }

  transformCityToString (city) {
    return (city.name
      + (city.district ? (', ' + city.district + ' distr.')
        : '') + (city.region ? (', '
        + city.region + ' reg.') : ''));
  };
}
