import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./domains/dashboard/feature/dashboard-home').then(
        (module) => module.DashboardHomeComponent,
      ),
  },
];
