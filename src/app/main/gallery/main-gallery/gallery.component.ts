import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'app/services/shared.service';
import { UploadImageComponent } from '../image_upload/upload-image.component';
import { ToasterService } from 'app/services/toaster.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { ImageUploadComponent } from 'app/common/image-upload/image-upload.component';
import { elementAt } from 'rxjs';
import { AuthService } from 'app/services/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    itemsList = [];
    Tabs: Array<any> = [
        { name: 'images', labelId: 'image' },
        { name: 'videos', labelId: 'video' },
        { name: 'channels', labelId: 'channel' },
        { name: 'quotes', labelId: 'quote' },
        { name: 'greetingCards', labelId: 'greetingCard' },
    ];
    isLoading = true;
    searchInputControl: FormControl = new FormControl();
    searchKey: string;
    curTab: number = 0;
    tabName: string = this.Tabs[this.curTab].name;
    buttonName: string = this.Tabs[this.curTab].labelId;
    selectedImages: any;
    direction: string = 'ltr';
    uploadDiv: boolean = true;
    deleteDiv: boolean = false;
    allVideos: any = [];
    allChannels: any = [];

    @ViewChild('container', { static: true, read: ElementRef })
    container: ElementRef;

    pagePosition: string = '0%';
    pagePositionItem: string = '0%';
    currentIndex = 0;
    totalChannels: number;
    cardWidth: string;
    cardWidthItem: string;
    totalCards: number;
    cardsPerPage: number = 5;
    overflowWidth: string;
    overflowWidthItem: string;
    currentChannel: number = 1;
    activeChannel: number;
    channelPlayList = [];
    currentPlayItem: number = 1;
    totalPlayList: number;
    totalCardsItems: number;
    cardsPerPageItem: number;
    totalChannelsItems: number;
    currentVideo: string | null = null;
    @ViewChild('channelDialog', { static: true })
    channelDialog: TemplateRef<any>;
    channelForm: FormGroup;
    page = 1;
    itemsPerPage = 10;

    // totalItems: number; // Total number of items
    // pageSize: number;
    // currentPage: number;
    // pageSizeOptions: number[];
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    prevText: string;
    nextText: string;
    allImages: any = [];
    mosqueGuid: string = '';
    mosqueInfo: any;
    galleryTypeId: number = 1;
    mediaGuid: string;
    user: any;
    pageImage = 1;
    itemsPerPageImage = 10;
    videoGuid: string;
    selectedVideos: any;
    channelGuid: string;

    constructor(
        private dialog: MatDialog,
        private sharedService: SharedService,
        private _authService: AuthService,
        private toaster: ToasterService,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private _fuseConfirmationService: FuseConfirmationService,
        private cdr: ChangeDetectorRef
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
        this.translate.use(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );

        this.translate.onLangChange.subscribe(() => {
            this.updatePaginatorLabels();
        });
    }

    ngOnInit(): void {
        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid
                ? this.mosqueInfo?.mosqueContactGuid
                : '';
        }
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });

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

        this.getMediaGalleryImages();
    }

    updatePaginatorLabels() {
        // this.pageSizeOptions = [5, 10, 25, 100];
        // this.pageSize = this.pageSizeOptions[0];

        // this.paginator._intl.itemsPerPageLabel = this.translate.instant('paginator.itemsPerPageLabel');
        // this.paginator._intl.nextPageLabel = this.translate.instant('paginator.nextPageLabel');
        // this.paginator._intl.previousPageLabel = this.translate.instant('paginator.previousPageLabel');

        this.prevText = this.translate.instant('paginator.previousPageLabel');
        this.nextText = this.translate.instant('paginator.nextPageLabel');
    }
    previousPage() {
        // Implement your previous page logic
    }

    nextPage() {
        // Implement your next page logic
    }

    applyFilter(filterValue: string) {
        this.searchKey = filterValue;
    }

    currTab(event) {
        this.allImages = [];
        this.curTab = event.index;
        this.tabName = this.Tabs[this.curTab].name;
        this.buttonName = this.Tabs[this.curTab].labelId;
        this.deleteDiv = false;
        switch (this.tabName) {
            case 'all':
                this.galleryTypeId = 0;
                this.getMediaGalleryImages();
                break;
            case 'images':
                this.galleryTypeId = 1;
                this.getMediaGalleryImages();
                break;
            case 'greetingCards':
                this.galleryTypeId = 2;
                this.getMediaGalleryImages();
                break;
            case 'quotes':
                this.galleryTypeId = 3;
                this.getMediaGalleryImages();
                break;
            case 'channels':
                this.getMediaChannelsList();
                break;
            case 'videos':
                this.getVideosAndArticles();
                break;
            default:
                console.log('Unknown status. Performing a default action.');
        }
    }

    sOptions(tabName) {
        if (tabName === 'videos') {
            this.videoGuid = '';
            this.selectedVideos = this.allVideos.filter(
                (item) => item.isChecked
            );
            this.videoGuid = this.selectedVideos
                .map((element) => element.videoGuid)
                .join(', ');
            this.deleteDiv = this.selectedVideos.length > 0;
        } else {
            this.mediaGuid = '';
            this.selectedImages = this.allImages.filter(
                (item) => item.isChecked
            );
            this.mediaGuid = this.selectedImages
                .map((element) => element.mediaGuid)
                .join(', ');
            this.deleteDiv = this.selectedImages.length > 0;
        }
    }
    onPreviewImage(index) {
        const dialogRef = this.dialog.open(UploadImageComponent, {
            data: {
                type: 'preview',
                width: 250,
                height: 320,
                returnToParent: false,
                apiProperties: {
                    serviceType: 'media-gallery',
                    mosqueGuid: this.mosqueGuid,
                    galleryTypeGuid: this.galleryTypeId,
                    currentIndex: index,
                    allImages: this.allImages,
                },
            },
        });
    }

    cancelDelete(tabName) {
        if (tabName === 'videos') {
            this.allVideos.forEach((element) => {
                element.isChecked = false;
            });
            this.deleteDiv = false;
        } else if (tabName === 'channels') {
            this.getMediaChannelsList();
        } else {
            this.allImages.forEach((element) => {
                element.isChecked = false;
            });
            this.deleteDiv = false;
        }
    }

    uploadData(tabName) {
        switch (tabName) {
            case 'all':
                this.galleryTypeId = 0;
                this.uploadImage('gallery', '250', '320');
                break;
            case 'images':
                this.galleryTypeId = 1;
                this.uploadImage('gallery', '250', '320');
                break;
            case 'greetingCards':
                this.galleryTypeId = 2;
                this.uploadImage('gallery', '250', '320');
                break;
            case 'quotes':
                this.galleryTypeId = 3;
                this.uploadImage('gallery', '250', '320');
                break;
            case 'channels':
                this.channelForm = this.fb.group({
                    channelId: ['', Validators.required],
                    displayOrder: [0],
                    isVisible: [true],
                });
                this.dialog.open(this.channelDialog);
                break;
            case 'videos':
                this.channelForm = this.fb.group({
                    videoUri: ['', Validators.required],
                    displayOrder: [0],
                    isVisible: [true],
                });
                this.dialog.open(this.channelDialog);
                break;
            case 'quotes':
                console.log(
                    'The status is pending. Performing pending action.'
                );
                break;
            default:
                console.log('Unknown status. Performing a default action.');
        }
    }

    getMediaChannelsList() {
        this.channelPlayList = [];
        this.sharedService.getIslamicMediaChannels().subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.allChannels = res?.result?.data;
                    this.totalCards = res?.result?.data?.length;
                    if (this.totalCards > 0) {
                        let cPlayList = res?.result?.data[0];
                        this.selectedChannel(cPlayList, 0);
                    }
                    //this.cardsPerPage = this.getChannelsPerPage();
                    this.cardsPerPageItem = this.getChannelsPerPage();
                    if (this.tabName === 'channels' && this.totalCards > 0) {
                        this.deleteDiv = true;
                    }
                    this.initializeSlider();
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            },
            (error) => {
                throw error;
            }
        );
    }

    getChannelsPerPage() {
        return Math.floor(this.container.nativeElement.offsetWidth / 256);
    }

    initializeSlider() {
        if (this.totalCards > 6) {
            this.totalChannels = Math.ceil(this.totalCards - 5);
        } else {
            this.totalChannels = Math.ceil(this.totalCards / this.cardsPerPage);
        }
        this.overflowWidth = `calc(${this.totalChannels * 100}% + ${
            this.totalChannels * 10
        }px)`;
        this.cardWidth = `calc((${80 / this.totalChannels}% - ${
            this.cardsPerPage * 10
        }px) / ${this.cardsPerPage})`;
    }

    populatePagePosition() {
        this.pagePosition = `calc(${-20 * (this.currentChannel - 1)}% - ${
            60 * (this.currentChannel - 1)
        }px)`;
    }

    changePage(incrementor) {
        this.currentChannel += incrementor;
        this.populatePagePosition();
    }

    selectedChannel(data, index) {
        this.channelPlayList = [];
        this.activeChannel = index;
        this.channelGuid = data?.channelGuid;
        this.channelPlayList = data.vMChannelPlayLists;
        this.totalPlayList = data.vMChannelPlayLists.length;
        this.initializeSliderItem();
    }

    initializeSliderItem() {
        if (this.totalPlayList > 2) {
            this.totalChannelsItems = Math.ceil(this.totalPlayList - 1);
        } else {
            this.totalChannelsItems = Math.ceil(
                this.totalPlayList / this.cardsPerPageItem
            );
        }
        this.overflowWidthItem = `calc(${this.totalChannelsItems * 100}% + ${
            this.totalChannelsItems * 10
        }px)`;
        this.cardWidthItem = `calc((${256 / this.totalChannelsItems}% - ${
            this.cardsPerPageItem * 10
        }px) / ${this.cardsPerPageItem})`;
    }

    populatePagePositionItem() {
        this.pagePositionItem = `calc(${-15 * (this.currentPlayItem - 1)}% - ${
            45 * (this.currentPlayItem - 1)
        }px)`;
    }

    changePageItem(incrementor) {
        this.currentPlayItem += incrementor;
        this.populatePagePositionItem();
    }

    closeDialog(): void {
        this.dialog.closeAll();
    }
    addChannelOrVideo() {
        if (this.channelForm.invalid) {
            return true;
        }
        let body = this.channelForm?.value;
        if (this.tabName === 'videos') {
            this.addVideosandArticles(body);
        } else {
            this.addChannels(body);
        }
    }

    addChannels(body) {
        this.sharedService.addIslamicChannel(body).subscribe((res: any) => {
            if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
                this.dialog.closeAll();
                this.getMediaChannelsList();
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }

    addVideosandArticles(body) {
        this.sharedService.addIslamicVideo(body).subscribe((res: any) => {
            if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
                this.dialog.closeAll();
                this.getVideosAndArticles();
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }

    getVideosAndArticles() {
        this.sharedService.getVideosAndArticles().subscribe((res: any) => {
            if (res?.result?.success) {
                this.allVideos = res?.result?.data;
            }
        });
    }

    getMediaGalleryImages() {
        this.deleteDiv = false;
        this.sharedService
            .getIslamicMediaGalleryImages(this.mosqueGuid, this.galleryTypeId)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.allImages = res?.result?.data;
                }
            });
    }

    uploadImage(type, width, height) {
        const dialogRef = this.dialog.open(ImageUploadComponent, {
            data: {
                type: type,
                width: width,
                height: height,
                returnToParent: false,
                apiProperties: {
                    serviceType: 'media-gallery',
                    mosqueGuid: this.mosqueGuid,
                    galleryTypeId: this.galleryTypeId,
                    ImageType: type === 'gallery',
                },
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (
                result?.key.toLowerCase() === 'gallery' ||
                result?.key === 'Galeri'
            ) {
                this.getMediaGalleryImages();
            }
        });
    }

    deleteGalleryImagesConfirm(tabName): void {
        const confirmation = this._fuseConfirmationService.open({
            title: this.translate.instant('Gallery.delete'),
            message: this.translate.instant('Gallery.areYouSureWantToDelete'),
            actions: {
                confirm: {
                    label: this.translate.instant('Gallery.ok'),
                },
                cancel: {
                    label: this.translate.instant('Gallery.cancel'),
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.deleteGalleryImages(tabName);
            }
        });
    }

    deleteGalleryImages(tabName) {
        if (tabName === 'videos') {
            this.sharedService
                .deleteMediaGalleryVideos(this.videoGuid)
                .subscribe((res: any) => {
                    if (res?.result?.success) {
                        this.deleteDiv = false;
                        this.toaster.triggerToast({
                            type: 'success',
                            message: 'Success',
                            description: res?.result?.message,
                        });
                        this.getVideosAndArticles();
                    }
                });
        } else if (tabName === 'channels') {
            this.sharedService
                .deleteMediaGalleryChannels(this.channelGuid)
                .subscribe((res: any) => {
                    if (res?.result?.success) {
                        this.deleteDiv = false;
                        this.toaster.triggerToast({
                            type: 'success',
                            message: 'Success',
                            description: res?.result?.message,
                        });
                        this.getMediaChannelsList();
                    }
                });
        } else {
            this.sharedService
                .deleteMediaGalleryImages(this.mediaGuid)
                .subscribe((res: any) => {
                    if (res?.result?.success) {
                        this.deleteDiv = false;
                        this.toaster.triggerToast({
                            type: 'success',
                            message: 'Success',
                            description: res?.result?.message,
                        });
                        this.getMediaGalleryImages();
                    }
                });
        }
    }
}
