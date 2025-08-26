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
import { NintynineNamesComponent } from './nintynine-names/nintynine-names.component';
import { IslamicKnowledgeRoutes } from './islamic-knowledge-routing';
import { SharedModule } from 'app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DailyAyatComponent } from './daily-ayat/daily-ayat.component';
import { WuduGuideComponent } from './wudu-guide/wudu-guide.component';
import { DailyDuasComponent } from './daily-duas/daily-duas.component';
import { DailyHadithComponent } from './daily-hadith/daily-hadith.component';
import { InspGeetingsComponent } from './insp-greetings/insp-geetings.component';
import { RukunIslamComponent } from './rukun-islam/rukun-islam.component';
import { RukunImanComponent } from './rukun-iman/rukun-iman.component';
import { BaccanShalatComponent } from './baccan-shalat/baccan-shalat.component';
import { DakwahComponent } from './dakwah/dakwah.component';
import { IslamicPhrasesComponent } from './islamic-phrases/islamic-phrases.component';
import { KhutbahJumatComponent } from './khutbah-jumat/khutbah-jumat.component';

@NgModule({
 declarations: [
         NintynineNamesComponent,
         DailyAyatComponent,
         WuduGuideComponent,
         DailyDuasComponent,
         DailyHadithComponent,
         InspGeetingsComponent,
         RukunIslamComponent,
         RukunImanComponent,
         BaccanShalatComponent,
         DakwahComponent,
         IslamicPhrasesComponent,
         KhutbahJumatComponent
     ],
     imports     : [
         RouterModule.forChild(IslamicKnowledgeRoutes),
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
     providers: [
         { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
     ]
})
export class IslamicKnowledgeModule { }
