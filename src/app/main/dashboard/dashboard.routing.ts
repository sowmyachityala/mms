import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RoutedDashboardComponent } from './routed-dashboard/routed-dashboard.component';

export const DashboardRoutes: Route[] = [
    {
        path     : '',
        component: DashboardComponent
    },
    {
        path     : ':id',
        component: RoutedDashboardComponent
    }
];
