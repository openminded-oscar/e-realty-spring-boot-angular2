import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RealtyObj} from "../domain/realty-obj";
import {endpoints} from "../commons";

@Injectable()
export class RealtyObjService {

  constructor(private http: HttpClient) {
  }

  save(realtyObj: RealtyObj) {
    return this.http.post(endpoints.realtyObj.add, realtyObj);
  }
}
