import {ChatError} from './chat-error.interface';

export interface ChatMessage {
  user: string;
  text: string;
  timestamp: Date;
  error?: ChatError;
}
