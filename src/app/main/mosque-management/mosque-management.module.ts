import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MosqueProfileComponent } from './mosque-profile/mosque-profile.component';
import { RouterModule } from '@angular/router';
import { MosqueManagementRoutes } from './mosque-management.routing';
import { SharedModule } from 'app/shared/shared.module';
import { KeyMembersComponent } from './key-members/key-members.component';
import { AddKeyMemberComponent } from './add-key-member/add-key-member.component';
import { MosqueInventoryComponent } from './mosque-inventory/mosque-inventory.component';
import { InventoryTrasactionComponent } from './inventory-trasaction/inventory-trasaction.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
//import { FileDragDropDirective } from './directive/file-drag-drop.directive';
import { UploadInvoiceComponent } from './upload-invoice/upload-invoice.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PendingAssetsComponent } from './pending-asset-donations/pending-assets.component';
import { MosqueDashboardComponent } from './mosque-dashboard/mosque-dashboard.component';
import { WebcamComponent } from './web-cam/webcam.component';
import { VideostreamComponent } from './video-stream/videostream.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { StarRatingDirective } from 'app/StarRatingDirective ';
import { CircleChartComponent } from './circle-chart/circle-chart.component';
import { ProductThresholdComponent } from './product-threshold/product-threshold.component';
import { PayOutsComponent } from './pay-outs/pay-outs.component';
import { XendittransactionsComponent } from './xendittransactions/xendittransactions.component';
import { DisbursementRequestComponent } from './disbursement-request/disbursement-request.component';

@NgModule({
  declarations: [
    MosqueProfileComponent,
    KeyMembersComponent,
    AddKeyMemberComponent,
    MosqueInventoryComponent,
    InventoryTrasactionComponent,
    AddInventoryComponent,
    //FileDragDropDirective,
    UploadInvoiceComponent,
    PendingAssetsComponent,
    MosqueDashboardComponent,
    WebcamComponent,
    VideostreamComponent,
    StarRatingComponent,
    StarRatingDirective,
    CircleChartComponent,
    ProductThresholdComponent,
    PayOutsComponent,
    XendittransactionsComponent,
    DisbursementRequestComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MosqueManagementRoutes),
    SharedModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})

export class MosqueManagementModule { }
