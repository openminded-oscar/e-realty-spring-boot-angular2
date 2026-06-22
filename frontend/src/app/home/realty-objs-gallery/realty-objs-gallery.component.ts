import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {Router} from '@angular/router';
import {BehaviorSubject, Observable, take} from 'rxjs';
import {debounceTime, tap} from 'rxjs/operators';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as _ from 'lodash';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RealtyObjService} from '../../app-services/realty-obj.service';
import {RealtyObj} from '../../app-models/realty-obj';
import {ConfigService, OPERATION_TYPES} from '../../app-services/config.service';
import {UserService} from '../../app-services/user.service';
import {RealtyObjsListComponent} from '../../shared/realty-objs-list/realty-objs-list.component';
import {WindowService} from '../../app-services/window.service';
import {GeolocationWidgetModalComponent} from './geolocation-widget-modal/geolocation-widget-modal.component';
import {CityOnMap} from '../../app-models/city-on-map';
import {AddressService} from '../../app-services/address.service';
import {LVIV_COORDINATES} from '../../utils/location-utils';


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
export class RealtyObjsGalleryComponent implements OnInit {
    private destroyRef = inject(DestroyRef);
    public filterForm: FormGroup;
    public supportedRegions: CityOnMap[] = [];
    public ALL_REGIONS_ID = 0;

    public readonly INITIAL_FILTER_FORM = {
        priceMin: ['0'],
        priceMax: ['1000000'],
        region: [this.ALL_REGIONS_ID],// all regions
        city: [''],
        street: [''],
        roomsAmount: [''],
        description: [''],
        buildingType: [''],
        totalAreaMin: [''],
        totalAreaMax: ['']
    };
    @ViewChild(RealtyObjsListComponent)
    public listComponent: RealtyObjsListComponent;
    public pageable: any;
    public buildingTypes: string[];
    public showNotificaton = false;
    public currentRealtyObjectsPortion = new BehaviorSubject<RealtyObj[]>([]);
    public currentObjectsPortion$: Observable<RealtyObj[]> = this.currentRealtyObjectsPortion.asObservable();
    public targetOperation: OPERATION_TYPES;
    public readonly initialPageable: any = {
        page: 0,
        size: 12
    };
    public FILTER_DEBOUNCE_TIME = 1000;
    public selectedOrderingOption: SortField = {
        display: 'Recent',
        field: 'updatedAt',
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
    }];
    public isFilterCollapsed = false;
    private lastPage = false;

    constructor(
        public realtyObjService: RealtyObjService,
        public userService: UserService,
        public config: ConfigService,
        public router: Router,
        public ngbModal: NgbModal,
        public fb: FormBuilder,
        public windowService: WindowService,
        public addressService: AddressService
    ) {
    }

    public ngOnInit() {
        this.isFilterCollapsed = this.windowService.nativeWindow?.innerWidth < 576;
        this.addressService.supportedRegions()
            .pipe(
                tap(regions => this.supportedRegions = regions),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
        this.resolveTargetOperations();
        this.buildingTypes = this.config.supportedBuildingTypes;
        this.resetFiltersAndLoadInitialObjects();
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
        this.realtyObjService.findByFilterAndPage(
            this.getFilterValue(),
            this.getSortValue(),
            this.pageable,
            this.targetOperation
        ).pipe(
            take(1),
            debounceTime(this.FILTER_DEBOUNCE_TIME),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(objectsPage => {
            this.lastPage = objectsPage.last;
            this.showNotificaton = true;
            this.currentRealtyObjectsPortion.next([
                ...objectsPage.content
            ]);
            ++this.pageable.page;
        });
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

    public openRealtyOnMapWidget(regionId: number): void {
        const realtyOnMap: NgbModalRef = this.ngbModal.open(GeolocationWidgetModalComponent);
        realtyOnMap.componentInstance.initialLocation =
            this.supportedRegions.find(r => r.id === Number(regionId)) ?? LVIV_COORDINATES;
        realtyOnMap.componentInstance.zoomLevel = 10;
    }

    public onRegionChange() {
        this.loadInitialObjects();
    }

    private resolveTargetOperations() {
        if (this.router.url.endsWith('/rent')) {
            this.targetOperation = OPERATION_TYPES.RENT;
        } else {
            this.targetOperation = OPERATION_TYPES.SELLING;
        }
    }

    private getFilterValue() {
        const formValues = this.filterForm.value;
        const priceFilter = this.targetOperation === OPERATION_TYPES.SELLING ? {
            price: {ge: formValues.priceMin, le: formValues.priceMax},
        } : {
            priceForRent: {ge: formValues.priceMin, le: formValues.priceMax},
        };

        return {
            ...priceFilter,
            ...formValues.region && Number(formValues.region) !== this.ALL_REGIONS_ID ? {
                region: {eq: formValues.region},
            } : {},
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
}
