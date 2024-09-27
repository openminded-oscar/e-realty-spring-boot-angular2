import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {throwError} from 'rxjs';

@Injectable()
export class FileUploadService {
  constructor(private http: HttpClient) {
  }

  public upload(file: File, url: string) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Accept': 'application/json',
    });
    const options = {headers};

    return (<any>this.http.post(url, formData, options)
      .map(res => res))
      .catch(error => throwError(error));
  }
}
