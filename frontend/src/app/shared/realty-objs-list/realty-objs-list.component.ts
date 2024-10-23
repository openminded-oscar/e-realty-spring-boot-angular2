import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';
import {RealtyObj} from '../../app-models/realty-obj';
import {BehaviorSubject, Subject} from 'rxjs';
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
export class RealtyObjsListComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();
  @Input()
  public showCreatedAt = false;
  public realtyObjects$ = new BehaviorSubject<RealtyObj[]>([]);

  @Input()
  set realtyObjectsPortion(values: RealtyObj[]) {
    if (values?.length) {
      const existingIds = new Set(this.realtyObjects$.value.map(obj => obj.id));
      const uniqueValues = values.filter(value => !existingIds.has(value.id));
      const currentValues = [...this.realtyObjects$.value, ...uniqueValues];
      this.realtyObjects$.next(currentValues);
    } else {
      this.realtyObjects$.next([]);
    }
  }

  public trackById(index: number, obj: RealtyObj): number {
    return obj.id;
  }

  constructor(public userService: UserService) {
  }

  public resetObjects() {
    this.realtyObjectsPortion = [];
    this.realtyObjects$.next([]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
