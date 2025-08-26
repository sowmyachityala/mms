import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { DonationsService } from 'app/services/donations.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-cal-dialog',
    templateUrl: './cal-dialog.component.html',
    styleUrl: './cal-dialog.component.scss',
})
export class CalDialogComponent {
    imageUrl = environment.imageEndPoints.menuRightLogo;
    paymentMethods: any = [];
    activeTab: number = 0;
    BanksData: any = [];
    payloadData: any;
    direction: string = 'ltr';
    donatedAmount: number;
    activeImageIndex: number;
    BankCharges: any = [];
    mosqueGuid: string;
    mosqueEmail: string;
    eventId: number;
    description: string;
    donationPurpose: string;
    isZakat: string;
    contactUserId: string;
    isConfirmed = false;
    isConfirmDonation = false;
    mosqueName: string;
    mosqueProfileUrl: string;
    defaultMosqueImage =
        'https://isalaam.me/mosquehubapi/Resources/DefaultImages/DefaultProfilePicture.png';

    constructor(
        public dialogRef: MatDialogRef<CalDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private donationService: DonationsService,
        private toaster: ToasterService,
        private sharedService: SharedService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );

        if (this.data?.payloadData) {
            this.payloadData = this.data?.payloadData;
            this.donatedAmount = this.payloadData?.transactionAmount;
            this.mosqueGuid = this.payloadData?.mosqueGuid;
            this.mosqueEmail = this.payloadData?.userEmail;
            this.eventId = this.payloadData?.eventId;
            this.description = this.payloadData?.description;
            this.donationPurpose = this.payloadData?.donationPurpose;
            this.isZakat = this.payloadData?.isZakat;
            this.contactUserId = this.payloadData?.contactUserId;
            this.mosqueName = this.payloadData?.mosqueName;
            this.mosqueProfileUrl = this.payloadData?.mosqueProfileUrl;
        }
    }

    ngOnInit(): void {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
        this.callDataList('PaymentType', '');
        //this.callDataList('Banks','Virtual Account');
    }

    onClose() {
        this.dialogRef.close();
    }

    showContent(index: number, method: string): void {
        this.activeTab = index;
        this.activeImageIndex = null;
        this.BankCharges = [];
        this.callDataList('Banks', method);
    }

    setActiveImage(index: number, bankNameId: string) {
        this.activeImageIndex = index;
        this.donationService
            .getBanksCharges(bankNameId, this.donatedAmount)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.BankCharges = res?.result?.data;
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

    callDataList(dataType: string, methodType: string) {
        this.donationService
            .getBanksForPaymentMode(dataType, methodType)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        if (dataType === 'PaymentType') {
                            this.paymentMethods = res?.result?.data;
                            this.callDataList(
                                'Banks',
                                this.paymentMethods[0].paymentMethod
                            );
                        } else if (dataType === 'Banks') {
                            this.BanksData = res?.result?.data;
                        }
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
    confirmDonationForUser() {
        this.isConfirmDonation = true;
        // const confirmation = this._fuseConfirmationService.open({
        //   title : 'Confirm Payment',
        //   message: `Are you sure you want to Confirm the Payment of
        //   <strong>${this.BankCharges.subTotalAmount}/-</strong> ?`,
        //   icon: {
        //     name: 'heroicons_outline:check-circle',
        //     color: 'success',
        // },
        //   actions: {
        //     confirm: {
        //       label: 'Yes',
        //       color: 'primary',
        //    }
        //   }
        // });
        // confirmation.afterClosed().subscribe(res => {
        //   if (res === 'confirmed') {
        //     this.confirmDonation();
        //   }
        // })
    }

    onYes() {
        if (this.isConfirmed) {
            console.log('Donation confirmed!');
            this.confirmDonation();
        }
    }

    onNo() {
        this.isConfirmDonation = false;
    }

    confirmDonation() {
        const payload = {
            mosqueGuid: this.mosqueGuid,
            userEmail: this.mosqueEmail,
            transactionAmount: this.BankCharges.subTotalAmount,
            description: this.description,
            donationPurpose: this.donationPurpose,
            isZakat: this.isZakat,
            eventId: this.eventId,
            paymentMethod: this.BankCharges.bankNameId,
            donationAmount: this.donatedAmount,
            transactionChargeAmount: this.BankCharges.transactionCharges,
            vATAmount: this.BankCharges.vatCharges,
            serviceAmount: this.BankCharges.splitCharges,
            contactUserId: this.contactUserId,
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

    onImageError(event: Event): void {
        const target = event.target as HTMLImageElement;
        target.src = this.defaultMosqueImage;
    }
}
