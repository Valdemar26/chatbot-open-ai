import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {AiChatMessage} from './models/ai-chat-message.interface';
import {Subscription} from 'rxjs';
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
export class AiChatComponent implements OnInit, OnDestroy {
  messages = signal<AiChatMessage[]>([]);
  private subscription!: Subscription;

  constructor(private aiWebSocketService: AiWebSocketService) {}

  ngOnInit(): void {
    this.subscription = this.aiWebSocketService.getMessages().subscribe((msgs: AiChatMessage[]) => {
      this.messages.set(msgs);
    });
  }

  sendMessage(text: string): void {
    console.log('sendMessage: ', text);
    const message: AiChatMessage = {
      user: 'User',
      text,
      timestamp: new Date().toISOString(),
    };
    this.aiWebSocketService.sendMessage(message);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
