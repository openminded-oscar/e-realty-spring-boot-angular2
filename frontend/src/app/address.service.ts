import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {webServiceEndpoint} from "./commons";

@Injectable()
export class AddressService {
  private addressesNearbyUrl: string = webServiceEndpoint + "/addresses-nearby";

  constructor(private http: HttpClient) {
  }

  public getAddressesByTerm(term: string, lat: number, lng: number) {
    term = term.trim();


    let params = new HttpParams()
      .set("lat", lat.toString())
      .set("lng", lng.toString())
      .set("term", term);

    return this.http.get(this.addressesNearbyUrl, {params: params});
  }
}
