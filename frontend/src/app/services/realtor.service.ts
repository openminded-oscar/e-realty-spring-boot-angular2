import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {endpoints} from '../commons';

import {Observable} from 'rxjs';
import {Realtor} from '../domain/realtor';
import {Photo} from '../domain/photo';
import {tap} from 'rxjs/operators';
import {RealtyObj} from '../domain/realty-obj';
import {Review} from '../domain/review';

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

  public getMyAsRealtorReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(endpoints.realtorReview).pipe(
      tap(res => {
        const realtyObjects = res.map(r => r.realtyObj);
        (realtyObjects ?? []).forEach(value => {
          value.mainPhotoPath = RealtyObj.getMainPhoto(value);
        });
      })
    );
  }

  public findById(id: any) {
    return this.http.get(endpoints.realtors.single + '/' + id)
      .pipe(
        tap((realtor: Realtor) => {
          if (realtor?.profilePic) {
            realtor.profilePic.fullUrl = Photo.getLinkByFilename(realtor.profilePic.filename);
          }
        }));
  }

  public claimForRealtor(): Observable<any> {
    throw new Error('Not implemented Yet');
  }
}
