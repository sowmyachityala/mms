import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    NgForm,
    Validators,
    FormGroup,
    FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/auth.service';
import { ToasterService } from 'app/services/toaster.service';
import { SharedService } from 'app/services/shared.service';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignUpComponent implements OnInit {
    imageUrl = environment.imageEndPoints.loginLogo;
    isOtpArrived = false;
    signUpForm: FormGroup;
    showAlert: boolean = false;
    seconds: number = 0;
    displayTimer: string;
    guId: any;
    direction: string = 'ltr';
    /**
     * Constructor
     */
    constructor(
        private sharedService: SharedService,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private toaster: ToasterService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
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
            eMail: [
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
                    Validators.minLength(8),
                    Validators.maxLength(15),
                ],
            ],
            loginOtp: [''],
            contactGuid: [''],
        });
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        if (this.signUpForm.invalid) {
            return;
        }
        this.signUpForm.disable();
        this._authService.newUserSignUp(this.signUpForm.value).subscribe(
            (response: any) => {
                if (response.result.success) {
                    const formControl = this.signUpForm.get(
                        'loginOtp'
                    ) as FormControl;
                    const formControlGuid = this.signUpForm.get(
                        'contactGuid'
                    ) as FormControl;
                    formControl.setValidators(Validators.required);
                    formControlGuid.setValidators(Validators.required);
                    formControl.updateValueAndValidity();
                    formControlGuid.updateValueAndValidity();
                    this.guId = response?.result?.data;
                    this.isOtpArrived = true;
                    this.timer(0.5);
                    this.signUpForm.patchValue({
                        contactGuid: response?.result?.data,
                    });
                    this.signUpForm.enable();
                } else {
                    this.signUpForm.enable();
                    if (response.result.statusCode === 409) {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Duplicate Entry',
                            description: response.result.message,
                        });
                    } else {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Error',
                            description: response.result.message,
                        });
                    }
                }
            },
            (err) => {
                // Re-enable the form
                this.signUpForm.enable();

                // Reset the form
                this.signUpForm.reset();

                // Show the alert
                this.showAlert = true;
            }
        );
    }

    resendOtp() {
        this._authService
            .resendOtp(this.signUpForm.value.contactGuid)
            .subscribe((res: any) => {
                if (res) {
                    this.timer(0.5);
                    this.signUpForm.patchValue({ contactGuid: res.id });
                    this.guId = res?.result?.data;
                }
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
            // control.patchValue(control.value.trimLeft(1));
            return { multispace: true };
        } else if (
            Math.abs(
                control?.value?.trimRight()?.length - control?.value?.length
            ) > 1
        ) {
            // control.patchValue(control?.value?.trimRight(1));
            return { multispace: true };
        }
        const hasNumbers = /\d/.test(control?.value);
        return hasNumbers ? { customValidation: true } : null;
    }

    checkForTrimChars() {
        this.signUpForm.patchValue({
            fullName: this.signUpForm?.value?.fullName.trim(),
        });
    }
    timer(minute) {
        // let minute = 1;
        this.seconds = minute * 60;
        let textSec: any = 0;
        let statSec: number = 30;

        const prefix = minute < 10 ? 0 : null;

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

    changeLoginDetails() {
        const formControl = this.signUpForm.get('loginOtp') as FormControl;
        const formControlGuid = this.signUpForm.get(
            'contactGuid'
        ) as FormControl;
        formControl.setValidators(null);
        formControlGuid.setValidators(null);
        formControl.updateValueAndValidity();
        formControlGuid.updateValueAndValidity();
        this.isOtpArrived = false;
        this.signUpForm.reset();
    }

    validateSignUp() {
        const body = {
            contactGuid: this.guId,
            loginOtp: this.signUpForm.value.loginOtp,
        };
        this._authService.verifyOtp(body).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    // Navigate to the redirect url
                    this._router.navigateByUrl('/dashboard');
                } else {
                    if (res?.result?.statusCode === 400) {
                        this.signUpForm.patchValue({
                            loginOtp: '',
                        });
                        this.signUpForm.controls['loginOtp'].markAsTouched();
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Validation error',
                            description: res?.result?.message,
                        });
                    }
                }
            },
            (err) => {
                this.signUpForm.enable();
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
