import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RealtyObj} from "../domain/realty-obj";
import {endpoints} from "../commons";

@Injectable()
export class RealtyObjService {

  constructor(private http: HttpClient) {
  }

  findByFilter(filter) {
    return this.http.post(endpoints.realtyObj.list, filter);
  }

  findById(id) {
    return this.http.get(endpoints.realtyObj.byId + "/" + id);
  }

  save(realtyObj: RealtyObj) {
    return this.http.post(endpoints.realtyObj.add, realtyObj);
  }
}
