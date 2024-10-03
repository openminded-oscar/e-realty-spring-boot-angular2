import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Photo} from '../domain/photo';
import {throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

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

    return this.http.post<Photo>(url, formData, options)
      .pipe(
        catchError(error => throwError(error)),
        tap(res => {
        res.fullUrl = Photo.getLinkByFilename(res.filename);
      }));
  }
}
