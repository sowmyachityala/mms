import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationsComponent } from './donations/donations.component';
import { RouterModule } from '@angular/router';
import { DonationsRoutes } from './donations.routing';
import { SharedModule } from 'app/shared/shared.module';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { DonationsuccessComponent } from './donationsuccess/donationsuccess.component';
import { DonationfailureComponent } from './donationfailure/donationfailure.component';
import { DonationChargesComponent } from './donation-charges/donation-charges.component';


@NgModule({
  declarations: [
    DonationsComponent,
    TransactionHistoryComponent,
    DonationsuccessComponent,
    DonationfailureComponent,
    DonationChargesComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DonationsRoutes),
    SharedModule
  ]
})
export class DonationsModule { }
