import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  imports: [
    FormsModule
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  @Output() messageSent = new EventEmitter<string>();
  messageText = '';

  sendMessage(): void {
    if (this.messageText.trim()) {
      this.messageSent.emit(this.messageText);
      this.messageText = '';
    }
  }
}
