import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';
import { environment } from 'environments/environment';
import { bankList } from './bank_list';

@Component({
    selector: 'app-bank-accounts',
    templateUrl: './bank-accounts.component.html',
    styleUrl: './bank-accounts.component.scss',
})
export class BankAccountsComponent {
    mosqueGuid: string = '';
    mosqueInfo: any;
    direction: string = 'ltr';
    currentActions: any;
    banksList: any = [];
    bankDetails: any = [];
    bankImage = environment.imageEndPoints.bankImage;
    showBankForm = false;
    bankForm: FormGroup;
    @ViewChild('bankInfoDialog', { static: true })
    bankInfoDialog: TemplateRef<any>;
    dailogRef: MatDialogRef<any>;
    accountTypes: { value: string; name: string }[] = [
        { value: 'Business', name: 'Business' },
        { value: 'Savings', name: 'Savings' },
        { value: 'Current', name: 'Current' },
    ]; // Dropdown options for accountType
    primaryAccountOptions: { value: boolean; name: string }[] = [
        { value: true, name: 'Yes' },
        { value: false, name: 'No' },
    ];
    banks = bankList;
    selectedChannelCode: string = '';

    constructor(
        private userService: UserManagementService,
        private toaster: ToasterService,
        private dialog: MatDialog,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private _fuseConfirmationService: FuseConfirmationService,
        private authService: AuthService,
        private _router: Router,
        private sharedService: SharedService,
        private fb: FormBuilder
    ) {
        //set default language
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
            if (this.mosqueInfo != null) {
                this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid;
            }
        }
        this.currentActions = this.sharedService.getCurrentPageActions();
        // let isAuth = this.authService.check();
        //
        // if (!isAuth) {
        //     this._router.navigate(['/sign-in']);
        // }

        this.getAllBanksList();

        this.bankForm = this.fb.group({
            bankGuid: [''],
            mosqueGuid: [''],
            bankName: ['', [Validators.required]],
            bankCode: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            branchCode: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            branchName: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            accountNumber: ['', [Validators.required]],
            confirmedAccountNumber: ['', [Validators.required]],
            accountHolderName: [
                '',
                [Validators.required, Validators.pattern('^[a-zA-Z ]+$')],
            ],
            accountType: ['', Validators.required],
            swiftCode: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            postalCode: ['', [Validators.required]],
            streetAddress: ['', [Validators.required]],
            city: ['', [Validators.required, this.noLeadingSpacesValidator]],
            state: ['', [Validators.required, this.noLeadingSpacesValidator]],
            contactInfo: ['', Validators.required],
            accountStatus: [true],
            bankType: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            npwp: ['', [Validators.required, this.noLeadingSpacesValidator]],
            isPrimaryAccount: ['', [Validators.required]],
            channelCode: [],
        });

        this.setupMatchingValidator();
    }

    private setupMatchingValidator() {
        // Monitor changes to both fields
        this.bankForm
            .get('accountNumber')
            ?.valueChanges.subscribe(() => this.validateAccountMatch());
        this.bankForm
            .get('confirmedAccountNumber')
            ?.valueChanges.subscribe(() => this.validateAccountMatch());
    }

    private validateAccountMatch() {
        const accountNumber = this.bankForm.get('accountNumber')?.value;
        const confirmedAccountNumber = this.bankForm.get(
            'confirmedAccountNumber'
        )?.value;
        if (
            accountNumber &&
            confirmedAccountNumber &&
            accountNumber !== confirmedAccountNumber
        ) {
            this.bankForm
                .get('confirmedAccountNumber')
                ?.setErrors({ mismatch: true });
        }
    }

    noLeadingSpacesValidator(control: any) {
        if (control.value && control.value.startsWith(' ')) {
            return { noLeadingSpaces: true };
        }
        return null;
    }

    viewBankDetails(data) {
        //this.roleInfoForm.patchValue(data);

        this.bankDetails = data;
        console.log(data, 'bank data');

        this.dailogRef = this.dialog.open(this.bankInfoDialog);
    }

    onClose(): void {
        // Logic for closing the dialog
        this.dailogRef.close();
    }
    getAllBanksList() {
        this.userService
            .getAllBanksList(this.mosqueGuid)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.banksList = res?.result?.data;
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }

    submitMosqueBankForm() {
        this.bankForm.patchValue({ mosqueGuid: this.mosqueGuid });
        this.userService
            .addMosqueBankDetails(this.bankForm.value)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result.message,
                    });
                    this.showBankForm = false;
                    this.getAllBanksList();
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }

    toggleBankForm() {
        this.showBankForm = !this.showBankForm;
        this.bankForm.reset();
    }

    toggleBankList() {
        this.bankForm.reset();
        this.showBankForm = false;
    }

    DeleteBank(bankGuid): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete',
            message: 'Are you sure, you want to delete bank details',
            actions: {
                confirm: {
                    label: 'Ok',
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.deleteBankDetails(bankGuid);
            }
        });
    }

    deleteBankDetails(bankGuid): void {
        this.sharedService.deleteBankDetails(bankGuid).subscribe((res: any) => {
            if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
                this.getAllBanksList();
            }
        });
    }

    onBankChange(event: any) {
        this.bankForm.patchValue({ bankName: event.value });
        const selectedBank = this.banks.find(
            (bank) => bank.bankName === event.value
        );
        this.bankForm.patchValue({ channelCode: selectedBank.channelCode });
    }
}
