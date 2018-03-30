import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {webServiceEndpoint} from "./commons";
import "rxjs/add/observable/of";
import {ReplaySubject} from "rxjs/ReplaySubject";

@Injectable()
export class AddressService {
  private addressesNearbyUrl: string = webServiceEndpoint + "/addresses/addresses-nearby";
  private supportedCitiesUrl: string = webServiceEndpoint + "/addresses/cities-supported";

  private observableAddresses = new ReplaySubject(1);
  private observableCities = new ReplaySubject(1);

  constructor(private http: HttpClient) {
  }

  public getAddressesByTerm(term: string, lat: number, lng: number) {
    term = term.trim();
    if (!this.observableAddresses.observers.length) {
      let params = new HttpParams()
        .set("lat", lat.toString())
        .set("lng", lng.toString())
        .set("term", term);
      this.http.get(this.addressesNearbyUrl, {params: params}).subscribe(
        (data:any[]) => {
          data = data.map(data => data.description);
          this.observableAddresses.next(data);
        }, error => {
          this.observableAddresses.error(error);
          this.observableAddresses = new ReplaySubject(1);
        });
    }

    return this.observableAddresses;
  }

  public getSupportedCities(forceRefresh?: boolean) {
    this.http.get(this.supportedCitiesUrl).subscribe(
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
