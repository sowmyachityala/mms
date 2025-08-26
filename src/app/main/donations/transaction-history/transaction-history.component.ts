import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { DonationsService } from 'app/services/donations.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent {
    imageEndPoints = environment.imageEndPoints;
    isLoading = false;
    pageLength = 0;
    pageSize = 10;
    searchInputControl: FormControl = new FormControl();
    searchKey: string;
    totalTxAmount: number = 0;
    dataSource: any = new MatTableDataSource<any>();
    // displayedColumns = [
    //     'payeeName',
    //     'id',
    //     'description',
    //     'type',
    //     'cardNumber',
    //     'ip',
    //     'amount',
    //     'updated_at',
    //     'status',
    // ];
    displayedColumns = [
        'id',
        'fullName',
        'phoneNumber',
        'payerEmail',
        'amount',
        'description',
        'paidAt',
        'currency',
        'status',
    ];
    isAuthenticated: boolean = false;
    transactionsList = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    usersChecked = true;
    direction: string = 'ltr';
    userCurrency: string;
    mosqueGuid: string = '';
    mosqueInfo: any;

    constructor(
        public transDialogRef: MatDialogRef<TransactionHistoryComponent>,
        private authService: AuthService,
        private toaster: ToasterService,
        private sharedService: SharedService,
        private donationService: DonationsService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private router: Router
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    ngOnInit(): void {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });

        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid
                ? this.mosqueInfo?.mosqueContactGuid
                : '';
        }
        this.getAllTransactions();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.dataSource.filter = filterValue;
        this.searchKey = filterValue;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getAllTransactions() {
        this.isLoading = true;
        this.donationService.getTransactionLogList(this.mosqueGuid).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.isLoading = false;
                    this.transactionsList = res?.result?.data;

                    this.totalTxAmount = res?.result?.data?.totalAmount;
                    this.userCurrency = res?.result?.data?.userCurrency;
                    this.dataSource = new MatTableDataSource(
                        res?.result?.data?.vmPaymentInfo
                    );
                    this.dataSource.paginator = this.paginator;
                    this.pageLength = res?.result?.data?.vmPaymentInfo?.length;
                } else {
                    this.isLoading = false;
                    this.toaster.triggerToast({
                        type: 'info',
                        message: 'Information',
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

    onClose() {
        this.transDialogRef.close();
    }

    onDonateNow() {
        this.transDialogRef.close();
        if (this.router.url !== '/donations') {
            this.router.navigate(['/donations']);
        }
    }
}
