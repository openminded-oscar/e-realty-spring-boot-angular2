import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {RealtyObj} from '../domain/realty-obj';
import {UserService} from '../services/user.service';

@Component({
  selector: 'realty-objs-list',
  templateUrl: './realty-objs-list.component.html',
  styleUrls: ['./realty-objs-gallery.component.scss', './realty-objs-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealtyObjsListComponent implements OnInit {
  @Input()
  public realtyObjects: RealtyObj[] = [];

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

  public trimDescription(fullDescr: string) {
    return fullDescr.substr(0, 75) + '...';
  }
}
