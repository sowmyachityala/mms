import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    UntypedFormBuilder,
    Validators,
    FormGroup,
    FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/auth.service';
import { ToasterService } from 'app/services/toaster.service';
import { EmailPhoneValidator } from 'app/email-phone-validator';
import { SharedService } from 'app/services/shared.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit {
    imageUrl = environment.imageEndPoints.loginLogo;
    setMdWidth = '608px';
    isOtpArrived = false;
    signInForm: FormGroup;
    showAlert: boolean = false;
    displayTimer: any;
    seconds = 0;
    guId: any;
    direction: string = 'ltr';

    user: any = null;
    error: string | null = null;

    constructor(
        private sharedService: SharedService,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private toaster: ToasterService
    ) {}

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, EmailPhoneValidator]],
            loginOtp: [''], //[Validators.required, Validators.maxLength(6)]
            contactGuid: [''],
        });
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
    }

    /**
     * Sign in
     */
    sendOtp(): void {
        if (this.signInForm.invalid) {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: 'Please enter valied Email/ Mobile Number',
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

    validateSignIn() {
        if (this.signInForm.invalid) {
            return;
        }
        this._authService.verifyOtp(this.signInForm.value).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    // if (res?.result?.data?.roleName === 'MOSQUE ADMIN'
                    //     || res?.result?.data?.roleName === 'IMAM'
                    //     || res?.result?.data?.roleName === 'SUPER MOSQUE ADMIN') {
                    //     this._router.navigateByUrl('/mosqueadmin');
                    // }
                    if (
                        res?.result?.data?.roleName != 'SUPER ADMIN' ||
                        res?.result?.data?.roleName === 'MINISTRY ADMIN'
                    ) {
                        this._router.navigateByUrl('/mosqueadmin');
                    } else {
                        this._router.navigateByUrl('/dashboard');
                    }
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

    SignInWithGoogle() {
        this._authService.signInWithGoogle().then((result) => {
            if (result) {
                this.GoogleAuthentication(result);
            }
        });
    }

    GoogleAuthentication(token) {
        let body = {
            IdToken: token,
            FcmToken: null,
            DeviceName: null,
        };
        this._authService.googleAuthentication(body).subscribe((res: any) => {
            if (res?.result?.success) {
                if (
                    res?.result?.data?.roleName === 'SUPER ADMIN' ||
                    res?.result?.data?.roleName === 'MINISTRY ADMIN'
                ) {
                    this._router.navigateByUrl('/dashboard');
                } else {
                    this._router.navigateByUrl('/mosqueadmin');
                }
            } else {
                if (
                    res?.result?.statusCode === 400 ||
                    res?.result?.statusCode === 498
                ) {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            }
        });
    }
}
