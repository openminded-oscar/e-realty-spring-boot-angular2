import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";


@Injectable()
export abstract class AbstractService<T> {
  protected uri;

  constructor(protected http: HttpClient, protected domain: string) {}

  protected save(item: T): Observable<HttpResponse<any>> {
    return this.sendRequest<any>('post', this.uri, null);
  }

  protected update(item: T): Observable<HttpResponse<T>> {
    return this.sendRequest<T>('put', this.uri, null);
  }

  protected findAll(): Observable<HttpResponse<T[]>> {
    return this.sendRequest<T[]>('get', this.uri, null);
  }

  protected findById(id: string): Observable<HttpResponse<T>> {
    const uri = `${this.uri}/${id}`;
    return this.sendRequest<T>('get', uri, null);
  }

  protected delete(id: string): Observable<HttpResponse<any>> {
    const uri = `${this.uri}/${id}`;
    return this.sendRequest<any>('delete', uri, null);
  }

  protected sendRequest<T>(method: string, uri: string, body: any, queryParams?: any): Observable<HttpResponse<T>> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    let request;

    if (method === 'get') {
      const getParams: any = this.buildQueryString(body);

      request = this.http.get<T>(this.domain + uri, {
        headers,
        observe: 'response',
        params: getParams
      });
    } else if (method === 'put') {
      const params: any = this.buildQueryString(queryParams);

      request = this.http.put<T>(this.domain + uri, body, {
        headers,
        observe: 'response',
        params: params
      });
    } else if (method === 'patch') {
      const params: any = this.buildQueryString(queryParams);

      request = this.http.patch<T>(this.domain + uri, body, {
        headers,
        observe: 'response',
        params: params
      });
    } else if (method === 'post') {
      const params: any = this.buildQueryString(queryParams);

      request = this.http.post<T>(this.domain + uri, body, {
        headers,
        observe: 'response',
        params: params
      });
    } else if (method === 'delete') {
      const params: any = this.buildQueryString(body);

      request = this.http.delete<T>(this.domain + uri, {
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
