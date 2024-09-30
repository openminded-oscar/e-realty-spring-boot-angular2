import {Component, OnDestroy, OnInit} from '@angular/core';

import * as _ from 'lodash';
import {BackendSupportedOperations, PageableResponse, RealtyObjService} from '../services/realty-obj.service';
import {RealtyObj} from '../domain/realty-obj';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime, takeUntil} from 'rxjs/operators';

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
  public targetOperation: string;
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
      this.targetOperation = BackendSupportedOperations.RENT;
    } else {
      this.targetOperation = BackendSupportedOperations.BUY;
    }
  }

  public loadInitialObjects() {
    this.currentRealtyObjects = [];
    this.pageable = _.cloneDeep(this.initialPageable);
    this.loadNextObjects();
  }

  public loadNextObjects() {
    this.realtyObjService.findByFilterAndPage(this.currentFilter, this.pageable)
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
