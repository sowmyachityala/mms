import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ManagementHubRoutes } from './management-hub.routing';
import { ServiceManagementComponent } from './service-management/service-management.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { AddServiceCallComponent } from './add-servicecall/add-servicecall.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    ServiceManagementComponent,
    AddServiceCallComponent,
    AccountManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ManagementHubRoutes),
    SharedModule    
  ],
  providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class ManagementHubModule { }
