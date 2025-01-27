import {Component, Input} from '@angular/core';
import {ChatMessage} from '../../models/chat-message.interface';
import {DatePipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-chat-message-list',
  imports: [
    DatePipe,
    NgForOf
  ],
  templateUrl: './chat-message-list.component.html',
  styleUrl: './chat-message-list.component.scss'
})
export class ChatMessageListComponent {
  @Input() messages: ChatMessage[] = [];
}
