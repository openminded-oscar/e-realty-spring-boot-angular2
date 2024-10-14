import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';
import {RealtyObj} from '../../domain/realty-obj';
import {Subject} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'realty-objs-list',
  templateUrl: './realty-objs-list.component.html',
  styleUrls: ['../../realty-objs-gallery/realty-objs-gallery.component.scss', './realty-objs-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealtyObjsListComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  public realtyObjects$ = new BehaviorSubject<RealtyObj[]>([]);
  @Input()
  set realtyObjectsPortion(values: RealtyObj[]) {
    const currentValues = [...this.realtyObjects$.value, ...(values?.length ? values : [])];
    this.realtyObjects$.next(currentValues);
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
