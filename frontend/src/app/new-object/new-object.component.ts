import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {AddressService} from "../address.service";


@Component({
  selector: 'new-object',
  templateUrl: './new-object.component.html',
  styleUrls: ['./new-object.component.css']
})
export class NewObjectComponent implements OnInit {
  constructor(public addressService: AddressService) {
  }

  ngOnInit() {
    this.addressService.getAddressesByQuery("Hor").subscribe(
      data => {
        console.log(JSON.stringify(data))
      }, error => {
        console.log(JSON.stringify(error))
      });
    console.log("request executed");
  }

  public addressQuery: string = '';
}
