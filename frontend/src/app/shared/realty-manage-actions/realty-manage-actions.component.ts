import {Component, Input, OnInit} from '@angular/core';
import {RealtyObj, RealtyObjectStatus} from '../../app-models/realty-obj';
import {RealtyObjService} from '../../app-services/realty-obj.service';

@Component({
  selector: 'app-realty-manage-actions',
  templateUrl: './realty-manage-actions.component.html',
  styleUrls: ['./realty-manage-actions.component.scss']
})
export class RealtyManageActionsComponent implements OnInit {
  protected readonly RealtyObjectStatus = RealtyObjectStatus;

  @Input()
  public realtyObject: RealtyObj;

  constructor(public realtyObjectService: RealtyObjService) { }

  ngOnInit(): void {
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
    window.location.reload();
  }
}
