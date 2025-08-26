import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ReportManagementRoutes } from './reports-routing';
import { ExcelDataComponent } from './sample-excel/excel-data.component';
@NgModule({
    declarations: [ExcelDataComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(ReportManagementRoutes),
        SharedModule,
    ],
})
export class ReportManagementModule {}
