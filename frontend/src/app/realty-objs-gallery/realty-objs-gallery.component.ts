import {Component, OnInit} from '@angular/core';

import * as _ from "lodash";
import {RealtyObjService} from "../services/realty-obj.service";

@Component({
  selector: 'realty-objs-gallery',
  templateUrl: './realty-objs-gallery.component.html',
  styleUrls: ['./realty-objs-gallery.component.css']
})
export class RealtyObjsGalleryComponent implements OnInit {
  public currentRealtyObjects = [];

  public initialFilter: any = {
    "limit": 12,
    "offset": 0,
    "minPrice": 0.0,
    "maxPrice": 1000000.0
  };
  public filter: any;


  constructor(private realtyObjService: RealtyObjService) {
  }

  ngOnInit() {
    this.filter = _.cloneDeep(this.initialFilter);
    this.searchObjects();
  }

  public searchObjects() {
    this.realtyObjService.findByFilter(this.filter).subscribe((response: any) => {
      this.currentRealtyObjects = response;
    });
  }

  public resetAllFilters() {
    this.filter = _.cloneDeep(this.initialFilter);
  }
}
