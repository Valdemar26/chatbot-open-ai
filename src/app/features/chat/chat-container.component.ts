import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatMessageListComponent} from './components/chat-message-list/chat-message-list.component';
import {ChatInputComponent} from './components/chat-input/chat-input.component';
import {ChatMessage} from './models/chat-message.interface';
import {Subscription} from 'rxjs';
import {WebSocketService} from './services/web-socket.service';
import {Router} from '@angular/router';

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
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const username = localStorage.getItem('username');

    if (!username) {
      this.router.navigate(['/login']);
    }

    this.subscription = this.webSocketService.getMessages().subscribe(
      (message: ChatMessage) => {
        if (message.error) {
          this.messages.push({
            user: 'Bot',
            text: `Сталася помилка: ${message.error.message}`,
            timestamp: new Date(),
          });
        } else {
          this.messages.push(message); // Додаємо нові повідомлення
        }
      },
      (error) => {
        console.error('WebSocket error:', error);
        this.messages.push({
          user: 'Bot',
          text: 'Сталася помилка з сервером.',
          timestamp: new Date(),
        });
      }
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
