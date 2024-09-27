import {Component, OnDestroy, OnInit} from '@angular/core';

import * as _ from 'lodash';
import {PageableResponse, RealtyObjService} from '../services/realty-obj.service';
import {RealtyObj} from '../domain/realty-obj';
import {ConfigService} from '../services/config.service';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'realty-objs-gallery',
  templateUrl: './realty-objs-gallery.component.html',
  styleUrls: ['./realty-objs-gallery.component.scss']
})
export class RealtyObjsGalleryComponent implements OnInit, OnDestroy {

  constructor(public realtyObjService: RealtyObjService,
              public userService: UserService,
              public config: ConfigService,
              public router: Router,
              ) {
  }
  public currentRealtyObjects = [];
  public filter: any;
  public pageable: any;
  public buildingTypes: string[];
  public showNotificaton = false;

  private destroy$ = new Subject<boolean>();

  public initialFilter: any = {
    price: {
      ge: '0',
      le: '1000000'
    },
    city: {
      like: ''
    },
    street: {
      like: ''
    },
    roomsAmount: {
      eq: ''
    },
    description: {
      like: ''
    },
    buildingType: {
      eq: ''
    },
    totalArea: {
      ge: '',
      le: ''
    }
  };

  targetOperation: string;

  public initialPageable: any = {
    page: 0,
    size: 12
  };

  public FILTER_DEBOUNCE_TIME = 1000;
  public selectedOrderingOption: string;
  public orderingOptions = ['Address', 'Price', 'Area'];

  ngOnInit() {
    this.resolveTargetOperations();
    this.buildingTypes = this.config.supportedBuildingTypes;
    this.resetFiltersAndPageable();
    this.loadInitialObjects();
  }

  private resolveTargetOperations() {
    if (this.router.url.toUpperCase().endsWith('RENT')) {
      this.targetOperation = 'RENT';
    } else {
      this.targetOperation = 'SELLING';
    }
  }

  public loadInitialObjects() {
    this.currentRealtyObjects = [];
    this.pageable = _.cloneDeep(this.initialPageable);
    this.loadNextObjects();
  }

  public loadNextObjects() {
    this.realtyObjService.findByFilterAndPage(this.filter, this.pageable)
      .pipe(
        debounceTime(this.FILTER_DEBOUNCE_TIME),
        takeUntil(this.destroy$)
      )
      .subscribe((response: PageableResponse<RealtyObj>) => {
      this.showNotificaton = true;
      const realtyObjects: RealtyObj[] = response.content;
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
    this.router.navigateByUrl('/sell').then();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public selectOrderingOption(option: string) {
    this.selectedOrderingOption = option;
    alert('Ordering not yet implemented');
  }

  public onScroll() {
    this.loadNextObjects();
  }
}
