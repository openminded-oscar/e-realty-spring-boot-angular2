import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {RealtorService} from '../../app-services/realtor.service';
import {filterByObjectStatus, RealtyObj, RealtyObjectByStatusFilter} from '../../app-models/realty-obj';


@Component({
    selector: 'app-realtor-objects',
    templateUrl: './realtor-objects.component.html',
    styleUrls: ['./realtor-objects.component.scss']
})
export class RealtorObjectsComponent implements OnInit, OnDestroy {
    public destroy$ = new Subject<boolean>();
    public allRealtorObjects: RealtyObj[] = [];
    public filter: RealtyObjectByStatusFilter = 'all';
    public filteredObjects: RealtyObj[] = [];

    constructor(public realtorService: RealtorService) {
    }

    ngOnInit(): void {
        this.realtorService.getMyAsRealtorObjects()
            .pipe(takeUntil(this.destroy$))
            .subscribe(objects => {
                this.allRealtorObjects = objects;
                this.applyFilter();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public applyFilter(): void {
        this.filteredObjects = filterByObjectStatus(this.allRealtorObjects, this.filter)
        debugger
    }

    public setFilter(filterSelected: RealtyObjectByStatusFilter) {
        this.filter = filterSelected;
        this.applyFilter();
    }
}
