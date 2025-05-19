import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-connect',
  imports: [FormsModule, InputTextModule, ButtonModule],
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.scss'
})
export class ConnectComponent {
  instanceUrl: string = '';

  constructor(private authService: AuthService) {}

  connect() {
    this.authService.registerApp(this.instanceUrl);
  }
}
