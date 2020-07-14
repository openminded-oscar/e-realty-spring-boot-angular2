import {Component, OnInit} from "@angular/core";
import { Observable } from 'rxjs';

import {of} from "rxjs/observable/of";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/merge";

import {AddressService} from "../services/address.service";
import {ConfigService} from "../services/config.service";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'address-input',
  templateUrl: './address-input.component.html',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: AddressInputComponent, multi: true}
  ]
})
export class AddressInputComponent implements OnInit, ControlValueAccessor {
  // Used for input with autocomplete
  private searching = false;
  private searchFailed = false;
  private hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  // Used for input propagation
  public formControl = new FormControl();

  public constructor(public addressService: AddressService, public config: ConfigService) {
  }

  public ngOnInit() {
  }

  public searchAddressForTerm = (text$: Observable<string>) => {
    return (<any>text$
      .debounceTime(300))
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.addressService.getAddressesByTerm(term, this.config.userRegion.lat, this.config.userRegion.lng)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
  }

  public selectedItemFromAutocomplete(value){
    this.onInputUpdated(value.item);
  }

  public onInputUpdated(value){
    return value;
  }

  writeValue(value: any) {
    this.formControl.setValue(value);
  }

  registerOnChange(fn: (value: any) => void) {
    this.onInputUpdated = fn;
  }

  registerOnTouched() {}
}
