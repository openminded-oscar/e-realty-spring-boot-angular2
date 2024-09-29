import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TargetOperationResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    const url = state.url.toUpperCase();
    const targetOperation = url.endsWith('RENT') ? 'RENT' : 'SELLING';
    return of(targetOperation);
  }
}
