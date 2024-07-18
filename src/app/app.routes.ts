import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./dashboard/dashboard-container.component').then(
        (m) => m.DashboardContainerComponent
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
