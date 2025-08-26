import { LOCALE_ID, NgModule } from '@angular/core';
import { CalDialogComponent } from './cal-dailog/cal-dialog.component';
import { WebDonationComponent } from './web-donation/web-donation.component';
import { RouterModule } from '@angular/router';
import { WebDonationRoutes } from './web-donation.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { SuccessDonationComponent } from './donation-success/success-donation.component';
import { FailDonationComponent } from './donation-fail/fail-donation.component';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';

registerLocaleData(localeId, 'id');

@NgModule({
  declarations: [
    CalDialogComponent,
    WebDonationComponent,
    SuccessDonationComponent,
    FailDonationComponent
  ],
  imports: [
        RouterModule.forChild(WebDonationRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'id' }],
})
export class WebDonationModule { }
