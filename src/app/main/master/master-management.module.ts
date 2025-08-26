import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { RouterModule } from '@angular/router';
import { MasterManagementRoutes } from './master-management.routing';
import { SharedModule } from 'app/shared/shared.module';
import { AddUpdateCategoriesComponent } from './add-update-categories/add-update-categories.component';
import { ProductSubCategoriesComponent } from './product-sub-categories/product-sub-categories.component';
import { SupplierComponent } from './supplier/supplier.component';
import { MenuActionsComponent } from './menu-actions/menu-actions.component';
import { BusinessActionsComponent } from './business-actions/business-actions.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { TranslationsComponent } from './translations/translations.component';
import { BankAccountsComponent } from './bank-accounts/bank-accounts.component';
import { MosqueQrcodeComponent } from './mosque-qrcode/mosque-qrcode.component';
import { DonatonPurposeComponent } from './donation-purpose/donaton-purpose.component';
import { PaymentGatewayFeeComponent } from './payment-gateway-fee/payment-gateway-fee.component';



@NgModule({
  declarations: [ProductCategoryComponent,
      AddUpdateCategoriesComponent,
      ProductSubCategoriesComponent,
      MenuActionsComponent,
      BusinessActionsComponent,
      UserRolesComponent,       
      SupplierComponent, 
      TranslationsComponent,
      BankAccountsComponent,
      MosqueQrcodeComponent,
      DonatonPurposeComponent,
      PaymentGatewayFeeComponent
      ],
  imports: [
    CommonModule,
    RouterModule.forChild(MasterManagementRoutes),
    SharedModule
  ]
})
export class MasterManagementModule { }
