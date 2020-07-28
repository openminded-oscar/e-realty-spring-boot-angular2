import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class ErrorService {
  private errorEmitter: EventEmitter<any> = new EventEmitter();
  emitError(error) {
    this.errorEmitter.emit(error);
  }
  getErrorEmitter() {
    return this.errorEmitter;
  }
}
