import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ConnectComponent } from './pages/connect/connect.component';
import { authGuard } from './guards/auth.guard';
import { CallbackComponent } from './pages/callback/callback.component';
import { authTokenGuard } from './guards/auth-token.guard';
import { FeedComponent } from './pages/feed/feed.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard, authTokenGuard], children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  },
  { path: 'code', component: CallbackComponent, canActivate: [authGuard] },
  { path: 'connect', component: ConnectComponent },
];
  