import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

export const authTokenGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasToken()) {
    return true;
  }

  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  if (code) {
    return true;
  }
  
  authService.clearCredentials();
  return router.parseUrl('/connect');
};