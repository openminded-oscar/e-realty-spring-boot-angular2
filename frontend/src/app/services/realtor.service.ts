import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {endpoints} from '../commons';

import {Observable, of, throwError} from 'rxjs';
import {Realtor} from '../domain/realtor';
import {Photo} from '../domain/photo';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
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

  public findById(id: any) {
    return this.http.get(endpoints.realtors.single + '/' + id)
      .pipe(
        tap((realtor: Realtor) => {
          if (realtor?.profilePic) {
            realtor.profilePic.fullUrl = Photo.getLinkByFilename(realtor.profilePic.filename);
          }
        }));
  }

  public updateRealtor(realtor: Realtor, realtorId: string): Observable<any> {
    return this.http.put(`${endpoints.realtors.single}/${realtorId}`, realtor)
      .pipe(
        catchError((error: any) => throwError(error))
      );
  }

  public saveRealtor(realtor: Realtor): Observable<any> {
    return this.http.post(endpoints.realtors.single, realtor)
      .pipe(
        catchError((error: any) => throwError(error))
      );
  }

  public claimForRealtor(): Observable<any> {
    throw new Error('Not implemented Yet');
  }
}
