import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    NgModule,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { FuseCardModule } from '@fuse/components/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StylePaginatorDirective } from 'app/paginatorStyleDirective';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from 'app/common/map/map.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmationDialogComponent } from 'app/main/dialogs/mosque-confirmation-dialog/confirmation-dialog.component';
import { OnlyNumberDirective } from 'app/only-number.directive';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';
import { ImageUploadComponent } from 'app/common/image-upload/image-upload.component';
import { QrcodePrintComponent } from 'app/common/qrcode-print/qrcode-print.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
// import { EmbedVideo } from 'ngx-embed-video';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CalculatorComponent } from 'app/main/donations/calculator/calculator.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FileDragDropDirective } from 'app/main/mosque-management/directive/file-drag-drop.directive';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import {
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
} from '@mat-datetimepicker/core';
import { ZakatCalculatorComponent } from 'app/main/donations/zakat-calculator/zakat-calculator.component';
//import { NgDragDropModule } from 'ng-drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClipboardModule } from 'ngx-clipboard';
import { WebcamModule } from 'ngx-webcam';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MosqqueFollowerComponent } from 'app/main/dialogs/mosque-follower/mosqque-follower.component';
import { TodayAttendiesComponent } from 'app/main/dialogs/today-attendies/today-attendies.component';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
    declarations: [
        StylePaginatorDirective,
        OnlyNumberDirective,
        MapComponent,
        ConfirmationDialogComponent,
        ImageUploadComponent,
        QrcodePrintComponent,
        CalculatorComponent,
        FileDragDropDirective,
        ZakatCalculatorComponent,
        MosqqueFollowerComponent,
        TodayAttendiesComponent,
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatTableModule,
        MatChipsModule,
        FuseCardModule,
        MatPaginatorModule,
        GoogleMapsModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatCheckboxModule,
        FuseAlertModule,
        MatTooltipModule,
        MatStepperModule,
        MatRadioModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        NgxMatDatetimePickerModule,
        MatDatepickerModule,
        NgxMatNativeDateModule,
        NgxPayPalModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        MatAutocompleteModule,
        // EmbedVideo.forRoot(),
        NgImageSliderModule,
        MatSelectModule,
        MatCardModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        NgxSpinnerModule,
        MatExpansionModule,
        MatTabsModule,
        MatListModule,
        MatToolbarModule,
        MatGridListModule,
        NgxQrcodeStylingModule,
        //NgDragDropModule.forRoot()
        MatNativeDateModule,
        MatDatetimepickerModule,
        MatNativeDatetimeModule,
        FlexLayoutModule,
        ClipboardModule,
        WebcamModule,
        NgxMatSelectSearchModule,
    ],
    exports: [
        StylePaginatorDirective,
        OnlyNumberDirective,
        MapComponent,
        ConfirmationDialogComponent,
        ImageUploadComponent,
        QrcodePrintComponent,
        CalculatorComponent,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatTableModule,
        MatChipsModule,
        FuseCardModule,
        MatPaginatorModule,
        GoogleMapsModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatCheckboxModule,
        FuseAlertModule,
        MatTooltipModule,
        MatStepperModule,
        MatRadioModule,
        NgxMatDatetimePickerModule,
        MatDatepickerModule,
        NgxMatNativeDateModule,
        NgxPayPalModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        MatAutocompleteModule,
        // EmbedVideo,
        NgImageSliderModule,
        MatSelectModule,
        MatCardModule,
        NgxSpinnerModule,
        MatExpansionModule,
        MatTabsModule,
        MatListModule,
        MatToolbarModule,
        MatGridListModule,
        CalendarModule,
        TranslateModule,
        NgxQrcodeStylingModule,
        //NgDragDropModule
        FileDragDropDirective,
        MatNativeDateModule,
        MatDatetimepickerModule,
        MatNativeDatetimeModule,
        ZakatCalculatorComponent,
        FlexLayoutModule,
        ClipboardModule,
        WebcamModule,
        NgxMatSelectSearchModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },DatePipe],
})
export class SharedModule {}
