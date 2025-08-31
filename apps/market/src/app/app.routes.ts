import { Routes } from '@angular/router';
import { AuthenticatedGuard } from '@market-commons';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.routes)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
  },
  {
    path: '**',
    loadComponent: () => import('./core/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
