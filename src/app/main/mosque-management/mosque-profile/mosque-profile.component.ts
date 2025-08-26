import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { AddUpdateMosqueComponent } from '../../ministry-management/add-update-mosque/add-update-mosque.component';
import { SharedService } from 'app/services/shared.service';
import { MosqueService } from 'app/services/mosque.service';
import { ToasterService } from 'app/services/toaster.service';
import { ImageUploadComponent } from 'app/common/image-upload/image-upload.component';
import { Router, RouterStateSnapshot } from '@angular/router';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import {
    DomSanitizer,
    SafeResourceUrl,
    SafeUrl,
} from '@angular/platform-browser';
import { ViewImamProfileComponent } from 'app/main/user-management/view-imam-profile/view-imam-profile.component';
import { CacheService } from 'app/services/cache.service';
import moment from 'moment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/services/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { ComponentType } from '@angular/cdk/portal';

@Component({
    selector: 'app-mosque-profile',
    templateUrl: './mosque-profile.component.html',
    styleUrls: ['./mosque-profile.component.scss'],
})
export class MosqueProfileComponent implements OnInit {
    imageEndPoints = environment.imageEndPoints;
    mosqueInfo: any = [];
    mosqueGuId: any;
    mosqueLinkInfo: any;
    direction: string = 'ltr';
    title: string;
    currentActions: any;
    translatedTitle: any;
    galleryTypeId: number = 1;
    galleryGreetings: number = 2;
    galleryQuotes: number = 3;
    allImages: any = [];
    allGreetings: any = [];
    allQuotes: any = [];
    imamMembers: any[] = [];
    organizers: any[] = [];
    keyLeaders: any[] = [];
    isLoading: boolean = false;
    nextPrayerDetails: any;
    keyMembersList = [];
    assignedKeyMembers: any = [];
    daysLeft: number;
    hoursLeft: number;
    minsLeft: number;
    secsLeft: number;
    timeZone: string = 'Asia/Jakarta';
    mosqueSlideInfo: any = [];
    activeIndex = 0;
    intervalId: any;
    photoGuid: string;

    //mosqueGuIdQR: string = '0623f2e7-2a80-426b-870b-7dc48d80afd8';
    mosqueInfo$: BehaviorSubject<any> | null = null;
    private mosqueInfoSubscription: Subscription | undefined;
    user: any;

    constructor(
        private dialog: MatDialog,
        private sharedService: SharedService,
        private mosqueService: MosqueService,
        private toaster: ToasterService,
        private router: Router,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        private cacheService: CacheService,
        private _fuseConfirmationService: FuseConfirmationService,
        private authService: AuthService
    ) {
        if (this.router.url === '/ministry/ministryprofile') {
            this.sharedService.setMosqueProfile(null);
            this.title = 'ministry';
        } else {
            this.title = 'mosque';
        }

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
        this.mosqueLinkInfo = this.sharedService?.mosqueInfo
            ? JSON.parse(this.sharedService?.mosqueInfo)
            : '';
        this.mosqueGuId =
            this.mosqueLinkInfo?.mosqueContactGuid === undefined
                ? ''
                : this.mosqueLinkInfo?.mosqueContactGuid;
        this.currentActions = this.sharedService.getCurrentPageActions();

        this.authService.check().subscribe((res) => {
            if (res) {
                this.user = AuthUtils._decodeToken(
                    localStorage.getItem('isalaamAccessToken')
                );
                this.user.roleName = JSON.parse(
                    this.user?.roleObject
                )?.[0]?.RoleName;
            }
        });

        this.translate
            .get('MosqueProfile.' + this.title)
            .subscribe((translation: string) => {
                this.translatedTitle = translation;
            });
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, 3000);

        this.onloadCalling();
    }
    fetchMosqueDetails(): void {
        this.mosqueInfo$ = this.cacheService.get('mosqueDetails');
        if (this.mosqueInfo$) {
            this.subscribeToMosqueInfo();
        }
        this.mosqueService
            .getMosqueCompleteProfileDetailsWNP(
                this.mosqueGuId ? this.mosqueGuId : ''
            )
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.mosqueInfo = res?.result?.data;
                        this.mosqueInfo$ = new BehaviorSubject<any>(
                            this.mosqueInfo
                        );
                        const timestamp = new Date().getTime();
                        this.mosqueInfo.mosqueCoverPhotoUrl = `${this.mosqueInfo.mosqueCoverPhotoUrl}?v=${timestamp}`;
                        this.mosqueInfo.mosqueProfilePhotoUrl = `${this.mosqueInfo.mosqueProfilePhotoUrl}?v=${timestamp}`;
                        this.cacheService.set('mosqueDetails', this.mosqueInfo);
                        this.subscribeToMosqueInfo();
                    } else {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Error',
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

    subscribeToMosqueInfo(): void {
        if (this.mosqueInfo$) {
            this.mosqueInfoSubscription = this.mosqueInfo$.subscribe(
                (mosqueInfo) => {
                    this.mosqueInfo = mosqueInfo;
                }
            );
        }
    }

    nextSlide() {
        this.activeIndex = (this.activeIndex + 1) % this.mosqueSlideInfo.length;
    }

    prevSlide() {
        this.activeIndex =
            (this.activeIndex - 1 + this.mosqueSlideInfo.length) %
            this.mosqueSlideInfo.length;
    }

    goToSlide(index: number) {
        this.activeIndex = index;
    }

    deleteCoverPhotoConfirm(photoGuid): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete',
            message: 'Are you sure, you want to delete Cover Photo',
            actions: {
                confirm: {
                    label: 'Ok',
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.deleteCoverPhoto(photoGuid);
            }
        });
    }

    deleteCoverPhoto(photoGuid): void {
        this.mosqueService
            .deleteMosqueCoverImage(photoGuid)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    this.getMosqueCoverPhotos();
                }
            });
    }

    editMosque() {
        const dialogRef = this.dialog.open(AddUpdateMosqueComponent, {
            panelClass: 'fullscreen-dialog',
            data: { mosqueGuid: this?.mosqueInfo?.mosqueContactGuid },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.fetchMosqueDetails();
            }
        });
    }

    uploadImage(type, width, height, allowMultiple) {
        if (this.user.roleName == 'Super Admin' && this.mosqueGuId == '') {
            this.mosqueGuId = '0623f2e7-2a80-426b-870b-7dc48d80afd8';
        }
        const dialogRef = this.dialog.open(ImageUploadComponent, {
            data: {
                type: type,
                width: width,
                height: height,
                returnToParent: false,
                allowMultiple,
                apiProperties: {
                    serviceType: 'mosque_profile',
                    mosqueGuId: this.mosqueGuId,
                    ImageType:
                        type === 'profile' ? 1 : type === 'cover' ? 2 : '',
                },
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //this.getMosqueDetailsById();
                this.fetchMosqueDetails();
                this.getMosqueCoverPhotos();
            }
        });
    }

    async onloadCalling() {
        this.fetchMosqueDetails();
        this.getMosqueCoverPhotos();
        await this.getMosqueNextPrayer();
        //await this.getMosqueDetailsById();
        await this.getMediaGalleryImages();
        await this.getMediaGalleryGreetings();
        await this.getMediaGalleryQuotes();
        await this.getAllKeymembers();
        await this.getAllAssignedKeymembers();
    }

    getMosqueCoverPhotos() {
        if (this.user.roleName == 'Super Admin' && this.mosqueGuId == '') {
            this.mosqueGuId = '0623f2e7-2a80-426b-870b-7dc48d80afd8';
        }
        this.mosqueService.getCoverPhotosForMosque(this.mosqueGuId).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.mosqueSlideInfo = res?.result?.data;
                    if (this.mosqueSlideInfo.length > 0) {
                        this.activeIndex = 0;
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
                    message: 'Internal error',
                    description: 'Something went wrong, please try again !',
                });
            }
        );
    }

    async getMediaGalleryImages() {
        this.sharedService
            .getIslamicMediaGalleryImages(this.mosqueGuId, this.galleryTypeId)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.allImages = res?.result?.data;
                    if (this.allImages.length > 4)
                        this.allImages = this.allImages.splice(0, 4);
                }
            });
    }
    async getMediaGalleryGreetings() {
        this.sharedService
            .getIslamicMediaGalleryImages(
                this.mosqueGuId,
                this.galleryGreetings
            )
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.allGreetings = res?.result?.data;
                    if (this.allGreetings.length > 4)
                        this.allGreetings = this.allGreetings.splice(0, 4);
                }
            });
    }
    async getMediaGalleryQuotes() {
        this.sharedService
            .getIslamicMediaGalleryImages(this.mosqueGuId, this.galleryQuotes)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.allQuotes = res?.result?.data;
                    if (this.allQuotes.length > 4)
                        this.allQuotes = this.allQuotes.splice(0, 4);
                }
            });
    }

    async getMosqueNextPrayer() {
        this.mosqueService
            .getNextPrayerForMosque(this.mosqueGuId ? this.mosqueGuId : '')
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.nextPrayerDetails = res?.result?.data;
                }
            });
    }

    // async getAllKeymembers() {
    //     this.isLoading = true;
    //     this.mosqueService.getMosqueMembers(this.mosqueGuId).subscribe(
    //         (res: any) => {
    //             if (res?.result?.success) {
    //                 this.keyMembersList = res?.result?.data;
    //                 this.keyMembersList.forEach((element) => {
    //                     switch (element?.memberTypeId) {
    //                         case 1:
    //                             this.imamMembers.push(element);
    //                             break;
    //                         case 2:
    //                             this.organizers.push(element);
    //                             break;
    //                         default:
    //                             this.keyLeaders.push(element);
    //                             break;
    //                     }
    //                 });
    //             } else {
    //                 this.toaster.triggerToast({
    //                     type: 'error',
    //                     message: 'Validation error',
    //                     description: res?.result?.message,
    //                 });
    //             }
    //             this.isLoading = false;
    //         },
    //         (err) => {
    //             this.isLoading = false;
    //             this.toaster.triggerToast({
    //                 type: 'error',
    //                 message: 'Internal error',
    //                 description: 'Something went wrong, please try again !',
    //             });
    //         }
    //     );
    // }

    async getAllKeymembers() {
        this.isLoading = true;
        this.keyMembersList = [];
        this.mosqueService.getMosqueMembers(this.mosqueGuId).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.keyMembersList = res?.result?.data;
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

    async getAllAssignedKeymembers() {
        this.isLoading = true;
        this.mosqueService
            .getAssignedMosqueKeyMembers(this.mosqueGuId)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.assignedKeyMembers = res?.result?.data;
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
    navToGallery(): void {
        this.router.navigate(['/gallery']);
    }
    // openGoogleMap() {
    //
    //     const latitude = 40.7128; // Example latitude
    //     const longitude = -74.0060; // Example longitude
    //     const url = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
    //     const safeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    //     window.open(safeUrl.toString(), '_blank');
    // }

    openGoogleMap() {
        const latitude = 40.7128; // Example latitude
        const longitude = -74.006; // Example longitude
        const url = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
        const safeUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        window.open(safeUrl.toString(), '_blank');
    }

    ViewImamProfile(id, role) {
        //if(role == "Imam"){
        const dialogRef = this.dialog.open(ViewImamProfileComponent, {
            panelClass: 'fullscreen-dialog',
            data: { imamUserId: id, roleName: role },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
        // }
        // else{
        //     this.toaster.triggerToast({
        //         type: 'info',
        //         message: 'No Info..!',
        //         description: 'No profile uploaded for selected user.',
        //     });
        // }
    }

    ngOnDestroy(): void {
        if (this.mosqueInfoSubscription) {
            this.mosqueInfoSubscription.unsubscribe();
        }
        clearInterval(this.intervalId);
    }
    async leftTime(futureDate) {
        let zoneTime = moment(new Date())
            .tz(this.timeZone.toLowerCase())
            .format('YYYY-MM-DDTHH:mm:ss');
        let diffTime = Math.abs(
            new Date(zoneTime).valueOf() - new Date(futureDate).valueOf()
        );
        //let diffTime = new Date(futureDate).valueOf() - new Date(zoneTime).valueOf();
        this.daysLeft = diffTime / (24 * 60 * 60 * 1000);
        this.hoursLeft = (this.daysLeft % 1) * 24;
        this.minsLeft = (this.hoursLeft % 1) * 60;
        this.secsLeft = (this.minsLeft % 1) * 60;
        [this.daysLeft, this.hoursLeft, this.minsLeft, this.secsLeft] = [
            Math.floor(this.daysLeft),
            Math.floor(this.hoursLeft),
            Math.floor(this.minsLeft),
            Math.floor(this.secsLeft),
        ];
        await [this.daysLeft, this.hoursLeft, this.minsLeft, this.secsLeft];
    }

    FollowTheMosque(type) {
        let body = {
            mosqueGuId: this.mosqueGuId,
            followType: type,
        };
        if (type === 'UnFollow') {
            const confirmation = this._fuseConfirmationService.open({
                title: 'Info',
                message: this.translate.instant(
                    'MosqueFollower.unFollowConfirmation'
                ),
                icon: {
                    name: 'heroicons_outline:minus-circle',
                    color: 'primary',
                },
                actions: {
                    confirm: {
                        label: this.translate.instant('MosqueFollower.ok'),
                    },
                },
            });
            confirmation.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this.FollowOrUnfollowMosque(body);
                }
            });
        } else {
            this.FollowOrUnfollowMosque(body);
        }
    }
    FollowOrUnfollowMosque(body) {
        this.mosqueService.ToFollowTheMosque(body).subscribe((res: any) => {
            if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
                this.fetchMosqueDetails();
            }
        });
    }
    openWebsite(): void {
        const url = this.mosqueInfo?.website
            ? this.mosqueInfo.website
            : 'https://mecca.net';
        window.open(url, '_blank');
    }
}
