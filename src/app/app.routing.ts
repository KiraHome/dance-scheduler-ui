import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ProfileSettingsComponent} from './profile-settings/profile-settings.component';
import {UsersComponent} from './users/users.component';
import {UserAuthenticationGuard} from './_config/user-authentication-guard';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'profile-settings', component: ProfileSettingsComponent, canActivate: [UserAuthenticationGuard]},
  {path: 'users', component: UsersComponent, canActivate: [UserAuthenticationGuard]},

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
