import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-payment-gateway-fee',
    templateUrl: './payment-gateway-fee.component.html',
    styleUrl: './payment-gateway-fee.component.scss',
})
export class PaymentGatewayFeeComponent {
    isLoading = true;
    searchKey: string;
    pageLength = 0;
    pageSize = 10;
    dataList = [];
    dataSource: any = new MatTableDataSource<any>();
    searchInputControl: FormControl = new FormControl();
    dataForm: FormGroup;
    displayedColumns = [
        'paymentMethod',
        'bankName',
        'bankNameId',
        'chargePercentOrAmount',
        'vatPercent',
        'createdDate',
        'entryBy',
        //   'action'
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('dataInfoDialog', { static: true })
    dataInfoDialog: TemplateRef<any>;
    currentActions: any;
    direction: string = 'ltr';
    mosqueGuid: string = '';
    mosqueInfo: any;
    imageEndPoints = environment.imageEndPoints;

    constructor(
        private userService: UserManagementService,
        private toaster: ToasterService,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private sharedService: SharedService,
        private _fuseConfirmationService: FuseConfirmationService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService
    ) {
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

        this.currentActions = this.sharedService.getCurrentPageActions();
        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid || '';
        }

        this.GetDataList();
    }

    pageChangeEvent(event) {
        event;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.dataSource.filter = filterValue;
        this.searchKey = filterValue;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    GetDataList(): void {
        this.userService.getAllBankChargesList().subscribe((res: any) => {
            if (res?.result?.success) {
                this.dataList = res?.result?.data;
                this.dataSource = new MatTableDataSource(res?.result?.data);
                this.dataSource.paginator = this.paginator;
                this.pageLength = res?.result?.data?.length;
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }
    OpenDialogForUpdateData(data) {
        this.dataForm = this.fb.group({
            bankId: [],
            chargeType: [],
            chargePercentOrAmount: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            vatPercent: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
        });
        this.dataForm.patchValue(data);
        this.dialog.open(this.dataInfoDialog);
    }

    noLeadingSpacesValidator(control: any) {
        if (control.value && control.value.startsWith(' ')) {
            return { noLeadingSpaces: true };
        }
        return null;
    }

    closeDialog(): void {
        this.dialog.closeAll();
    }
}
