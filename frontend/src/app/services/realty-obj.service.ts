import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RealtyObj} from '../domain/realty-obj';
import {endpoints} from '../commons';
import {Observable} from 'rxjs';
import {Photo, RealtyPhoto} from '../domain/photo';
import {tap} from 'rxjs/operators';
import {SortValue} from '../realty-objs-gallery/realty-objs-gallery.component';

export interface PageableResponse<T> {
  content: T[];
  pageable: any;
  sort: any;
  totalElements: number;
  totalPages: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export enum BackendSupportedOperations {
  BUY = 'SELLING',
  RENT = 'RENT',
}

@Injectable()
export class RealtyObjService {

  constructor(private http: HttpClient) {
  }

  public findByFilterAndPage(filter: {
    [filterField: string]: { [operationName: string]: string }
  }, ordering: SortValue, pageable): Observable<PageableResponse<RealtyObj>> {
    const filterItems = this.mapFilterInputsToHttpRequest(filter);

    return this.http.post<PageableResponse<RealtyObj>>(endpoints.realtyObj.list, filterItems, {
      params: {
        page: pageable.page,
        size: pageable.size
      }
    }).pipe(
      tap(res => {
        const realtyObjects = res.content;
        (realtyObjects ?? []).forEach(value => {
          value.mainPhotoPath = RealtyObj.getMainPhoto(value);
        });
      })
    );
  }

  public findById(id: string): Observable<RealtyObj> {
    return this.http.get<RealtyObj>(endpoints.realtyObj.byId + '/' + id).map((realtyObj: RealtyObj) => {
      if (realtyObj.realter && realtyObj.realter.photo) {
        realtyObj.realter.photo.photoFullUrl = Photo.getLinkByFilename(realtyObj.realter.photo.filename);
      }
      realtyObj.photos.forEach(photo => {
        photo.fullUrl = RealtyPhoto.getLinkByFilename(photo.filename);
      });
      return realtyObj;
    });
  }

  public save(realtyObj: RealtyObj): Observable<RealtyObj> {
    return this.http.post<RealtyObj>(endpoints.realtyObj.add, realtyObj);
  }

  private mapFilterInputsToHttpRequest(filter: { [p: string]: { [p: string]: string } }) {
    const filterItems: any[] = [];
    for (const field in filter) {
      for (const operation in filter[field]) {
        const value = filter[field][operation];
        const fieldNameToRequest = this.appendFieldNameIfNestedRequired(field);
        if (value !== '') {
          filterItems.push({
            field: fieldNameToRequest,
            operation: operation,
            value: value
          });
        }
      }
    }
    return filterItems;
  }

  private appendFieldNameIfNestedRequired(field: string): string {
    if (field === 'street' || field === 'city') {
      field = 'address.' + field;
    }

    return field;
  }
}
