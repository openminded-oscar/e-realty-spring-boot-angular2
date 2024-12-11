import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {RealtyObj, RealtyObjectStatus} from '../../app-models/realty-obj';
import {UserService} from '../../app-services/user.service';

@Component({
  selector: 'app-realty-obj-card',
  templateUrl: './realty-obj-card.component.html',
  styleUrls: ['./realty-obj-card.component.scss']
})
export class RealtyObjCardComponent implements OnInit, OnDestroy {
  private _realtyObject: RealtyObj;
  @Input()
  public set realtyObject(value: RealtyObj) {
    this._realtyObject = value;
  }

  public get realtyObject(): RealtyObj {
    return this._realtyObject;
  }

  @Input()
  public showCreatedAt = false;
  @Input()
  public showManageStatusOptions = false;
  public isMyObject: boolean;
  private destroy$ = new Subject<boolean>();

  protected readonly RealtyObj = RealtyObj;

  constructor(private userService: UserService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    combineLatest([
      this.userService.user$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([user]) => {
      let currentUserObjects = [];
      if (user) {
        currentUserObjects = user.realtyObjects;
      }
      this.isMyObject = !!currentUserObjects?.find((obj) => obj.id === this.realtyObject.id);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
