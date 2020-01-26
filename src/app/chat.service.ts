import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _url = environment.URL;
  private _socket;

  constructor() {
    this._socket = io(this._url);
   }

  public sendMessage(message) {
    this._socket.emit('new-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
        this._socket.on('new-message', (message) => {
            observer.next(message);
        });
    });
  }

}
