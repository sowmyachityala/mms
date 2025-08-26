import { Route } from '@angular/router';
import { MosquesComponent } from './mosques/mosques.component';
import { MosqueProfileComponent } from '../mosque-management/mosque-profile/mosque-profile.component';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { MinistryProfileComponent } from './ministry-profile/ministry-profile.component';
import { RoleGuard } from 'app/core/auth/guards/role.guard';
import { MosqueOnboardingRequestComponent } from './mosque-onboarding/mosque-onboarding.component';

export const MinistryManagementRoutes: Route[] = [
    {
        path     : 'mosques',
        component: MosquesComponent,
        canActivate :   [RoleGuard],
        data        :   { expectedRoles:  ['SUPER ADMIN','MINISTRY ADMIN'] }
    },
    {
        path     : 'ministryprofile',
        component: MinistryProfileComponent,
    },
    {
        path     : 'onboarding-requests',
        component: MosqueOnboardingRequestComponent,
    }

];
