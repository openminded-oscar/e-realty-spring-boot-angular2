import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {User} from '../../app-models/user';
import {UserService} from '../../app-services/user.service';
import {filterByObjectStatus, RealtyObj, RealtyObjectByStatusFilter} from '../../app-models/realty-obj';

@Component({
    selector: 'app-user-objects',
    templateUrl: './user-objects.component.html',
    styleUrls: ['./user-objects.component.scss']
})
export class UserObjectsComponent implements OnInit {
    public user: User;
    public allUserRealtyObjects = [];
    public filter: RealtyObjectByStatusFilter = 'all';
    public filteredObjects: RealtyObj[] = [];
    private destroyRef = inject(DestroyRef);

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService.user$.pipe(
            takeUntilDestroyed(this.destroyRef),
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
}
