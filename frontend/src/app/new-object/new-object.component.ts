import { Component, OnInit } from '@angular/core';
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
  constructor(public addressService: AddressService) { }

  ngOnInit() {
  }

  public addressQuery: string = '';

  public searchAddress = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : this.addressService.getAddressesByQuery("").filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
}
