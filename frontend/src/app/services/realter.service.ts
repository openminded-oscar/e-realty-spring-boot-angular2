import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {endpoints} from "../commons";

import {Observable} from "rxjs/Observable";

@Injectable()
export class RealterService {
  constructor(private http: HttpClient) { }

  public getRealters() {
    return this.http.get(endpoints.realters.list)
      .catch((error:any) => Observable.throw(error));
  }
}
