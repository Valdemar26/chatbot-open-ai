import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';

  constructor(private router: Router) {}

  login(): void {
    if (this.username.trim()) {
      localStorage.setItem('username', this.username);
      this.router.navigate(['/chat']);
    }
  }
}
