import {Component, Input, OnInit} from '@angular/core';
import {RealtyObj, RealtyObjectStatus} from '../../app-models/realty-obj';
import {RealtyObjService} from '../../app-services/realty-obj.service';
import {WindowService} from '../../app-services/window.service';
import {UserService} from '../../app-services/user.service';
import {takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-realty-status-editor',
  templateUrl: './realty-status.component.html',
  styleUrls: ['./realty-status.component.scss']
})
export class RealtyStatusComponent implements OnInit {
  @Input()
  public realtyObject: RealtyObj;
  protected readonly RealtyObjectStatus = RealtyObjectStatus;
  private destroy$ = new Subject<boolean>();
  public isRealtorOrAdmin = false;

  public get shouldShowDropdown(): boolean {
    return (
      this.isRealtorOrAdmin ||
      this.realtyObject?.status !== RealtyObjectStatus.DRAFT // prevent change status by owners for just created object
    );
  }

  constructor(public realtyObjectService: RealtyObjService,
              public userService: UserService,
              public windowService: WindowService) {
  }

  ngOnInit(): void {
    this.userService.isAdmin$.pipe(
      takeUntil(this.destroy$),
      tap(value => {
        this.isRealtorOrAdmin = value;
      })
    ).subscribe();
    this.userService.isRealtor$.pipe(
      takeUntil(this.destroy$),
      tap(value => {
        this.isRealtorOrAdmin = value;
      })
    ).subscribe();
  }

  public activateObject(realtyObject: RealtyObj) {
    this.realtyObjectService.activate(realtyObject)
      .subscribe(() => {
        this.refreshPage();
      });
  }

  public archiveObject(realtyObject: RealtyObj) {
    this.realtyObjectService.archive(realtyObject)
      .subscribe(() => {
        this.refreshPage();
      });
  }

  public restoreObject(realtyObject: RealtyObj) {
    this.realtyObjectService.restore(realtyObject)
      .subscribe(() => {
        this.refreshPage();
      });
  }

  public refreshPage() {
    this.windowService.nativeWindow?.location.reload();
  }
}
