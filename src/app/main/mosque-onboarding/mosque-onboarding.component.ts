import { Component } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MasterService } from 'app/services/master.service';
import { MosqueService } from 'app/services/mosque.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
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
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    },
};

@Component({
    selector: 'app-mosque-onboarding',
    templateUrl: './mosque-onboarding.component.html',
    styleUrl: './mosque-onboarding.component.scss',
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class MosqueOnboardingComponent {
    locationDetails: {};
    autocompleteControl = new FormControl();
    locations: any[] = [];
    direction: string = 'ltr';
    isLoading: boolean;
    mosqueInfoForm: FormGroup;

    mosqueTypes: any[] = [];
    masterLocations: any;
    productUOM: any = [];
    orgModel: any = [];
    mosqueFacilities: any = [];
    financialResources: any = [];
    mosqueCountries: any = [];
    mosqueStates: any = [];
    mosqueCities: any = [];
    mosqueDistricts: any = [];
    mosqueVillages: any = [];

    valuesArray: { value: boolean; display: string }[] = [
        { value: true, display: 'Yes' },
        { value: false, display: 'No' },
    ];

    filteredMosqueTypes: Observable<any[]>;
    mosqueTypeFilterCtrl = new FormControl();
    filteredMosqueCountries: Observable<any[]>;
    mosqueCountryFilterCtrl = new FormControl();
    filteredMosqueStates: Observable<any[]>;
    mosqueStateFilterCtrl = new FormControl();
    filteredMosqueCities: Observable<any[]>;
    mosqueCitiesFilterCtrl = new FormControl();
    filteredMosqueDistricts: Observable<any[]>;
    mosqueDistrictsFilterCtrl = new FormControl();
    filteredMosqueVillages: Observable<any[]>;
    mosqueVillagesFilterCtrl = new FormControl();
    filteredOrginsation: Observable<any[]>;
    mosqueOrgFilterCtrl = new FormControl();
    filteredMosqueFacilities: Observable<any[]>;
    mosqueFacilityFilterCtrl = new FormControl();
    filteredFinancialResources: Observable<any[]>;
    mosqueFinancialFilterCtrl = new FormControl();

    isAuthenticated: boolean;
    isTokenAvailable: any;
    currentPage = 1;
    onboardPage = false;

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
        private mosqueService: MosqueService,
        private masterService: MasterService
    ) {
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : //? 'en-US'
                  localStorage.getItem('isalaam-language')
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

        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
    }

    async MosqueInfoForm() {
        this.mosqueInfoForm = this.fb.group({
            aboutMosque: ['', Validators.required],
            mosqueName: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            mosqueLocation: ['', Validators.required],
            latitude: [],
            longitude: [],
            mosqueAddress: [''],
            personIncharge: ['', Validators.required],
            mobileNumber: [
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
                    Validators.required,
                ],
            ],
            website: [
                '',
                [
                    Validators.pattern(
                        /^(https?:\/\/)?([\w\d-]+\.)+[a-z]{2,6}(\/[\w\d-]*)*\/?$/i
                    ),
                ],
            ],
            mosqueTypeId: ['', Validators.required],
            establishedYear: ['', Validators.required],
            mosqueVillage: [''],
            mosqueDistrict: [''],
            mosqueCity: [''],
            mosqueState: [''],
            mosqueCountry: [''],
            rtrwCode: ['', [Validators.maxLength(7)]],
            landline: [],
            totalSittingCapacity: [
                '',
                [Validators.maxLength(6)],
            ],
            capacityOutside: [
                '',
                [Validators.maxLength(6)],
            ],
            numbersOfStaff: [
                '',
                [Validators.maxLength(6)],
            ],
            landArea: [
                '',
                [
                    Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
                    Validators.min(0),
                    Validators.max(999999),
                ],
            ],
            landUomId: [''],
            buildingArea: [
                '',
                [
                    Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
                    Validators.min(0),
                    Validators.max(999999),
                ],
            ],
            buildingUomId: [''],
            parkingArea: [''],
            parkingUomId: [''],
            masjidTower: [''],
            masjidDome: [''],
            landCertificate: [''],
            landLegalStatus: ['',[Validators.maxLength(15)],],
            buildingStructure: ['',[Validators.maxLength(15)],],
            organisationId: [''],
            facilityId: [''],
            resourceId: [''],
            sMAdminEmail: [
                '',
                [
                    Validators.email,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                    ),
                    Validators.required,
                ],
            ],
            isSMAdminVerified: [false],
            mosqueAdminEmail: [
                '',
                [
                    Validators.email,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                    ),
                ],
            ],
            isMosqueAdminVerified: [false],
            mosqueAccountantEmail: [
                '',
                [
                    Validators.email,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                    ),
                ],
            ],
            isMosqueAccountantVerified: [false],
        });

        try {
            await Promise.all([
                this.getAllMosqueTypes(),
                this.GetAllCountries(),
                this.getProductUomList(),
                this.GetFacilityResources(),
            ]);
            console.log('All services called successfully.');
        } catch (error) {
            console.error('Error while calling services:', error);
        }
    }

    noLeadingSpacesValidator(control: any) {
        if (control.value && control.value.startsWith(' ')) {
            return { noLeadingSpaces: true };
        }
        return null;
    }
    async getAllMosqueTypes() {
        return new Promise<void>((resolve, reject) => {
            this.mosqueService.getMosqueTypes().subscribe((res: any) => {
                if (res?.result?.success) {
                    this.mosqueTypes = res?.result?.data;
                    this.filteredMosqueTypes =
                        this.mosqueTypeFilterCtrl.valueChanges.pipe(
                            startWith(''),
                            map((value) => this._filterMosqueTypes(value))
                        );
                    resolve(); // Resolve the promise if successful
                } else {
                    reject('Error fetching mosque types.'); // Reject with error message
                }
            });
        });
    }

    async GetLocations() {
        return new Promise<void>((resolve, reject) => {
            this.mosqueService.getMasterLocations().subscribe((res: any) => {
                if (res?.result?.success) {
                    this.masterLocations = res?.result?.data;
                    resolve(); // Resolve the promise if successful
                } else {
                    reject('Error fetching locations.'); // Reject with error message
                }
            });
        });
    }

    async getProductUomList() {
        return new Promise<void>((resolve, reject) => {
            this.masterService.getProductUomList('Land').subscribe(
                (res: any) => {
                    if (res.result.success) {
                        this.productUOM = res?.result?.data;
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

    async GetFacilityResources() {
        return new Promise<void>((resolve, reject) => {
            this.masterService
                .OrganizationFacilityResources()
                .subscribe((res: any) => {
                    if (res?.result?.success) {
                        this.orgModel = res?.result?.data?.organization;
                        this.filteredOrginsation =
                            this.mosqueOrgFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) =>
                                    this._filterMosqueOrganisations(value)
                                )
                            );
                        this.mosqueFacilities = res?.result?.data?.facilities;
                        this.filteredMosqueFacilities =
                            this.mosqueFacilityFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) =>
                                    this._filterMosqueFacilities(value)
                                )
                            );
                        this.financialResources = res?.result?.data?.resources;
                        this.filteredFinancialResources =
                            this.mosqueFinancialFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) =>
                                    this._filterMosqueResources(value)
                                )
                            );
                        resolve(); // Resolve the promise if successful
                    } else {
                        reject('Error fetching facility resources.'); // Reject with error message
                    }
                });
        });
    }
    async GetAllCountries() {
        return new Promise<void>((resolve, reject) => {
            this.mosqueService.getAllCountries().subscribe(
                (res: any) => {
                    if (res.result.success) {
                        this.mosqueCountries = res?.result?.data;
                        this.filteredMosqueCountries =
                            this.mosqueCountryFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) =>
                                    this._filterMosqueCountries(value)
                                )
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
    private _filterMosqueTypes(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.mosqueTypes.filter((type) =>
            type.mosqueTypeName.toLowerCase().includes(filterValue)
        );
    }
    private _filterMosqueCountries(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.mosqueCountries.filter((con) =>
            con.name.toLowerCase().includes(filterValue)
        );
    }
    private _filterMosqueStates(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.mosqueStates.filter((state) =>
            state.name.toLowerCase().includes(filterValue)
        );
    }
    private _filterMosqueCities(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.mosqueCities.filter((city) =>
            city.name.toLowerCase().includes(filterValue)
        );
    }
    private _filterMosqueDistricts(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.mosqueDistricts.filter((dist) =>
            dist.name.toLowerCase().includes(filterValue)
        );
    }
    private _filterMosqueVillages(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.mosqueVillages.filter((vil) =>
            vil.name.toLowerCase().includes(filterValue)
        );
    }
    private _filterMosqueOrganisations(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.orgModel.filter((type) =>
            type.organisationName.toLowerCase().includes(filterValue)
        );
    }
    private _filterMosqueFacilities(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.mosqueFacilities.filter((type) =>
            type.facilityName.toLowerCase().includes(filterValue)
        );
    }
    private _filterMosqueResources(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.financialResources.filter((type) =>
            type.resourceName.toLowerCase().includes(filterValue)
        );
    }

    getSelectedFacilityNames(): string {
        const selectedIds = this.mosqueInfoForm.get('facilityId').value;
        const selectedFacilities = this.mosqueFacilities.filter((facility) =>
            selectedIds.includes(facility.facilityId)
        );
        return (
            selectedFacilities
                .map((facility) => facility.facilityName)
                .join(', ') || 'No selections made'
        );
    }

    getSelectedResourceNames(): string {
        const selectedIds = this.mosqueInfoForm.get('resourceId').value;
        const selectedResources = this.financialResources.filter((resource) =>
            selectedIds.includes(resource.resourceId)
        );
        return (
            selectedResources
                .map((resource) => resource.resourceName)
                .join(', ') || 'No selections made'
        );
    }

    cancelRequest(): void {
        this.mosqueInfoForm.reset();
        this.mosqueInfoForm.get('sMAdminEmail')?.enable();
        this.mosqueInfoForm.get('mosqueAdminEmail')?.enable();
        this.mosqueInfoForm = this.fb.group({
            aboutMosque: ['', Validators.required],
            mosqueName: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            mosqueLocation: ['', Validators.required],
            latitude: [],
            longitude: [],
            mosqueAddress: ['', Validators.required],
            personIncharge: ['', Validators.required],
            mobileNumber: [
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
                    Validators.required,
                ],
            ],
            website: [
                '',
                [
                    Validators.pattern(
                        /^(https?:\/\/)?([\w\d-]+\.)+[a-z]{2,6}(\/[\w\d-]*)*\/?$/i
                    ),
                ],
            ],
            mosqueTypeId: ['', Validators.required],
            establishedYear: ['', Validators.required],
            mosqueVillage: ['', Validators.required],
            mosqueDistrict: ['', Validators.required],
            mosqueCity: ['', Validators.required],
            mosqueState: ['', Validators.required],
            mosqueCountry: ['', Validators.required],
            rtrwCode: ['', [Validators.maxLength(7)]],
            landline: [],
            totalSittingCapacity: [
                '',
                [Validators.required, Validators.maxLength(6)],
            ],
            capacityOutside: [
                '',
                [Validators.required, Validators.maxLength(6)],
            ],
            numbersOfStaff: [
                '',
                [Validators.required, Validators.maxLength(6)],
            ],
            landArea: [
                '',
                [
                    Validators.required,
                    Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
                    Validators.min(0),
                    Validators.max(999999),
                ],
            ],
            landUomId: ['', Validators.required],
            buildingArea: [
                '',
                [
                    Validators.required,
                    Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
                    Validators.min(0),
                    Validators.max(999999),
                ],
            ],
            buildingUomId: ['', Validators.required],
            parkingArea: [''],
            parkingUomId: [''],
            masjidTower: ['', Validators.required],
            masjidDome: ['', Validators.required],
            landCertificate: ['', Validators.required],
            landLegalStatus: [
                '',
                [Validators.required, Validators.maxLength(15)],
            ],
            buildingStructure: [
                '',
                [Validators.required, Validators.maxLength(15)],
            ],
            organisationId: ['', Validators.required],
            facilityId: ['', Validators.required],
            resourceId: ['', Validators.required],
            sMAdminEmail: [
                '',
                [
                    Validators.email,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                    ),
                    Validators.required,
                ],
            ],
            isSMAdminVerified: [false],
            mosqueAdminEmail: [
                '',
                [
                    Validators.email,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                    ),
                    Validators.required,
                ],
            ],
            isMosqueAdminVerified: [false],
        });
        this.onboardPage = false;
        this.currentPage = 1;
    }

    sendOnboardRequest() {
        if (
            !this.mosqueInfoForm?.value?.isMosqueAdminVerified ||
            !this.mosqueInfoForm?.value?.isSMAdminVerified
        ) {
            this.toaster.triggerToast({
                type: 'info',
                message: 'Info',
                description: 'Please complete appropriate mandatory fields',
            });
            return true;
        }
        if (this.mosqueInfoForm.invalid) {
            return true;
        }
        const formData = new FormData();
        let body = this.mosqueInfoForm?.value;
        Object.keys(body).forEach((key) => {
            if (key === 'latitude') {
                body[key] = this.mosqueInfoForm.value.latitude
                    ? this.mosqueInfoForm.value.latitude
                    : 12.15;
            } else if (key === 'longitude') {
                body[key] = this.mosqueInfoForm.value.longitude
                    ? this.mosqueInfoForm.value.longitude
                    : 12.15;
            }
            formData.append(key, body[key]);
        });

        const rawFormValue = this.mosqueInfoForm.getRawValue();

        const payload = {
            ...rawFormValue,
            facilityId: rawFormValue.facilityId?.join(','),
            resourceId: rawFormValue.resourceId?.join(','),
        };
        this.mosqueService.sendOnboardRequest(payload).subscribe(
            (res: any) => {
                if (res.result.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res.result.message,
                    });
                    this.cancelRequest();
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

    setYear(
        normalizedYear: moment.Moment,
        datepicker: MatDatepicker<moment.Moment>
    ) {
        const yearValue = normalizedYear.year();
        const currentYear = new Date().getFullYear();

        if (yearValue <= currentYear) {
            this.mosqueInfoForm
                .get('establishedYear')
                .setValue(yearValue.toString());
        } else {
            this.mosqueInfoForm.get('establishedYear').setValue(null);
            this.toaster.triggerToast({
                type: 'error',
                message: 'Error',
                description: 'Year must be less then current year',
            });
        }
        datepicker.close();
    }
    getLocationData(id: number, typeId: string) {
        this.mosqueService.getAllLocations(id, typeId).subscribe(
            (res: any) => {
                if (res.result.success) {
                    if (typeId == 'S') {
                        this.mosqueStates = res?.result?.data;
                        this.filteredMosqueStates =
                            this.mosqueStateFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) => this._filterMosqueStates(value))
                            );
                    } else if (typeId == 'C') {
                        this.mosqueCities = res?.result?.data;
                        this.filteredMosqueCities =
                            this.mosqueCitiesFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) => this._filterMosqueCities(value))
                            );
                    } else if (typeId == 'D') {
                        this.mosqueDistricts = res?.result?.data;
                        this.filteredMosqueDistricts =
                            this.mosqueDistrictsFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) =>
                                    this._filterMosqueDistricts(value)
                                )
                            );
                    } else {
                        this.mosqueVillages = res?.result?.data;
                        this.filteredMosqueVillages =
                            this.mosqueVillagesFilterCtrl.valueChanges.pipe(
                                startWith(''),
                                map((value) =>
                                    this._filterMosqueVillages(value)
                                )
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
    selectLocation(locationDetails) {
        this.mosqueInfoForm.patchValue({
            mosqueLocation: locationDetails?.description,
            latitude: locationDetails?.latitude,
            longitude: locationDetails?.longitude,
        });
        this.locationDetails = locationDetails;
    }

    verifyUserExistAsMember(uEmail, type) {
        this.mosqueService.verifyUserExistAsMember(uEmail).subscribe(
            (res: any) => {
                if (res.result.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res.result.message,
                    });
                    if (type === 'SMA') {
                        this.mosqueInfoForm
                            .get('isSMAdminVerified')
                            .setValue(true);
                        this.mosqueInfoForm.get('sMAdminEmail')?.disable();
                    } else if (type === 'MA') {
                        this.mosqueInfoForm
                            .get('isMosqueAdminVerified')
                            .setValue(true);
                        this.mosqueInfoForm.get('mosqueAdminEmail')?.disable();
                    } else if (type === 'MAC') {
                        this.mosqueInfoForm
                            .get('isMosqueAccountantVerified')
                            .setValue(true);
                        this.mosqueInfoForm
                            .get('mosqueAccountantEmail')
                            ?.disable();
                    }
                } else {
                    this.toaster.triggerToast({
                        type: 'info',
                        message: 'Info',
                        description: res.result.message,
                    });
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
    goToNextPage() {
        this.currentPage++;
    }

    goToPreviousPage() {
        this.currentPage--;
    }
    goToOnboardPage() {
        this.MosqueInfoForm();
        this.onboardPage = true;
    }
    goToMemberRegistration() {
        this._router.navigate(['/sign-up']);
    }
}
