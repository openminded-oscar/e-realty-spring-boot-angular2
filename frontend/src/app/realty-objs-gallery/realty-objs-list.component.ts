import {Component, Input, OnInit} from '@angular/core';
import {RealtyObj} from "../domain/realty-obj";

@Component({
  selector: 'realty-objs-list',
  templateUrl: './realty-objs-list.component.html',
  styleUrls: ['./realty-objs-gallery.component.css']
})
export class RealtyObjsListComponent implements OnInit {
  @Input()
  public realtyObjects:RealtyObj[] = [];

  constructor() { }

  ngOnInit() {
  }

  trimDescription(fullDescr) {
    return fullDescr.substr(0, 75) + '...';
  }
}
