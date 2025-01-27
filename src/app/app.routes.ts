import { Routes } from '@angular/router';
import {ChatContainerComponent} from './features/chat/chat-container.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat', // Перенаправлення на сторінку чату
    pathMatch: 'full',
  },
  {
    path: 'chat',
    component: ChatContainerComponent,
  },
];
