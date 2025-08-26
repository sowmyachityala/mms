import { Route } from '@angular/router';
import { AuthSignUpComponent } from 'app/core/auth/sign-up/sign-up.component';

export const authSignupRoutes: Route[] = [
    {
        path     : '',
        component: AuthSignUpComponent
    }
];
