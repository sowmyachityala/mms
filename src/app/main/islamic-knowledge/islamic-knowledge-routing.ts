import { Route } from '@angular/router';
import { NintynineNamesComponent } from './nintynine-names/nintynine-names.component';
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

export const IslamicKnowledgeRoutes: Route[] = [
    {
        path     : 'nintynine-names',
        component: NintynineNamesComponent
    },
    {
        path     : 'daily-ayat',
        component: DailyAyatComponent
    },
    {
        path     : 'wudu-guide',
        component:WuduGuideComponent
    },
     {
        path     : 'daily-duas',
        component: DailyDuasComponent
    },
    {
        path     : 'daily-hadith',
        component: DailyHadithComponent
    },
    {
        path     : 'insp-greetings',
        component:InspGeetingsComponent
    },
     {
        path     : 'rukun-islam',
        component: RukunIslamComponent
    },
    {
        path     : 'rukun-iman',
        component: RukunImanComponent
    },
    {
        path     : 'baccan-shalat',
        component:BaccanShalatComponent
    },
     {
        path     : 'dakwah',
        component: DakwahComponent
    },
    {
        path     : 'islamic-phrases',
        component: IslamicPhrasesComponent
    },
    {
        path     : 'khutbah-jumat',
        component:KhutbahJumatComponent
    }
];
