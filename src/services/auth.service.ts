import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../app/config';

interface AppRegistrationResponse {
  client_id: string;
  client_secret: string;
}

interface AppTokenResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly clientIdKey = 'client_id';
  private readonly clientSecretKey = 'client_secret';
  private readonly instanceUrlKey = 'instance_url';
  private readonly tokenKey = 'access_token';

  constructor(private http: HttpClient) {}

  registerApp(rawInstanceUrl: string): void {
    const instanceUrl = rawInstanceUrl.startsWith("http://") || rawInstanceUrl.startsWith("htts://") ? rawInstanceUrl : "https://" + rawInstanceUrl;
    this.http.post<Partial<AppRegistrationResponse>>(
      instanceUrl + "/api/v1/apps",
      {
        "client_name": "Berry Cake",
        "redirect_uris": [config.appUrl] + "/code",
        "scopes": "read write push",
        "website": "https://github.com/be4ri"
      },
    ).subscribe({
      next: (value) => {
        if (value.client_id === undefined || value.client_secret === undefined) {
          /// TODO: Error (maybe I should make an error page).
        }
        localStorage.setItem(this.clientIdKey, value.client_id!);
        localStorage.setItem(this.clientSecretKey, value.client_secret!);
        localStorage.setItem(this.instanceUrlKey, instanceUrl);
      },
      error: (err) => console.error(err), // TODO: Make that error page.
      complete: () => {
        window.open(
          `${instanceUrl}/oauth/authorize` +
          `?client_id=${this.getClientId()!}` + 
          `&scope=read+write+push` +
          `&redirect_uri=${config.appUrl}/code` + 
          `&response_type=code`,
          "_blank"
        )
      },
    })
  }

  exchangeCodeForToken(code: string) {
    const instanceUrl = this.getInstanceUrl();
    if (!instanceUrl) {
      // TODO: error, maybe I should do something?
    }
    return this.http.post<AppTokenResponse>(`${instanceUrl}/oauth/token`, {
      client_id: this.getClientId(),
      client_secret: this.getClientSecret(),
      redirect_uri: config.appUrl + '/code',
      grant_type: 'authorization_code',
      code,
    });
  }

  hasAppCredentials(): boolean {
    return !!(this.getClientId() && this.getClientSecret() && this.getInstanceUrl());
  }

  getClientId(): string | null {
    return localStorage.getItem(this.clientIdKey);
  }

  getClientSecret(): string | null {
    return localStorage.getItem(this.clientSecretKey);
  }

  getInstanceUrl(): string | null {
    return localStorage.getItem(this.instanceUrlKey);
  }

  clearCredentials(): void {
    localStorage.removeItem(this.clientIdKey);
    localStorage.removeItem(this.clientSecretKey);
    localStorage.removeItem(this.instanceUrlKey);
  }

  getToken():  string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  } 

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
