import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MosqueService } from 'app/services/mosque.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
    type: string;
    selection = '';
    selectedFile = null;
    requiredWidth;
    requiredHeight;
    direction: string = 'ltr';
    imageSource: string;
    returnFileToParent: boolean;
    apiProperties: any = {};
    classWidth: string;
    classHeight: string;
    files: any[] = [];
    oneClick: boolean = false;
    selectedMultiFiles: File[] = [];
    multiimageSources: string[] = [];

    isSingleUpload: boolean = true;

    constructor(
        public imgDialogRef: MatDialogRef<ImageUploadComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private sharedService: SharedService,
        private _fuseConfirmationService: FuseConfirmationService,
        private toaster: ToasterService,
        private userService: UserManagementService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private mosqueService: MosqueService
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
        translate.use(
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

        // this.isSingleUpload = this.data?.type === 'cover';
        this.isSingleUpload = this.data?.allowMultiple;
        if (this.data?.type) {
            this.type = this.data?.type;
            this.requiredWidth = Number(this.data?.width);
            this.requiredHeight = Number(this.data?.height);
            this.classWidth =
                'w-' +
                this.requiredWidth / 4 +
                ' ' +
                'w-max-[' +
                this.requiredWidth +
                'px]';
            this.classHeight =
                'h-' +
                this.requiredHeight / 4 +
                ' ' +
                'h-max-[' +
                this.requiredHeight +
                'px]';
            this.returnFileToParent = this.data?.returnToParent;
            this.apiProperties = this.data?.apiProperties;
        }

        // this.translate
        //     .get('ImageUpload.' + this.type)
        //     .subscribe((translation: string) => {
        //         this.type = translation;
        //     });
    }

    saveUploadedImage() {
        this.oneClick = true;
        if (!this.selectedFile) {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: 'Please upload an Image to save',
            });
            this.oneClick = false;
            return;
        }
        if (this.returnFileToParent) {
            this.imgDialogRef.close({
                key: this.type,
                [this.type]: this.selectedFile,
                src: this.imageSource,
            });
        } else {
            const formData = new FormData();
            if (this.apiProperties?.serviceType === 'user_profile') {
                // Object.keys(this.apiProperties)?.forEach(key => {
                //   formData.append(key, this?.apiProperties?.[key])
                // })
                formData.append('profileImage', this.selectedFile);
                this.userService.uploadUserProfileImage(formData).subscribe(
                    (res: any) => {
                        this.oneClick = false;
                        if (res?.result?.success) {
                            this.toaster.triggerToast({
                                type: 'success',
                                message: 'Success',
                                description: res?.result?.message,
                            });
                            this.imgDialogRef.close(true);
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
            } else if (this.apiProperties?.serviceType === 'mosque_profile') {
                formData.append('Image', this.selectedFile);
                formData.append('MosqueGuid', this.apiProperties?.mosqueGuId);
                formData.append('ImageType', this.apiProperties?.ImageType);
                this.sharedService
                    .updateUploadedImage(
                        formData,
                        'uploadMosqueProfileOrCoverImage'
                    )
                    .subscribe(
                        (res: any) => {
                            this.oneClick = false;
                            if (res?.result?.success) {
                                this.toaster.triggerToast({
                                    type: 'success',
                                    message: 'Success',
                                    description: res?.result?.message,
                                });
                                this.imgDialogRef.close(true);
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
            } else if (this.apiProperties?.serviceType === 'media-gallery') {
                formData.append('UploadMedia', this.selectedFile);
                formData.append('MosqueGuid', this.apiProperties?.mosqueGuid);
                formData.append(
                    'GalleryTypeId',
                    this.apiProperties?.galleryTypeId
                );
                this.sharedService
                    .updateUploadedImage(formData, 'uploadMediaGallery')
                    .subscribe(
                        (res: any) => {
                            this.oneClick = false;
                            if (res?.result?.success) {
                                this.toaster.triggerToast({
                                    type: 'success',
                                    message: 'Success',
                                    description: res?.result?.message,
                                });
                                //this.imgDialogRef.close(true);
                                this.imgDialogRef.close({ key: this.type });
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
        }
    }

    onClose() {
        this.imgDialogRef.close();
    }

    onFileChange(pFileList: File[]) {
        this.files = Object.keys(pFileList).map((key) => pFileList[key]);
        const file = this.files[0] as File;
        if (file) {
            const uploadFile = file.name;
            const uploadType = uploadFile.split('.');
            let fileType = uploadType[1].toLowerCase();
            if (
                fileType !== 'jpg' &&
                fileType !== 'jpeg' &&
                fileType !== 'png' &&
                fileType !== 'svg'
            ) {
                this.selection = '';
                const confirmation = this._fuseConfirmationService.open({
                    title: 'Validation error',
                    message:
                        "Please don't upload" + ' ' + fileType + ' ' + 'files',
                    actions: {
                        confirm: {
                            label: 'Ok',
                        },
                    },
                });
            } else if (
                fileType === 'jpg' ||
                fileType === 'jpeg' ||
                fileType === 'png' ||
                fileType === 'svg'
            ) {
                const img = new Image();
                img.src = window.URL.createObjectURL(file);
                img.onload = () => {
                    const width = img.width;
                    const height = img.height;

                    // if (width < this.requiredWidth || height < this.requiredHeight) {
                    //   // File dimensions are invalid, reset the file input value
                    //   event.target.files = null;
                    //   alert(`File dimensions must be ${this.requiredWidth}x${this.requiredHeight} pixels.`);
                    // }
                    // else {
                    this.selectedFile = file;
                    if (this.selectedFile) {
                        const reader = new FileReader();

                        reader.onload = (e: any) => {
                            this.imageSource = e.target.result;
                        };

                        reader.readAsDataURL(this.selectedFile);
                        // this.imageSource = window.URL.createObjectURL(this.selectedFile);
                    }
                };
                this.selection = 'selected';
            }
        }
    }

    onMultipleFileChange(pFileList: File[]) {
        this.files = Array.from(pFileList);
        this.selection = '';

        const allowedTypes = ['jpg', 'jpeg', 'png', 'svg'];
        const invalidFiles = this.files.filter((file) => {
            const fileType = file.name.split('.').pop()?.toLowerCase();
            return !fileType || !allowedTypes.includes(fileType);
        });

        if (invalidFiles.length > 0) {
            const invalidExtensions = invalidFiles
                .map((file) => file.name.split('.').pop())
                .join(', ');
            this._fuseConfirmationService.open({
                title: 'Validation Error',
                message: `Please don't upload the following file types: ${invalidExtensions}`,
                actions: {
                    confirm: {
                        label: 'Ok',
                    },
                },
            });
            this.files = [];
            return;
        }

        this.selectedMultiFiles = this.files;
        this.multiimageSources = [];
        this.selectedMultiFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.multiimageSources.push(e.target.result);
            };
            reader.readAsDataURL(file);
        });
        this.selection = 'selected';
    }

    updateCoverImages() {
        this.oneClick = true;
        if (!this.selectedMultiFiles || this.selectedMultiFiles.length === 0) {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: 'Please upload an Image to save',
            });
            this.oneClick = false;
            return;
        }
        if (this.returnFileToParent) {
            this.imgDialogRef.close({
                key: this.type,
                [this.type]: this.selectedMultiFiles,
                src: this.multiimageSources,
            });
        } else {
            const formData = new FormData();
            if (this.apiProperties?.serviceType === 'mosque_profile') {
                this.selectedMultiFiles.forEach((file) => {
                    formData.append(`Image`, file);
                });
                formData.append('MosqueGuid', this.apiProperties?.mosqueGuId);

                this.mosqueService
                    .uploadMosqueCoverImage(formData)
                    .subscribe((res: any) => {
                        this.oneClick = false;
                        if (res?.result?.success) {
                            this.toaster.triggerToast({
                                type: 'success',
                                message: 'Success',
                                description: res?.result?.message,
                            });
                            this.imgDialogRef.close(true);
                        } else {
                            this.toaster.triggerToast({
                                type: 'error',
                                message: 'Validation error',
                                description: res?.result?.message,
                            });
                        }
                    });
            }
        }
    }

    onDragOver(event: any): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: any): void {
        event.preventDefault();
        event.stopPropagation();

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            // Process the dropped image files
            this.processImages(files);
        }
    }

    onDragLeave(event: any): void {
        event.preventDefault();
        event.stopPropagation();
    }

    processImages(files: FileList): void {
        // Perform necessary actions with the dropped images
        // For example, you can read the file contents using FileReader API
        // const fileReader = new FileReader();
        // fileReader.onload = () => {
        //   const imageSrc = fileReader.result as string;
        //   // Do something with the image source (e.g., display, upload, etc.)
        // };
        // fileReader.readAsDataURL(files[0]);

        const img = new Image();
        img.src = window.URL.createObjectURL(files[0]);
        img.onload = () => {
            const width = img.width;
            const height = img.height;

            //if (width < this.requiredWidth || height < this.requiredHeight) {
            //files = null;
            //alert(
            // `File dimensions must be ${this.requiredWidth}x${this.requiredHeight} pixels.`
            //);
            //} else {
            this.imageSource = window.URL.createObjectURL(this.selectedFile);
            this.selectedFile = files[0];
            //}
        };
        this.selection = 'selected';
    }
}
