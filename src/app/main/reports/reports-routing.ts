import { Route } from '@angular/router';
import { ExcelDataComponent } from './sample-excel/excel-data.component';

export const ReportManagementRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'excel',
                component: ExcelDataComponent,
            },
        ],
    },
];
