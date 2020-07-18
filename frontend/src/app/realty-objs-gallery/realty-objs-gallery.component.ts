import {Component, OnDestroy, OnInit} from '@angular/core';

import * as _ from "lodash";
import {RealtyObjService} from "../services/realty-obj.service";
import {RealtyObj} from "../domain/realty-obj";
import {ConfigService} from "../services/config.service";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {SampleSocketService} from "../services/socket/sample-socket.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'realty-objs-gallery',
  templateUrl: './realty-objs-gallery.component.html',
  styleUrls: ['./realty-objs-gallery.component.scss']
})
export class RealtyObjsGalleryComponent implements OnInit, OnDestroy {
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

  targetOperation: string;

  public initialPageable: any = {
    page: 0,
    size: 12
  };

  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
  }

  private socketSubscription: Subscription;

  constructor(private realtyObjService: RealtyObjService,
              private userService: UserService,
              private config: ConfigService,
              private socketService: SampleSocketService,
              private router: Router,
              ) {
  }

  ngOnInit() {
    this.resolveTargetOperations();
    this.buildingTypes = this.config.supportedBuildingTypes;
    this.resetFiltersAndPageable();
    this.loadObjects();

    this.socketSubscription = this.socketService.currentDocument.subscribe(object => console.log(JSON.stringify(object)));
  }

  private resolveTargetOperations() {
    if (this.router.url.toUpperCase().endsWith('RENT')) {
      this.targetOperation = 'RENT';
    } else {
      this.targetOperation = 'SELLING';
    }
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
    this.filter.targetOperations = {operationTypeContains: this.targetOperation};
    this.pageable = _.cloneDeep(this.initialPageable);
  }

  public addObject() {
    this.router.navigateByUrl('/sell');
  }

  public generateEvent() {
    this.socketService.generateObject();
  }
}
