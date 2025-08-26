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
    selector: 'app-donaton-purpose',
    templateUrl: './donaton-purpose.component.html',
    styleUrl: './donaton-purpose.component.scss',
})
export class DonatonPurposeComponent {
    isLoading = true; searchKey: string;
    pageLength = 0; pageSize = 10; pageIndex=1;  dataList = [];
    dataSource: any = new MatTableDataSource<any>();
    searchInputControl: FormControl = new FormControl();
    purposeForm: FormGroup; isUpdate: boolean = false;
    displayedColumns = [
        'donationTypeName',
        'donationTypeDescription',
        'createdBy',
        'createdOn',
        'isActive',
        'action',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('purposeInfoDialog', { static: true })
    purposeInfoDialog: TemplateRef<any>;
    currentActions: any;    direction: string = 'ltr';   mosqueGuid: string = '';
    mosqueInfo: any; searchForm: FormGroup;
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
        this.searchForm = this.fb.group({
            mosqueGuid: this.mosqueGuid,
            donationPurposeName: [''],
            status: [],
            pageIndex: [],
            pageSize: [],
            isFilter: [false],
        });
        this.GetDataList();
    }
  

    GetDataList(): void {
        this.searchForm.patchValue({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
        });
        let formValue = this.searchForm.value;
        this.userService
            .getAllPurposeDataList(formValue)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.dataList = res?.result?.data?.donationPurpose;
                    this.dataSource = new MatTableDataSource(res?.result?.data?.donationPurpose);
                    this.dataSource.paginator = this.paginator;
                    this.pageLength = res?.result?.data?.totalCount;
                } else {
                    this.toaster.triggerToast({
                        type: 'info',
                        message: 'Info',
                        description: res?.result?.message,
                    });
                }
            });
    }

    OpenDialogForAddPurpose() {
        this.purposeForm = this.fb.group({
            mosqueGuid: this.mosqueGuid,
            donationTypeName: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            donationTypeDescription: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
        });
        this.isUpdate = false;
        this.dialog.open(this.purposeInfoDialog);
    }

    OpenDialogForUpdatePurpose(data) {
        this.purposeForm = this.fb.group({
            donationGuid: [''],
            donationTypeName: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            donationTypeDescription: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            isActive: [],
        });
        this.isUpdate = true;
        this.purposeForm.patchValue(data);
        this.dialog.open(this.purposeInfoDialog);
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

    addOrUpdatePurpose() {
        if (this.purposeForm.invalid) {
            return true;
        }
        let body = this.purposeForm?.value;
        this.userService
            .addOrUpdatePurpose(body, this.isUpdate)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    this.dialog.closeAll();
                    this.GetDataList();
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }

    confirmDeactivePurpose(data) {
        this.purposeForm = this.fb.group({
            donationGuid: [''],
            donationTypeName: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            donationTypeDescription: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            isActive: [],
        });

        this.purposeForm.patchValue({
            donationGuid: data.donationGuid,
            donationTypeName: data.donationTypeName,
            donationTypeDescription: data.donationTypeDescription,
            isActive: false,
        });

        this.isUpdate = true;
        this.confirmActiveInactivePurpose();
    }

    confirmActivePurpose(data) {
        this.purposeForm = this.fb.group({
            donationGuid: [''],
            donationTypeName: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            donationTypeDescription: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            isActive: [],
        });

        this.purposeForm.patchValue({
            donationGuid: data.donationGuid,
            donationTypeName: data.donationTypeName,
            donationTypeDescription: data.donationTypeDescription,
            isActive: true,
        });

        this.isUpdate = true;
        this.confirmActiveInactivePurpose();
    }

    confirmActiveInactivePurpose(): void {
        const confirmation = this._fuseConfirmationService.open({
            title: this.translate.instant('DonationPurpose.update'),
            message: this.translate.instant('DonationPurpose.updateStatus'),
            actions: {
                confirm: {
                    label: this.translate.instant('DonationPurpose.ok'),
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.addOrUpdatePurpose();
            }
        });
    }

    ResetFilterList() {
        this.pageSize = 10;
        this.pageIndex = 1;
        this.searchForm.patchValue({
            donationPurposeName: '',
            status: null,
            isFilter: false,
        });
        this.GetDataList();
    }
    SearchFilter() {
        this.searchForm.patchValue({
            isFilter: true,
        });
        this.GetDataList();
    }
    onPageChange(event: any): void {
      this.pageIndex = event.pageIndex + 1; 
      this.pageSize = event.pageSize; 
      this.GetDataList();  
    }
}
