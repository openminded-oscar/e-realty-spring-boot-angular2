import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';


@Injectable()
export abstract class AbstractService<T> {
  protected uri;

  constructor(protected http: HttpClient, protected domain: string) {
  }

  protected save(item: T): Observable<HttpResponse<any>> {
    return this.sendRequest('post', this.uri);
  }

  protected update(item: T): Observable<HttpResponse<T>> {
    return this.sendRequest('put', this.uri);
  }

  protected findAll(): Observable<HttpResponse<T[]>> {
    return this.sendRequest('get', this.uri);
  }

  protected findById(id: string): Observable<HttpResponse<T>> {
    const uri = `${this.uri}/${id}`;
    return this.sendRequest('get', uri);
  }

  protected delete(id: string): Observable<HttpResponse<any>> {
    const uri = `${this.uri}/${id}`;
    return this.sendRequest('delete', uri);
  }

  protected sendRequest<R>(method: 'get'|'post'|'put'|'delete'|'patch',
                           uri: string,
                           options: {
                             customHeaders?: { [key: string]: string },
                             body?: any,
                             queryParams?: any
                           } = {}): Observable<HttpResponse<R>> {

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      ...(options.customHeaders ?? {})
    });

    let request;

    const { body, queryParams } = options;

    if (method === 'get') {
      const getParams: any = this.buildQueryString(body);

      request = this.http.get<R>(this.domain + uri, {
        headers,
        observe: 'response',
        params: getParams
      });
    } else if (method === 'put') {
      const params: any = this.buildQueryString(queryParams);

      request = this.http.put<R>(this.domain + uri, body, {
        headers,
        observe: 'response',
        params: params
      });
    } else if (method === 'patch') {
      const params: any = this.buildQueryString(queryParams);

      request = this.http.patch<R>(this.domain + uri, body, {
        headers,
        observe: 'response',
        params: params
      });
    } else if (method === 'post') {
      const params: any = this.buildQueryString(queryParams);

      request = this.http.post<R>(this.domain + uri, body, {
        headers,
        observe: 'response',
        params: params
      });
    } else if (method === 'delete') {
      const params: any = this.buildQueryString(body);

      request = this.http.delete<R>(this.domain + uri, {
        headers,
        observe: 'response',
        params: params
      });
    } else {
      console.error('Unsupported request: ' + method);
      return throwError('Unsupported request: ' + method);
    }

    return request;
  }

  /* eslint-enable */

  protected buildQueryString(data) {
    const params: URLSearchParams = new URLSearchParams('');

    if (!data) {
      return params;
    }

    for (const param of Object.keys(data)) {
      params.append(param, data[param]);
    }

    return params;
  }
}
