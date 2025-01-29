import { Routes } from '@angular/router';
import {ChatContainerComponent} from './features/chat/chat-container.component';
import {LoginComponent} from './features/login/login.component';
import {
  ChatReactiveFormComponent
} from './features/chat-form/components/chat-reactive-form/chat-reactive-form.component';
import {AiChatComponent} from './features/ai-chat/ai-chat.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
  {
    path: 'chat',
    component: ChatContainerComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'reactive-chat', component: ChatReactiveFormComponent },
  { path: 'gemini-chat', component: AiChatComponent },
  { path: '**', redirectTo: 'login' },
];
