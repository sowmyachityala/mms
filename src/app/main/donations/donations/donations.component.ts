import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild,
    numberAttribute,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationsService } from 'app/services/donations.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
// import { MoyasarService } from 'app/services/moyasar.service';
import { environment } from 'environments/environment';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { TransactionHistoryComponent } from '../transaction-history/transaction-history.component';
import { MasterService } from 'app/services/master.service';
import { MatInput } from '@angular/material/input';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { ZakatCalculatorComponent } from '../zakat-calculator/zakat-calculator.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ExcelDataComponent } from 'app/main/reports/sample-excel/excel-data.component';
import { MatCardLgImage } from '@angular/material/card';
import { DonationChargesComponent } from '../donation-charges/donation-charges.component';
// import { Moyasar } from 'moyasar';

@Component({
    selector: 'app-donations',
    templateUrl: './donations.component.html',
    styleUrls: ['./donations.component.scss'],
})
export class DonationsComponent implements OnInit, AfterViewInit {
    imageEndPoints = environment.imageEndPoints;
    paymentMethod = 'Moyasar';
    public payPalConfig?: IPayPalConfig;
    public showPaypalButtons: boolean;
    amountEntered = null;
    selectedAmount: number = 10000;
    amountTypes = [
        { isActive: true, displayValue: '10,000', value: 10000 },
        { isActive: false, displayValue: '20,000', value: 20000 },
        { isActive: false, displayValue: '50,000', value: 50000 },
        { isActive: false, value: 'other', displayValue: 'other' },
    ];
    showSuccess: boolean;
    showCancel: boolean;
    showError: boolean;
    direction: string = 'ltr';
    paymentId: string;
    reDirectionURI: string = environment.redirectDonationURL;
    donationTypes: any[] = [];
    donationTypeSelected = [];

    donationDesc: string = '';
    @ViewChild('cAmount') cAmount: ElementRef;
    user: any;
    userdonationType: number;
    userDonationTypes = [];
    allMosques = [];
    categories = [];
    subCategories = [];
    categoryGuid: string = '';
    products = [];
    childCategoryGuid: string = '';
    mosqueId: number;
    assetDonationForm: FormGroup;
    eventDonationForm: FormGroup;
    mosqueDonationForm: FormGroup;
    xenditRegistrationForm: FormGroup;
    userCurrency: string;
    eventId: number;
    eventName: string = '';
    allEvents = [];
    isChecked: boolean = false;
    isZakat: boolean = false;
    statusRef: MatDialogRef<any>;
    @ViewChild('confirmDonationDialog', { static: true })
    confirmDonationDialog: TemplateRef<any>;
    xenditRef: MatDialogRef<any>;
    @ViewChild('xenditRegDialog', { static: true })
    xenditRegDialog: TemplateRef<any>;
    mosqueGuid: string = '';
    donationTypeName: string = '';
    selectedDonationTypeNames = [];
    isPayRegistred: boolean = false;
    mosqueEmail: string;
    mosqueName: string;
    mosqueInfo: any;
    donationPurpose: string = '';
    PurposeFlag: string = 'D';

    constructor(
        private renderer: Renderer2,
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private donationService: DonationsService,
        private router: Router,
        private toaster: ToasterService,
        private dialog: MatDialog,
        private masterService: MasterService,
        private _authService: AuthService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private fb: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        // this.paymentId = this.activatedRoute.snapshot.queryParamMap.get('id');
        // this.pLinkRefNo =this.activatedRoute.snapshot.queryParamMap.get('ref-id');

        // if (this.paymentId) {
        //     const dataObj = {
        //         paymentId: this.paymentId,
        //         mosqueId: localStorage.getItem('donForMosque')
        //             ? parseInt(localStorage.getItem('donForMosque'))
        //             : null,
        //         eventId: localStorage.getItem('donForEvent')
        //             ? parseInt(localStorage.getItem('donForEvent'))
        //             : null,
        //     };
        //     this.savePaymentDetails(dataObj);
        // } else {
        //     localStorage.removeItem('donForMosque');
        //     localStorage.removeItem('donForEvent');
        // }
        // if (this.pLinkRefNo) {
        //     const dataObj = {
        //         mosqueGuid: this.mosqueGuid,
        //         plinkRefNo: this.pLinkRefNo
        //     };
        //     this.callPlinkTransactionDetails(dataObj);
        // }

        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    ngOnInit() {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            this.mosqueGuid =
                this.mosqueInfo != null
                    ? this.mosqueInfo?.mosqueContactGuid
                    : '';
            this.mosqueEmail = this.mosqueInfo?.email ?? '';
            this.mosqueName = this.mosqueInfo?.mosqueName ?? '';
        } else {
            this.mosqueEmail = 'agsds-isalaam@isalaam.id';
        }
        this._authService.check().subscribe((res) => {
            if (res) {
                this.user = AuthUtils._decodeToken(
                    localStorage.getItem('isalaamAccessToken')
                );
                this.user.roleName = JSON.parse(
                    this.user?.roleObject
                )?.[0]?.RoleName;
            } else {
                this.router.navigate(['/sign-in']);
            }
        });
        this.initConfig();
        this.getDonationTypes();
        this.getUserDonationTypes();

        this.checkXenditRegForMosque();

        this.assetDonationForm = this.fb.group({
            //mosqueId: [this.mosqueId, Validators.required],
            mosqueGuid: [this.mosqueGuid],
            categoryId: [null, Validators.required],
            subCategoryId: [null, Validators.required],
            productId: [null, Validators.required],
            selectedUOM: [null],
            quantity: [null, Validators.required],
        });

        this.eventDonationForm = this.fb.group({
            //mosqueId: [this.mosqueId, Validators.required],
            eventId: [this.eventId, Validators.required],
        });

        this.mosqueDonationForm = this.fb.group({
            mosqueId: [this.mosqueId, Validators.required],
        });

        this.xenditRegistrationForm = this.fb.group({
            mosqueGuid: [this.mosqueGuid],
            email: ['', Validators.required],
            businessName: ['', Validators.required],
        });
    }

    checkXenditRegForMosque() {
        this.donationService
            .checkMosqueRegForXendit(this.mosqueGuid)
            .subscribe((res: any) => {
                console.log(res, 'xendit registration');
                if (res.result.success == true) {
                    this.isPayRegistred = res?.result?.data?.isPayRegistred;
                    this.mosqueEmail = res?.result?.data?.email;
                    this.mosqueName = res?.result?.data?.mosqueName ?? '';
                } else {
                    this.isPayRegistred =
                        res?.result?.data?.isPayRegistred || false;

                    this.mosqueEmail = res?.result?.data?.email;
                    this.mosqueName = res?.result?.data?.mosqueName ?? '';
                }
            });
    }

    ngAfterViewInit(): void {
        //this.loadMoyasar();
        // this.donationService.fetchPayments('41d37069-a03c-45eb-bf80-57fa3a70ddb8');
    }

    // ngOnDestroy(): void {
    //     this.donationSubscription.unsubscribe();
    // }

    initConfig(): void {
        this.payPalConfig = {
            currency: 'EUR',
            clientId: 'sb',
            createOrderOnClient: (data) =>
                <ICreateOrderRequest>{
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            amount: {
                                currency_code: 'EUR',
                                value: this.selectedAmount.toFixed(2),
                                breakdown: {
                                    item_total: {
                                        currency_code: 'EUR',
                                        value: this.selectedAmount.toFixed(2),
                                    },
                                },
                            },
                        },
                    ],
                },
            advanced: {
                commit: 'true',
            },
            style: {
                label: 'pay',
                tagline: false,
                // layout: 'vertical'
            },
            onApprove: (data, actions) => {
                console.log(
                    'onApprove - transaction was approved, but not authorized',
                    data,
                    actions
                );
                actions.order.get().then((details) => {
                    console.log(
                        'onApprove - you can get full order details inside onApprove: ',
                        details
                    );
                });
            },
            onClientAuthorization: (data) => {
                console.log(
                    'onClientAuthorization - you should probably inform your server about completed transaction at this point',
                    data
                );
                this.showSuccess = true;
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
                this.showCancel = true;
            },
            onError: (err) => {
                console.log('OnError', err);
                this.showError = true;
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
                // this.resetStatus();
            },
        };
    }

    loadMoyasar() {
        const script = this.renderer.createElement('script');
        script.text = `Moyasar.init({
      element: '.mysr-form',
      amount: ${this.selectedAmount}*${100},
      currency: 'SAR',
      description: "${this.donationDesc}",
      publishable_api_key: 'pk_test_KAXYjsaPDtS3gKB7DjEkKN1TDD88ttnVeS3t3zi6',
      callback_url: "${this.reDirectionURI}",
      methods: ['creditcard'],
     
    })`;
        script.type = `text/javascript`;
        script.async = true;
        this.renderer.appendChild(document.body, script);
    }

    selectPaymentMethod(type) {
        if (type?.value === 'Moyasar') {
            setTimeout(() => {
                if (this.donationDesc != '') {
                    this.loadMoyasar();
                }
            }, 500);
        }
    }

    getDonationTypes() {
        this.masterService
            .getDonationTypes(this.PurposeFlag, this.mosqueGuid)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.donationTypes = res?.result?.data;
                        //this.getAllMosques();
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

    // getDonationSelected(event) {
    //
    //     console.log(this.donationTypes, "donationtype");

    //     // Loop through each value in event.value and find the corresponding donationTypeName
    //     event.value.forEach(value => {
    //         const matchingDonationType = this.donationTypes.find(type => type.donationGuid === value); // Adjust the matching logic if necessary (e.g., `id` may be different in your case)
    //         if (matchingDonationType) {
    //             this.selectedDonationTypeNames.push(matchingDonationType.donationTypeName);
    //         }
    //     });
    //     const mosqueIdEventForm = this.eventDonationForm.get('mosqueId')?.value;
    //     const mosqueIdMosqueForm = this.mosqueDonationForm.get('mosqueId')?.value;
    //     if(mosqueIdEventForm || mosqueIdMosqueForm){
    //         if (event?.value?.length > 0 || this.donationTypeSelected?.length > 0 || this.selectedDonationTypeNames?.length > 0) {
    //             this.donationDesc = this.donationTypeSelected.join(',');
    //             this.donationTypeName = this.selectedDonationTypeNames.join(',');
    //             console.log(this.donationTypeName, "donation names");
    //             console.log(this.donationTypeSelected,"checktypes");
    //            // this.loadMoyasar();
    //         } else {
    //             this.donationDesc = '';
    //             this.donationTypeName = '';
    //            // this.loadMoyasar();
    //         }
    //     }
    //     else{
    //         this.toaster.triggerToast({
    //             type: 'error',
    //             message: 'Validation error',
    //             description: this.translate.instant(
    //                 'Inventory.mosqueNameRequired'
    //             )
    //         });
    //     }

    // }

    getDonationSelected(event) {
        // Log donation types for debugging purposes
        console.log(this.donationTypes, 'donationtypes');

        // First, loop through the current selection and find the corresponding donationTypeName for each selected donationGuid
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

        // Now we need to handle the case where a donation type was removed
        // Loop through the previous selection and check if the item is no longer selected
        this.selectedDonationTypeNames = selectedDonationTypeNames;
        const selectedDonations = []; // Initialize an empty array

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

        this.donationPurpose = JSON.stringify(selectedDonations); // Convert the array to JSON string
        console.log(this.donationPurpose, 'donation purpose'); // For debugging
        const mosqueIdEventForm = this.eventDonationForm.get('mosqueId')?.value;
        const mosqueIdMosqueForm =
            this.mosqueDonationForm.get('mosqueId')?.value;

        // if (mosqueIdEventForm || mosqueIdMosqueForm) {
        if (
            event?.value?.length > 0 ||
            this.donationTypeSelected?.length > 0 ||
            this.selectedDonationTypeNames?.length > 0
        ) {
            this.donationDesc = this.donationTypeSelected.join(',');
            this.donationTypeName = this.selectedDonationTypeNames.join(',');

            console.log(this.donationTypeName, 'donation names');
            console.log(this.donationTypeSelected, 'selected donation types');
        } else {
            this.donationDesc = '';
            this.donationTypeName = '';
        }
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
            // if (this.selectedAmount === 0)
            //   this.amountEntered = this.selectedAmount = 500;
        }
        setTimeout(() => {
            this.loadMoyasar();
        }, 500);
    }

    onAmountChange() {
        this.selectedAmount = Number(this.amountEntered);
        if (this.amountEntered > 0 && this.paymentMethod === 'Moyasar') {
            setTimeout(() => {
                if (this.donationTypeSelected?.length > 0) {
                    this.loadMoyasar();
                }
            }, 500);
        }
    }

    savePaymentDetails(dataObj) {
        this.donationService.savePaymentDetails(dataObj).subscribe(
            (res: any) => {
                localStorage.removeItem('donForMosque');
                localStorage.removeItem('donForEvent');
                if (res?.result?.success) {
                    this.router.navigate(['/donations']);
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: 'Donation successful',
                    });
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

    getTransactionHistory() {
        const dialogRef = this.dialog.open(TransactionHistoryComponent, {
            panelClass: 'fullscreen-dialog',
        });
    }
    navigateToChargesPage() {
        const payload = {
            mosqueGuid: this.mosqueGuid,
            userEmail: this.mosqueEmail,
            transactionAmount: this.selectedAmount,
            description: !this.isZakat ? this.donationTypeName : 'Zakat',
            donationPurpose: !this.isZakat ? this.donationPurpose : 'Zakat',
            isZakat: this.isZakat,
            eventId: this.eventId,
        };
        const dialogRef = this.dialog.open(DonationChargesComponent, {
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
    toggleCheck() {
        this.isChecked = !this.isChecked;
    }

    openXenditRegDailog() {
        this.xenditRegistrationForm.patchValue({
            email: this.mosqueEmail,
            businessName: this.mosqueName,
        });
        this.xenditRef = this.dialog.open(this.xenditRegDialog);

        this.xenditRef.afterClosed().subscribe((result) => {
            if (result) {
                this.checkXenditRegForMosque();
            }
        });
    }

    regMosqueXenditt() {
        console.log(
            this.xenditRegistrationForm.value,
            'xendit registration form'
        );
        if (this.xenditRegistrationForm.valid) {
            this.donationService
                .regMosqueRegForXendit(this.xenditRegistrationForm.value)
                .subscribe((res: any) => {
                    console.log(res, 'reg response');

                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                });

            this.xenditRef.close(true);
        } else {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: 'please fill Mandatory fields to Register',
            });
        }
    }

    openDonationDailog() {
        if (
            (this.donationTypeSelected.length !== 0 &&
                this.userdonationType === 1 &&
                !this.isZakat) ||
            (this.donationTypeSelected.length == 0 &&
                this.userdonationType === 1 &&
                this.isZakat) ||
            (this.userdonationType === 3 &&
                this.eventDonationForm.value.eventId)
        ) {
            // this.statusRef = this.dialog.open(this.confirmDonationDialog);
            this.confirmDonationForUser();
            console.log(this.mosqueGuid, 'GUID');
            console.log(this.selectedAmount, 'selected amount');
        } else {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: 'Please Select Donation/Event Purpose to Donate',
            });
        }
    }

    confirmDonationForUser() {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Confirm Payment',
            message: `Are you sure you want to Confirm the Payment of 
          <strong>${this.selectedAmount}/-</strong> ?`,
            icon: {
                name: 'heroicons_outline:check-circle',
                color: 'success',
            },
            actions: {
                confirm: {
                    label: 'Yes',
                    color: 'primary',
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.confirmDonation();
            }
        });
    }

    confirmDonation() {
        const payload = {
            mosqueGuid: this.mosqueGuid,
            userEmail: this.mosqueEmail,
            transactionAmount: this.selectedAmount,
            description: !this.isZakat ? this.donationTypeName : 'Zakat',
            donationPurpose: !this.isZakat ? this.donationPurpose : 'Zakat',
            isZakat: this.isZakat,
            eventId: this.eventId,
        };
        this.donationService
            .callXendittMethod(payload)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    window.location.href = res?.result.data;
                    console.log(res, 'payment url');
                }
                //   this.statusRef.close();
            });
    }

    onClose() {
        this.statusRef.close();
    }

    closeDailog() {
        this.xenditRef.close();
    }

    ZakatCalculator() {
        const dialogRef = this.dialog.open(ZakatCalculatorComponent, {
            panelClass: 'fullscreen-dialog',
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result?.success) {
                this.amountEntered = result?.zakathDue;
                this.isZakat = true;
                this.selectedAmount = Number(this.amountEntered);
                this.cAmount.nativeElement.focus();
                this.amountTypes[0].isActive = false;
                this.amountTypes[this.amountTypes.length - 1].isActive = true;
            }
        });
    }

    getUserDonationTypes() {
        this.masterService.getUserDonationTypes().subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.userCurrency = res?.result?.data?.userCurrency;
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
            this.getUpcomingEventsForMosque();
        } else {
            this.donationTypeSelected = [];
        }
    }

    getAllMosques() {
        this.masterService.getAllMosques('').subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.allMosques = res?.result?.data;
                    if (this.userdonationType === 2) this.getCategories();
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

    selectedProduct(pId, uomName) {
        this.assetDonationForm.patchValue({
            productId: pId,
            selectedUOM: uomName,
        });
    }

    assetDonateNow() {
        if (this.assetDonationForm.invalid) {
            return true;
        }
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

        // localStorage.setItem('donForEvent', this.eventId.toString());
        const selectedEvent = this.allEvents.find(
            (event) => event.eventId === this.eventId
        );

        // If found, get the event name
        if (selectedEvent) {
            this.donationTypeName = selectedEvent.eventName;

            // Or handle the eventName as needed
            //this.eventName = this.eventTypeName.join(',');
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
                    // const fileURL = window.URL.createObjectURL(blob);
                    // const newWindow = window.open(fileURL, '_blank');
                    //
                    // if (newWindow) {
                    //     newWindow.document.write(
                    //         '<iframe src="' +
                    //             fileURL +
                    //             '" style="border: none; width: 100%; height: 100%;"></iframe>'
                    //     );
                    // } else {
                    //     const link = document.createElement('a');
                    //     link.href = fileURL;
                    //     link.download = 'Asset-Invoice';
                    //     document.body.appendChild(link);
                    //     link.click();
                    //     document.body.removeChild(link);
                    // }
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

    getSampleExcelView() {
        const dialogRef = this.dialog.open(ExcelDataComponent, {
            panelClass: 'fullscreen-dialog',
        });
    }

    // isMosqueSelected(event){
    //     const mosqueIdMosqueForm = this.mosqueDonationForm.get('mosqueId')?.value;
    //     this.mosqueId = event?.value;
    //     console.log(this.allMosques , "checking data");
    //     localStorage.setItem('donForMosque', this.mosqueId.toString());
    //     if(mosqueIdMosqueForm && this.donationTypeSelected?.length > 0){
    //         this.donationDesc = this.donationTypeSelected.join(',');
    //         this.loadMoyasar();
    //     }
    // }
    isMosqueSelected(event) {
        const mosqueIdMosqueForm =
            this.mosqueDonationForm.get('mosqueId')?.value;
        this.mosqueId = event?.value;
        console.log(this.allMosques, 'checking data');

        // Find the mosque that matches the selected mosqueId
        const selectedMosque = this.allMosques.find(
            (mosque) => mosque.mosqueId === this.mosqueId
        );

        if (selectedMosque) {
            // Once the mosque is found, get the mosqueGuid
            this.mosqueGuid = selectedMosque.mosqueGuid;
            console.log('Selected mosque GUID:', this.mosqueGuid);

            // Optionally, you can store the mosqueGuid in localStorage if needed
            // localStorage.setItem('mosqueGuid', this.mosqueGuid);

            // Continue with the other logic (if required)
            localStorage.setItem('donForMosque', this.mosqueId.toString());
            if (mosqueIdMosqueForm && this.donationTypeSelected?.length > 0) {
                this.donationDesc = this.donationTypeSelected.join(',');
                this.loadMoyasar();
            }
        } else {
            console.error('Mosque with the given ID not found');
        }
    }

    callPlinkTransactionDetails(dataObj) {
        this.donationService.plinkTransactionData(dataObj).subscribe(
            (res: any) => {
                localStorage.removeItem('donForMosque');
                localStorage.removeItem('donForEvent');
                if (res?.result?.success) {
                    this.router.navigate(['/donations']);
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: 'Donation successful',
                    });
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
