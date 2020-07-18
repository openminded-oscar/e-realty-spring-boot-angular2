import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SampleSocketService {
  currentDocument = this.socket.fromEvent<any>('LOAD_POST_PAGE');

  constructor(private socket: Socket) { }

  generateObject() {
    this.socket.emit('LOAD_POST_PAGE', Math.random());
  }
}
