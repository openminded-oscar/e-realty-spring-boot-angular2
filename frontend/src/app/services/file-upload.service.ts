import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class FileUploadService {
  constructor(private http: HttpClient) {
  }

  upload(file: File, url: string) {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);

    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {headers: headers};

    (<any>this.http.post(url, formData, options)
      .map(res => res.json()))
      .catch(error => Observable.throw(error))
      .subscribe(
        data => console.log('success'),
        error => console.log(error)
      );
  }
}
