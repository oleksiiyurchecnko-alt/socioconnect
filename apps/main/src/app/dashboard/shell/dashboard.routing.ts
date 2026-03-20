import { Route } from '@angular/router';
import { DashboardHomeComponent } from '../feature/dashboard-home/dashboard-home.component';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardHomeComponent,
  },
];
