import {Component, Input, OnInit} from '@angular/core';
import {RealtyObj, RealtyObjectStatus} from '../../app-models/realty-obj';
import {RealtyObjService} from '../../app-services/realty-obj.service';

@Component({
  selector: 'app-realty-status-editor',
  templateUrl: './realty-status.component.html',
  styleUrls: ['./realty-status.component.scss']
})
export class RealtyStatusComponent implements OnInit {
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
