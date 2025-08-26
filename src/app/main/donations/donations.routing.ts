import { Route } from '@angular/router';
import { DonationsComponent } from './donations/donations.component';
import { DonationsuccessComponent } from './donationsuccess/donationsuccess.component';
import { DonationfailureComponent } from './donationfailure/donationfailure.component';

export const DonationsRoutes: Route[] = [
    {
        path: '',
        component: DonationsComponent
    },
    {
        path: 'donationsuccess',
        component: DonationsuccessComponent
    },
    {
        path: 'donationfailure',
        component: DonationfailureComponent
    }
    // {

    //     path: ':id',
    //     component: DonationsComponent
    // },
    // {
    //     path: ':ref-id',
    //     component: DonationsComponent
    // }
];
