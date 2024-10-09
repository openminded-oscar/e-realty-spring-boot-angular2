import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {endpoints} from '../commons';
import {ReplaySubject, Subject} from 'rxjs';

@Injectable()
export class AddressService {
  private observableAddresses = new Subject;
  private observableCities = new ReplaySubject(1);

  constructor(private http: HttpClient) {
  }

  public getAddressesByTerm(term: string, lat: number, lng: number) {
    term = term.trim();

    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('term', term);
    this.http.get(endpoints.addressesNearby, {params: params}).subscribe(
      (data: any[]) => {
        data = data.map(data => data.description);
        this.observableAddresses.next(data);
      }, error => {
        this.observableAddresses.error(error);
        this.observableAddresses = new ReplaySubject(1);
      });

    return this.observableAddresses;
  }

  public getSupportedCities(forceRefresh?: boolean) {
    this.http.get(endpoints.supportedCities).subscribe(
      data => {
        this.observableCities.next(data);
      }, error => {
        this.observableCities.error(error);
        this.observableCities = new ReplaySubject(1);
      }
    );

    return this.observableCities;
  }
}
