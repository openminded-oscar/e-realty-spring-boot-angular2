import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RealtorService} from '../../app-services/realtor.service';
import {filterByObjectStatus, RealtyObj, RealtyObjectByStatusFilter} from '../../app-models/realty-obj';


@Component({
    selector: 'app-realtor-objects',
    templateUrl: './realtor-objects.component.html',
    styleUrls: ['./realtor-objects.component.scss']
})
export class RealtorObjectsComponent implements OnInit {
    private destroyRef = inject(DestroyRef);
    public allRealtorObjects: RealtyObj[] = [];
    public filter: RealtyObjectByStatusFilter = 'all';
    public filteredObjects: RealtyObj[] = [];

    constructor(public realtorService: RealtorService) {
    }

    ngOnInit(): void {
        this.realtorService.getMyAsRealtorObjects()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(objects => {
                this.allRealtorObjects = objects;
                this.applyFilter();
            });
    }

    public applyFilter(): void {
        this.filteredObjects = filterByObjectStatus(this.allRealtorObjects, this.filter);
    }

    public setFilter(filterSelected: RealtyObjectByStatusFilter) {
        this.filter = filterSelected;
        this.applyFilter();
    }
}
