import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

import {AddressService} from "../address.service";



@Component({
  selector: 'new-object',
  templateUrl: './new-object.component.html',
  styleUrls: ['./new-object.component.css']
})
export class NewObjectComponent implements OnInit {
  public currentQuery: string = '';
  public currentCity: any;

  private searching = false;
  private searchFailed = false;
  private hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  public constructor(public addressService: AddressService) {
  }

  public ngOnInit() {

  }

  public search = (text$: Observable<string>) => {
    return text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.addressService.getAddressesByTerm(term, 10, 1)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
  }
}
