import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HajiUmrahComponent } from './haji-umrah/haji-umrah.component';
import { PengetahuanHajiComponent } from './pengetahuan-haji/pengetahuan-haji.component';
import { DoaHajiComponent } from './doa-haji/doa-haji.component';
import { PengetahuanUmrahComponent } from './pengetahuan-umrah/pengetahuan-umrah.component';
import { DoaUmrahComponent } from './doa-umrah/doa-umrah.component';
import { DestinasiComponent } from './destinasi/destinasi.component';
import { TempaMustajabDoaComponent } from './tempa-mustajab-doa/tempa-mustajab-doa.component';
import { TempatBersejarahComponent } from './tempat-bersejarah/tempat-bersejarah.component';

export const HajiUmrahRoutes: Routes = [
    {
        path: '',
        component: HajiUmrahComponent,
    },
    {
        path: 'pengetahuan-haji',
        component: PengetahuanHajiComponent,
    },
    {
        path: 'doa-haji',
        component: DoaHajiComponent,
    },
    {
        path: 'pengetahuan-umrah',
        component: PengetahuanUmrahComponent,
    },
    {
        path: 'doa-umrah',
        component: DoaUmrahComponent,
    },
    {
        path: 'destinasi',
        component: DestinasiComponent,
    },
    {
        path: 'tempa-mustajab-doa',
        component: TempaMustajabDoaComponent,
    },
    {
        path: 'tempat-bersejarah',
        component: TempatBersejarahComponent,
    },
];
