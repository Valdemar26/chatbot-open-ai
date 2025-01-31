import {Component, effect, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {AiChatMessage} from './models/ai-chat-message.interface';
import {AiWebSocketService} from './service/ai-web-socket.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-ai-chat',
  imports: [
    NgForOf,
    NgIf,
  ],
  providers: [DatePipe],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss'
})
export class AiChatComponent {
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLUListElement>;

  messages = signal<AiChatMessage[]>([]);
  private datePipe = inject(DatePipe);
  private aiWebSocketService = inject(AiWebSocketService);

  constructor() {

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

    this.scrollToBottom();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }, 100);
  }

  formatTimestamp(timestamp: string): string {
    return this.datePipe.transform(timestamp, 'HH:mm:ss') || timestamp;
  }
}
