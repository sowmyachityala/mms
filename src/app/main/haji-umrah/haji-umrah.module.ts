import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HajiUmrahRoutes } from './haji-umrah-routing';
import { HajiUmrahComponent } from './haji-umrah/haji-umrah.component';
import { PengetahuanHajiComponent } from './pengetahuan-haji/pengetahuan-haji.component';
import { PengetahuanUmrahComponent } from './pengetahuan-umrah/pengetahuan-umrah.component';
import { DoaUmrahComponent } from './doa-umrah/doa-umrah.component';
import { DoaHajiComponent } from './doa-haji/doa-haji.component';
import { RouterModule } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SharedModule } from 'app/shared/shared.module';
import { DestinasiComponent } from './destinasi/destinasi.component';
import { TempaMustajabDoaComponent } from './tempa-mustajab-doa/tempa-mustajab-doa.component';
import { TempatBersejarahComponent } from './tempat-bersejarah/tempat-bersejarah.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    HajiUmrahComponent,
    PengetahuanHajiComponent,
    PengetahuanUmrahComponent,   
    DoaUmrahComponent,
    DoaHajiComponent, 
    DestinasiComponent,
    TempaMustajabDoaComponent,
    TempatBersejarahComponent
  ],
  imports: [
    RouterModule.forChild(HajiUmrahRoutes),
    CommonModule,
    SharedModule,
    MatTabsModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class HajiUmrahModule { }
