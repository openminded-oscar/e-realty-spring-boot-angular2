import {Component, OnInit} from '@angular/core';

import * as _ from "lodash";
import {RealtyObjService} from "../services/realty-obj.service";
import {RealtyObj} from "../domain/realty-obj";
import {ConfigService} from "../services/config.service";

@Component({
  selector: 'realty-objs-gallery',
  templateUrl: './realty-objs-gallery.component.html',
  styleUrls: ['./realty-objs-gallery.component.css']
})
export class RealtyObjsGalleryComponent implements OnInit {
  public currentRealtyObjects = [];
  public filter: any;
  public pageable: any;
  public buildingTypes: string[];
  public showNotificaton = false;

  public initialFilter: any = {
    price: {
      ge: "0",
      le: "1000000"
    },
    city: {
      like: ""
    },
    street: {
      like: ""
    },
    roomsAmount: {
      eq: ""
    },
    description: {
      like: ""
    },
    buildingType: {
      eq: ""
    },
    totalArea:{
      ge: "",
      le: ""
    }
  };
  public initialPageable: any = {
    page: 0,
    size: 12
  };

  constructor(private realtyObjService: RealtyObjService,
              private config: ConfigService) {
  }

  ngOnInit() {
    this.buildingTypes = this.config.supportedBuildingTypes;
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
      this.showNotificaton = true;
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
