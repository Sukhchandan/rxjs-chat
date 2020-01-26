import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import * as moment from 'moment';
import {distinctUntilChanged, filter, throttleTime, scan, skipWhile, takeWhile} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  message: string;
  messages: string[] = [];
  secretCode: string;
  endConversationCode: string;
  constructor(private _chatService:ChatService){
    this.secretCode = 'DONT TELL';
    this.endConversationCode = 'BYE BYE';
  }

  sendMessage() {
    this._chatService.sendMessage(this.message);
    this.message = '';
  }
  ngOnInit() {
    this._chatService
    .getMessages().pipe(
      distinctUntilChanged(),
      filter((message: any) => message.trim().length > 0),
      throttleTime(1000),
      skipWhile((message) => message !== this.secretCode),
      takeWhile((message) => message !== this.endConversationCode),
      scan((acc: string, message: string, index: number) =>
          `${message}(${index + 1})`
         )
    ).subscribe((message: string) => {
      let currentTime = moment().format('hh:mm:ss a');
      let messageWithTimestamp =  `${currentTime}: ${message}`;
      this.messages.push(messageWithTimestamp);
    });
  }
}
