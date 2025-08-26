import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MosqueService } from 'app/services/mosque.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';
import { NgxQrcodeStylingComponent } from 'ngx-qrcode-styling';
import { CreateUpdateEventComponent } from '../create-update-event/create-update-event.component';
import { FuseAlertService } from '@fuse/components/alert';
import { SharedService } from 'app/services/shared.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { QrcodePrintComponent } from 'app/common/qrcode-print/qrcode-print.component';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Component({
    selector: 'app-event-details',
    templateUrl: './event-details.component.html',
    styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit {
    eventDetails: any;
    elementType = 'url';
    isLoading = true;
    eventGuId = '';
    logo = environment.imageEndPoints.logo;
    bannerUrl = environment.imageEndPoints.eventsBanner;
    imageEndPoints = environment.imageEndPoints;
    direction: string = 'ltr';
    @ViewChild(NgxQrcodeStylingComponent, { static: false })
    qrcode: NgxQrcodeStylingComponent;
    @ViewChild('printSection', { static: false }) printSection: ElementRef;
    user: any;
    qrEvent:any;
    constructor(
        public addDialogRef: MatDialogRef<EventDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private dialog: MatDialog,
        private mosqueService: MosqueService,
        private toaster: ToasterService,
        private sharedService: SharedService,
        private _fuseConfirmationService: FuseConfirmationService,
        private cdref: ChangeDetectorRef,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private _authService: AuthService
    ) {
        //set default language
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
        if (this.data?.data) {
            this.eventGuId = this.data?.data?.eventGuid;
            const expireDate = this.data?.data?.eventDate;
            this.qrEvent = `https://isalaam.me/mosque/mms-ulink.html?eId=${this.eventGuId}&type=EN&exp=${expireDate}`
            this.getEventDetailsById();
        }
        this._authService.check().subscribe((res) => {
            if (res) {
                this.user = AuthUtils._decodeToken(
                    localStorage.getItem('isalaamAccessToken')
                );
                this.user.roleName = JSON.parse(
                    this.user?.roleObject
                )?.[0]?.RoleName;
            }
        });
    }

    getEventDetailsById() {
        this.isLoading = true;
        this.mosqueService.getEventDetails(this.eventGuId).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    res.result.data.differenceDays = Math.floor(
                        (Date.UTC(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            new Date().getDate()
                        ) -
                            Date.UTC(
                                new Date(
                                    res?.result?.data.eventDate
                                ).getFullYear(),
                                new Date(
                                    res?.result?.data.eventDate
                                ).getMonth(),
                                new Date(res?.result?.data.eventDate).getDate()
                            )) /
                            (1000 * 60 * 60 * 24)
                    );
                    this.eventDetails = res?.result?.data;
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

    updateEvent() {
        const dialogRef = this.dialog.open(CreateUpdateEventComponent, {
            panelClass: 'fullscreen-dialog',
            data: {
                eventGuid: this.eventGuId,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.eventName) {
                this.addDialogRef.close({
                    updated: true,
                    eventName: result?.eventName,
                });
            }
        });
    }

    confirmationMessage(type) {
        const confirmation = this._fuseConfirmationService.open({
            title:
                type === 'cancel'
                    ? this.translate.instant('Events.ccancel')
                    : type === 'deactivate'
                    ? this.translate.instant('Events.deactivate')
                    : '' + ' event',
            message:
                type === 'cancel'
                    ? this.translate.instant('Events.youWantCancelEvent')
                    : type === 'deactivate'
                    ? this.translate.instant('Events.youWantDeactivateEvent')
                    : '',
            actions: {
                confirm: {
                    label: this.translate.instant('Events.confirmLabel'),
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                type === 'cancel'
                    ? this.cancelEvent('55ea4468-1006-460f-9d80-1775dab83f63')
                    : type === 'deactivate'
                    ? this.deactivateEvent(
                          '3022f59c-6676-4f6f-aded-7cf4fb9971a9'
                      )
                    : null;
            }
        });
    }

    cancelEvent(actionId) {
        this.isLoading = true;
        this.mosqueService
            .updateEventStatus(this.eventGuId, actionId)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Cancelled',
                            description: 'Event cancelled successfully',
                        });
                    } else {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Validation error',
                            description: res?.result?.message,
                        });
                    }
                    this.isLoading = false;
                },
                (err) => {
                    this.isLoading = false;
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Internal error',
                        description: 'Something went wrong, please try again !',
                    });
                }
            );
    }

    deactivateEvent(actionId) {
        this.isLoading = true;
        this.mosqueService
            .updateEventStatus(this.eventGuId, actionId)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Deactived',
                            description: 'Event deactivated successfully',
                        });                        
                        this.getEventDetailsById();
                    } else {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Validation error',
                            description: res?.result?.message,
                        });
                    }
                    this.isLoading = false;
                },
                (err) => {
                    this.isLoading = false;
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Internal error',
                        description: 'Something went wrong, please try again !',
                    });
                }
            );
    }

    printQRCode() {
        const printDialogRef = this.dialog.open(QrcodePrintComponent, {
            panelClass: 'fullscreen-dialog',
            data: {
                eventGuId: `https://isalaam.me/mosque/mms-ulink.html?mId=${this.eventGuId}&type=Event`,
                eventName: this.eventDetails?.eventName,
            },
        });
    }

    onDownload(qrcode: any): void {
        qrcode.download('file-name.png').subscribe((res: any) => {
            // TO DO something!
            console.log('download:', res);
        });
    }

    onClose() {
        this.addDialogRef.close(true);
    }
    
    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }
}
