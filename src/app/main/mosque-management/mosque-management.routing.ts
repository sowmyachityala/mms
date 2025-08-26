import { Route } from '@angular/router';
import { MosqueProfileComponent } from './mosque-profile/mosque-profile.component';
import { KeyMembersComponent } from './key-members/key-members.component';
import { MosqueInventoryComponent } from './mosque-inventory/mosque-inventory.component';
import { InventoryTrasactionComponent } from './inventory-trasaction/inventory-trasaction.component';
import { MosqueDashboardComponent } from './mosque-dashboard/mosque-dashboard.component';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { ProductThresholdComponent } from './product-threshold/product-threshold.component';
import { PayOutsComponent } from './pay-outs/pay-outs.component';
import { XendittransactionsComponent } from './xendittransactions/xendittransactions.component';
import { DisbursementRequestComponent } from './disbursement-request/disbursement-request.component';

export const MosqueManagementRoutes: Route[] = [
    {
        path :'',
        children: [
            {
                path: 'profile',
                component: MosqueProfileComponent
            },
            {
                path: 'keymembers',
                component: KeyMembersComponent
            },
            {
                path: 'inventory',
                component: MosqueInventoryComponent
            },
            {
                path: 'inventory/inventorytransactions/:inventoryGuid',
                component: InventoryTrasactionComponent
            },
            {
                path: 'controlcenter',
                component: MosqueDashboardComponent
                //,canActivate: [AuthGuard] 
            },
            { 
                path: 'controlcenter/:code/:state',
                component: MosqueDashboardComponent
            },
            {
                path:'pthreshold',
                component:ProductThresholdComponent
            },
            {
                path:'pay-outs',
                component:PayOutsComponent
            },
            {
                path: 'payment-transactions',
                component: XendittransactionsComponent
            },
            {
                path:'payout',
                component:DisbursementRequestComponent
            }
        ]
    }    
];
