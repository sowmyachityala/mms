import { Route } from '@angular/router';
import { AdminMosquesComponent } from './admin-mosques/admin-mosques.component';

export const MosqueAdminRoutes: Route[] = [
    {
        path: '',
        data: {
            layout: 'empty'
        },
        component: AdminMosquesComponent
    }
];
