import { Component, HostListener, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-user-profile-details-update',
    templateUrl: './user-profile-details-update.component.html',
    styleUrls: ['./user-profile-details-update.component.scss'],
})
export class UserProfileDetailsUpdateComponent implements OnInit {
    messageType: string;
    userProfileForm: FormGroup;
    messageHeader: string;
    direction: string = 'ltr';
    isOtpArrived = false;
    displayTimer: any;
    seconds = 0;
    allCurrencyTypes = [];
    singleClickButton: boolean = false;
    isLoadingType: string;
    genders = [
        { value: 'M', viewValue: 'Male' },
        { value: 'F', viewValue: 'Female' },
        { value: 'O', viewValue: 'Other' },
    ];
    @HostListener('document:keydown', ['$event'])
    onEnterPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();

            switch (this.data?.messageType) {
                case 'Full_Name':
                    this.updateUserCurrency('Full_Name');
                    break;
                case 'Gender':
                    this.updateUserCurrency('Gender');
                    break;
                case 'Phone_Number':
                case 'Email_Id':
                    this.GenerateOtp(this.data?.messageType);
                    break;
            }
        }
    }

    constructor(
        public dialogRef: MatDialogRef<UserProfileDetailsUpdateComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private formBuilder: FormBuilder,
        private sharedService: SharedService,
        private toaster: ToasterService,
        private userService: UserManagementService,
        private authService: AuthService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private spinnerService: NgxSpinnerService
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
        this.isLoadingType = 'ball-beat';
    }

    onClose() {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this.userProfileForm = this.formBuilder.group({
            fullName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern('^[A-Za-z ]*$'),
                    this.customValidation,
                ],
            ],
            emailId: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                    ),
                ],
            ],
            phoneNumber: [
                '',
                [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(14),
                ],
            ],
            gender: [],
            roleName: [{ value: '', disabled: true }],
            donations: [{ value: '', disabled: true }],
            myPlaces: [{ value: '', disabled: true }],
            Otp: [''],
            contactGuid: [''],
            userCurrency: [''],
            userActivityStatus: [''],
        });

        if (this.data?.profileDetails) {
            this.userProfileForm.patchValue(this.data?.profileDetails);
        }
        if (this.data?.messageType) {
            this.messageHeader =
                this.data?.messageType === 'Phone_Number'
                    ? 'EDIT PHONE NUMBER'
                    : this.data?.messageType === 'Full_Name'
                    ? 'EDIT FULL NAME'
                    : this.data?.messageType === 'Email_Id'
                    ? 'EDIT EMAIL ID'
                    : this.data?.messageType === 'Currency_Type'
                    ? 'EDIT CURRENCY TYPE'
                    : this.data?.messageType === 'Gender'
                    ? 'Edit Gender'
                    : '';
            this.messageType =
                this.data?.messageType === 'Phone_Number'
                    ? 'Information'
                    : this.data?.messageType === 'Full_Name'
                    ? 'Information'
                    : this.data?.messageType === 'Email_Id'
                    ? 'Information'
                    : this.data?.messageType === 'Currency_Type'
                    ? 'Information'
                    : this.data?.messageType === 'Gender'
                    ? 'Information'
                    : '';
        }

        if (this.data?.messageType === 'Currency_Type') {
            //this.uCurrency = this.data?.profileDetails?.userCurrency;
            this.getUserCurrencyTypes();
        }

        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
    }

    checkForTrimChars() {
        this.userProfileForm.patchValue({
            fullName: this.userProfileForm?.value?.fullName.trim(),
        });
    }

    customValidation(control: FormControl) {
        const isWhitespace = (control?.value || '')?.trim()?.length === 0;
        const isValid = !isWhitespace;

        if (!isValid) {
            return isValid ? null : { whitespace: true };
        } else if (
            Math.abs(
                control?.value?.trimLeft()?.length - control?.value?.length
            ) > 1
        ) {
            return { multispace: true };
        } else if (
            Math.abs(
                control?.value?.trimRight()?.length - control?.value?.length
            ) > 1
        ) {
            return { multispace: true };
        }
        const hasNumbers = /\d/.test(control?.value);
        return hasNumbers ? { customValidation: true } : null;
    }

    onActionClick(buttonInfo, msgType) {
        if (buttonInfo?.type === 'Cancel') {
            this.dialogRef.close();
        } else if (
            buttonInfo?.type === 'Verify' &&
            msgType != 'Currency_Type'
        ) {
            this.singleClickButton = true;
            this.UpdateProfile();
        } else if (
            msgType != 'Currency_Type' &&
            msgType != 'Full_Name' &&
            msgType != 'Gender'
        ) {
            this.singleClickButton = true;
            this.GenerateOtp(msgType);
            // this.dialogRef.close(true);
        } else {
            if (this.userProfileForm.invalid) {
                return true;
            }
            this.singleClickButton = true;
            this.updateUserCurrency(msgType);
        }
    }

    UpdateProfile(): void {
        if (
            this.userProfileForm.invalid ||
            this.userProfileForm.value.Otp == ''
        ) {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: 'Please fill all mandatory information',
            });
            this.singleClickButton = false;
            return;
        }

        this.userService
            .updateUserProfile(this.userProfileForm.value)
            .subscribe(
                (response: any) => {
                    if (response.result.success) {
                        this.singleClickButton = false;
                        this.dialogRef.close(true);
                        this.toaster.triggerToast({
                            type: 'success',
                            message: 'Success',
                            description: 'Profile updated successfully',
                        });
                    } else {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Error',
                            description: response.result.message,
                        });
                    }
                },
                (err) => {}
            );
    }

    GenerateOtp(msgType) {
        this.spinnerService.show();
        let body = {
            emailId: this.userProfileForm.value.emailId,
            phoneNumber: this.userProfileForm.value.phoneNumber,
            changeType: msgType,
        };
        if (this.userProfileForm.invalid) {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: 'Please fill all mandatory information',
            });
            this.singleClickButton = false;
            this.spinnerService.hide();
            return;
        }
        this.authService.generateOtpEditPrfoile(body).subscribe((res: any) => {
            this.singleClickButton = false;
            this.spinnerService.hide();
            if (res.result.success) {
                const formControl = this.userProfileForm.get(
                    'Otp'
                ) as FormControl;
                const formControlGuid = this.userProfileForm.get(
                    'contactGuid'
                ) as FormControl;
                formControl.setValidators(Validators.required);
                formControlGuid.setValidators(Validators.required);
                formControl.updateValueAndValidity();
                formControlGuid.updateValueAndValidity();
                this.isOtpArrived = true;
                this.data.messageType = 'Verification_Code';
                this.data.buttons.push({
                    color: 'primary',
                    type: 'Verify',
                    label: 'Verify & Close',
                    buttonClass:
                        this.direction === 'ltr'
                            ? 'ml-2'
                            : this.direction === 'rtl'
                            ? 'mr-2'
                            : '',
                });
                this.data?.buttons
                    ?.filter((x) => x.type === 'Confirm')
                    .map((x) => (x.hide = true));
                this.timer(1);
                this.userProfileForm.patchValue({
                    contactGuid: res?.result?.data,
                });
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success message',
                    description: 'Otp sent successfully',
                });
            } else {
                this.toaster.triggerToast({
                    type: 'info',
                    message: 'Warming Message',
                    description: res.result.message,
                });
            }
        });
    }

    resendOtp() {
        this.singleClickButton = true;
        this.spinnerService.show();
        let body = {
            emailId: this.userProfileForm.value.emailId,
            phoneNumber: this.userProfileForm.value.phoneNumber,
            changeType: '',
        };
        this.authService.generateOtpEditPrfoile(body).subscribe((res: any) => {
            if (res) {
                this.timer(1);
                this.userProfileForm.patchValue({
                    contactGuid: res?.result?.data,
                });
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: 'Otp sent successfully',
                });
            }
            this.singleClickButton = false;
            this.spinnerService.hide();
        });
    }

    getUserCurrencyTypes() {
        this.userService.getMasterCurrencyTypes().subscribe((res: any) => {
            if (res?.result?.success) {
                this.allCurrencyTypes = res?.result?.data;
                // this.toaster.triggerToast({
                //     type: 'success',
                //     message: 'Success',
                //     description: res?.result?.message,
                // });
            }
        });
    }

    timer(minute) {
        // let minute = 1;
        this.seconds = minute * 60;
        let textSec: any = '0';
        let statSec: number = 60;

        const prefix = minute < 10 ? '0' : '';

        const timer = setInterval(() => {
            this.seconds--;
            if (statSec != 0) statSec--;
            else statSec = 59;

            if (statSec < 10) {
                textSec = '0' + statSec;
            } else textSec = statSec;

            this.displayTimer = `${prefix}${Math.floor(
                this.seconds / 60
            )}:${textSec}`;
            //console.log(this.displayTimer);
            if (this.seconds == 0) {
                clearInterval(timer);
            }
        }, 1000);
    }
    selectedCurrency(event): void {
        this.userProfileForm.patchValue({
            userCurrency: event?.value,
        });
    }
    updateUserCurrency(type: string): void {
        const data = {
            userCurrency: this.userProfileForm.value.userCurrency,
            fullName: this.userProfileForm.value.fullName,
            updateType: type,
            gender: this.userProfileForm.value.gender,
        };
        console.log('data', data);
        this.userService.updateCurrency(data).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.singleClickButton = false;
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    this.dialogRef.close(true);
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
