import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ImageUploadComponent } from 'app/common/image-upload/image-upload.component';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { User } from 'app/core/user/user.types';
import { UserProfileDetailsUpdateComponent } from 'app/main/dialogs/user-profile/user-profile-details-update/user-profile-details-update.component';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';
import { environment } from 'environments/environment';
import { FcmDeviceComponent } from '../fcm-device/fcm-device.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent {
    userProfile: any = [];
    isOtpArrived = false;
    displayTimer: any;
    seconds = 0;
    profileImageUrl = '';
    direction: string = 'ltr';
    user: User;
    isLoadingType: string;

    constructor(
        private userService: UserManagementService,
        private dialog: MatDialog,
        private toaster: ToasterService,
        public profileDialogRef: MatDialogRef<ProfileSettingsComponent>,
        private sharedService: SharedService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private spinnerService: NgxSpinnerService,
        private cdr: ChangeDetectorRef
    ) {
        this.isLoadingType = 'pacman';
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
        this.getUserProfileDetails();
    }

    onClose() {
        this.profileDialogRef.close(true);
    }

    getUserProfileDetails() {
        this.spinnerService.show();
        this.userService.getUserProfileById().subscribe((res: any) => {
            if (res?.result?.success) {
                this.userProfile = res?.result?.data;
                this.user = AuthUtils._decodeToken(
                    localStorage.getItem('isalaamAccessToken')
                );
                this.profileImageUrl = `${
                    this.userProfile.profileImageUrl
                }?t=${new Date().getTime()}`;
                this.sharedService.updateProfileImageUrl(this.profileImageUrl);
                this.user.userName = this.userProfile.fullName;
                this.cdr.detectChanges();
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
    getCacheBustedImageUrl(): string {
        if (this.profileImageUrl) {
            const separator = this.profileImageUrl.includes('?') ? '&' : '?';
            return `${
                this.profileImageUrl
            }${separator}cache-buster=${new Date().getTime()}`;
        }
        return '';
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
            disableClose: true,
            // height:'auto',
            data: {
                profileDetails: this.userProfile,
                messageType: fieldType,
                isCreate: true,
                buttons: [
                    {
                        type: 'Cancel',
                        label: 'Cancel',
                    },
                    {
                        color: 'primary',
                        type: 'Confirm',
                        label: 'Save & Continue',
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
}
