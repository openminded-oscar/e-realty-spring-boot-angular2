import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {AddressByGeolocation, Geolocation} from '../app-models/geolocation';

import {endpoints} from '../commons';
import {HTTP_CONSTANTS} from './common/HttpErrorInterceptor';
import {CityOnMap, Region} from '../app-models/city-on-map';

@Injectable({providedIn: 'root'})
export class AddressService {
    private cachedRegions: CityOnMap[] = [];
    private observableAddresses = new Subject;

    constructor(private http: HttpClient) {
    }

    public supportedRegions(forceRefresh?: boolean): Observable<CityOnMap[]> {
        if (this.cachedRegions.length && !forceRefresh) {
            return of(this.cachedRegions);
        }
        return this.http.get<Region[]>(endpoints.supportedRegions)
            .pipe(
                map(r => r.map(r => ({
                        id: r.id,
                        name: r.name,
                        lat: r.centerLatitude,
                        lng: r.centerLongitude
                    } as CityOnMap))
                ),
                tap((r: CityOnMap[]) => this.cachedRegions = r)
            );
    }

    public getAddressesByLatLong(geo: Geolocation): Observable<AddressByGeolocation> {
        const params = new HttpParams()
            .set('lat', geo.lat.toString())
            .set('lng', geo.lng.toString());

        return this.http.get<AddressByGeolocation>(endpoints.addressesByCoordinates, {
            params: params,
            headers: {[HTTP_CONSTANTS.SKIP_ERROR_INTERCEPTOR_HEADER]: 'true'}
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
