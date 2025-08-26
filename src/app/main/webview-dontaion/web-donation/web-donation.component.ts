import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { DonationsService } from 'app/services/donations.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MasterService } from 'app/services/master.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';
import { CalDialogComponent } from '../cal-dailog/cal-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-web-donation',
    templateUrl: './web-donation.component.html',
    styleUrl: './web-donation.component.scss',
})
export class WebDonationComponent implements OnInit {
    id: string | null = null;
    imageEndPoints = environment.imageEndPoints;
    imageUrl = environment.imageEndPoints.menuRightLogo;
    userDonationTypes = [];
    userCurrency: string = 'IDR';
    userdonationType: number;
    assetDonationForm: FormGroup;
    eventDonationForm: FormGroup;
    mosqueDonationForm: FormGroup;
    allMosques = [];
    categories = [];
    subCategories = [];
    categoryGuid: string = '';
    products = [];
    donationTypes: any[] = [];
    donationTypeSelected = [];
    mosqueGuid: string = '';
    donationTypeName: string = '';
    eventId: number;
    eventName: string = '';
    allEvents = [];
    childCategoryGuid: string = '';
    mosqueId: number;
    amountEntered = null;
    selectedAmount: number = 10000;
    amountTypes = [
        { isActive: true, displayValue: '10000', value: 10000 },
        { isActive: false, displayValue: '20000', value: 20000 },
        { isActive: false, displayValue: '50000', value: 50000 },
        { isActive: false, value: 'other', displayValue: 'other' },
    ];
    @ViewChild('cAmount') cAmount: ElementRef;
    isZakat: boolean = false;
    donationPurpose: string = '';
    mosqueEmail: string;
    donationDesc: string = '';
    selectedDonationTypeNames = [];
    donPurposeReq: boolean = false;
    mosqueName: string;
    mosqueProfileUrl: string;
    isFromQR: boolean;

    constructor(
        private route: ActivatedRoute,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private toaster: ToasterService,
        private masterService: MasterService,
        private donationService: DonationsService,
        private fb: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private dialog: MatDialog
    ) {
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : //? 'en-US'
                  localStorage.getItem('isalaam-language')
        );
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const paramId = params.get('id');

            if (paramId) {
                const [id, isZakatValue, mosqueGuid, isFromQR] =
                    paramId.split('&');
                this.id = id;
                this.isZakat = isZakatValue === '1';
                this.mosqueGuid = mosqueGuid;
                this.isFromQR = isFromQR === '1';
            }
        });

        this.getUserDonationTypes();
        this.getAllMosques();

        this.assetDonationForm = this.fb.group({
            mosqueId: [this.mosqueId, Validators.required],
            categoryId: [null, Validators.required],
            subCategoryId: [null, Validators.required],
            productId: [null, Validators.required],
            selectedUOM: [null],
            quantity: [null, Validators.required],
            contactUserId: [],
        });

        this.eventDonationForm = this.fb.group({
            mosqueId: [this.mosqueId, Validators.required],
            eventId: [this.eventId, Validators.required],
        });

        this.mosqueDonationForm = this.fb.group({
            mosqueId: [this.mosqueId, Validators.required],
        });
    }
    getUserDonationTypes() {
        this.masterService.getUserDonationTypes().subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.userDonationTypes =
                        res?.result?.data?.vmUserDonationTypes;
                    this.userdonationType =
                        this.userDonationTypes.find((type) => type.isSelected)
                            ?.userDonationId || null;
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
    getUserDonationSelected(data): void {
        this.userdonationType = data;
        if (this.userdonationType == 2) {
            this.assetDonationForm.reset();
            this.subCategories = [];
            this.products = [];
            this.donationTypeName = '';
            this.getCategories();
        } else if (this.userdonationType == 3) {
            this.donationTypeName = '';
            this.eventDonationForm.get('eventId')?.reset();
            this.eventDonationForm.get('mosqueId')?.reset();
            //this.getUpcomingEventsForMosque();
        } else {
            this.donationTypeSelected = [];
            this.mosqueDonationForm.get('mosqueId')?.reset();
        }

        if (this.isFromQR) {
            this.callForIsFromQR();
        }
    }
    callForIsFromQR() {
        this.mosqueDonationForm.get('mosqueId')?.disable();
        this.eventDonationForm.get('mosqueId')?.disable();
        this.assetDonationForm.get('mosqueId')?.disable();

        const matchedMosque = this.allMosques.find(
            (m) => m.mosqueGuid === this.mosqueGuid
        );

        if (matchedMosque) {
            const mosqueId = matchedMosque.mosqueId;
            this.mosqueEmail = matchedMosque.mosqueEmail;
            this.mosqueName = matchedMosque.mosqueName;
            this.mosqueProfileUrl = matchedMosque.mosqueProfilePhotoUrl;
            switch (this.userdonationType) {
                case 1:
                    this.mosqueDonationForm.get('mosqueId')?.setValue(mosqueId);
                    this.getDonationTypes();
                    break;
                case 2:
                    this.assetDonationForm.get('mosqueId')?.setValue(mosqueId);
                    this.getCategories();
                    break;
                default:
                    this.eventDonationForm.get('mosqueId')?.setValue(mosqueId);
                    this.getUpcomingEventsForMosque();
                    break;
            }
        }
    }
    getAllMosques() {
        this.masterService.getAllMosques('Donation').subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.allMosques = res?.result?.data;

                    //if (this.userdonationType === 2) this.getCategories();
                    if (this.isFromQR) {
                        this.callForIsFromQR();
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

    getUpcomingEventsForMosque(): void {
        this.donationService
            .getUpcomingEventsForMosque(this.mosqueGuid)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.allEvents = res?.result?.data;
                        console.log(this.allEvents, 'allEvents');
                    } else {
                        this.allEvents = [];
                        this.toaster.triggerToast({
                            type: 'info',
                            message: 'Information',
                            description: res?.result?.message,
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

    getCategories() {
        this.masterService.getParentCategories().subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.categories = res?.result?.data;
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
                    message: 'Error',
                    description: err.error.message,
                });
            }
        );
    }

    getSubCategories(pcid: string) {
        this.categoryGuid = pcid;
        this.masterService.getChildCategories(this.categoryGuid).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.subCategories = res?.result?.data;
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
                    message: 'Error',
                    description: err.error.message,
                });
            }
        );
    }

    getProducts(cid: string) {
        this.childCategoryGuid = cid;
        this.masterService
            .getProductsByCategory(this.childCategoryGuid)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.products = res?.result?.data;
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
                        message: 'Error',
                        description: err.error.message,
                    });
                }
            );
    }

    selectedProduct(pId: number) {
        const selectedProduct = this.products.find(
            (product) => product.id === pId
        );
        this.assetDonationForm.patchValue({
            productId: pId,
            selectedUOM: selectedProduct?.uomName,
        });
    }

    assetDonateNow() {
        if (this.assetDonationForm.invalid) {
            return true;
        }
        this.assetDonationForm.patchValue({
            contactUserId: this.id,
        });
        let body = this.assetDonationForm?.value;

        this.masterService.donateAssetForMosque(body).subscribe((res: any) => {
            if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
                this.assetDonationForm.reset();
                this.categories = [];
                this.subCategories = [];
                this.products = [];
                this.getUserDonationTypes();
                let txId = res?.result?.data;
                const confirmation = this._fuseConfirmationService.open({
                    title: 'Success',
                    message:
                        'Are you sure, you want to printable invoice for your asset',
                    icon: {
                        name: 'heroicons_outline:document-download',
                        color: 'primary',
                    },
                    actions: {
                        confirm: {
                            label: 'Ok',
                        },
                    },
                });
                confirmation.afterClosed().subscribe((res) => {
                    if (res === 'confirmed') {
                        this.downloadAndOpenPdf(txId);
                    }
                });
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }

    getEventSelected(event): void {
        this.eventId = event?.value;
        const selectedEvent = this.allEvents.find(
            (event) => event.eventId === this.eventId
        );
        if (selectedEvent) {
            this.donationTypeName = selectedEvent.eventName;
            console.log(this.eventName, 'eventName');
        }
    }

    downloadAndOpenPdf(txId) {
        this.donationService.getAssetInvoice(txId).subscribe(
            (response: any) => {
                if (response) {
                    const blob = new Blob([response], {
                        type: 'application/pdf',
                    });
                    const fileURL = URL.createObjectURL(blob);
                    window.open(fileURL, '_blank');
                    const link = document.createElement('a');
                    link.href = fileURL;
                    link.download = 'Asset-Invoice';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description:
                            'Invoice not found please contact administrator',
                    });
                }
            },
            (err) => {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: err,
                });
            }
        );
    }
    selectAmount(item) {
        this.amountTypes.map((x) => (x.isActive = false));
        this.amountTypes
            .filter((x) => x.value === item?.value)
            .map((x) => (x.isActive = true));
        this.selectedAmount = 0;
        if (item?.value !== 'other') {
            this.amountEntered = null;
            this.selectedAmount = item?.value;
        } else {
            this.cAmount.nativeElement.focus();
        }
    }

    onAmountChange() {
        this.selectedAmount = Number(this.amountEntered);
    }

    getMosqueSelected(mosque) {
        this.mosqueId = mosque.value;
        const selectedMosque = this.allMosques.find(
            (mos) => Number(mos.mosqueId) === Number(this.mosqueId)
        );

        if (selectedMosque) {
            this.mosqueGuid = selectedMosque.mosqueGuid;
            this.mosqueEmail = selectedMosque.mosqueEmail;
            this.mosqueName = selectedMosque.mosqueName;
            this.mosqueProfileUrl = selectedMosque.mosqueProfilePhotoUrl;

            if (this.userdonationType === 1) {
                this.getDonationTypes();
            } else if (this.userdonationType === 2) {
                this.getCategories();
            } else {
                this.getUpcomingEventsForMosque();
            }
        } else {
            console.warn('Mosque not found for ID:', this.mosqueId);
        }
    }

    getDonationTypes() {
        this.masterService.getDonationTypes('CND', this.mosqueGuid).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.donationTypes = res?.result?.data;
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
    navigateToChargesPage() {
        if (this.userdonationType == 1 && this.mosqueDonationForm.invalid) {
            this.mosqueDonationForm.markAllAsTouched();
            return true;
        }
        if (this.userdonationType == 2 && this.assetDonationForm.invalid) {
            return true;
        }
        if (this.userdonationType == 3 && this.eventDonationForm.invalid) {
            return true;
        }
        if (
            this.userdonationType == 1 &&
            !this.isZakat &&
            this.donationTypeName == ''
        ) {
            this.donPurposeReq = true;
            return true;
        }
        const payload = {
            mosqueGuid: this.mosqueGuid,
            mosqueName: this.mosqueName,
            mosqueProfileUrl: this.mosqueProfileUrl,
            userEmail: this.mosqueEmail,
            transactionAmount: this.selectedAmount,
            description: !this.isZakat ? this.donationTypeName : 'Zakat',
            donationPurpose: !this.isZakat ? this.donationPurpose : 'Zakat',
            isZakat: this.isZakat,
            eventId: this.eventId,
            contactUserId: this.id,
        };
        const dialogRef = this.dialog.open(CalDialogComponent, {
            panelClass: 'fullscreen-dialog',
            data: {
                payloadData: payload,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('test donation charges');
            }
        });
    }
    getDonationSelected(event) {
        const selectedDonationTypeNames = [];
        event.value.forEach((value) => {
            const matchingDonationType = this.donationTypes.find(
                (type) => type.donationGuid === value
            );
            if (
                matchingDonationType &&
                !selectedDonationTypeNames.includes(
                    matchingDonationType.donationTypeName
                )
            ) {
                selectedDonationTypeNames.push(
                    matchingDonationType.donationTypeName
                );
            }
        });

        this.selectedDonationTypeNames = selectedDonationTypeNames;
        const selectedDonations = [];

        event.value.forEach((value: string) => {
            const selectedDonation = this.donationTypes.find(
                (donation) => donation.donationGuid === value
            );

            if (selectedDonation) {
                selectedDonations.push({
                    donationGuid: selectedDonation.donationGuid,
                    donationTypeName: selectedDonation.donationTypeName,
                    donationTypeDescription:
                        selectedDonation.donationTypeDescription,
                });
            }
        });

        this.donationPurpose = JSON.stringify(selectedDonations);
        const mosqueIdEventForm = this.eventDonationForm.get('mosqueId')?.value;
        const mosqueIdMosqueForm =
            this.mosqueDonationForm.get('mosqueId')?.value;
        if (
            event?.value?.length > 0 ||
            this.donationTypeSelected?.length > 0 ||
            this.selectedDonationTypeNames?.length > 0
        ) {
            this.donationDesc = this.donationTypeSelected.join(',');
            this.donationTypeName = this.selectedDonationTypeNames.join(',');
            this.donPurposeReq = false;
        } else {
            this.donationDesc = '';
            this.donationTypeName = '';
        }
    }

    getSelectedDonationNames(): string {
        if (
            !this.donationTypeSelected ||
            this.donationTypeSelected.length === 0
        ) {
            return '';
        }

        const selectedNames = this.donationTypes
            .filter((type) =>
                this.donationTypeSelected.includes(type.donationGuid)
            )
            .map((type) => type.donationTypeName);

        return selectedNames.join(', ');
    }
}
