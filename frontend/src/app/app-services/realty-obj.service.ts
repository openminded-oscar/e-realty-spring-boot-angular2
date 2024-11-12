import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RealtyObj} from '../app-models/realty-obj';
import {endpoints} from '../commons';
import {Observable, Subject, throwError} from 'rxjs';
import {Photo, RealtyPhoto} from '../app-models/photo';
import {catchError, takeUntil, tap} from 'rxjs/operators';
import {SortValue} from '../home/realty-objs-gallery/realty-objs-gallery.component';
import {OPERATION_TYPES} from './config.service';
import {GlobalNotificationService} from './global-notification.service';

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

@Injectable({providedIn: 'root'})
export class RealtyObjService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(private http: HttpClient, private notificationService: GlobalNotificationService) {
  }

  public findByFilterAndPage(filter: {
    [filterField: string]: { [operationName: string]: string }
  }, ordering: SortValue, pageable, operation: OPERATION_TYPES): Observable<PageableResponse<RealtyObj>> {
    const filterItems = this.mapFilterInputsToHttpRequest(filter);

    return this.http.post<PageableResponse<RealtyObj>>(endpoints.realtyObj.listSell, filterItems, {
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

  public create(realtyObj: Partial<RealtyObj>): Observable<RealtyObj> {
    return this.callSaveOnServer(realtyObj)
      .pipe(
        tap(createdObject => {
          this.notificationService.showNotification('The object was created! It will appear on site after our system confirmation!');
        }), catchError((error) => {
          this.notificationService.showNotification('Failure! The object saving failed!');
          return throwError(() => error);
        })
      );
  }

  public update(realtyObj: Partial<RealtyObj>): Observable<RealtyObj> {
    return this.callSaveOnServer(realtyObj).pipe(
      tap(updatedObject => {
        this.notificationService.showNotification('The object was saved!');
      }), catchError((error) => {
        this.notificationService.showNotification('Failure! The object saving failed!');
        return throwError(() => error);
      })
    );
  }

  private callSaveOnServer(realtyObj: Partial<RealtyObj>) {
    return this.http.post<RealtyObj>(endpoints.realtyObj.add, realtyObj).pipe(
      takeUntil(this.destroy$),
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

  public activate(realtyObject: RealtyObj): Observable<any> {
    return this.http.post(`${endpoints.realtyObj.byId}/${realtyObject.id}/activate`, realtyObject).pipe();
  }

  public archive(realtyObject: RealtyObj): Observable<any> {
    return this.http.post(`${endpoints.realtyObj.byId}/${realtyObject.id}/archive`, realtyObject).pipe();
  }

  public restore(realtyObject: RealtyObj): Observable<any> {
    return this.http.delete(`${endpoints.realtyObj.byId}/${realtyObject.id}/archive`).pipe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
