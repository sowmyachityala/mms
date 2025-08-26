import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ImageUploadComponent } from 'app/common/image-upload/image-upload.component';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MosqueService } from 'app/services/mosque.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { CommonBaseClass } from 'app/shared/common-abstract-class';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-add-key-member',
    templateUrl: './add-key-member.component.html',
    styleUrls: ['./add-key-member.component.scss'],
})
export class AddKeyMemberComponent extends CommonBaseClass implements OnInit {
    memberInfoForm: FormGroup;
    isLoading: boolean = false;
    selectedProfileFile = null;
    profileImageSource: string;
    direction: string = 'ltr';
    memberGuid;
    imageUrl = environment.imageEndPoints;
    mTypes = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        public addDialogRef: MatDialogRef<AddKeyMemberComponent>,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private mosqueService: MosqueService,
        private toaster: ToasterService,
        public sharedService: SharedService,
        public authService: AuthService,
        public cdRef: ChangeDetectorRef,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService
    ) {
        super(authService, sharedService);
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    ngOnInit(): void {
        this.memberInfoForm = this.fb.group({
            memberGuid: [''],
            mosqueGuid: [
                this.mosqueInfo?.mosqueContactGuid
                    ? this.mosqueInfo?.mosqueContactGuid
                    : '',
            ],
            name: ['', [Validators.required, this.noLeadingSpacesValidator]],
            email: [''],
            phoneNumber: ['', [Validators.minLength(8), Validators.maxLength(15)]],
            about: ['', [Validators.required, this.noLeadingSpacesValidator]],
            designation: ['', [Validators.required, this.noLeadingSpacesValidator]],
        });

        if (this.data?.memberGuid) {
            this.memberGuid = this.data?.memberGuid;
            this.getKeyMemberDetailsById();
        }
    }

    ngAfterViewInit(): void {
        this.cdRef.detectChanges();
    }

    onClose() {
        this.addDialogRef.close();
    }

    getKeyMemberDetailsById() {
        this.mosqueService.getMosqueMemberInfo(this.memberGuid).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.memberInfoForm.patchValue(res?.result?.data);
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
            //if (result?.key === 'PROFILE' || result?.key === 'PROFIL') {
            if (result?.key === 'profile') {
                this.selectedProfileFile = result?.[result?.key];
                this.profileImageSource = result?.src;
            }
        });
    }

    deleteImage(type) {
        if (type === 'profile') {
            this.selectedProfileFile = null;
            this.profileImageSource = '';
        }
    }

    addOrUpdateMemeber() {
        if (this.memberInfoForm.invalid) {
            return true;
        }
        const formData = new FormData();
        Object.keys(this.memberInfoForm?.value).forEach((key) => {
            formData.append(key, this.memberInfoForm?.value[key]);
        });
        if (this.selectedProfileFile) {
            formData.append('KeyMemberPicture', this.selectedProfileFile);
        }
        this.isLoading = true;
        this.mosqueService.createOrUpdateMosqueMember(formData).subscribe(
            (res: any) => {
                if (res.result.success) {
                    this.addDialogRef.close(true);
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res.result.message,
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

    getKeyMemberTypes() {
        this.sharedService.getKeyMemberTypes().subscribe((res: any) => {
            if (res?.result?.success) {
                this.mTypes = res?.result?.data;
            }
        });
    }
    noLeadingSpacesValidator(control: any) {
        if (control.value && control.value.startsWith(' ')) {
            return { noLeadingSpaces: true };
        }
        return null;
    }
}
