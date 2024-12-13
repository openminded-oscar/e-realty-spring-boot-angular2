import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {User} from '../../app-models/user';
import {UserService} from '../../app-services/user.service';
import {filterByObjectStatus, RealtyObj, RealtyObjectByStatusFilter} from '../../app-models/realty-obj';

@Component({
    selector: 'app-user-objects',
    templateUrl: './user-objects.component.html',
    styleUrls: ['./user-objects.component.scss']
})
export class UserObjectsComponent implements OnInit, OnDestroy {
    public user: User;
    public allUserRealtyObjects = [];
    public filter: RealtyObjectByStatusFilter = 'all';
    public filteredObjects: RealtyObj[] = [];
    private destroy$ = new Subject<boolean>();

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService.user$.pipe(
            takeUntil(this.destroy$),
        ).subscribe(
            user => {
                this.user = user;
                this.allUserRealtyObjects = user?.realtyObjects ?? [];
                this.applyFilter();
            }
        );
    }

    public setFilter(filterSelected: RealtyObjectByStatusFilter) {
        this.filter = filterSelected;
        this.applyFilter();
    }


    public applyFilter(): void {
        this.filteredObjects = filterByObjectStatus(this.allUserRealtyObjects, this.filter)
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
