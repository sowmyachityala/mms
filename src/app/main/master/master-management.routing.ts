import { Route } from "@angular/router";
import { ProductCategoryComponent } from "./product-category/product-category.component";
import { ProductSubCategoriesComponent } from "./product-sub-categories/product-sub-categories.component";
import { SupplierComponent } from "./supplier/supplier.component";
import { MenuActionsComponent } from "./menu-actions/menu-actions.component";
import { BusinessActionsComponent } from "./business-actions/business-actions.component";
import { UserRolesComponent } from "./user-roles/user-roles.component";
import { TranslationsComponent } from "./translations/translations.component";
import { RoleGuard } from "app/core/auth/guards/role.guard";
import { AuthGuard } from "app/core/auth/guards/auth.guard";
import { ChildAuthGuard } from "app/core/auth/guards/childAuth.guard";
import { BankAccountsComponent } from "./bank-accounts/bank-accounts.component";
import { MosqueQrcodeComponent } from "./mosque-qrcode/mosque-qrcode.component";
import { DonatonPurposeComponent } from "./donation-purpose/donaton-purpose.component";
import { PaymentGatewayFeeComponent } from "./payment-gateway-fee/payment-gateway-fee.component";

export const MasterManagementRoutes: Route[] = [
    {
        path: '',
        //component: ProductCategoryComponent,        
        children: [
            {
                path: 'productcategory',
                component: ProductCategoryComponent,
            },
            {
                path: 'productcategory/:categoryParentId/:categoryGuid',
                component: ProductCategoryComponent
            },
            {
                path: 'productcategory/:categoryGuid',
                component: ProductCategoryComponent
            },
            {
                path: 'productSubcategory/:categoryGuid',
                component: ProductSubCategoriesComponent
            },
            {
                path    :  'menuactions' ,
                component: MenuActionsComponent,
                canActivate :   [RoleGuard],
                data        :   { expectedRoles:  ['SUPER ADMIN','MINISTRY ADMIN'] }
            },
            {
                path    :       'businessactions' ,
                component:      BusinessActionsComponent,
                canActivate :   [RoleGuard],
                data        :   { expectedRoles:  ['SUPER ADMIN','MINISTRY ADMIN'] }
            },
            {
                path        :   'roles',
                component   :   UserRolesComponent,
                canActivate :   [RoleGuard],
                data        :   { expectedRoles:  ['SUPER ADMIN','MINISTRY ADMIN'] }
            },           
            {
                path        :   'suppliers',
                component   :   SupplierComponent, 
                canActivate :   [RoleGuard],
                //data        :   { expectedRole:  'MINISTRY ADMIN' }
                data        :   { expectedRoles:  ['SUPER ADMIN','MINISTRY ADMIN','SUPER MOSQUE ADMIN','MOSQUE ADMIN'] }
            },
            {
                path        :   'translations',
                component   :   TranslationsComponent, 
                canActivate :   [RoleGuard],
                data        :   { expectedRoles:  ['SUPER ADMIN','MINISTRY ADMIN'] }
            },
            {
                path     : 'bankaccounts',
                component: BankAccountsComponent
            },
            {
                path     : 'qrcode',
                component: MosqueQrcodeComponent
            },
            {
                path     : 'donationpurpose',
                component: DonatonPurposeComponent
            },
            {
                path      :'paymentfee',
                component : PaymentGatewayFeeComponent
            }
        ]
    }
]