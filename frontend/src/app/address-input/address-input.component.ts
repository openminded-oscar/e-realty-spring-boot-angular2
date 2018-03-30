import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";

import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

import {AddressService} from "../services/address.service";
import {CityOnMap} from "../domain/domain";

@Component({
  selector: 'address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.css']
})
export class AddressInputComponent implements OnInit {
  public currentQuery: string = '';
  public currentCity: CityOnMap = {"name": "Львів", "lat": 49.8430008, "lng": 24.0215309};
  public baseCities: CityOnMap[] = [];

  private searching = false;
  private searchFailed = false;
  private hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  public constructor(public addressService: AddressService) {
  }

  public ngOnInit() {
    this.addressService.getSupportedCities().subscribe((data:CityOnMap[]) => {
      this.baseCities = data;
    });
  }

  public searchAddressForTerm = (text$: Observable<string>) => {
    return (<any>text$
      .debounceTime(300))
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.addressService.getAddressesByTerm(term, this.currentCity.lat, this.currentCity.lng)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
  }
}
