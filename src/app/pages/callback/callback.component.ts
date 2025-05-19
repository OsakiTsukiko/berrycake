import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.authService.exchangeCodeForToken(code).subscribe({
          next: (value) => {
            this.authService.setToken(value.access_token!); // pray this is not null or something
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Token exchange failed', err);
            this.authService.clearCredentials();
            this.authService.clearToken();
            this.router.navigate(['/connect']);
          }
        });
      } else {
        this.authService.clearCredentials();
        this.authService.clearToken();
        this.router.navigate(['/connect']);
      }
    });
  }
}
