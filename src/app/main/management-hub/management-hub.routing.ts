import { Route } from '@angular/router';
import { AccountManagementComponent } from './account-management/account-management.component';
import { ServiceManagementComponent } from './service-management/service-management.component';
import { ChildAuthGuard } from 'app/core/auth/guards/childAuth.guard';
export const ManagementHubRoutes: Route[] = [
    {
        path     : '',
        children: [
            {
                path     : 'accounts',
                component: AccountManagementComponent
            },
            {
                path     : 'services',
                component: ServiceManagementComponent,
            }
        ]
    }    
];
