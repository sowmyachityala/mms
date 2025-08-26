import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { DonationsService } from 'app/services/donations.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { DisbursementRequestComponent } from '../disbursement-request/disbursement-request.component';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pay-outs',
    templateUrl: './pay-outs.component.html',
    styleUrl: './pay-outs.component.scss',
})
export class PayOutsComponent {
    mosqueInfo: any;
    mosqueGuid: string = '';
    direction: string = 'ltr';
    allPayOuts = [];
    pageLength = 0;
    isLoading = true;
    searchKey: string;
    pageSize = 10; pageIndex=1;searchForm: FormGroup;
    dataSource: any = new MatTableDataSource<any>();
    displayedColumns: string[] = [
        'amount',
        'channelCode',
        'currency',
        'description',
        'estimatedArrivalTime',
        'status',
        'account_number',
        'account_holder_name',
        'email_to',
        'email_cc',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    searchInputControl: FormControl = new FormControl();
    currentActions: any;
    totalAvlAmount: number = 0;
    externalId: string = '';
    isPayRegistred: boolean = false; // Declare and initialize the variable
    mosqueEmail: string;
    mosqueName: string;

    constructor(
        private sharedService: SharedService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private donationService: DonationsService,
        private toaster: ToasterService,
        private dialog: MatDialog,
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }
    ngOnInit() {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });

        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            this.mosqueGuid =
                this.mosqueInfo != null
                    ? this.mosqueInfo?.mosqueContactGuid
                    : '';
            this.mosqueName = this.mosqueInfo?.mosqueName ?? '';
        }
        this.currentActions = this.sharedService.getCurrentPageActions();
         this.searchForm = this.fb.group({
            mosqueGuid: this.mosqueGuid,
            status: [],
            pageIndex: [],
            pageSize: [],
            isFilter: [false],
        });
        this.GetAllPayOutTransactions();
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
                    this.getMosqueAvailableBalance();
                } else {
                    this.isPayRegistred =
                        res?.result?.data?.isPayRegistred || false;
                    this.mosqueEmail = res?.result?.data?.email;
                }
            });
    }
    GetAllPayOutTransactions() {
         this.searchForm.patchValue({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
        });
        let formValue = this.searchForm.value;
        this.donationService.getAllPayOuts(formValue).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.isLoading = false;
                    this.allPayOuts = res?.result?.data?.xenditPayouts;
                    this.dataSource = new MatTableDataSource(res?.result?.data?.xenditPayouts);
                    this.dataSource.paginator = this.paginator;
                    this.pageLength = res?.result?.data?.totalRecords;
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
  
    goToPayout() {
        const dialogRef = this.dialog.open(DisbursementRequestComponent, {
            panelClass: 'fullscreen-dialog',
            data: {
                mosqueGuid: this.mosqueGuid,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.GetAllPayOutTransactions();
            }
        });
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
                            type: 'info',
                            message: 'Info',
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
    ResetFilterList() {
        this.pageSize = 10;
        this.pageIndex = 1;
        this.searchForm.patchValue({
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
