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
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';

@Component({
    selector: 'app-supplier',
    templateUrl: './supplier.component.html',
    styleUrls: ['./supplier.component.scss'],
})
export class SupplierComponent {
    isLoading = true;
    searchKey: string;
    pageLength = 0;
    pageSize = 10;
    pageIndex = 1;
    supplierList = [];
    dataSource: any = new MatTableDataSource<any>();
    searchInputControl: FormControl = new FormControl();
    supplierForm: FormGroup;
    isUpdate: boolean = false;
    displayedColumns = [
        'supplierName',
        'phoneNumber',
        'supplierAddress',
        'email',
        'updatedOn',
        'isActive',
        'action',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('supplierDialog', { static: true })
    supplierDialog: TemplateRef<any>;
    currentActions: any;
    direction: string = 'ltr';
    mosqueGuid: string = '';
    mosqueInfo: any;
    searchForm: FormGroup;

    constructor(
        private userService: UserManagementService,
        private toaster: ToasterService,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private sharedService: SharedService,
        private _fuseConfirmationService: FuseConfirmationService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private authService: AuthService,
        private _router: Router
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
        this.supplierForm = this.fb.group({
            id: [0],
            supplierGuid: [''],
            supplierName: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            supplierAddress: [''],
            phoneNumber: [
                '',
                [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(14),
                ],
            ],
            email: [
                '',
                [
                    Validators.email,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                    ),
                ],
            ],
            isActive: [true],
            mosqueGuid: [this.mosqueGuid],
        });
        this.currentActions = this.sharedService.getCurrentPageActions();

        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid;
        }
        this.searchForm = this.fb.group({
            mosqueGuid: this.mosqueGuid,
            phoneNumber: [''],
            supplierName: [''],
            supplierStatus: [],
            pageIndex: [],
            pageSize: [],
            isFilter: [false],
        });
        this.GetAllSppliersList();
    }
    
    closeDialog(): void {
        this.dialog.closeAll();
    }

    addSupplier(): void {
        this.supplierForm.reset();
        this.isUpdate = false;
        this.supplierForm.patchValue({
            id: 0,
            isActive: true,
            mosqueGuid: this.mosqueGuid,
        });
        this.dialog.open(this.supplierDialog);
    }

    editSupplier(data) {
        this.isUpdate = true;
        this.supplierForm.patchValue(data);
        this.supplierForm.patchValue({
            mosqueGuid: this.mosqueGuid,
        });
        this.dialog.open(this.supplierDialog);
    }

    addOrUpdateSupplier() {
        if (this.supplierForm.invalid) {
            return true;
        }
        let body = this.supplierForm?.value;
        this.userService.addOrUpdateSuppliers(body).subscribe((res: any) => {
            if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
                this.dialog.closeAll();
                this.GetAllSppliersList();
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }

    GetAllSppliersList(): void {
        this.searchForm.patchValue({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
        });
        let formValue = this.searchForm.value;
        this.userService.getAllSuppliers(formValue).subscribe((res: any) => {
            if (res?.result?.success) {
                this.supplierList = res?.result?.data?.vmSuppliers;
                debugger;
                this.dataSource = new MatTableDataSource(res?.result?.data?.vmSuppliers);
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

    activeInactiveSupplier(isActive: boolean, supplierGuid: string) {
        let ActiveInactive = isActive === true ? 'Active' : 'InActive';
        const confirmation = this._fuseConfirmationService.open({
            title: ActiveInactive,
            message:
                'Are you sure, you want to ' +
                ' ' +
                ActiveInactive +
                ' ' +
                ' supplier',
            actions: {
                confirm: {
                    label: 'Ok',
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.activeOrInactiveSupplier(isActive, supplierGuid);
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Cancel',
                    description: 'Cancel the supplier ' + ActiveInactive,
                });
                this.GetAllSppliersList();
            }
        });
    }
    activeOrInactiveSupplier(isActive: boolean, supplierGuid: string) {
        const body = {
            isActive: isActive,
            Guid: supplierGuid,
        };
        this.userService
            .activeOrInactiveSupplier(body)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    this.GetAllSppliersList();
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }
    redirectToEmail(emailId: string): void {
        // Replace 'mailto' with the appropriate email client's URI if needed
        window.location.href = `mailto:${emailId}`;
        window.location.href = `mailto:${emailId}`;
    }

    noLeadingSpacesValidator(control: any) {
        if (control.value && control.value.startsWith(' ')) {
            return { noLeadingSpaces: true };
        }
        return null;
    }
    ResetFilterList() {
        this.pageSize = 10;
        this.pageIndex = 1;
        this.searchForm.patchValue({
            phoneNumber: '',
            supplierName: '',
            supplierStatus: null,
            isFilter: false,
        });
        this.GetAllSppliersList();
    }
    SearchFilter() {
        this.searchForm.patchValue({
            isFilter: true,
        });
        this.GetAllSppliersList();
    }
    onPageChange(event: any): void {
      this.pageIndex = event.pageIndex + 1; 
      this.pageSize = event.pageSize; 
      this.GetAllSppliersList();  
    }
}
