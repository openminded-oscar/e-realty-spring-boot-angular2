import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Photo} from '../app-models/photo';

@Injectable({providedIn: 'root'})
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
        catchError(error => throwError(() => error)),
        tap(res => {
          res.fullUrl = Photo.getLinkByFilename(res.filename);
        }));
  }
}
