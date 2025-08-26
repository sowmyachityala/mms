import { Route } from '@angular/router';
import { WebDonationComponent } from './web-donation/web-donation.component';
import { SuccessDonationComponent } from './donation-success/success-donation.component';
import { FailDonationComponent } from './donation-fail/fail-donation.component';

export const WebDonationRoutes: Route[] = [
   
    {
        path     : 'donationSuccess',
        component: SuccessDonationComponent,
    },
    {
        path     : 'donationFail',
        component: FailDonationComponent,
    },
    {
        path     : ':id',
        component: WebDonationComponent,
    },
    {
        path     : '',
        component: WebDonationComponent,
    }
];