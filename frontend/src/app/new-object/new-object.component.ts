import {Component, OnInit} from '@angular/core';
import {AddressService} from "../services/address.service";
import {CityOnMap} from "../domain/domain";


@Component({
  selector: 'new-object',
  templateUrl: './new-object.component.html',
  styleUrls: ['./new-object.component.css']
})
export class NewObjectComponent implements OnInit {
  public constructor() {
  }

  public ngOnInit() {
  }
}
