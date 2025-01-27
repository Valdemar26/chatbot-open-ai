import { Injectable } from '@angular/core';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {ChatMessage} from '../models/chat-message.interface';
import {webSocket} from 'rxjs/webSocket';
import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket$: WebSocketSubject<ChatMessage>;
  private messagesSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    this.socket$ = webSocket<ChatMessage>('ws://localhost:8080');
  }

  sendMessage(message: ChatMessage): void {
    this.socket$.next(message);
  }

  getMessages(): Observable<ChatMessage> {
    return this.socket$.asObservable();
  }

  connect() {
    this.socket$
      .pipe(
        catchError((error) => {
          console.error('WebSocket connection error:', error);
          return throwError(() => new Error('WebSocket connection failed'));
        })
      )
      .subscribe({
        next: (msg) => this.messagesSubject.next([...this.messagesSubject.value, msg]),
        error: (err) => console.error('WebSocket error:', err),
        complete: () => console.log('WebSocket connection closed'),
      });
  }

  closeConnection(): void {
    this.socket$.complete();
  }
}
