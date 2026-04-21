import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { Schedules } from './components/schedules/schedules';
import { BuffetsComponent } from './components/buffets/buffets.component';
import { BuffetDetailComponent } from './components/buffets/buffet-detail/buffet-detail.component';
import { Account } from './components/account/account';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'schedules', component: Schedules },
    { path: 'buffets', component: BuffetsComponent },
    { path: 'buffets/:id', component: BuffetDetailComponent },  // ← исправлено
    { path: 'account', component: Account },
    { path: '', component: DashboardComponent },
    { path: '**', redirectTo: '/dashboard' }
];