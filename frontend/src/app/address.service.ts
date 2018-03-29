import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class AddressService {
  private googlePlaceAutocompleteUrl: string = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

  constructor(private http: HttpClient) {
  }

  public getAddressesByQuery(queryTerm: string) {
    queryTerm = queryTerm.trim();

    let params = new HttpParams()
      .set("types", "geocode")
      .set("language", "uk")
      .set("location", "49.8118805,24.0096293")
      .set("radius", "150000")
      .set("input", queryTerm)
      .set("key", """");

    return this.http.get(this.googlePlaceAutocompleteUrl, {params: params});
  }
}
