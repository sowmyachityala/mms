import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { DonationsService } from 'app/services/donations.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-disbursement-request',
    templateUrl: './disbursement-request.component.html',
    styleUrl: './disbursement-request.component.scss',
})
export class DisbursementRequestComponent implements OnInit {
    imageEndPoints = environment.imageEndPoints;
    isLoading = false;
    isAuthenticated: boolean = false;
    payoutForm: FormGroup;

    direction: string = 'ltr';
    mosqueGuid: string = '';
    mosqueInfo: any;
    totalAvlAmount: any = 0;
    externalId: string = '';
    isLoadingType: string;

    constructor(
        public payoutDialogRef: MatDialogRef<DisbursementRequestComponent>,
        private sharedService: SharedService,
        private authService: AuthService,
        @Inject(MAT_DIALOG_DATA) public data,
        private donationService: DonationsService,
        private fb: FormBuilder,
        private toaster: ToasterService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private spinnerService: NgxSpinnerService
    ) {
        this.isLoadingType = 'pacman';

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

        if (this.data?.mosqueGuid) {
            this.mosqueGuid = this.data?.mosqueGuid;
        }
        this.payoutForm = this.fb.group({
            mosqueGuid: [this.mosqueGuid],
            referenceId: [''],
            amount: [''],
            channelCode: [''],
            accountNumber: [''], // Added channelCode
            accountHolderName: [''], // Added accountHolderName
            emailTo: this.fb.array([
                this.fb.control('', {
                    validators: [Validators.required],
                    nonNullable: true,
                }), // Default, non-editable email
            ]),
            emailCc: this.fb.array([]), // Added email
            currency: [''],
        });

        this.getMosqueBankDetailsForPayout();
    }

    getMosqueBankDetailsForPayout() {
        this.spinnerService.show();
        this.donationService
            .getMosqueBankDetailsForPayout(this.mosqueGuid)
            .subscribe(
                (res: any) => {
                    if (res?.result.success) {
                        this.spinnerService.hide();
                        this.externalId = res?.result.data.forUserId;
                        this.payoutForm.patchValue({
                            referenceId: res?.result?.data.forUserId,
                            accountHolderName:
                                res?.result?.data.accountHolderName,
                            accountNumber: res?.result?.data.accountNumber,
                            channelCode: res?.result?.data.channelCode,
                            currency: res?.result?.data.currency,
                        });
                        this.getMosqueAvailableBalance();
                        const newEmail = res?.result?.data.email;
                        const emailToArray = this.payoutForm.get(
                            'emailTo'
                        ) as FormArray;
                        emailToArray.clear();
                        emailToArray.push(
                            this.fb.control(newEmail, {
                                validators: [Validators.required],
                                nonNullable: true,
                            })
                        );
                    } else {
                        this.spinnerService.hide();
                        this.toaster.triggerToast({
                            type: 'info',
                            message: 'Info',
                            description: res?.result?.message,
                        });
                    }
                },
                (err) => {
                    this.spinnerService.hide();
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: err?.error?.message,
                    });
                }
            );
    }

    getMosqueAvailableBalance() {
        this.spinnerService.show();
        this.donationService
            .getMosqueAvailableBalance(this.externalId)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.spinnerService.hide();
                        this.payoutForm.patchValue({
                            amount: res?.result?.data?.balance,
                        });

                        //this.totalAvlAmount = res?.result?.data?.balance;
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

    onClose() {
        this.payoutDialogRef.close();
    }

    get emailTo(): FormArray {
        return this.payoutForm.get('emailTo') as FormArray;
    }

    get emailCc(): FormArray {
        return this.payoutForm.get('emailCc') as FormArray;
    }

    addEmailTo() {
        if (this.emailTo.length < 4) {
            this.emailTo.push(this.fb.control(''));
        }
    }

    removeEmailTo(index: number) {
        if (index > 0) {
            this.emailTo.removeAt(index);
        }
    }

    addEmailCc() {
        if (this.emailCc.length < 4) {
            this.emailCc.push(this.fb.control(''));
        }
    }

    removeEmailCc(index: number) {
        this.emailCc.removeAt(index);
    }

    onSubmit(): void {
        const payload = this.payoutForm.value;
        payload.emailTo = this.emailTo.getRawValue(); // Include disabled values
        payload.emailCc = this.emailCc.value;

        const transformedPayload = {
            mosqueGuid: payload.mosqueGuid,
            referenceId: payload.referenceId,
            channelCode: payload.channelCode,
            channelProperties: {
                accountNumber: payload.accountNumber,
                accountHolderName: payload.accountHolderName,
            },
            amount: payload.amount,
            description: '', // Add a description if needed
            currency: payload.currency,
            receiptNotification: {
                emailTo: payload.emailTo,
                emailCc: payload.emailCc,
            },
        };

        console.log(transformedPayload);
        this.donationService
            .payOutXenditMethod(transformedPayload)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                } else {
                    this.toaster.triggerToast({
                        type: 'info',
                        message: 'Info',
                        description: res?.result?.message,
                    });
                }
                this.payoutDialogRef.close(true);
            });
    }
}
