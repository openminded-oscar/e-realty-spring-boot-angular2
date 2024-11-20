import {Component, OnDestroy, OnInit} from '@angular/core';

import * as _ from 'lodash';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {PageableResponse, RealtyObjService} from '../../app-services/realty-obj.service';
import {UserService} from '../../app-services/user.service';
import {OPERATION_TYPES} from '../../app-services/config.service';
import {RealtyObj} from '../../app-models/realty-obj';

export interface FilterRange {
  ge: string;
  le: string;
}

export interface FilterExact {
  eq: string;
}

export interface FilterLike {
  like: string;
}

export interface SortValue {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SortField {
  display: string;
  field: string;
}

export interface Filter {
  price: FilterRange;
  city: FilterLike;
  street: FilterLike;
  roomsAmount: FilterExact;
  description: FilterLike;
  buildingType: FilterExact;
  totalArea: FilterRange;
}

@Component({
  selector: 'realty-objs-gallery',
  templateUrl: './realty-objs-gallery.component.html',
  styleUrls: ['./realty-objs-gallery.component.scss']
})
export class RealtyObjsGalleryComponent implements OnInit, OnDestroy {
  public initialFilter: Filter = {
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

  constructor(public realtyObjService: RealtyObjService,
              public userService: UserService,
              public router: Router,
              public route: ActivatedRoute,
  ) {
  }

  public currentRealtyObjects = [];

  public order: string;
  public currentFilter: any;

  public pageable: any;

  public showNotificaton = false;
  public targetOperation: OPERATION_TYPES;
  public initialPageable: any = {
    page: 0,
    size: 12
  };

  public FILTER_DEBOUNCE_TIME = 1000;

  private destroy$ = new Subject<boolean>();

  ngOnInit() {
    this.resolveTargetOperations();

    this.currentFilter = _.cloneDeep(this.initialFilter);
    this.currentFilter.targetOperations = {operationTypeContains: this.targetOperation};
    this.pageable = _.cloneDeep(this.initialPageable);

    this.loadInitialObjects();
  }

  private resolveTargetOperations() {
    if (this.router.url.startsWith('/rent')) {
      this.targetOperation = OPERATION_TYPES.RENT;
    } else {
      this.targetOperation = OPERATION_TYPES.SELLING;
    }
  }

  public loadInitialObjects() {
    this.currentRealtyObjects = [];
    this.pageable = _.cloneDeep(this.initialPageable);
    this.loadNextObjects();
  }

  public loadNextObjects() {
    this.realtyObjService.findByFilterAndPage(
      this.currentFilter, this.pageable, this.pageable, this.targetOperation
    )
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

  public addObject() {
    this.router.navigateByUrl('/sell').then();
  }

  public onScroll() {
    this.loadNextObjects();
  }

  public filterChange(filter: Filter) {
    this.currentFilter = filter;
    this.loadInitialObjects();
  }

  public orderChange(order: string) {
    this.order = order;
    this.loadInitialObjects();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
