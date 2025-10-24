import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'list', 
    loadChildren: () => import('./modules/list/list-module').then(m => m.ListModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];
