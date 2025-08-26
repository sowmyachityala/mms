import { Component, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    Validators,
    FormGroup,
    FormControl,
    FormArray,
    FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/auth.service';
import { ToasterService } from 'app/services/toaster.service';
import { SharedService } from 'app/services/shared.service';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    map,
    Observable,
    startWith,
    switchMap,
    tap,
} from 'rxjs';
import { MosqueService } from 'app/services/mosque.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { EmailPhoneValidator } from 'app/email-phone-validator';
import { NgxSpinnerService } from 'ngx-spinner';
import { ageValidator } from 'app/ageValidator';

@Component({
    selector: 'app-imam-registration',
    templateUrl: './imam-registration.component.html',
    styleUrl: './imam-registration.component.scss',
})
export class ImamRegistrationComponent implements OnInit {
    imageUrl = environment.imageEndPoints.loginLogo;
    isOtpArrived = false;
    signUpForm: FormGroup;
    showAlert: boolean = false;
    seconds: number = 0;
    displayTimer: string;
    guId: any;
    direction: string = 'ltr';
    currentActions: any;
    isLoading: boolean;
    imamInfoForm: FormGroup;
    locationDetails: {};
    autocompleteControl = new FormControl();
    locations: any[] = [];
    filteredCountries: Observable<any[]>;
    countryFilterCtrl = new FormControl();
    filteredStates: Observable<any[]>;
    stateFilterCtrl = new FormControl();
    filteredCities: Observable<any[]>;
    citiesFilterCtrl = new FormControl();
    filteredDistricts: Observable<any[]>;
    districtsFilterCtrl = new FormControl();
    filteredVillages: Observable<any[]>;
    villagesFilterCtrl = new FormControl();
    HigherEducation: any = [];
    TrainingCourses: any = [];
    LocalLanguages: any = [];
    SermonThemes: any = [];
    MemorizationAbility: any = [];
    EductaionTrainingInstructor: any = [];
    SocialMediaAccounts: any = [];
    socialMediaAccounts: FormArray;
    imamProfileInfo: any = [];
    imamProfileGrid: boolean = false;
    imamRegGrid: boolean = true;
    countriesList = [];
    statesList = [];
    citiesList = [];
    districtList = [];
    villagesList = [];
    isNewImamReg: string = 'New';
    signInForm: FormGroup;
    userId: string;
    radioButtonsDisabled: boolean = false;
    //maxDate: Date;
    maxDOB = new Date();
    constructor(
        private sharedService: SharedService,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private spinnerService: NgxSpinnerService,
        private toaster: ToasterService,
        private fb: FormBuilder,
        private mosqueService: MosqueService
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
        this.autocompleteControl.valueChanges
            .pipe(
                filter((value) => value?.length > 3),
                map((value) => value.trim()),
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => {
                    this.locations = [];
                    this.isLoading = true;
                }),
                switchMap((value) =>
                    this.sharedService.findPlacesBySearchKey(value)
                ),
                finalize(() => (this.isLoading = false))
            )
            .subscribe((res: any) => {
                this.locations = res?.result?.data;
            });

        this.currentActions = this.sharedService.getCurrentPageActions();
        this.switchForm(this.isNewImamReg);
        // this.signUpForm = this._formBuilder.group({
        //     fullName: [
        //         '',
        //         [
        //             Validators.required,
        //             Validators.minLength(2),
        //             Validators.maxLength(50),
        //             Validators.pattern('^[A-Za-z ]*$'),
        //             this.customValidation,
        //         ],
        //     ],
        //     eMail: [
        //         '',
        //         [
        //             Validators.required,
        //             Validators.email,
        //             Validators.pattern(
        //                 /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        //             ),
        //         ],
        //     ],
        //     phoneNumber: [
        //         '',
        //         [
        //             Validators.required,
        //             Validators.minLength(10),
        //             Validators.maxLength(14),
        //         ],
        //     ],
        //     registerFrom: ['ImamReg'],
        //     loginOtp: [''],
        //     contactGuid: [''],
        // });

        // this.signInForm = this._formBuilder.group({
        //     email: ['', [Validators.required, EmailPhoneValidator]],
        //     loginOtp: [''],
        //     contactGuid: [''],
        // });

        this.imamInfoForm = this.fb.group({
            id: [''],
            imamGuid: [''],
            userId: ['', Validators.required],
            nickName: ['', Validators.required],
            place: [''],
            doB: ['', ageValidator(20)],
            imamAddress: [''],
            countryId: [''],
            stateId: [''],
            cityId: [''],
            districtId: [''],
            villageId: [''],
            rtrwCode: ['', [Validators.maxLength(7)]],
            postalCode: ['', [Validators.maxLength(5)]],
            mapsLocation: [''],
            latitude: [''],
            longitude: [],
            mainBaseMosque: ['', this.noLeadingSpacesValidator],
            mainMosqueAddress: ['', this.noLeadingSpacesValidator],
            mosqueMapsLocation: [''],
            mosqueLatitude: [''],
            mosqueLongitude: [],
            otherMosques: this.fb.array([]),
            educationLevels: [''],
            trainings: [''],
            knownLanguages: [''],
            sermonThemes: [''],
            memorizationAbilityId: [''],
            professionalImam: [''],
            expInternationalDawah: [''],
            professionalKhatib: [''],
            expImamAbroad: [''],
            religiousBookAuthor: [''],
            activistReligiousInst: [''],
            popularPreacher: [''],
            moderateDawahActivist: [''],
            majelisTaklimTeacher: [''],
            serviceGovtInst: [''],
            pesantrenTeacher: [''],
            socialMediaActivist: [''],
            politicalPartyAffiliation: [''],
            independent: [''],
            eductaionTrainingInstructor: [''],
            socialMediaAccounts: this.fb.array([]),
        });
        this.socialMediaAccounts = this.imamInfoForm.get(
            'socialMediaAccounts'
        ) as FormArray;
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });

        //this.maxDate = new Date();
    }

    signUp(): void {
        if (this.signUpForm.invalid) {
            return;
        }
        this.radioButtonsDisabled = true;
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
                this.signUpForm.enable();
                this.signUpForm.reset();
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

    checkForTrimChars() {
        this.signUpForm.patchValue({
            fullName: this.signUpForm?.value?.fullName.trim(),
        });
    }

    timer(minute) {
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
        //this.radioButtonsDisabled = true;
        const body = {
            contactGuid: this.guId,
            loginOtp: this.signUpForm.value.loginOtp,
        };
        this._authService.verifyOtp(body).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.imamRegGrid = false;
                    this.imamProfileGrid = true;
                    this.imamInfoForm.patchValue({
                        userId: res.result.data.userId,
                    });
                    this.GetAllCountries();
                    this.GetAllImamMasterData();
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
    async GetAllCountries() {
        return new Promise<void>((resolve, reject) => {
            this.mosqueService.getAllCountries().subscribe(
                (res: any) => {
                    if (res.result.success) {
                        this.countriesList = res?.result?.data;
                        this.filteredCountries =
                            this.countryFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) => this._filterCountries(value))
                            );
                        resolve(); // Resolve the promise if successful
                    } else {
                        reject('Error fetching product UOM.'); // Reject with error message
                    }
                },
                (err) => {
                    reject(err); // Reject with error message
                }
            );
        });
    }

    getLocationData(id: number, typeId: string) {
        this.mosqueService.getAllLocations(id, typeId).subscribe(
            (res: any) => {
                if (res.result.success) {
                    if (typeId == 'S') {
                        this.statesList = res?.result?.data;
                        this.filteredStates =
                            this.stateFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) => this._filterStates(value))
                            );
                    } else if (typeId == 'C') {
                        this.citiesList = res?.result?.data;
                        this.filteredCities =
                            this.citiesFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) => this._filterCities(value))
                            );
                    } else if (typeId == 'D') {
                        this.districtList = res?.result?.data;
                        this.filteredDistricts =
                            this.districtsFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) => this._filterDistricts(value))
                            );
                    } else {
                        this.villagesList = res?.result?.data;
                        this.filteredVillages =
                            this.villagesFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) => this._filterVillages(value))
                            );
                    }
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

    private _filterCountries(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.countriesList.filter((con) =>
            con.name.toLowerCase().includes(filterValue)
        );
    }
    private _filterStates(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.statesList.filter((state) =>
            state.name.toLowerCase().includes(filterValue)
        );
    }
    private _filterCities(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.citiesList.filter((city) =>
            city.name.toLowerCase().includes(filterValue)
        );
    }
    private _filterDistricts(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.districtList.filter((dist) =>
            dist.name.toLowerCase().includes(filterValue)
        );
    }
    private _filterVillages(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.villagesList.filter((vil) =>
            vil.name.toLowerCase().includes(filterValue)
        );
    }
    selectLocation(locationDetails) {
        this.imamInfoForm.patchValue({
            mapsLocation: locationDetails?.description,
            latitude: locationDetails?.latitude,
            longitude: locationDetails?.longitude,
        });
        //this.locationDetails = locationDetails;
    }
    selectMainMosqueLocation(locationDetails) {
        this.imamInfoForm.patchValue({
            mosqueMapsLocation: locationDetails?.description,
            mosqueLatitude: locationDetails?.latitude,
            mosqueLongitude: locationDetails?.longitude,
        });
        this.locationDetails = locationDetails;
    }
    get otherMosques(): FormArray {
        return this.imamInfoForm.get('otherMosques') as FormArray;
    }

    addMosque() {
        const mosqueGroup = this.fb.group({
            otherMosqueName: ['', Validators.required],
            otherMosqueAddress: ['', Validators.required],
            //otherMosqueMapsLocation: ['', Validators.required],
            //otherMosqueLatitude: [''],
            //otherMosqueLongitude: [],
        });
        this.otherMosques.push(mosqueGroup);
    }
    removeMosque(index: number) {
        this.otherMosques.removeAt(index);
    }
    async GetAllImamMasterData() {
        return new Promise<void>((resolve, reject) => {
            this.mosqueService.getAllImamMasterData().subscribe(
                (res: any) => {
                    if (res.result.success) {
                        this.HigherEducation =
                            res?.result?.data?.higherEducation;
                        this.TrainingCourses =
                            res?.result?.data?.trainingCourses;
                        this.LocalLanguages = res?.result?.data?.localLanguages;
                        this.SermonThemes = res?.result?.data?.sermonThemes;
                        this.MemorizationAbility =
                            res?.result?.data?.memorizationAbility;
                        this.SocialMediaAccounts =
                            res?.result?.data?.socialMediaAccounts;
                        this.EductaionTrainingInstructor =
                            res?.result?.data?.eductaionTrainingInstructor;
                        this.setSocialMediaAccounts(
                            res?.result?.data?.socialMediaAccounts
                        );
                        resolve(); // Resolve the promise if successful
                    } else {
                        reject('Error fetching product UOM.'); // Reject with error message
                    }
                },
                (err) => {
                    reject(err); // Reject with error message
                }
            );
        });
    }
    setSocialMediaAccounts(accounts: any[]) {
        const socialMediaFormArray = this.imamInfoForm.get(
            'socialMediaAccounts'
        ) as FormArray;
        socialMediaFormArray.clear(); // Clear existing form array controls if any

        accounts.forEach((account) => {
            socialMediaFormArray.push(this.createSocialMediaFormGroup(account));
        });
    }
    createSocialMediaFormGroup(account: any) {
        const formGroup = this.fb.group({
            id: account.id,
            socialMediaType: account.socialMediaType,
            isChecked: account.isChecked,
            socialMediaId: account.socialMediaId,
        });

        formGroup.get('isChecked').valueChanges.subscribe((checked) => {
            const socialMediaIdControl = formGroup.get('socialMediaId');
            if (checked) {
                socialMediaIdControl.setValidators(Validators.required);
            } else {
                socialMediaIdControl.clearValidators();
            }
            socialMediaIdControl.updateValueAndValidity();
        });

        return formGroup;
    }

    isInvalid(index: number) {
        const account = (
            this.imamInfoForm.get('socialMediaAccounts') as FormArray
        ).at(index);
        return (
            account.get('socialMediaId').invalid &&
            account.get('socialMediaId').touched
        );
    }

    addUpdateImamProfileData() {
        if (this.imamInfoForm.invalid) {
            return true;
        }
        this.imamInfoForm.patchValue({
            educationLevels: [this.imamInfoForm.get('educationLevels').value], // Store the value as an array
        });
        let body = this.imamInfoForm?.value;

        this.mosqueService
            .addOrUpdateImamProfile(body)
            .subscribe((res: any) => {
                if (res.result.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res.result.message,
                    });
                    this._router.navigateByUrl('/dashboard');
                }
            });
    }
    cancelRegistration() {
        this._router.navigateByUrl('/dashboard');
    }

    sendOtp(): void {
        if (this.signInForm.invalid) {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: 'Please fill all mandatory information',
            });
            return;
        }
        this.radioButtonsDisabled = true;
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
    resendOtpExist() {
        this._authService
            .resendOtp(this.signInForm.value.contactGuid)
            .subscribe((res: any) => {
                if (res) {
                    this.timer(0.5);
                    this.signInForm.patchValue({ contactGuid: res.id });
                    this.guId = res.id;
                }
            });
    }
    validateSignIn() {
        if (this.signInForm.invalid) {
            return;
        }
        this._authService.verifyOtp(this.signInForm.value).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    if (res?.result?.data?.roleName == 'IMAM') {
                        this.imamRegGrid = false;
                        this.imamProfileGrid = true;
                        this.userId = res.result.data.userId;
                        this.imamInfoForm.patchValue({
                            userId: res.result.data.userId,
                        });
                        this.VerifyIsImamProfileUpload();
                        this.GetAllCountries();
                        this.GetAllImamMasterData();
                    } else {
                        this.toaster.triggerToast({
                            type: 'info',
                            message: 'Role Information',
                            description:
                                'User is exist with role as ' +
                                res?.result?.data?.roleName +
                                ', Please contact administrator to Switch role as Imam',
                        });
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

    getImamProfileDataById() {
        this.spinnerService.show();
        this.mosqueService.getImamProfileData(this.userId, 'Imam').subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.imamProfileInfo = res?.result?.data;
                    this.imamInfoForm.patchValue(this.imamProfileInfo);
                    this.imamInfoForm.patchValue({
                        knownLanguages: this.imamProfileInfo.knownLanguages.map(
                            ({ id }) => id
                        ),
                        educationLevels:
                            this.imamProfileInfo.educationLevels.map(
                                ({ id }) => id
                            ),
                        trainings: this.imamProfileInfo.trainings.map(
                            ({ id }) => id
                        ),
                        sermonThemes: this.imamProfileInfo.sermonThemes.map(
                            ({ id }) => id
                        ),
                        eductaionTrainingInstructor:
                            this.imamProfileInfo.eductaionTrainingInstructor.map(
                                ({ id }) => id
                            ),
                    });
                    this.setSocialMediaAccounts(
                        this.imamProfileInfo.socialMediaAccounts
                    );
                    this.imamProfileInfo.otherMosques.forEach((mosque) => {
                        const mosqueGroup = this.fb.group({
                            otherMosqueName: [
                                mosque.otherMosqueName,
                                Validators.required,
                            ],
                            otherMosqueAddress: [
                                mosque.otherMosqueAddress,
                                Validators.required,
                            ],
                            //otherMosqueMapsLocation: [mosque.otherMosqueMapsLocation, Validators.required],
                            //otherMosqueLatitude: [mosque.otherMosqueLatitude],
                            //otherMosqueLongitude: [mosque.otherMosqueLongitude],
                            //autocompleteControlMosque: new FormControl()
                        });
                        this.otherMosques.push(mosqueGroup);
                    });
                    this.spinnerService.hide();
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
                    message: 'Server error',
                    description: err?.message,
                });
            }
        );
    }

    VerifyIsImamProfileUpload() {
        this.mosqueService.VerifyImamProfile().subscribe((res: any) => {
            if (res?.result?.success) {
                this.getImamProfileDataById();
            }
        });
    }

    switchForm(isNewImamReg: string) {
        if (isNewImamReg === 'New') {
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
                registerFrom: ['ImamReg'],
                loginOtp: [''],
                contactGuid: [''],
            });
        } else {
            this.signInForm = this._formBuilder.group({
                email: ['', [Validators.required, EmailPhoneValidator]],
                loginOtp: [''],
                contactGuid: [''],
            });
        }
    }

    noLeadingSpacesValidator(control: any) {
        if (control.value && control.value.startsWith(' ')) {
            return { noLeadingSpaces: true };
        }
        return null;
    }
    getSelectedTrainingNames(): string {
        const selectedIds = this.imamInfoForm.get('trainings').value;
        const selectedCourses = this.TrainingCourses.filter((course) =>
            selectedIds.includes(course.id)
        );
        return (
            selectedCourses.map((course) => course.trainingName).join(', ') ||
            'No selections made'
        );
    }

    getSelectedLanguageNames(): string {
        const selectedIds = this.imamInfoForm.get('knownLanguages').value;
        const selectedLangs = this.LocalLanguages.filter((lang) =>
            selectedIds.includes(lang.id)
        );
        return (
            selectedLangs.map((lang) => lang.languageName).join(', ') ||
            'No selections made'
        );
    }

    getSelectedSermonThemeNames(): string {
        const selectedIds = this.imamInfoForm.get('sermonThemes').value;
        const selectedThemes = this.SermonThemes.filter((theme) =>
            selectedIds.includes(theme.id)
        );
        return (
            selectedThemes.map((theme) => theme.sermonThemeName).join(', ') ||
            'No selections made'
        );
    }

    getSelectedInstructorNames(): string {
        const selectedIds = this.imamInfoForm.get(
            'eductaionTrainingInstructor'
        ).value;
        const selectedInstructors = this.EductaionTrainingInstructor.filter(
            (instructor) => selectedIds.includes(instructor.id)
        );
        return (
            selectedInstructors
                .map((instructor) => instructor.educationTrainingName)
                .join(', ') || 'No selections made'
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
}
