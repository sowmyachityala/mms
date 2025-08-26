import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { DonationsService } from 'app/services/donations.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';

// interface ParentData {
//     type: string;
//     channel_category: string;
//     channel_code: string;
//     amount: number;
//     currency: string;
//     status: string;
//     net_amount: number;
//     cashflow: string;
//     settlement_status: string;
//     estimated_settlement_time: string;
// }

// interface ChildData {
//     xendit_fee: number;
//     value_added_tax: number;
//     xendit_withholding_tax: number;
//     third_party_withholding_tax: number;
//     status: string;
// }

interface ParentData {
    transactionId: string;
    paymentChannel: string;
    paymentMethod: string;
    amount: number;
    currency: string;
    paymentStatus: string;
    paymentGateway: number;
    paidAt: string;
}

interface ChildData {
    //transactionId: string;
    donationAmount: number;
    transactionAmount: number;
    vatAmount: number;
    serviceAmount: number;
    paidAmount: string;
}

@Component({
    selector: 'app-xendittransactions',
    templateUrl: './xendittransactions.component.html',
    styleUrl: './xendittransactions.component.scss',
})
export class XendittransactionsComponent implements OnInit {
    isPayRegistred: boolean = false; // Declare and initialize the variable
    mosqueEmail: string;
    mosqueGuid: string = '';
    externalId: string = '';
    mosqueInfo: any;
    isLoading = false;
    pageLength = 0;  pageSize = 10;   pageIndex=1;searchForm: FormGroup;
    searchInputControl: FormControl = new FormControl();
    searchKey: string;
    totalAvlAmount: number = 0;
    mosqueName: string = '';
    displayedColumns = [
        'transactionId',
        'currency',
        'paymentChannel',
        'paymentMethod',
        'paymentGateway',
        'amount',
        'donationAmount',
        'paymentStatus',
        //'donatedBy',
        'paidAt',
        'action',
    ];
    expandedElement: ParentData | null;
    parentData = [];
    childData = [];
    dataSource: MatTableDataSource<any> = new MatTableDataSource(
        this.parentData
    );
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private donationService: DonationsService,
        private sharedService: SharedService,
        private toaster: ToasterService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private fb: FormBuilder
    ) {
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }
    ngOnInit(): void {
        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid;
            this.mosqueName = this.mosqueInfo?.mosqueName;
        }

        this.searchForm = this.fb.group({
            mosqueGuid: this.mosqueGuid,
            paymentChannel: [],
            status: [],
            pageIndex: [],
            pageSize: [],
            isFilter: [false],
        });

        this.checkXenditRegForMosque();
       
    }

    checkXenditRegForMosque() {        
        this.donationService
            .checkMosqueRegForXendit(this.mosqueGuid)
            .subscribe((res: any) => {
                if (res.result.success == true) {
                    this.externalId = res?.result.data?.forUserId;
                    this.isPayRegistred = res?.result?.data?.isPayRegistred;
                    this.mosqueEmail = res?.result?.data?.email;
                    this.mosqueName = res?.result?.data?.mosqueName;
                    this.getAllTransactions();
                } else {
                    this.isPayRegistred =
                        res?.result?.data?.isPayRegistred || false;
                    this.mosqueEmail = res?.result?.data?.email;
                }
            });
    }


    getAllTransactions() {
        this.isLoading = true;
        this.searchForm.patchValue({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
        });
        let formValue = this.searchForm.value;
        this.donationService
            .getAllPaymentTransactions(formValue)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.isLoading = false;
                        this.parentData = res?.result?.data?.vmPaymentTransaction;
                        this.dataSource = new MatTableDataSource(
                            res?.result?.data?.vmPaymentTransaction
                        );
                        this.dataSource.paginator = this.paginator;
                        this.pageLength = res?.result?.data?.totalRecords;
                        this.getMosqueAvailableBalance();
                    } else {
                        this.isLoading = false;
                        this.toaster.triggerToast({
                            type: 'info',
                            message: 'Info',
                            description: res?.result?.message,
                        });
                    }
                },
                (err) => {
                    this.isLoading = false;
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: err?.error?.message,
                    });
                }
            );
    }

    getMosqueAvailableBalance() {
        this.donationService
            .getMosqueAvailableBalance(this.externalId)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.totalAvlAmount = res?.result?.data?.balance;
                    } else {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Validation error',
                            description: res?.result?.message,
                        });
                    }
                },
                (err) => {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: err?.error?.message,
                    });
                }
            );
    }

    onExpand(element: ParentData): void {
        if (this.expandedElement === element) {
            this.expandedElement = null;
        } else {
            this.expandedElement = element;
            this.fetchChildData(element);
        }
    }

    fetchChildData(element): void {
        const childitem: ChildData[] = Array(element);
        this.childData = childitem;
    }
    ResetFilterList() {
        this.pageSize = 10;
        this.pageIndex = 1;
        this.searchForm.patchValue({
            paymentChannel: '',
            status: '',
            isFilter: false,
        });
        this.checkXenditRegForMosque();
    }
    SearchFilter() {
        this.searchForm.patchValue({
            isFilter: true,
        });
        this.checkXenditRegForMosque();
    }
    onPageChange(event: any): void {
      this.pageIndex = event.pageIndex + 1; 
      this.pageSize = event.pageSize; 
      this.checkXenditRegForMosque();  
    }
}
