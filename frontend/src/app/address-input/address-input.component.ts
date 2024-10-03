import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, merge } from 'rxjs/operators';
import { AddressService } from '../services/address.service';
import { ConfigService } from '../services/config.service';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'address-input',
  templateUrl: './address-input.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: AddressInputComponent, multi: true }
  ]
})
export class AddressInputComponent implements OnInit, ControlValueAccessor {
  // Used for input with autocomplete
  private searching = false;
  private searchFailed = false;
  private hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  // Used for input propagation
  public formControl = new FormControl();

  public constructor(public addressService: AddressService, public config: ConfigService) {}

  public ngOnInit() {}

  public searchAddressForTerm = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.addressService.getAddressesByTerm(term, this.config.userRegion.lat, this.config.userRegion.lng).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => this.searching = false),
      merge(this.hideSearchingWhenUnsubscribed)
    );
  }

  public selectedItemFromAutocomplete(value: any) {
    this.onInputUpdated(value.item);
  }

  public onInputUpdated(value: any) {
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
