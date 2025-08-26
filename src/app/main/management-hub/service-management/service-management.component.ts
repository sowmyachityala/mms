import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MasterService } from 'app/services/master.service';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToasterService } from 'app/services/toaster.service';
import { AddServiceCallComponent } from '../add-servicecall/add-servicecall.component';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'app/services/shared.service';
import { AuthService } from 'app/services/auth.service';
import { DonationsService } from 'app/services/donations.service';
import { result } from 'lodash';

interface ParentData {
    serviceCallId: string;
    categoryId: number;
    vendorName: string;
    vendorPhoneNumber: string;
    categoryName: string;
    adminDescription: string;
    visitTimeFrom: string;
    visitTimeTo: string;
    natureOfFault: string;
    raisedBy: string;
}

interface ChildData {
    serviceCallId: string;
    productId: number;
    productName: string;
    productStatus: number;
    quantity: number;
    defectImageName: string;
}

@Component({
    selector: 'app-service-management',
    templateUrl: './service-management.component.html',
    styleUrls: ['./service-management.component.scss'],
})
export class ServiceManagementComponent implements OnInit {
    isLoading = true;
    searchKey: string;
    pageLength = 7;
    mosqueGuid: string = '';
    isDashboard = true;
    pageSize = 10;
    serviceCreation: string;
    roleInfoForm: FormGroup;
    statusSelected: string;
    selectedStatusValue: string;
    selectedElement: any;
    statusRef: MatDialogRef<any>;
    searchInputControl: FormControl = new FormControl();
    @ViewChild('roleInfoDialog', { static: true })
    roleInfoDialog: TemplateRef<any>;
    parentData = [];
    childData = [];
    reasonControl: FormControl = new FormControl('');
    mosqueInfo: any;
    dataSource: MatTableDataSource<any> = new MatTableDataSource(
        this.parentData
    );
    @ViewChild(MatPaginator) paginator: MatPaginator;
    sOrdersCounts: any;
    filterValue: number;

    statusList = [
        {
            value: 0,
            label: 'all',
            imgPath: 'assets/images/sms/asset-1.png',
            sCount: 0,
        },
        {
            value: 10,
            label: 'open',
            imgPath: 'assets/images/sms/asset-2.png',
            sCount: 0,
        },
        {
            value: 20,
            label: 'vendorAccepted',
            imgPath: 'assets/images/sms/asset-3.png',
            sCount: 0,
        },
        {
            value: 30,
            label: 'vendorRejected',
            imgPath: 'assets/images/sms/asset-4.png',
            sCount: 0,
        },
        {
            value: 40,
            label: 'technicianAssigned',
            imgPath: 'assets/images/sms/asset-5.png',
            sCount: 0,
        },
        {
            value: 50,
            label: 'selfAssigned',
            imgPath: 'assets/images/sms/asset-6.png',
            sCount: 0,
        },
        {
            value: 60,
            label: 'attended',
            imgPath: 'assets/images/sms/asset-7.png',
            sCount: 0,
        },
        {
            value: 70,
            label: 'inProgress',
            imgPath: 'assets/images/sms/asset-8.png',
            sCount: 0,
        },
        {
            value: 80,
            label: 'hold',
            imgPath: 'assets/images/sms/asset-9.png',
            sCount: 0,
        },
        {
            value: 90,
            label: 'approvalRequired',
            imgPath: 'assets/images/sms/asset-10.png',
            sCount: 0,
        },
        {
            value: 100,
            label: 'approve',
            imgPath: 'assets/images/sms/asset-11.png',
            sCount: 0,
        },
        {
            value: 110,
            label: 'paymentsent',
            imgPath: 'assets/images/sms/asset-2.png',
            sCount: 0,
        },
        {
            value: 120,
            label: 'paidToVendor',
            imgPath: 'assets/images/sms/asset-12.png',
            sCount: 0,
        },
    ];

    productStatusData = [
        { value: 10, label: 'On Hold', isActive: true },
        { value: 20, label: 'Estimated', isActive: true },
        { value: 30, label: 'Accepted', isActive: true },
        { value: 40, label: 'Denied', isActive: true },
        { value: 50, label: 'Close', isActive: true },
    ];

    displayedColumns = [
        'serviceCallId',
        'categoryName',
        'natureOfFault',
        'adminDescription',
        'vendorName',
        'raisedBy',
        'status',
        'visitTimeFrom',
        'visitTimeTo',
        'action',
    ];
    expandedElement: ParentData | null;

    constructor(
        private dialog: MatDialog,
        private masterService: MasterService,
        private fb: FormBuilder,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private toaster: ToasterService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private sharedService: SharedService,
        private authService: AuthService,
        private donationService: DonationsService
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    ngOnInit() {
        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid ?? '';
        }
        // this.getServiceitems(0);
        this.getServiceOrdersCounts();
        this.searchInputControl.valueChanges.subscribe((value) => {
            this.applyFilter(value);
            this.expandedElement = null;
        });
    }

    getServiceCallStatusLabel(value: number) {
        const status = this.statusList.find((status) => status.value === value);
        return status ? status.label : undefined;
    }

    getStatusLabel(value: number): string | undefined {
        const status = this.productStatusData.find(
            (status) => status.value === value
        );
        return status ? status.label : undefined;
    }

    getServiceitems(value) {
        this.filterValue = value;
        this.isDashboard = false;
        this.masterService
            .getServiceCallData(this.mosqueGuid, value)
            .subscribe((res: any) => {
                this.parentData = res.data;
                this.dataSource.data = this.parentData;
                this.dataSource.paginator = this.paginator;
                this.isLoading = false;
            });
    }
    getServiceOrdersCounts() {
        this.masterService
            .getWorkOrderCounts(this.mosqueGuid)
            .subscribe((res: any) => {
                this.sOrdersCounts = res.data;
                this.statusList[0].sCount = res.data?.allOrders;
                this.statusList[1].sCount = res.data?.newOrders;
                this.statusList[2].sCount = res.data?.acceptedOrders;
                this.statusList[3].sCount = res.data?.rejectedOrders;
                this.statusList[4].sCount = res.data?.techAssignOrders;
                this.statusList[5].sCount = res.data?.selfAssignOrders;
                this.statusList[6].sCount = res.data?.vendorAttend;
                this.statusList[7].sCount = res.data?.inProgressOrder;
                this.statusList[8].sCount = res.data?.holdOrders;
                this.statusList[9].sCount = res.data?.approvalRequiredOrders;
                this.statusList[10].sCount = res.data?.closedOrders;
                this.statusList[11].sCount = res.data?.paidOrders;
                this.statusList[12].sCount = res.data?.paidToVenodrOrders;
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    createServiceCall() {
        const dialogRef = this.dialog.open(AddServiceCallComponent, {
            panelClass: 'fullscreen-dialog',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getServiceitems(0);
            }
        });
    }
    updateServiceCall(serviceCallId: string) {
        const dialogRef = this.dialog.open(AddServiceCallComponent, {
            panelClass: 'fullscreen-dialog',
            data: {
                serviceCallId: serviceCallId,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getServiceitems(0);
            }
        });
    }

    approveForPayment(element: any) {
        this.reasonControl.reset();
        this.selectedStatusValue = '100';
        this.selectedElement = element;
        const selectedStatus = this.statusList.find(
            (status) => status.value === Number(this.selectedStatusValue)
        );

        if (selectedStatus) {
            this.statusSelected = selectedStatus.label;
        }

        this.statusRef = this.dialog.open(this.roleInfoDialog);
        this.statusRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getServiceitems(0);
            }
        });
    }

    confirmChange() {
        const reason = this.reasonControl.value;
        const element = this.selectedElement;
        console.log('Confirmed status change to:', this.statusSelected);
        console.log('Reason:', reason);
        console.log('Element:', element);
        const payload = {
            serviceCallId: element.serviceCallId,
            status: this.selectedStatusValue,
            reason: reason,
            UpdateBy: 'Admin',
        };
        if (this.reasonControl.value) {
            this.masterService.serviceTicketStatusUpdate(payload).subscribe(
                (res: any) => {
                    if (res?.success) {
                        this.toaster.triggerToast({
                            type: 'success',
                            message: 'Success',
                            description: 'Status Updated successfully',
                        });
                        this.statusRef.close(true);
                    } else {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Validation error',
                            description: res?.message,
                        });
                    }
                },
                (err) => {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Error',
                        description: err.error.message,
                    });
                }
            );
        }
    }

    onExpand(element: ParentData): void {
        if (this.expandedElement === element) {
            this.expandedElement = null;
        } else {
            this.expandedElement = element;
            this.fetchChildData(element.serviceCallId);
        }
    }

    fetchChildData(serviceCallId: string): void {
        this.masterService
            .getServiceCallChildData(serviceCallId)
            .subscribe((data: any) => {
                const childitem: ChildData[] = data.data;
                this.childData = childitem;
            });
    }

    pageChangeEvent(event) {
        event;
    }
    onClose() {
        this.statusRef.close();
    }
    backToDashboard() {
        this.getServiceOrdersCounts();
        this.isDashboard = true;
    }

    approveOrRejectEstimation(serviceCallId, productId, status) {
        let body = {
            serviceCallId: serviceCallId,
            productId: productId,
            updateBy: 'Admin',
            productStatus: status,
        };
        this.masterService
            .approveSericeItemEstimation(body)
            .subscribe((res: any) => {
                if (res?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.message,
                    });
                    this.getServiceitems(this.filterValue);
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.message,
                    });
                }
            });
    }

    confirmDeactiveUser(serviceCallId) {
        const payload = {
            mosqueGuid: this.mosqueGuid,
            serviceCallId: serviceCallId.serviceCallId,
            estimatedAmount: serviceCallId.estimatedAmount,
            vendordetails: serviceCallId.vendorName,
        };
        const confirmation = this._fuseConfirmationService.open({
            title: 'Payment Request',
            message: `Are you sure, you want to send a request to AMS with the following Amount
          <strong>${payload.estimatedAmount} /-</strong> ?`,
            icon: {
                name: 'heroicons_outline:check-circle',
                color: 'success',
            },
            actions: {
                confirm: {
                    label: 'Ok',
                    color: 'primary',
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.donationService
                    .payRequestToAms(payload)
                    .subscribe((res: any) => {
                        if (res?.result.success) {
                            this.toaster.triggerToast({
                                type: 'success',
                                message: 'Success',
                                description: res?.result.message,
                            });
                            this.getServiceitems(this.filterValue);
                        } else {
                            this.toaster.triggerToast({
                                type: 'error',
                                message: 'Validation error',
                                description: res?.result.message,
                            });
                        }
                    });
                //  type === 'activate' ? this.updateUserStatus(userDetails?.contactGuid, type, '9381a6ec-8e33-46eb-b52d-cc7fa688d437') : type === 'deactivate' ? this.updateUserStatus(userDetails?.contactGuid, type, '3022f59c-6676-4f6f-aded-7cf4fb9971a9') : null;
            }
        });
    }
}
