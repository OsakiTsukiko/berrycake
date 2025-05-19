import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'berrycake';
  private router = inject(Router);

  ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) { // deal with # in code url...
      window.location.href = `${window.location.pathname}/#/code?code=${code}`;
    }
  }
}
