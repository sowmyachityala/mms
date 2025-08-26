import { TranslateService } from '@ngx-translate/core';
import { ImageUploadComponent } from 'app/common/image-upload/image-upload.component';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { User } from 'app/core/user/user.types';
import { UserProfileDetailsUpdateComponent } from 'app/main/dialogs/user-profile/user-profile-details-update/user-profile-details-update.component';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';
import { FcmDeviceComponent } from '../fcm-device/fcm-device.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    Observable,
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    map,
    startWith,
    switchMap,
    tap,
} from 'rxjs';
import { MosqueService } from 'app/services/mosque.service';
import { ageValidator } from 'app/ageValidator';

@Component({
    selector: 'app-imam-profile',
    templateUrl: './imam-profile.component.html',
    styleUrl: './imam-profile.component.scss',
})
export class ImamProfileComponent {
    userProfile: any = [];
    isOtpArrived = false;
    displayTimer: any;
    seconds = 0;
    url = '';
    direction: string = 'ltr';
    user: User;
    isLoadingType: string;
    imamInfoForm: FormGroup;
    locationDetails: {};
    autocompleteControl = new FormControl();
    locations: any[] = [];
    countriesList = [];
    statesList = [];
    citiesList = [];
    districtList = [];
    villagesList = [];
    currentActions: any;
    isLoading: boolean;
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
    userId: string;
    imamProfileInfo: any = [];
    maxDOB = new Date();
    //autocompleteControlMosque= new FormControl();

    constructor(
        private userService: UserManagementService,
        private dialog: MatDialog,
        private mosqueService: MosqueService,
        private toaster: ToasterService,
        public profileDialogRef: MatDialogRef<ImamProfileComponent>,
        private sharedService: SharedService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private spinnerService: NgxSpinnerService,
        private fb: FormBuilder
    ) {
        this.isLoadingType = 'pacman';
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
        this.user = AuthUtils._decodeToken(
            localStorage.getItem('isalaamAccessToken')
        );
        this.userId = this.user?.userId;
        this.imamInfoForm = this.fb.group({
            id: [''],
            imamGuid: [''],
            userId: [this.userId, Validators.required],
            nickName: ['', Validators.required],
            place: ['', Validators.required],
            doB: ['', [Validators.required, ageValidator(20)]],
            imamAddress: ['', Validators.required],
            countryId: ['', Validators.required],
            stateId: ['', Validators.required],
            cityId: ['', Validators.required],
            districtId: ['', Validators.required],
            villageId: ['', Validators.required],
            rtrwCode: ['', [Validators.required, Validators.maxLength(7)]],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]],
            mapsLocation: [''],
            latitude: [''],
            longitude: [''],
            mainBaseMosque: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            mainMosqueAddress: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            mosqueMapsLocation: ['', Validators.required],
            mosqueLatitude: [''],
            mosqueLongitude: [''],
            otherMosques: this.fb.array([]),
            educationLevels: ['', Validators.required],
            trainings: ['', Validators.required],
            knownLanguages: ['', Validators.required],
            sermonThemes: ['', Validators.required],
            memorizationAbilityId: ['', Validators.required],
            professionalImam: ['', Validators.required],
            expInternationalDawah: ['', Validators.required],
            professionalKhatib: ['', Validators.required],
            expImamAbroad: ['', Validators.required],
            religiousBookAuthor: ['', Validators.required],
            activistReligiousInst: ['', Validators.required],
            popularPreacher: ['', Validators.required],
            moderateDawahActivist: ['', Validators.required],
            majelisTaklimTeacher: ['', Validators.required],
            serviceGovtInst: ['', Validators.required],
            pesantrenTeacher: ['', Validators.required],
            socialMediaActivist: ['', Validators.required],
            politicalPartyAffiliation: ['', Validators.required],
            independent: ['', Validators.required],
            eductaionTrainingInstructor: ['', Validators.required],
            socialMediaAccounts: this.fb.array([]),
        });
        this.socialMediaAccounts = this.imamInfoForm.get(
            'socialMediaAccounts'
        ) as FormArray;
    }

    async ngOnInit() {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
        this.getUserProfileDetails();

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
        try {
            await Promise.all([
                this.GetAllCountries(),
                this.GetAllImamMasterData(),
                //this.getImamProfileDataById()
                this.VerifyIsImamProfileUpload(),
            ]);
        } catch (error) {
            console.error('Error while calling services:', error);
        }
    }

    onClose() {
        this.profileDialogRef.close();
    }

    getUserProfileDetails() {
        this.spinnerService.show();
        this.userService.getUserProfileById().subscribe((res: any) => {
            if (res?.result?.success) {
                this.userProfile = res?.result?.data;
                this.user = AuthUtils._decodeToken(
                    localStorage.getItem('isalaamAccessToken')
                );
                this.url = this.userProfile.profileImageUrl;
                //setTimeout(() => {
                this.spinnerService.hide();
                //}, 5000); // 5 seconds
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }

    uploadImage(type, width, height) {
        const dialogRef = this.dialog.open(ImageUploadComponent, {
            data: {
                type: type,
                width: width,
                height: height,
                returnToParent: false,
                apiProperties: {
                    serviceType: 'user_profile',
                    profileDetails: this.userProfile,
                    ImageType:
                        type === 'profile' ? 1 : type === 'cover' ? 2 : '',
                },
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getUserProfileDetails();
            }
        });
    }

    editUserProfileInfo(fieldType) {
        const dialogRef = this.dialog.open(UserProfileDetailsUpdateComponent, {
            maxWidth: '650px',
            minWidth: '650px',
            // height:'auto',
            data: {
                profileDetails: this.userProfile,
                messageType: fieldType,
                isCreate: true,
                buttons: [
                    {
                        type: 'Cancel',
                        //label: 'Cancel',
                        label: this.translate.instant('DialogBox.cancel'),
                    },
                    {
                        color: 'primary',
                        type: 'Confirm',
                        //label: 'Save & Continue',
                        label: this.translate.instant(
                            'DialogBox.saveCountinue'
                        ),
                        buttonClass:
                            this.direction === 'ltr'
                                ? 'ml-2'
                                : this.direction === 'rtl'
                                ? 'mr-2'
                                : '',
                    },
                ],
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getUserProfileDetails();
            }
        });
    }

    openDeviceList(devices) {
        const dialogRef = this.dialog.open(FcmDeviceComponent, {
            data: {
                deviceData: devices,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getUserProfileDetails();
            }
        });
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

    selectOtherMosqueLocation(locationDetails, index: number) {
        const mosqueFormGroup = this.otherMosques.at(index) as FormGroup;
        if (mosqueFormGroup) {
            mosqueFormGroup.patchValue({
                otherMosqueMapsLocation: locationDetails?.description,
                otherMosqueLatitude: locationDetails?.latitude,
                otherMosqueLongitude: locationDetails?.longitude,
            });

            const control = mosqueFormGroup.get('otherMosqueMapsLocation');
            if (control) {
                control.updateValueAndValidity();
            }
        }
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
            // Object.keys(this.imamInfoForm.controls).forEach(controlName => {
            //   const control = this.imamInfoForm.get(controlName);
            //   if (control?.invalid) {
            //     console.log(`Field ${controlName} is invalid.`);
            //   }
            // });
            return true;
        }
        let body = this.imamInfoForm?.value;
        this.imamInfoForm.patchValue({
            educationLevels: [this.imamInfoForm.get('educationLevels').value], // Store the value as an array
        });
        this.mosqueService
            .addOrUpdateImamProfile(body)
            .subscribe((res: any) => {
                if (res.result.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res.result.message,
                    });
                    this.profileDialogRef.close();
                }
            });
    }

    getImamProfileDataById() {
        this.spinnerService.show();
        this.mosqueService.getImamProfileData(this.userId, 'Imam').subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.imamProfileInfo = res?.result?.data;
                    this.imamInfoForm.patchValue(this.imamProfileInfo);
                    this.imamInfoForm.patchValue({
                        educationLevels:
                            this.imamProfileInfo.educationLevels[0].id, //removed multi selection
                    });
                    this.imamInfoForm.patchValue({
                        knownLanguages: this.imamProfileInfo.knownLanguages.map(
                            ({ id }) => id
                        ),
                        //educationLevels: this.imamProfileInfo.educationLevels.map(({ id }) => id),
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
}
