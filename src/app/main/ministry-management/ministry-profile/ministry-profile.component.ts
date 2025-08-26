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
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CacheService } from 'app/services/cache.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-ministry-profile',
    templateUrl: './ministry-profile.component.html',
    styleUrl: './ministry-profile.component.scss',
})
export class MinistryProfileComponent implements OnInit {
    imageEndPoints = environment.imageEndPoints;
    mosqueInfo: any;
    mosqueGuId: string = '0623f2e7-2a80-426b-870b-7dc48d80afd8';
    mosqueLinkInfo: any;
    direction: string = 'ltr';
    title: string = 'ministry';
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
    keyMembersList = [];
    mosqueSlideInfo: any = [];
    activeIndex = 0;
    intervalId: any;
    photoGuid: string;

    ministryMosqueInfo$: BehaviorSubject<any> | null = null;
    private ministryMosqueInfoSubscription: Subscription | undefined;

    constructor(
        private dialog: MatDialog,
        private sharedService: SharedService,
        private mosqueService: MosqueService,
        private toaster: ToasterService,
        private router: Router,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private changeDetectorRef: ChangeDetectorRef,
        private cacheService: CacheService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {
        // if (this.router.url === '/ministry/ministryprofile') {            
        //     this.sharedService.setMosqueProfile(null);
        //     this.title = 'ministry';     
        // } else {
        //     this.title = 'mosque';
        // }

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

        this.currentActions = this.sharedService.getCurrentPageActions();
        this.translate.get('MosqueProfile.' + this.title).subscribe((translation: string) => {
                this.translatedTitle = translation;
            });
            this.intervalId = setInterval(() => {
                this.nextSlide();
            }, 3000);
        
        this.onloadCalling();
    }

    async getMosqueDetailsById() {
        this.ministryMosqueInfo$ = this.cacheService.get(
            'ministryMosqueDetails'
        );
        if (this.ministryMosqueInfo$) {
            this.subscribeToMosqueInfo();
        }
        this.mosqueService.getMosqueProfileDetails(this.mosqueGuId).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.mosqueInfo = res?.result?.data;
                    this.ministryMosqueInfo$ = new BehaviorSubject<any>(
                        this.mosqueInfo
                    );
                    const timestamp = new Date().getTime();
                    this.mosqueInfo.mosqueCoverPhotoUrl = `${this.mosqueInfo.mosqueCoverPhotoUrl}?v=${timestamp}`;
                    this.mosqueInfo.mosqueProfilePhotoUrl = `${this.mosqueInfo.mosqueProfilePhotoUrl}?v=${timestamp}`;
                    this.cacheService.set(
                        'ministryMosqueDetails',
                        this.mosqueInfo
                    );
                    this.subscribeToMosqueInfo();
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

    subscribeToMosqueInfo(): void {
        if (this.ministryMosqueInfo$) {
            this.ministryMosqueInfoSubscription =
                this.ministryMosqueInfo$.subscribe((mosqueInfo) => {
                    this.mosqueInfo = mosqueInfo;
                });
        }
    }

    editMosque() {
        const dialogRef = this.dialog.open(AddUpdateMosqueComponent, {
            panelClass: 'fullscreen-dialog',
            data: { mosqueGuid: this?.mosqueInfo?.mosqueContactGuid },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getMosqueDetailsById();
            }
        });
    }

    uploadImage(type, width, height, allowMultiple) {
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
                this.getMosqueDetailsById();
                this.getMosqueCoverPhotos()
            }
        });
    }

    async onloadCalling() {
        this.getMosqueCoverPhotos()
        await this.getMosqueDetailsById();
        await this.getMediaGalleryImages();
        await this.getMediaGalleryGreetings();
        await this.getMediaGalleryQuotes();
        await this.getAllKeymembers();
    }

    getMosqueCoverPhotos() {
       
        this.mosqueService.getCoverPhotosForMosque(this.mosqueGuId).subscribe(
            (res: any) => {
              if(res?.result?.success) {
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
        )
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

    deleteCoverPhotoConfirm(photoGuid): void{
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
            if(res === 'confirmed') {
                this.deleteCoverPhoto(photoGuid)
            }
        })
    }

     deleteCoverPhoto(photoGuid):void {
       this.mosqueService.deleteMosqueCoverImage(photoGuid).subscribe((res: any) => {
         if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
                this.getMosqueCoverPhotos();
            }
       })
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

    async getAllKeymembers() {
        this.isLoading = true;
        this.mosqueService.getMosqueMembers(this.mosqueGuId).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.keyMembersList = res?.result?.data;
                    this.keyMembersList.forEach((element) => {
                        switch (element?.memberTypeId) {
                            case 1:
                                this.imamMembers.push(element);
                                break;
                            case 2:
                                this.organizers.push(element);
                                break;
                            default:
                                this.keyLeaders.push(element);
                                break;
                        }
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

    navToGallery(): void {
        this.router.navigate(['/gallery']);
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
                this.getMosqueDetailsById();
            }
        });
    }
    openWebsite(): void {
        const url = this.mosqueInfo?.website
            ? this.mosqueInfo.website
            : 'https://mecca.net';
        window.open(url, '_blank');
    }
    ngOnDestroy(): void {
        if (this.ministryMosqueInfoSubscription) {
            this.ministryMosqueInfoSubscription.unsubscribe();
        }
        clearInterval(this.intervalId);
    }
}
