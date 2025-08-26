import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MosqueService } from 'app/services/mosque.service';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { ToasterService } from 'app/services/toaster.service';
import { ConfirmationDialogComponent } from 'app/main/dialogs/mosque-confirmation-dialog/confirmation-dialog.component';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AssignAdministratorComponent } from '../assign-administrator/assign-administrator.component';
import { ImageUploadComponent } from 'app/common/image-upload/image-upload.component';
import { SharedService } from 'app/services/shared.service';
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
import { HttpClient } from '@angular/common/http';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterService } from 'app/services/master.service';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
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
    selector: 'app-add-update-mosque',
    templateUrl: './add-update-mosque.component.html',
    styleUrls: ['./add-update-mosque.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class AddUpdateMosqueComponent implements OnInit {
    mosqueInfoForm: FormGroup;
    selectedFile = null;
    selection = '';
    selectedProfileFile = null;
    profileSelection: string = '';
    mosqueGuId: any;
    direction: string = 'ltr';
    isLoading: boolean;
    locations: any[] = [];
    locationDetails: {};
    autocompleteControl = new FormControl();
    coverImageSource: string;
    profileImageSource: string;
    imageUrl = environment.imageEndPoints;
    mosqueInfoDetails: any;
    currentActions: any;
    isLoadingType: string;
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
    //date = new FormControl(moment(null));

    constructor(
        public addDialogRef: MatDialogRef<AddUpdateMosqueComponent>,
        private fb: FormBuilder,
        private sharedService: SharedService,
        @Inject(MAT_DIALOG_DATA) public data,
        private mosqueService: MosqueService,
        private _fuseConfirmationService: FuseConfirmationService,
        private toaster: ToasterService,
        private dialog: MatDialog,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private spinnerService: NgxSpinnerService,
        private masterService: MasterService
    ) {
        this.isLoadingType = 'pacman';
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    async ngOnInit() {
        this.mosqueInfoForm = this.fb.group({
            id: [''],
            mosqueContactGuid: [''],
            MosqueAdministrationId: [''],
            adminName: [''],
            aboutMosque: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            mosqueName: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            mosqueLocation: ['', Validators.required],
            latitude: [''],
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
            mosqueStatus: [''],
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
            parkingArea: [
                '',
                [
                    Validators.required,
                    Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
                    Validators.min(0),
                    Validators.max(999999),
                ],
            ],
            parkingUomId: ['', Validators.required],
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
        });

        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });

        if (this.data?.mosqueGuid) {
            this.mosqueGuId = this.data?.mosqueGuid;
            this.getMosqueDetailsById();
        }
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
        // this.getAllMosqueTypes();
        // this.GetLocations();
        // this.getProductUomList();
        // this.GetFacilityResources();
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

    selectLocation(locationDetails) {
        this.mosqueInfoForm.patchValue({
            mosqueLocation: locationDetails?.description,
            latitude: locationDetails?.latitude,
            longitude: locationDetails?.longitude,
        });
        this.locationDetails = locationDetails;
    }

    getMosqueDetailsById() {
        this.spinnerService.show();
        this.mosqueService.getMosqueProfileDetails(this.mosqueGuId).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.mosqueInfoDetails = res?.result?.data;
                    this.mosqueInfoDetails.establishedYear =
                        this.mosqueInfoDetails.establishedYear.toString();
                    this.mosqueInfoDetails.facilityId = this.processIds(
                        this.mosqueInfoDetails.facilityId
                    );
                    this.mosqueInfoDetails.resourceId = this.processIds(
                        this.mosqueInfoDetails.resourceId
                    );
                    this.mosqueInfoForm.patchValue(this.mosqueInfoDetails);
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
    processIds(ids: string): number[] {
        return ids ? ids.split(',').map(Number) : [];
    }

    uploadImage(type, width, height, allowMultiple) {
        const dialogRef = this.dialog.open(ImageUploadComponent, {
            data: {
                type: type,
                width: width,
                height: height,
                returnToParent: true,
                allowMultiple,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result?.key === 'profile') {
                this.selectedProfileFile = result?.[result?.key];
                this.profileImageSource = result?.src;
            } else if (result?.key === 'cover') {
                this.selectedFile = result?.[result?.key];
                this.coverImageSource = result?.src;
            }
        });
    }

    deleteImage(type) {
        if (type === 'profile') {
            this.selectedProfileFile = null;
            this.profileImageSource = '';
            this.mosqueInfoDetails.mosqueProfilePhotoUrl = null;
        } else if (type === 'cover') {
            this.selectedFile = null;
            this.coverImageSource = '';
            this.mosqueInfoDetails.mosqueCoverPhotoUrl = null;
        }
    }

    onClose() {
        this.addDialogRef.close();
    }

    addOrUpdateMosque() {
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
        if (this.selectedFile) {
            formData.append('mosqueCoverPhoto', this.selectedFile);
        }
        if (this.selectedProfileFile) {
            formData.append('mosqueProfilePhoto', this.selectedProfileFile);
        }
        this.mosqueService.addOrUpdateMosque(formData).subscribe(
            (res: any) => {
                if (res.result.success) {
                    if (res?.result?.data) {
                        const mosqueId = res?.result?.data;
                        if (!this.mosqueGuId) {
                            const dialogRef = this.dialog.open(
                                ConfirmationDialogComponent,
                                {
                                    maxWidth: '550px',
                                    // height:'auto',
                                    data: {
                                        mosqueName:
                                            this.mosqueInfoForm?.value
                                                ?.mosqueName,
                                        isCreate: true,
                                        iconType:
                                            environment.imageEndPoints
                                                .checkIcon,
                                        buttons: [
                                            {
                                                type: 'Cancel',
                                                label: 'No, Thank you',
                                                buttonClass: 'ml-2',
                                            },
                                            {
                                                color: 'primary',
                                                type: 'Confirm',
                                                label: 'Yes, Continue',
                                            },
                                        ],
                                    },
                                }
                            );
                            dialogRef.componentInstance.messageType = 'SUCCESS';
                            dialogRef.afterClosed().subscribe((res) => {
                                if (res) {
                                    this.assignAdmin({
                                        mosqueContactGuid: mosqueId,
                                    });
                                } else {
                                    this.addDialogRef.close(true);
                                }
                            });
                        } else {
                            this.mosqueGuId = res?.result?.data;
                            this.addDialogRef.close(true);
                        }
                    }
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                } else {
                    if (res.result.statusCode === 409) {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Duplicate Entry',
                            description: res.result.message,
                        });
                    } else {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Error',
                            description: res.result.message,
                        });
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

    assignAdmin(mosqueInfo) {
        const dialogRef = this.dialog.open(AssignAdministratorComponent, {
            panelClass: 'fullscreen-dialog',
            data: { mosqueGuid: mosqueInfo?.mosqueContactGuid },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.addDialogRef.close({ admin: true, result: result });
            } else {
                this.addDialogRef.close(true);
            }
        });
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

    // setYear(normalizedYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
    //   const ctrlValue = this.date.value ?? moment();
    //   ctrlValue.year(normalizedYear.year());
    //   this.date.setValue(ctrlValue);
    //   const yearValue = normalizedYear.year();
    //   this.mosqueInfoForm.get('establishedYear').setValue(yearValue.toString());
    //   datepicker.close();
    // }
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

    noLeadingSpacesValidator(control: any) {
        if (control.value && control.value.startsWith(' ')) {
            return { noLeadingSpaces: true };
        }
        return null;
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
}
