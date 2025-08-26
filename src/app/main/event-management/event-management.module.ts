import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { EventManagementRoutes } from './event-management.routing';
import { CreateUpdateEventComponent } from './create-update-event/create-update-event.component';
import { EventDetailsComponent } from './event-details/event-details.component';

@NgModule({
  declarations: [
    EventsComponent,
    CreateUpdateEventComponent,
    EventDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(EventManagementRoutes),
    SharedModule
  ]
})
export class EventManagementModule { }
