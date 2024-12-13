import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RealtyObjectByStatusFilter} from '../../../app-models/realty-obj';
import {ReviewFilter} from '../../../app-models/review';

@Component({
    selector: 'app-objects-in-profile-filter',
    templateUrl: './objects-in-profile-filter.component.html',
    styleUrl: './objects-in-profile-filter.component.scss'
})
export class ObjectsInProfileFilterComponent {
    @Output()
    public filterChanged = new EventEmitter<RealtyObjectByStatusFilter>();
    @Input()
    public filter: RealtyObjectByStatusFilter;

    public setFilter(filterValue: RealtyObjectByStatusFilter) {
        this.filter = filterValue;
        this.filterChanged.emit(filterValue);
    }
}
