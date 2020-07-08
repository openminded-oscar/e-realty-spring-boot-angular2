import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import "rxjs/add/observable/of";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Subject} from "rxjs/Subject";
import {endpoints} from "../commons";

@Injectable()
export class AddressService {
  private observableAddresses = new Subject;
  private observableCities = new ReplaySubject(1);

  constructor(private http: HttpClient) {
  }

  public getAddressesByTerm(term: string, lat: number, lng: number) {
    term = term.trim();

    let params = new HttpParams()
      .set("lat", lat.toString())
      .set("lng", lng.toString())
      .set("term", term);
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
