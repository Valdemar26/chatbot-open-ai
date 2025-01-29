import {Component, computed, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-chat-reactive-form',
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './chat-reactive-form.component.html',
  styleUrl: './chat-reactive-form.component.scss'
})
export class ChatReactiveFormComponent {
// Сигнал для зберігання історії повідомлень
  private messages = signal<string[]>([]);

  // Комбінований сигнал (історія в реверсному порядку)
  chatHistory = computed(() => [...this.messages()].reverse());

  chatForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Ініціалізація реактивної форми
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  sendMessage(): void {
    const message: string = this.chatForm.value.message.trim();
    if (message) {
      // Додати нове повідомлення в Signal
      this.messages.update((prev: string[]) => [...prev, message]);
      // Очистити форму
      this.chatForm.reset();
    }
  }
}
