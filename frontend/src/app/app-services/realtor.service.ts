import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {endpoints} from '../commons';

import {Realtor} from '../app-models/realtor';
import {Photo} from '../app-models/photo';
import {RealtyObj} from '../app-models/realty-obj';

@Injectable({providedIn: 'root'})
export class RealtorService {
  constructor(private http: HttpClient) {
  }

  public getRealtors(): Observable<any> {
    return this.http.get(endpoints.realtors.list)
      .pipe(
        tap((realtors: Realtor[]) => {
          realtors.forEach(realtor => {
            if (realtor.profilePic) {
              realtor.profilePic.fullUrl = Photo.getLinkByFilename(realtor.profilePic.filename);
            }
          });
        }));
  }

  public getMyAsRealtorObjects(): Observable<RealtyObj[]> {
    return this.http.get<RealtyObj[]>(endpoints.realtyObj.realtorList)
      .pipe(
        tap(objects => {
          (objects ?? []).forEach(object => {
            object.mainPhotoPath = RealtyObj.getMainPhoto(object);
          });
        })
      );
  }
}
