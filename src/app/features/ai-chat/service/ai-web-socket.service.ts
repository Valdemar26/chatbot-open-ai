import { Injectable } from '@angular/core';
import {AiChatMessage} from '../models/ai-chat-message.interface';
import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {webSocket} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class AiWebSocketService {

  private socket$: WebSocketSubject<AiChatMessage>;
  private messagesSubject = new BehaviorSubject<AiChatMessage[]>([]);

  constructor() {
    this.socket$ = webSocket<AiChatMessage>('ws://localhost:8081'); // окремий сервер для AI-чату
    this.connect();
  }

  sendMessage(message: AiChatMessage): void {
    this.socket$.next(message);
  }

  getMessages(): Observable<AiChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  private connect(): void {
    this.socket$
      .pipe(
        catchError((error) => {
          console.error('AI WebSocket connection error:', error);
          return throwError(() => new Error('AI WebSocket connection failed'));
        })
      )
      .subscribe({
        next: (msg) => this.messagesSubject.next([...this.messagesSubject.value, msg]),
        error: (err) => console.error('AI WebSocket error:', err),
        complete: () => console.log('AI WebSocket connection closed'),
      });
  }

  closeConnection(): void {
    this.socket$.complete();
  }
}
