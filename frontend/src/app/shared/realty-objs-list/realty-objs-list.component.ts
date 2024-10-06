import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RealtyObj} from '../../domain/realty-obj';
import {UserService} from '../../services/user.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'realty-objs-list',
  templateUrl: './realty-objs-list.component.html',
  styleUrls: ['../../realty-objs-gallery/realty-objs-gallery.component.scss', './realty-objs-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealtyObjsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  public currentRealtyObjects$ = new BehaviorSubject<RealtyObj[]>([]);
  public currentUserObjects: RealtyObj[];

  @Input()
  set realtyObjects(value: RealtyObj[]) {
    this.currentRealtyObjects$.next(value);
  }

  public trackById(index: number, obj: RealtyObj): number {
    return obj.id;
  }

  constructor(public userService: UserService,
              public cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    combineLatest([
      this.userService.user$,
      this.currentRealtyObjects$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([user, currentObjects]) => {
      if (user && currentObjects?.length) {
        this.currentUserObjects = user.realtyObjects;
      } else {
        this.currentUserObjects = [];
      }
      this.cdr.detectChanges();
    });
  }

  public isMyObject(realtyObject: RealtyObj) {
    const id = realtyObject.id;
    if (this.currentUserObjects) {
      const object = this.currentUserObjects.find((obj) => obj.id === id);
      return !!object;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
