import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatMessageListComponent} from './components/chat-message-list/chat-message-list.component';
import {ChatInputComponent} from './components/chat-input/chat-input.component';
import {ChatMessage} from './models/chat-message.interface';
import {Subscription} from 'rxjs';
import {WebSocketService} from './services/web-socket.service';

@Component({
  selector: 'app-chat-container',
  imports: [
    ChatMessageListComponent,
    ChatInputComponent
  ],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.scss'
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  private subscription: Subscription | null = null;

  constructor(
    private webSocketService: WebSocketService,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.webSocketService.getMessages().subscribe(
      (message) => {
        this.messages.push(message); // Додаємо нові повідомлення
      },
      (error) => console.error('WebSocket error:', error)
    );
  }

  addMessage(text: string): void {
    const newMessage: ChatMessage = {
      user: 'User', // Тут можна підставити динамічне ім'я
      text,
      timestamp: new Date(),
    };

    this.messages.push(newMessage); // Локальне оновлення
    this.webSocketService.sendMessage(newMessage); // Відправка на сервер
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.webSocketService.closeConnection(); // Закриваємо сокет
  }
}
