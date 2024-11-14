import {Component, Input, OnInit} from '@angular/core';
import {RealtyObj, RealtyObjectStatus} from '../../app-models/realty-obj';
import {RealtyObjService} from '../../app-services/realty-obj.service';
import {WindowService} from '../../app-services/window.service';
import {UserService} from '../../app-services/user.service';
import {takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageModalComponent} from '../message-modal/message-modal.component';

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

  constructor(public realtyObjectService: RealtyObjService,
              public userService: UserService,
              public dialogService: NgbModal,
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
    if (this.isRealtorOrAdmin) {
      this.realtyObjectService.activate(realtyObject)
        .subscribe(() => {
          this.refreshPage();
        });
    } else {
      const confirmation = this.dialogService.open(MessageModalComponent);
      confirmation.componentInstance.message = `
      Object is waiting to be reviewed by admin or realtor within few hours.
       `;
    }
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
