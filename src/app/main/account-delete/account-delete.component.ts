import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import {
    FormControl,
    FormGroup,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { EmailPhoneValidator } from 'app/email-phone-validator';
import { AuthService } from 'app/services/auth.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-account-delete',
    templateUrl: './account-delete.component.html',
    styleUrl: './account-delete.component.scss',
})
export class AccountDeleteComponent {
    imageUrl = environment.imageEndPoints.menuRightLogo;
    signInForm: FormGroup;
    seconds = 0;
    guId: any;
    isOtpArrived = false;
    displayTimer: any;

    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private toaster: ToasterService,
        private _fuseConfirmationService: FuseConfirmationService,
        private http: HttpClient
    ) {}

    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, EmailPhoneValidator]],
            loginOtp: [''], //[Validators.required, Validators.maxLength(6)]
            contactGuid: [''],
        });
    }
    sendOtp(): void {
        if (this.signInForm.invalid) {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: 'Please enter valied Email',
            });
            return;
        }

        this.signInForm.disable();
        this._authService.generateOtp(this.signInForm.value.email).subscribe(
            (res: any) => {
                if (res.result.success) {
                    const formControl = this.signInForm.get(
                        'loginOtp'
                    ) as FormControl;
                    const formControlGuid = this.signInForm.get(
                        'contactGuid'
                    ) as FormControl;
                    formControl.setValidators([
                        Validators.required,
                        Validators.maxLength(6),
                    ]);
                    formControlGuid.setValidators(Validators.required);
                    formControl.updateValueAndValidity();
                    formControlGuid.updateValueAndValidity();
                    this.isOtpArrived = true;
                    this.timer(2);
                    this.signInForm.patchValue({
                        contactGuid: res?.result?.data,
                    });
                    this.guId = res.id;
                    this.signInForm.enable();
                } else {
                    this.signInForm.enable();
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Invalid data',
                        description: res.result.message,
                    });
                }
            },
            (err) => {
                this.signInForm.enable();
                if (err?.error?.status === 400) {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: err?.error?.errors?.contactGuid[0],
                    });
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: 'Something went wrong, please try again !',
                    });
                }
            }
        );
    }
    confirmDonationForUser() {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Are you sure you want to delete your account',
            message: `Your account will be deactivated for coming 30 days, and access to the Isalaam platform will be restricted.
To reactivate, please contact our support team at <b>info@isalaam.id</b> before the 30-day period ends. After that, your account and associated data may be permanently deleted.`,
            icon: {
                name: 'heroicons_outline:check-circle',
                color: 'success',
            },
            actions: {
                confirm: {
                    label: 'Yes',
                    color: 'primary',
                },
                cancel: {
                    label: 'No',
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.sendOtp();
            }
        });
    }

    resendOtp() {
        this._authService
            .resendOtp(this.signInForm.value.contactGuid)
            .subscribe((res: any) => {
                if (res) {
                    this.timer(1);
                    this.signInForm.patchValue({
                        contactGuid: res?.result?.data,
                    });
                    this.guId = res.id;
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
            //console.log(this.displayTimer)
            if (this.seconds == 0) {
                console.log('finished');
                clearInterval(timer);
            }
        }, 1000);
    }

    InactiveUserAccount() {
        if (this.signInForm.invalid) {
            return;
        }
        this._authService.InactiveUserAccount(this.signInForm.value).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    this.isOtpArrived = false;
                    this.signInForm.reset();
                } else {
                    if (
                        res?.result?.statusCode === 400 ||
                        res?.result?.statusCode === 498
                    ) {
                        this.signInForm.patchValue({
                            loginOtp: '',
                        });
                        this.signInForm.controls['loginOtp'].markAsTouched();
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Validation error',
                            description: res?.result?.message,
                        });
                    }
                }
            },
            (err) => {
                this.signInForm.enable();
                if (
                    err?.error?.status === 400 ||
                    err?.error?.statusCode === 498
                ) {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: err?.error?.errors?.contactGuid[0],
                    });
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: 'Something went wrong, please try again !',
                    });
                }
            }
        );
    }

    changeLoginDetails() {
        const formControl = this.signInForm.get('loginOtp') as FormControl;
        const formControlGuid = this.signInForm.get(
            'contactGuid'
        ) as FormControl;
        formControl.setValidators(null);
        formControlGuid.setValidators(null);
        formControl.updateValueAndValidity();
        formControlGuid.updateValueAndValidity();
        this.isOtpArrived = false;
        this.signInForm.reset();
    }
    onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            // Handle the Enter key press if needed
            console.log('Enter key pressed');
            return;
        }

        if ((event.target as HTMLInputElement).value.length === 6) {
            event.preventDefault();
        }
    }

    TestApiData(): void {
        const url = 'http://192.168.10.178:8081/SensuQ/auth/login';
        const loginData = {
            user_name: 'superadmin',
            password: '2514ca2d121cc4228051c7a2fd577259',
        };
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        this.http.post(url, loginData, { headers }).subscribe(
            (response) => {
                console.log('API Response:', response);
                // Handle the response here
            },
            (error) => {
                console.error('Error:', error);
                // Handle the error here
            }
        );
    }
}
