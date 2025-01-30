import {Component, effect, ElementRef, signal, ViewChild} from '@angular/core';
import {AiChatMessage} from './models/ai-chat-message.interface';
import {AiWebSocketService} from './service/ai-web-socket.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-ai-chat',
  imports: [
    NgForOf,
  ],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss'
})
export class AiChatComponent {
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  messages = signal<AiChatMessage[]>([]);

  constructor(private aiWebSocketService: AiWebSocketService) {

    // Реактивно слухаємо повідомлення через Signal Effect
    effect(() => {
      this.aiWebSocketService.getMessages().subscribe((newMessages: AiChatMessage[]) => {
        this.messages.update((msgs) => [...msgs, ...newMessages]);
      });
    });
  }

  sendMessage(text: string): void {
    if (!text.trim()) return;

    const message: AiChatMessage = {
      user: 'User',
      text,
      timestamp: new Date().toISOString(),
    };
    this.aiWebSocketService.sendMessage(message);

    this.messages.update((msgs) => [...msgs, message]);

    this.messageInput.nativeElement.value = '';
  }
}
