import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMosquesComponent } from './admin-mosques/admin-mosques.component';
import { RouterModule } from '@angular/router';
import { MosqueAdminRoutes } from './mosque-admin.routing';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [
    AdminMosquesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MosqueAdminRoutes),
    SharedModule
  ]
})
export class MosqueAdminModule { }
