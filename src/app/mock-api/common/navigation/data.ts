/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { environment } from 'environments/environment';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:view-grid',
        link: '/dashboard',
        isStandAlone: true,
        isChild: false
    },
    {
        id: 'ministry',
        title: 'Ministry Management',
        type: 'collapsable',
        iconUrl: environment.imageEndPoints.menuIcons.ministry,
        isChild: false,
        children: [
            {
                id: 'ministry.mosques',
                title: 'Mosques',
                type: 'basic',
                link: '/ministry/mosques',
                isChild: true
            },
            {
                id: 'ministry.timings',
                title: 'Timings',
                type: 'basic',
                link: '/ministry/timings',
                isChild: true
            },
            {
                id: 'ministry.keymembers',
                title: 'Key Members',
                type: 'basic',
                link: '/ministry/keymembers',
                isChild: true
            },
            {
                id: 'ministry.notifications',
                title: 'Notifications',
                type: 'basic',
                link: '/ministry/notifications',
                isChild: true
            },
        ]
    },
    {
        id: 'user',
        title: 'User Management',
        type: 'collapsable',
        iconUrl: environment.imageEndPoints.menuIcons.user,
        isChild: false,
        children: [
            {
                id: 'user.users',
                title: 'Users',
                type: 'basic',
                link: '/users',
                isChild: true
            }
        ]
    },
    {
        id: 'prayers',
        title: 'Prayer Tool Management',
        type: 'collapsable',
        iconUrl: environment.imageEndPoints.menuIcons.prayers,
        isChild: false,
        children: [
            {
                id: 'prayers.timings',
                title: 'Prayers Timings',
                type: 'basic',
                link: '/prayers/prayers',
                isChild: true
            }
        ]
    },
    {
        id: 'mosque',
        title: 'Mosque Management',
        type: 'collapsable',
        iconUrl: environment.imageEndPoints.menuIcons.ministry,
        isChild: false,
        children: [
            {
                id: 'mosque.profile',
                title: 'Mosque Profile',
                type: 'basic',
                link: '/mosque/profile',
                isChild: true
            },
            {
                id: 'mosque.timings',
                title: 'Timings',
                type: 'basic',
                link: '/mosque/timings',
                isChild: true
            },
            {
                id: 'mosque.member',
                title: 'Key Members',
                type: 'basic',
                link: '/mosque/timings',
                isChild: true
            },
            {
                id: 'mosque.tours',
                title: 'Virtual Tours',
                type: 'basic',
                link: '/mosque/timings',
                isChild: true
            },
        ]
    },
    {
        id: 'events',
        title: 'Events',
        type: 'basic',
        // icon: 'heroicons_outline:view-grid',
        link: '/events',
        isStandAlone: true,
        iconUrl: environment.imageEndPoints.menuIcons.events,
        isChild: false
    },
    {
        id: 'donations',
        title: 'Donations',
        type: 'basic',
        link: '/donations',
        isStandAlone: true,
        iconUrl: environment.imageEndPoints.menuIcons.donations,
        isChild: false
    },
    {
        id: 'reports',
        title: 'Reports',
        type: 'basic',
        link: '/reports',
        isStandAlone: true,
        iconUrl: environment.imageEndPoints.menuIcons.reports,
        isChild: false
    },
    {
        id: 'otherServices',
        title: 'Other Services',
        type: 'basic',
        link: '/otherServices',
        isStandAlone: true,
        iconUrl: environment.imageEndPoints.menuIcons.otherServices,
        isChild: false
    },
    {
        id: 'techSupport',
        title: 'Tech Support',
        type: 'basic',
        link: '/techSupport',
        isStandAlone: true,
        iconUrl: environment.imageEndPoints.menuIcons.techSupport,
        isChild: false
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
        isChild: false
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
        isChild: false
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
        isChild: false
    }
];