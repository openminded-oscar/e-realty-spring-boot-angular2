import {Component, OnInit} from '@angular/core';

import * as _ from "lodash";
import {RealtyObjService} from "../services/realty-obj.service";
import {RealtyObj} from "../domain/realty-obj";

@Component({
  selector: 'realty-objs-gallery',
  templateUrl: './realty-objs-gallery.component.html',
  styleUrls: ['./realty-objs-gallery.component.css']
})
export class RealtyObjsGalleryComponent implements OnInit {
  public currentRealtyObjects = [];
  public filter: any;
  public pageable: any;

  public initialFilter: any = {
    price: {
      ge: 0.0,
      le: 1000000.0
    },
    city: {
      like: ""
    },
    street: {
      like: ""
    }
  };
  public initialPageable: any = {
    page: 0,
    size: 12
  };

  constructor(private realtyObjService: RealtyObjService) {
  }

  ngOnInit() {
    this.resetFiltersAndPageable();
    this.loadObjects();
  }

  public loadObjects() {
    this.currentRealtyObjects = [];
    this.pageable = _.cloneDeep(this.initialPageable);
    this.loadNextObjects();
  }

  public loadNextObjects() {
    this.realtyObjService.findByFilterAndPage(this.filter, this.pageable).subscribe((response: any) => {
      let realtyObjects: RealtyObj[] = response.content;
      realtyObjects.forEach(value => {
        value.mainPhotoPath = RealtyObj.getMainPhoto(value);
      });
      this.currentRealtyObjects.push(...realtyObjects);
      ++this.pageable.page;
    });
  }

  public resetFiltersAndPageable() {
    this.filter = _.cloneDeep(this.initialFilter);
    this.pageable = _.cloneDeep(this.initialPageable);
  }
}
