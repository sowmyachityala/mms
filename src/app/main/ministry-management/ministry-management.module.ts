import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MosquesComponent } from './mosques/mosques.component';
import { RouterModule } from '@angular/router';
import { MinistryManagementRoutes } from './ministry-management.routing';
import { SharedModule } from 'app/shared/shared.module';
import { AddUpdateMosqueComponent } from './add-update-mosque/add-update-mosque.component';
import { AssignAdministratorComponent } from './assign-administrator/assign-administrator.component';
import { MinistryProfileComponent } from './ministry-profile/ministry-profile.component';
import { MosqueOnboardingRequestComponent } from './mosque-onboarding/mosque-onboarding.component';

@NgModule({
  declarations: [
    MosquesComponent,
    AddUpdateMosqueComponent,
    AssignAdministratorComponent,
    MinistryProfileComponent,
    MosqueOnboardingRequestComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MinistryManagementRoutes),
    SharedModule
  ]
})
export class MinistryManagementModule { }
