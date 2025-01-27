import { Routes } from '@angular/router';
import {ChatContainerComponent} from './features/chat/chat-container.component';
import {LoginComponent} from './features/login/login.component';

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
  { path: '**', redirectTo: 'login' },
];
