import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {RealtyObj} from "../domain/realty-obj";
import {endpoints} from "../commons";
import {Observable} from "rxjs";
import {Photo, RealtyPhoto} from "../domain/photo";

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

  findById(id): Observable<RealtyObj> {
    return <Observable<RealtyObj>>this.http.get(endpoints.realtyObj.byId + "/" + id).map((realtyObj: RealtyObj) => {
      if (realtyObj.realter && realtyObj.realter.photo) {
        realtyObj.realter.photo.photoFullUrl = Photo.getLinkByFilename(realtyObj.realter.photo.filename);
      }
      realtyObj.photos.forEach(photo => {
        photo.fullUrl = RealtyPhoto.getLinkByFilename(photo.filename);
      });
      return realtyObj;
    });
  }

  save(realtyObj: RealtyObj) {
    return this.http.post(endpoints.realtyObj.add, realtyObj);
  }
}
