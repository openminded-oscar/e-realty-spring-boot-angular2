import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RealtyObj} from '../domain/realty-obj';
import {UserService} from '../services/user.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'realty-objs-list',
  templateUrl: './realty-objs-list.component.html',
  styleUrls: ['./realty-objs-gallery.component.scss', './realty-objs-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealtyObjsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  public currentUserObjects: RealtyObj[];

  @Input()
  public realtyObjects: RealtyObj[] = [];
  public trackById(index: number, obj: RealtyObj): number {
    return obj.id;
  }

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.user$.pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUserObjects = user.realtyObjects;
        } else {
          this.currentUserObjects = [];
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
