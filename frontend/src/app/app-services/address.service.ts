import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {AddressByGeolocation, Geolocation} from '../app-models/geolocation';

import {endpoints} from '../commons';
import {HTTP_CONSTANTS} from './common/HttpErrorInterceptor';
import {CityOnMap, supportedRegions} from '../app-models/city-on-map';

@Injectable({providedIn: 'root'})
export class AddressService {
  private observableAddresses = new Subject;
  private observableCities = new ReplaySubject(1);

  constructor(private http: HttpClient) {
  }

  public supportedRegions(forceRefresh?: boolean): Observable<CityOnMap[]> {
      return of(supportedRegions);
  }

  public getAddressesByLatLong(geo: Geolocation): Observable<AddressByGeolocation> {
    const params = new HttpParams()
      .set('lat', geo.lat.toString())
      .set('lng', geo.lng.toString());

    return this.http.get<AddressByGeolocation>(endpoints.addressesByCoordinates, {
      params: params,
      headers: {[HTTP_CONSTANTS.SKIP_INTERCEPTOR_HEADER]: 'true'}
    });
  }

  public getAddressesByTerm(term: string, lat: number, lng: number) {
    term = term.trim();

    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('term', term);
    this.http.get(endpoints.addressesNearby, {params: params}).subscribe({
      next: (data: any[]) => {
        data = data.map(item => item.description);
        this.observableAddresses.next(data);
      },
      error: (error) => {
        this.observableAddresses.error(error);
        this.observableAddresses = new ReplaySubject(1);
      }
    });

    return this.observableAddresses;
  }
}
