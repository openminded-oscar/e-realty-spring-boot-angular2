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

@Injectable({providedIn: 'root'})
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
        size: pageable.size,
        sort: ordering.field + ',' + ordering.direction,
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
    return this.http.get<RealtyObj>(endpoints.realtyObj.byId + '/' + id).pipe(
      tap((realtyObj: RealtyObj) => {
        if (realtyObj.realtor && realtyObj.realtor.profilePic) {
          realtyObj.realtor.profilePic.fullUrl = Photo.getLinkByFilename(realtyObj.realtor.profilePic.filename);
        }
        if (realtyObj.confirmationDocPhoto) {
          realtyObj.confirmationDocPhoto.fullUrl = RealtyPhoto.getLinkByFilename(realtyObj.confirmationDocPhoto.filename);
        }
        realtyObj.photos?.forEach(photo => {
          photo.fullUrl = RealtyPhoto.getLinkByFilename(photo.filename);
        });
      }));
  }

  public save(realtyObj: Partial<RealtyObj>): Observable<RealtyObj> {
    return this.http.post<RealtyObj>(endpoints.realtyObj.add, realtyObj).pipe(
      tap((realtyObjReturned: RealtyObj) => {
        if (realtyObjReturned.realtor && realtyObjReturned.realtor.profilePic) {
          realtyObjReturned.realtor.profilePic.fullUrl =
            Photo.getLinkByFilename(realtyObjReturned.realtor.profilePic.filename);
        }
        realtyObjReturned.photos?.forEach(photo => {
          photo.fullUrl = RealtyPhoto.getLinkByFilename(photo.filename);
        });
        if (realtyObjReturned.confirmationDocPhoto) {
          const photo = realtyObjReturned.confirmationDocPhoto;
          photo.fullUrl = RealtyPhoto.getLinkByFilename(photo.filename);
        }
      }));
  }

  public deleteById(id: number): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(endpoints.realtyObj.delete + '/' + id).pipe();
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
