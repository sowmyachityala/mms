import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './dashboard.routing';
import { SharedModule } from 'app/shared/shared.module';
import { EssentialProductsComponent } from './essential-products/essential-products.component';
// import { RoutedDashboardComponent } from './routed-dashboard/routed-dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    // RoutedDashboardComponent
    EssentialProductsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    SharedModule
  ],
  providers:[DatePipe]
})
export class DashboardModule { }
