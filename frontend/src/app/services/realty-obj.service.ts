import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RealtyObj} from "../domain/realty-obj";
import {endpoints} from "../commons";

@Injectable()
export class RealtyObjService {

  constructor(private http: HttpClient) {
  }

  findByFilterAndPage(filter, pageable) {
    let filterItems: any[] = [];
    for(let field in filter){
      for(let operation in filter[field]){
        filterItems.push({
          field: field,
          operation: operation,
          value: filter[field][operation]
        });
      }
    }

    return this.http.post(endpoints.realtyObj.list, filterItems, {
      params: {
        page: pageable.page,
        size: pageable.size
      }
    });
  }

  findById(id) {
    return this.http.get(endpoints.realtyObj.byId + "/" + id);
  }

  save(realtyObj: RealtyObj) {
    return this.http.post(endpoints.realtyObj.add, realtyObj);
  }
}
