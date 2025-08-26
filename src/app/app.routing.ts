import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { ComingSoonComponent } from './common/coming-soon/coming-soon.component';
import { ChildAuthGuard } from './core/auth/guards/childAuth.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
   // { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },
    //{ path: 'dashboard', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'imam-registration', pathMatch: 'full', redirectTo: 'imam-registration' },
    { path: 'mosque-onboard', pathMatch: 'full', redirectTo: 'mosque-onboard' },
    { path: 'account-delete', pathMatch: 'full', redirectTo: 'account-delete' },
    { path: 'mosque-donation', pathMatch: 'full', redirectTo: 'mosque-donation' },
    { path: 'islamic-knowledge', pathMatch: 'full', redirectTo: 'islamic-knowledge' },
    { path: 'haji-umrah', pathMatch: 'full', redirectTo: 'haji-umrah'},

    // Auth routes for guests
    {
        path: '',
        canMatch: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/core/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/core/auth/sign-up/sign-up.module').then(
                        (m) => m.AuthSignUpModule
                    ),
            },
            {
                path: 'mosqueadmin',
                loadChildren: () =>
                    import('app/main/mosque-admin/mosque-admin.module').then(
                        (m) => m.MosqueAdminModule
                    ),
            },
            {
                path: 'imam-registration',
                loadChildren: () =>
                    import('app/main/imam-registration/imam-registration.module').then(
                        (m) => m.ImamRegistrationModule
                    ),
            },
            {
                path: 'mosque-onboard',
                loadChildren: () =>
                    import('app/main/mosque-onboarding/mosque-onboarding.module').then(
                        (m) => m.MosqueOnboardingModule
                    ),
            },
            {
                path: 'account-delete',
                loadChildren: () =>
                    import('app/main/account-delete/account-delete.module').then(
                        (m) => m.AccountDeleteModule
                    ),
            },
            {
                path: 'mosque-donation',
                loadChildren: () =>
                    import('app/main/webview-dontaion/web-donation.module').then(
                        (m) => m.WebDonationModule
                    ),
            },
            {
                path: 'islamic-knowledge',
                loadChildren: () =>
                    import('app/main/islamic-knowledge/islamic-knowledge.module').then(
                        (m) => m.IslamicKnowledgeModule
                    ),
            },
            {
                path: 'haji-umrah',
                loadChildren: () =>
                    import('app/main/haji-umrah/haji-umrah.module').then(
                        (m) => m.HajiUmrahModule
                    ),
            }
        ],
    },

    // Admin routes
    {
        path: '',
        canMatch: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            // { path: '**', component: ComingSoonComponent },
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('app/main/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'mosque',
                loadChildren: () =>
                    import(
                        'app/main/mosque-management/mosque-management.module'
                    ).then((m) => m.MosqueManagementModule),
            },
            {
                path: 'ministry',
                loadChildren: () =>
                    import(
                        'app/main/ministry-management/ministry-management.module'
                    ).then((m) => m.MinistryManagementModule),
            },
            {
                path: 'users',
                loadChildren: () =>
                    import(
                        'app/main/user-management/user-management.module'
                    ).then((m) => m.UserManagementModule),
            },
            {
                path: 'events',
                loadChildren: () =>
                    import(
                        'app/main/event-management/event-management.module'
                    ).then((m) => m.EventManagementModule),
            },
            {
                path: 'donations',
                loadChildren: () =>
                    import('app/main/donations/donations.module').then(
                        (m) => m.DonationsModule
                    ),
            },
            {
                path: 'mosqueadmin',
                loadChildren: () =>
                    import('app/main/mosque-admin/mosque-admin.module').then(
                        (m) => m.MosqueAdminModule
                    ),
            },
            {
                path: 'gallery',
                loadChildren: () =>
                    import('app/main/gallery/gallery.module').then(
                        (m) => m.GalleryModule
                    ),
            },
            {
                path: 'master',
                loadChildren: () =>
                    import('app/main/master/master-management.module').then(
                        (m) => m.MasterManagementModule
                    ),
            },
            {
                path: 'askimam',
                loadChildren: () =>
                    import('app/main/reports/reports.module').then(
                        (m) => m.ReportManagementModule
                    ),
            },
            {
                path: 'managementhub',
                loadChildren: () =>
                    import('app/main/management-hub/management-hub.module').then(
                        (m) => m.ManagementHubModule
                    ),
            }
        ],
    },
];
