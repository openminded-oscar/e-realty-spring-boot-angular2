import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {endpoints} from '../commons';

import {Observable, throwError} from 'rxjs';
import {Realter} from '../domain/realter';
import {Photo} from '../domain/photo';
import {tap} from 'rxjs/operators';

@Injectable()
export class RealterService {
  constructor(private http: HttpClient) {
  }

  public getRealters(): Observable<any> {
    return this.http.get(endpoints.realters.list)
      .pipe(
        tap((realters: Realter[]) => {
          realters.forEach(realter => {
            if (realter.profilePic) {
              realter.profilePic.photoFullUrl = Photo.getLinkByFilename(realter.profilePic.filename);
            }
          });
        }));
  }

  public findById(id: any) {
    return this.http.get(endpoints.realters.single + '/' + id)
      .pipe(
        tap((realter: Realter) => {
          if (realter?.profilePic) {
            realter.profilePic.photoFullUrl = Photo.getLinkByFilename(realter.profilePic.filename);
          }
        }));
  }

  public updateRealter(realter: Realter, realterId: string): Observable<any> {
    return this.http.put(`${endpoints.realters.single}/${realterId}`, realter)
      .catch((error: any) => throwError(error));
  }

  public saveRealter(realter: Realter): Observable<any> {
    return this.http.post(endpoints.realters.single, realter)
      .catch((error: any) => throwError(error));
  }
}
