import { Routes } from '@angular/router';
import { Dashboard} from './components/dashboard/dashboard';
import { Schedules} from './components/schedules/schedules';
import { Buffets} from './components/buffets/buffets';
import { Account} from './components/account/account';
import { Login} from './components/login/login';

export const routes: Routes = [
    { path: 'login', component: Login},
    { path: 'dashboard', component: Dashboard },
    { path: 'schedules', component: Schedules },
    { path: 'buffets', component: Buffets},
    { path: 'account', component: Account },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard' }
];
