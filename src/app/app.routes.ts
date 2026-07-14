import { Routes } from '@angular/router';
import { setupGuard, sessionGuard, tokenGuard } from './core/guards/admin.guard';
import { PublicShell } from './public-site/shell/public-shell';

export const routes: Routes = [
  { path: '', component: PublicShell },
  {
    path: 'admin/setup',
    canActivate: [setupGuard],
    loadComponent: () => import('./admin/setup/admin-setup').then((m) => m.AdminSetup),
  },
  {
    path: 'admin/:token',
    canActivate: [tokenGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./admin/login/admin-login').then((m) => m.AdminLogin),
      },
      {
        path: '',
        canActivate: [sessionGuard],
        loadComponent: () => import('./admin/admin-shell/admin-shell').then((m) => m.AdminShell),
        children: [
          {
            path: '',
            loadComponent: () => import('./admin/dashboard/admin-dashboard').then((m) => m.AdminDashboard),
          },
          {
            path: 'contenu',
            loadComponent: () => import('./admin/content/sections-list-editor').then((m) => m.SectionsListEditor),
          },
          {
            path: 'apparence',
            loadComponent: () => import('./admin/appearance/theme-editor').then((m) => m.ThemeEditor),
          },
          {
            path: 'technique',
            loadComponent: () => import('./admin/technical/technical-settings').then((m) => m.TechnicalSettings),
          },
          {
            path: 'apercu',
            loadComponent: () => import('./admin/preview/admin-preview').then((m) => m.AdminPreview),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
