import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {RealtyObj} from '../../app-models/realty-obj';
import {UserService} from '../../app-services/user.service';

@Component({
    selector: 'realty-objs-list',
    templateUrl: './realty-objs-list.component.html',
    styleUrls: [
        '../../home/realty-objs-gallery/realty-objs-gallery.component.scss',
        './realty-objs-list.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealtyObjsListComponent {
    @Input()
    public showCreatedAt = false;
    @Input()
    public showManageStatusOptions = false;
    @Input()
    public displayMode: 'accumulateByPortion' | 'reset' = 'accumulateByPortion';

    public realtyObjects$ = new BehaviorSubject<RealtyObj[]>([]);

    constructor(public userService: UserService) {
    }

    @Input()
    set realtyObjectsPortion(newValues: RealtyObj[]) {
        if (this.displayMode === 'reset') {
            this.realtyObjects$.next(newValues);
        } else {
            const existingIds = new Set(this.realtyObjects$.value.map(obj => obj.id));
            const uniqueValues = newValues.filter(value => !existingIds.has(value.id));
            const currentValues = [...this.realtyObjects$.value, ...uniqueValues];
            this.realtyObjects$.next(currentValues);
        }
    }

    public trackById(index: number, obj: RealtyObj): number {
        return obj.id;
    }

    public resetObjects() {
        this.realtyObjectsPortion = [];
        this.realtyObjects$.next([]);
    }
}
