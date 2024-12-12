import {ChangeDetectorRef, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    private requestCount = 0;
    private isLoading = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoading.asObservable();

    constructor() {
    }

    public show() {
        this.requestCount++;
        this.updateLoadingState();
    }

    public hide() {
        if (this.requestCount > 0) {
            this.requestCount--;
        }
        this.updateLoadingState();
    }

    private updateLoadingState() {
        this.isLoading.next(this.requestCount > 0);
    }
}
