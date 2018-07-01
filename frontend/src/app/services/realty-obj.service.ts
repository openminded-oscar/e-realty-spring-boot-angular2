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
    for (let field in filter) {
      for (let operation in filter[field]) {
        let value = filter[field][operation];
        let fieldNameToRequest = this.appendFieldNameIfNestedRequired(field);
        if (value === "") {
          continue;
        } else {
          filterItems.push({
            field: fieldNameToRequest,
            operation: operation,
            value: value
          });
        }
      }
    }

    return this.http.post(endpoints.realtyObj.list, filterItems, {
      params: {
        page: pageable.page,
        size: pageable.size
      }
    });
  }

  private appendFieldNameIfNestedRequired(field: string): string {
    if (field === "street" || field === "city") {
      field = "address." + field
    }

    return field;
  }

  findById(id) {
    return this.http.get(endpoints.realtyObj.byId + "/" + id);
  }

  save(realtyObj: RealtyObj) {
    return this.http.post(endpoints.realtyObj.add, realtyObj);
  }
}
