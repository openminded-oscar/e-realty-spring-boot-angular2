import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {BackendSupportedOperations, RealtyObjService} from '../services/realty-obj.service';
import {RealtyObj} from '../domain/realty-obj';
import {ConfigService} from '../services/config.service';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime, map, takeUntil, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';
import {RealtyObjsListComponent} from '../shared/realty-objs-list/realty-objs-list.component';

export interface SortValue {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SortField {
  display: string;
  field: string;
}

@Component({
  selector: 'realty-objs-gallery',
  templateUrl: './realty-objs-gallery.component.html',
  styleUrls: ['./realty-objs-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealtyObjsGalleryComponent implements OnInit, OnDestroy {
  public filterForm: FormGroup;
  public readonly DEFAULT_CITY = 'Lviv';
  public readonly INITIAL_FILTER_FORM = {
    priceMin: ['0'],
    priceMax: ['1000000'],
    city: [this.DEFAULT_CITY],
    street: [''],
    roomsAmount: [''],
    description: [''],
    buildingType: [''],
    totalAreaMin: [''],
    totalAreaMax: ['']
  };
  private lastPage = false;

  @ViewChild(RealtyObjsListComponent)
  public listComponent: RealtyObjsListComponent;

  constructor(public realtyObjService: RealtyObjService,
              public userService: UserService,
              public config: ConfigService,
              public router: Router,
              public fb: FormBuilder,
  ) {
  }

  public pageable: any;
  public buildingTypes: string[];
  public showNotificaton = false;

  private destroy$ = new Subject<boolean>();

  public currentObjectsPortion$: Observable<RealtyObj[]>;

  public targetOperation: string;

  public readonly initialPageable: any = {
    page: 0,
    size: 12
  };

  public currentRealtyObjectsPortion = new BehaviorSubject<RealtyObj[]>([]);

  public FILTER_DEBOUNCE_TIME = 1000;
  public selectedOrderingOption: SortField = {
    display: 'Price',
    field: 'price',
  };
  public selectedOrderingDirection: 'asc' | 'desc' = 'desc';
  public orderingOptions: SortField[] = [{
    display: 'Recent',
    field: 'updatedAt',
  }, {
    display: 'Price',
    field: 'price',
  }, {
    display: 'Area',
    field: 'totalArea',
  }, {
    display: 'City',
    field: 'address.city',
  }];

  ngOnInit() {
    this.resolveTargetOperations();
    this.buildingTypes = this.config.supportedBuildingTypes;
    this.resetFiltersAndLoadInitialObjects();
  }

  private resolveTargetOperations() {
    if (this.router.url.endsWith('/rent')) {
      this.targetOperation = BackendSupportedOperations.RENT;
    } else {
      this.targetOperation = BackendSupportedOperations.BUY;
    }
  }

  public resetFiltersAndLoadInitialObjects() {
    this.filterForm = this.fb.group(this.INITIAL_FILTER_FORM);
    this.loadInitialObjects();
  }

  public loadInitialObjects() {
    this.currentRealtyObjectsPortion.next([]);
    this.pageable = _.cloneDeep(this.initialPageable);
    if (this.listComponent) {
      this.listComponent.resetObjects();
    }

    this.loadNextObjects();
  }

  public loadNextObjects() {
    this.currentObjectsPortion$ = this.realtyObjService.findByFilterAndPage(
      this.getFilterValue(),
      this.getSortValue(),
      this.pageable
    ).pipe(
      debounceTime(this.FILTER_DEBOUNCE_TIME),
      tap(objects => {
        this.lastPage = objects.last;
        this.showNotificaton = true;
        this.currentRealtyObjectsPortion.next([
          ...objects.content
        ]);
        ++this.pageable.page;
      }),
      map(o => this.currentRealtyObjectsPortion.value),
      takeUntil(this.destroy$)
    );
  }

  public selectOrderingOption(option: SortField) {
    this.selectedOrderingOption = option;
    this.loadInitialObjects();
  }

  public toggleOrderingDirection() {
    this.selectedOrderingDirection = this.selectedOrderingDirection === 'asc' ? 'desc' : 'asc';
    this.loadInitialObjects();
  }

  public onScroll() {
    if (!this.lastPage) {
      this.loadNextObjects();
    }
  }

  private getFilterValue() {
    const formValues = this.filterForm.value;
    return {
      price: {ge: formValues.priceMin, le: formValues.priceMax},
      city: {like: formValues.city},
      street: {like: formValues.street},
      roomsAmount: {eq: formValues.roomsAmount},
      description: {like: formValues.description},
      buildingType: {eq: formValues.buildingType},
      totalArea: {ge: formValues.totalAreaMin, le: formValues.totalAreaMax},
      targetOperations: {operationTypeContains: this.targetOperation}
    };
  }

  private getSortValue(): SortValue {
    return {
      field: this.selectedOrderingOption.field,
      direction: this.selectedOrderingDirection,
    };
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
