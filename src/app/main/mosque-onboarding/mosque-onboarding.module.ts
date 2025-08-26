import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MosqueOnboardRoutes } from './mosque-onboarding.routing';
import { MosqueOnboardingComponent } from './mosque-onboarding.component';

@NgModule({
    declarations: [
        MosqueOnboardingComponent,

    ],
    imports: [
        RouterModule.forChild(MosqueOnboardRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule,
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class MosqueOnboardingModule {}
