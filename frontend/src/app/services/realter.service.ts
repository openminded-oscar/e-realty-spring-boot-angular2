import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {endpoints} from "../commons";

import {Observable, throwError} from "rxjs";
import {Realter} from "../domain/realter";

@Injectable()
export class RealterService {
  constructor(private http: HttpClient) { }

  public getRealters(): Observable<any> {
    return this.http.get(endpoints.realters.list)
      .catch((error:any) => throwError(error));
  }

  public addRealter(realter: Realter): Observable<any> {
    return this.http.post(endpoints.realters.single, realter)
      .catch((error:any) => throwError(error));
  }

  public findById(id: any) {
    return this.http.get(endpoints.realters.single+'/'+id)
      .catch((error:any) => throwError(error));
  }
}
