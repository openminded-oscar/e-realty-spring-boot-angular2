import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {LoaderService} from '../loader.service';

export const SKIP_LOADER_FOR_REQUEST_HEADER = 'X-Skip-Interceptor';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip interceptor if the custom header is present
    if (req.headers.has(SKIP_LOADER_FOR_REQUEST_HEADER)) {
      const clonedRequest = req.clone({ headers: req.headers.delete(SKIP_LOADER_FOR_REQUEST_HEADER) });
      return next.handle(clonedRequest);
    }

    // Show loader for other requests
    this.loaderService.show();

    return next.handle(req).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }
}
