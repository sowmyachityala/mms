import { Route } from '@angular/router';
import { EventsComponent } from './events/events.component';

export const EventManagementRoutes: Route[] = [
    {
        path: '',
        component: EventsComponent
    }
];
