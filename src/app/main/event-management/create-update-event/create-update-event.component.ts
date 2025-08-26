import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MosqueService } from 'app/services/mosque.service';
import { ToasterService } from 'app/services/toaster.service';
import { StepperOrientation } from '@angular/material/stepper';
import {
    Observable,
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    map,
    switchMap,
    tap,
} from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import moment, { Moment } from 'moment';
import { ThemePalette } from '@angular/material/core';
import { CommonBaseClass } from 'app/shared/common-abstract-class';
import { SharedService } from 'app/services/shared.service';
import { AuthService } from 'app/services/auth.service';
import { ImageUploadComponent } from 'app/common/image-upload/image-upload.component';
import { DatePipe, formatDate } from '@angular/common';
import { User } from 'app/core/user/user.types';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatRadioChange } from '@angular/material/radio';
import { DateTime } from 'luxon';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-create-update-event',
    templateUrl: './create-update-event.component.html',
    styleUrls: ['./create-update-event.component.scss'],
})
export class CreateUpdateEventComponent
    extends CommonBaseClass
    implements OnInit
{
    stepperOrientation: Observable<StepperOrientation>;
    selectedFile = null;
    isLinear = true;
    eventInforForm: FormGroup;
    registrationInfoForm: FormGroup;
    publishInfoForm: FormGroup;
    public date: moment.Moment;
    public dateDisabled = true;
    public showSpinners = true;
    public showSeconds = true;
    public touchUi = false;
    public enableMeridian = false;
    public minDate = new Date();
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    isLoading = false;
    public color: ThemePalette = 'primary';
    public dateControlMinMax = new FormControl(new Date());
    eventGuId: string = '';
    user: User;
    locations: any[] = [];
    locationDetails: {};
    autocompleteControl = new FormControl();
    eventImageSource: string;
    direction: string = 'ltr';
    currentActions: any;
    imageUrl = environment.imageEndPoints;
    isButtonDisabled = false;
    isLoadingType: string;
    eventTypes: string[] = [
        'Doa Bersama untuk Umat Islam',
        'Gerakan Infak',
        'Gotong Royong dan Kebersihan',
        'Hari Besar Islam di Indonesia',
        'Ibadah Khusus',
        'Kajian Rutin',
        'Kegiatan Internal Masjid',
        'Kegiatan Sosialisasi Kesehatan',
        'Majelis Taklim',
        'Pameran dan Bazar Islami',
        'Pendidikan Agama Islam',
        'Peringatan Sejarah Islam',
        'Peristiwa Penting Islam Modern',
        'Perjuangan Ekonomi Syariah',
        'Program Ramadan',
        'Rutinitas Bulanan Masjid',
        'Rutinitas Mingguan Masjid',
        'Rutinitas Pengajian',
        'Seminar dan Workshop',
        'Sunnah & Momen Ibadah di Masjid',
        'Lomba Islami',
    ];

    constructor(
        public addDialogRef: MatDialogRef<CreateUpdateEventComponent>,
        private fb: FormBuilder,
        breakpointObserver: BreakpointObserver,
        public sharedService: SharedService,
        public authService: AuthService,
        @Inject(MAT_DIALOG_DATA) public data,
        private mosqueService: MosqueService,
        private toaster: ToasterService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private datePipe: DatePipe,
        private spinnerService: NgxSpinnerService
    ) {
        super(authService, sharedService);
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
        this.isLoadingType = 'pacman';
    }

    ngOnInit(): void {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
        if (this.data?.eventGuid) {
            this.eventGuId = this.data?.eventGuid;
            this.getEventDetailsById();
        }
        this.eventInforForm = this.fb.group({
            id: [0],
            mosqueGuid: [
                this.mosqueInfo?.mosqueContactGuid
                    ? this.mosqueInfo?.mosqueContactGuid
                    : '',
            ],
            eventGuid: [this.eventGuId],
            eventName: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            eventType: ['', [Validators.required]],
            keynoteSpeaker: [
                '',
                [Validators.required, this.noLeadingSpacesValidator],
            ],
            isImportantEvent: [false, Validators.required],
            eventDescription: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(500),
                    this.noLeadingSpacesValidator,
                ],
            ],
            isIndoorEvent: [true, Validators.required],
            eventLocation: [''],
            latitude: [null],
            longitude: [null],
            eventCompleteAddress: [''],
            eventDate: [new Date(), Validators.required],
        });

        this.registrationInfoForm = this.fb.group({
            isFreeEvent: [false, Validators.required],
            registrationFee: [0, Validators.required],
            registrationDateFrom: [new Date(), Validators.required],
            registrationDateTo: [null, Validators.required],
            eventLimit: [null],
            isUnlimited: [true, Validators.required],
        });

        this.publishInfoForm = this.fb.group({
            isImmediatePublish: [true, Validators.required],
            publishedDate: [new Date(), Validators.required],
            liveVideoUrl: [],
        });

        let keyInner;
        this.eventInforForm.valueChanges.subscribe((value) => {
            keyInner = this.getChangedValues(this.eventInforForm);
            if (keyInner?.key === 'isIndoorEvent') {
                const eventLocationControl = this.eventInforForm?.controls[
                    'eventLocation'
                ] as FormControl;
                const eventCompleteAddControl = this.eventInforForm?.controls[
                    'eventCompleteAddress'
                ] as FormControl;
                const latitude = this.eventInforForm?.controls[
                    'latitude'
                ] as FormControl;
                const longitude = this.eventInforForm?.controls[
                    'longitude'
                ] as FormControl;
                if (!keyInner?.value) {
                    eventLocationControl.setValidators([Validators.required]);
                    eventCompleteAddControl.setValidators([
                        Validators.required,
                    ]);
                    latitude.setValidators([Validators.required]);
                    longitude.setValidators([Validators.required]);
                } else {
                    eventLocationControl.setValidators(null);
                    eventCompleteAddControl.setValidators([]);
                    latitude.clearValidators();
                    longitude.clearValidators();
                }
                eventLocationControl.updateValueAndValidity();
                eventCompleteAddControl.updateValueAndValidity();
                latitude.updateValueAndValidity();
                longitude.updateValueAndValidity();
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

        this.registrationInfoForm.valueChanges.subscribe((value) => {
            keyInner = this.getChangedValues(this.registrationInfoForm);
            if (keyInner?.key === 'isFreeEvent') {
                const regFeeControl = this.registrationInfoForm?.controls[
                    'registrationFee'
                ] as FormControl;
                if (keyInner?.value) {
                    regFeeControl.setValidators([Validators.required]);
                    regFeeControl.updateValueAndValidity();
                } else {
                    regFeeControl?.patchValue(null);
                    regFeeControl.setValidators([]);
                    regFeeControl.updateValueAndValidity();
                }
            }
            if (keyInner?.key === 'isUnlimited') {
                const eventLimitControl = this.registrationInfoForm?.controls[
                    'eventLimit'
                ] as FormControl;
                if (!keyInner?.value) {
                    eventLimitControl.setValidators([Validators.required]);
                    eventLimitControl.updateValueAndValidity();
                } else {
                    eventLimitControl?.patchValue(null);
                    eventLimitControl.setValidators([]);
                    eventLimitControl.updateValueAndValidity();
                }
            }
        });
        this.user = AuthUtils._decodeToken(
            localStorage.getItem('isalaamAccessToken')
        );
        this.user.roleName = JSON.parse(this.user?.roleObject)?.[0]?.RoleName;

        this.currentActions = this.sharedService.getCurrentPageActions();
    }

    onClose() {
        this.addDialogRef.close();
    }

    getEventDetailsById() {
        this.isLoading = true;
        this.mosqueService.getEventDetails(this.eventGuId).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.eventImageSource =
                        res?.result?.data?.eventFilePath ?? null;
                    this.selectedFile = res?.result?.data?.eventFilePath
                        ? 'event'
                        : null;
                    this.eventInforForm.patchValue(res?.result?.data);
                    // this.eventInforForm.get('isIndoorEvent').markAsDirty();
                    this.eventInforForm.patchValue({
                        keynoteSpeaker: res?.result?.data?.keyNoteSpeaker,
                    });
                    this.registrationInfoForm.patchValue(res?.result?.data);

                    if (res?.result?.data?.publishedDate) {
                        const diffPublishDate = Math.floor(
                            (Date.UTC(
                                new Date().getFullYear(),
                                new Date().getMonth(),
                                new Date().getDate()
                            ) -
                                Date.UTC(
                                    new Date(
                                        res?.result?.data?.publishedDate
                                    ).getFullYear(),
                                    new Date(
                                        res?.result?.data?.publishedDate
                                    ).getMonth(),
                                    new Date(
                                        res?.result?.data?.publishedDate
                                    ).getDate()
                                )) /
                                (1000 * 60 * 60 * 24)
                        );
                        if (diffPublishDate > 0) {
                            res.result.data.publishedDate = new Date();
                        }
                    }
                    this.publishInfoForm.patchValue(res?.result?.data);
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
                    message: 'Internal error',
                    description: 'Something went wrong, please try again !',
                });
            }
        );
    }

    getChangedValues(form: any) {
        let changedValues: any = {};
        Object.keys(form?.controls).forEach((key) => {
            let currentControl = form?.controls[key];
            if (currentControl?.dirty) {
                changedValues['key'] = key;
                if (currentControl?.controls) {
                    // changedValues[key] = this.getInnerChangedValues(currentControl)
                } else {
                    changedValues.key = key;
                    changedValues.value = currentControl?.value;
                    currentControl?.markAsPristine();
                }
            }
        });
        return changedValues;
    }

    selectLocation(locationDetails) {
        this.eventInforForm.patchValue({
            eventLocation: locationDetails?.description,
            latitude: locationDetails?.latitude,
            longitude: locationDetails?.longitude,
        });
        this.locationDetails = locationDetails;
    }

    uploadImage(type, width, height) {
        const dialogRef = this.dialog.open(ImageUploadComponent, {
            data: {
                type: type,
                width: width,
                height: height,
                returnToParent: true,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (type === 'event') {
                this.selectedFile = result?.[result?.key];
                this.eventImageSource = result?.src;
            }
        });
    }

    deleteImage(type) {
        if (type === 'event') {
            this.selectedFile = null;
            this.eventImageSource = '';
        }
    }

    createNewEvent() {
        this.spinnerService.show();
        this.isButtonDisabled = true;
        if (
            this.eventInforForm?.invalid ||
            this.registrationInfoForm?.invalid ||
            this.publishInfoForm?.invalid
        ) {
            this.isButtonDisabled = false;
            return;
        }
        const body = {
            ...this.eventInforForm?.value,
            ...this.registrationInfoForm?.value,
            ...this.publishInfoForm?.value,
        };

        const formData = new FormData();
        Object.keys(body).forEach((key) => {
            if (
                key === 'eventDate' ||
                key === 'publishedDate' ||
                key === 'registrationDateFrom' ||
                key === 'registrationDateTo'
            ) {
                // body[key] = formatDate(
                //     body[key],
                //     'dd-MM-yyyy HH:mm:ss',
                //     'en-In',
                //     '+0530'
                // );

                body[key] = this.formatDate(body[key]);
            }

            if (key === 'latitude' || key === 'longitude') {
                if (body[key] != null) {
                    formData.append(key, body[key]);
                }
                //formData.append(key, null);
            } else {
                formData.append(key, body[key] == null ? '' : body[key]);
            }
        });
        if (this.selectedFile) {
            formData.append('eventImage', this.selectedFile);
        }
        this.isLoading = true;
        this.mosqueService.createOrUpdateEvent(formData).subscribe(
            (res: any) => {
                this.spinnerService.hide();
                if (res?.result?.success) {
                    this.isLoading = false;
                    const response = {
                        eventName: this.eventInforForm?.value?.eventName,
                    };
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    this.addDialogRef.close(response);
                } else {
                    this.isLoading = false;
                    this.isButtonDisabled = false;
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            },
            (err) => {
                this.isLoading = false;
                this.isButtonDisabled = false;
                this.spinnerService.hide();
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Error',
                    description: 'Something went wrong, Please try again!',
                });
            }
        );
    }
    formatDate(date: string) {
        const formattedDate = this.datePipe.transform(
            date,
            'dd-MM-yyyy HH:mm:ss'
        );
        console.log(formattedDate); // Example output: "25-12-2024 06:30:00"
        return formattedDate;
    }
    public findInvalidControls() {
        const invalid = [];
        // const controls = this.incidentForm.controls.observationItemsDetailsModels['controls'][0].controls.injuredDetailsModels.controls[2].controls;
        const controls = this.eventInforForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
                console.log(invalid);
            }
        }
        return invalid;
    }

    noLeadingSpacesValidator(control: any) {
        if (control.value && control.value.startsWith(' ')) {
            return { noLeadingSpaces: true };
        }
        return null;
    }

    onDateChange(event: MatDatepickerInputEvent<Moment>): void {
        const regStartDate = event.value;
        const eventDate = this.eventInforForm.get('eventDate')?.value;
        if (regStartDate && eventDate) {
            if (
                moment(regStartDate).isBefore(moment(eventDate)) &&
                moment(regStartDate).isSameOrAfter(moment(), 'day')
            ) {
                this.registrationInfoForm
                    .get('registrationDateFrom')
                    ?.setValue(regStartDate);
            } else {
                this.registrationInfoForm
                    .get('registrationDateFrom')
                    ?.setValue(eventDate);
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: this.translate.instant(
                        'Events.eventRegStartBeforeEventDate'
                    ),
                });
            }
        } else {
            this.registrationInfoForm
                .get('registrationDateFrom')
                ?.setValue(regStartDate);
        }

        this.registrationInfoForm.updateValueAndValidity();
    }

    onDateChangeEnd(event: MatDatepickerInputEvent<Moment>): void {
        const regEndDate = event.value;
        const regStartDate = this.registrationInfoForm.get(
            'registrationDateFrom'
        )?.value;
        const eventDate = this.eventInforForm.get('eventDate')?.value;
        if (regStartDate && regEndDate && eventDate) {
            if (
                moment(regStartDate).isBefore(moment(regEndDate)) &&
                moment(regEndDate).isBefore(moment(eventDate))
            ) {
                this.registrationInfoForm
                    .get('registrationDateTo')
                    ?.setValue(regEndDate);
            } else {
                this.registrationInfoForm
                    .get('registrationDateTo')
                    ?.setValue(eventDate);
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: this.translate.instant(
                        'Events.eventRegStartEndBeforeEventDate'
                    ),
                });
            }
        } else {
            this.registrationInfoForm
                .get('registrationDateTo')
                ?.setValue(regStartDate);
        }

        this.registrationInfoForm.updateValueAndValidity();
    }
    updateEventLimitValidators(isUnlimited: boolean): void {
        const eventLimitControl = this.registrationInfoForm.get('eventLimit');

        if (isUnlimited) {
            eventLimitControl?.clearValidators();
        } else {
            eventLimitControl?.setValidators([
                Validators.required,
                (control) => {
                    const value = control.value;
                    return value > 0 ? null : { positiveNumber: true };
                },
            ]);
        }
        eventLimitControl?.updateValueAndValidity();
    }

    onPublishDateChange(event: MatDatepickerInputEvent<Moment>): void {
        //const publishDate = event.value;
        //const eventDate = this.eventInforForm.get('eventDate')?.value;
        const publishDate: Moment = event.value;
        let eventDate: Date | Moment =
            this.eventInforForm.get('eventDate')?.value;
        if (typeof eventDate === 'string') {
            eventDate = new Date(eventDate); // Convert string to Date object
        }
        if (publishDate && eventDate) {
            //const publishDateAsDate = publishDate.toDate();
            if (publishDate < eventDate) {
                this.publishInfoForm
                    .get('publishedDate')
                    ?.setValue(publishDate);
            } else {
                this.publishInfoForm.get('publishedDate')?.reset();
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: this.translate.instant(
                        'Events.publishDateValidate'
                    ),
                });
            }
        }
    }

    onEventDateChange(event: MatDatepickerInputEvent<Moment>): void {
        this.registrationInfoForm.get('registrationDateFrom')?.setValue(null);
        this.registrationInfoForm.get('registrationDateTo')?.setValue(null);
    }

    isImmediatePublish(event: MatRadioChange) {
        const isPublish = event.value;
        if (isPublish) {
            this.publishInfoForm
                .get('publishedDate')
                ?.setValue(DateTime.now().toISO());
        } else {
            this.publishInfoForm.get('publishedDate')?.setValue(null);
        }
    }

    onRadioButtonChange(event: any): void {
        if (event.value) {
            this.registrationInfoForm.get('registrationFee')?.setValue(0);
        }
    }
}
