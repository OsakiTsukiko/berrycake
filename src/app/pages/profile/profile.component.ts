import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile = signal<any | null>(null);
  loading = signal(true);
  instance = signal("");
  lines = signal<string[]>([]);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.instance.set(this.authService.getInstanceUrl()!);
    this.loading.set(true);
    this.http.get(this.authService.getInstanceUrl()! + "/api/v1/accounts/verify_credentials", {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()!}` // pray it finds one
      }
    }).subscribe({
      next: data => {
        console.log(data);
        this.profile.set(data);
        this.loading.set(false);
        this.lines.set(this.profile().source.note.split("\r\n"));
      },
        error: err => {
        console.error('Error loading profile', err);
        this.loading.set(false);
      }
    });
  }
}