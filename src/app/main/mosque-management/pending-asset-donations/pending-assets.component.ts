import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MasterService } from 'app/services/master.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UploadInvoiceComponent } from '../upload-invoice/upload-invoice.component';

interface StatusFields {
    id: number;
    viewValue: string;
}

@Component({
    selector: 'app-pending-assets',
    // standalone: true,
    // imports: [],
    templateUrl: './pending-assets.component.html',
    styleUrl: './pending-assets.component.scss',
})
export class PendingAssetsComponent {
    direction: string = 'ltr';
    mosqueGuid: string;
    searchKey: string;
    dataSource: any = new MatTableDataSource<any>();
    searchInputControl: FormControl = new FormControl();
    displayedColumns = [
        'fullName',
        'phoneNumber',
        'productName',
        'quantity',
        'createdOn',
        'productStatus',
        'action',
    ];
    pageSize: number = 10;
    pageIndex: number = 0;
    pageLength: number = 10;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    pageSizeOptions: number[] = [10, 20, 50];
    totalRows: number = 0;
    doneLoading: boolean = true;

    productStatus: StatusFields[] = [
        { id: 10, viewValue: 'Baru' },
        { id: 20, viewValue: 'Menunggu' },
        { id: 30, viewValue: 'Disetujui' },
        { id: 40, viewValue: 'Ditolak' },
    ];
    isConfirmDonation: boolean = false;
    estimatedAmount: number | null = null;
    status2: number;
    invGuid2: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        public addDialogRef: MatDialogRef<PendingAssetsComponent>,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private sharedService: SharedService,
        private toaster: ToasterService,
        private masterService: MasterService,
        private _fuseConfirmationService: FuseConfirmationService,
        private dialog: MatDialog
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    ngOnInit(): void {
        if (this.data && this.data?.mosqueGuid) {
            this.mosqueGuid = this.data?.mosqueGuid;
        }
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
        this.getTrasactions();
    }

    onClose() {
        this.addDialogRef.close(true);
    }
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.dataSource.filter = filterValue;
        this.searchKey = filterValue;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    changeProductStatus(status, invGuid): void {
        let msg =
            status === 20
                ? 'Tertunda'
                : status === 30
                ? 'Disetujui'
                : status === 40
                ? 'Ditolak'
                : 'Baru';
        if (status != 30) {
            const confirmation = this._fuseConfirmationService.open({
                title: 'Perbarui',
                message:
                    'Apakah Anda yakin ingin memperbarui status produk menjadi ' +
                    msg,
                icon: {
                    color: 'warn',
                },
                actions: {
                    confirm: {
                        label: 'Ok',
                    },
                },
            });
            confirmation.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this.updateProductStatus(status, invGuid, null);
                } else {
                    this.getTrasactions();
                }
            });
        } else {
            this.isConfirmDonation = true;
            this.status2 = status;
            this.invGuid2 = invGuid;
        }
    }

    updateProductStatus(
        status: number,
        invGuid: string,
        estimatedAmount: number
    ) {
        let body = {
            statusId: status,
            invTrxId: invGuid,
            estimatedAmount: estimatedAmount,
        };
        this.masterService.updateProductStatus(body).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    this.estimatedAmount = null;
                    this.getTrasactions();
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
                    message: 'Error',
                    description: err.error.message,
                });
            }
        );
    }

    getTrasactions() {
        let body = {
            mosqueGuid: this.mosqueGuid == undefined ? '' : this.mosqueGuid,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
        };
        this.masterService.getPendingAssets(body).subscribe((res: any) => {
            if (res?.result?.success) {
                this.dataSource = new MatTableDataSource(
                    res?.result?.data?.vmPendingAsset
                );
                this.dataSource.paginator = this.paginator;
                this.totalRows = res?.result?.data?.totalCount;
                this.doneLoading = false;
                setTimeout(() => {
                    this.paginator.pageIndex = this.pageIndex;
                    this.paginator.length = res?.result?.data?.totalCount;
                });
                this.estimatedAmount = null;
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }

    pageChangeEvent(event) {
        this.pageSize = event?.pageSize;
        this.pageIndex = event?.pageIndex;
        this.getTrasactions();
    }

    uploadInvoice(mosqueGuid, inventoryGuid) {
        const dialogRef = this.dialog.open(UploadInvoiceComponent, {
            data: {
                mosqueGuid: mosqueGuid,
                inventoryGuid: inventoryGuid,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getTrasactions();
            }
        });
    }

    openPdfOrImage(fileUrl: string): void {
        window.open(fileUrl, '_blank');
    }

    isAmountInvalid(): boolean {
        return this.estimatedAmount === null || this.estimatedAmount < 0;
    }

    onYes(): void {
        if (!this.isAmountInvalid()) {
            this.isConfirmDonation = false;
            this.updateProductStatus(
                this.status2,
                this.invGuid2,
                this.estimatedAmount
            );
        }
    }

    onNo(): void {
        this.isConfirmDonation = false;
    }
}
