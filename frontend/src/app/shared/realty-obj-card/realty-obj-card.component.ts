import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RealtyObj, RealtyObjectStatus} from '../../app-models/realty-obj';
import {combineLatest, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UserService} from '../../app-services/user.service';
import {RealtyObjService} from '../../app-services/realty-obj.service';

@Component({
  selector: 'app-realty-obj-card',
  templateUrl: './realty-obj-card.component.html',
  styleUrls: ['./realty-obj-card.component.scss']
})
export class RealtyObjCardComponent implements OnInit, OnDestroy {
  @Input()
  public set realtyObject(value: RealtyObj) {
    this._realtyObject = value;
  }
  public get realtyObject(): RealtyObj {
    return this._realtyObject;
  }

  constructor(private userService: UserService,
              private cdr: ChangeDetectorRef) {
  }
  private destroy$ = new Subject<boolean>();
  public isMyObject: boolean;
  private _realtyObject: RealtyObj;
  @Input()
  public showCreatedAt = false;
  @Input()
  showManageStatusOptions = false;
  public currentUserObjects: RealtyObj[];
  public RealtyObjectStatus = RealtyObjectStatus;

  protected readonly RealtyObj = RealtyObj;

  ngOnInit(): void {
    combineLatest([
      this.userService.user$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([user]) => {
      if (user) {
        this.currentUserObjects = user.realtyObjects;
      } else {
        this.currentUserObjects = [];
      }
      this.isMyObject = !!this.currentUserObjects?.find((obj) => obj.id === this.realtyObject.id);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
