import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import {
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';
import { mockApiServices } from './layout/common';
import { ComingSoonComponent } from './common/coming-soon/coming-soon.component';
import { SharedModule } from './shared/shared.module';
import { AvailableAdminMosquesComponent } from './common/available-admin-mosques/available-admin-mosques.component';
import { UserProfileDetailsUpdateComponent } from './main/dialogs/user-profile/user-profile-details-update/user-profile-details-update.component';
import { UpdateQuranicVerseDialogComponent } from './main/dialogs/update-quranic-verse-dialog/update-quranic-verse-dialog.component';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
};

@NgModule({
    declarations: [
        AppComponent,
        ComingSoonComponent,
        AvailableAdminMosquesComponent,
        UserProfileDetailsUpdateComponent,
        UpdateQuranicVerseDialogComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,
        // Layout module of your application
        LayoutModule,
        ToastrModule.forRoot(),
        SharedModule
    ],
    bootstrap: [AppComponent],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'fill' } as MatFormFieldDefaultOptions,
        },
    ],
})
export class AppModule {}
