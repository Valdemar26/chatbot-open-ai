import { Injectable } from '@angular/core';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {ChatMessage} from '../models/chat-message.interface';
import {webSocket} from 'rxjs/webSocket';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket$: WebSocketSubject<ChatMessage>;

  constructor() {
    this.socket$ = webSocket<ChatMessage>('ws://localhost:8080');
  }

  sendMessage(message: ChatMessage): void {
    this.socket$.next(message);
  }

  getMessages(): Observable<ChatMessage> {
    return this.socket$.asObservable();
  }

  closeConnection(): void {
    this.socket$.complete();
  }
}
