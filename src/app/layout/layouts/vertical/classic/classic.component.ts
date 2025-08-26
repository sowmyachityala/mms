import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { environment } from 'environments/environment';
import { FormControl } from '@angular/forms';
import { SharedService } from 'app/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AvailableAdminMosquesComponent } from 'app/common/available-admin-mosques/available-admin-mosques.component';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'classic-layout',
    templateUrl: './classic.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassicLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    position: string = 'right';
    navBar = 'navBar';
    contentSet = 'contentSet';
    mosqueInfo: any;
    searchInputControl: FormControl = new FormControl();
    imageUrl = environment.imageEndPoints;
    // imageWIthTextUrl = environment.imageEndPoints;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    direction: string = 'ltr';
    mosqueHeaderTop: string = '';

    /**
     * Constructor
     */
    constructor(
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private sharedService: SharedService,
        private dialog: MatDialog,
        private translateSerive:LanguageTranslateService,private translate: TranslateService,
        private cdr: ChangeDetectorRef
    ) {
        //set default language
        translate.setDefaultLang(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        })
        this.sharedService.mosqueProfileName.subscribe((res) => {
            if (res) {
                res.mosqueName = res?.mosqueName.toLowerCase()
                this.mosqueInfo = res;
            }
            else if (this.sharedService?.mosqueInfo) {
                this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            }
            this.updateMosqueHeaderTop();
        });
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            }, err=>{
                console.log(err)
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
                this.updateNavBar();
            });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    showAdminMosques() {
        const dialogRef = this.dialog.open(AvailableAdminMosquesComponent, {
            maxHeight: '418px',
            maxWidth: '-webkit-fill-available',
            width: '-webkit-fill-available',
            position: { top: '56px', left: this.direction === 'ltr' ? '280px' : '', right: this.direction === 'rtl' ? '280px' : '' }
        })
    }

    updateMosqueHeaderTop() {
        this.mosqueHeaderTop = this.mosqueInfo?.mosqueName ? '14' : '';
    }

    updateNavBar() {
        if (this.isScreenSmall) {
          this.navBar = '';
          this.contentSet = '';
        } else {
          this.navBar = 'navBar';
          this.contentSet = 'contentSet';
        }
    }
    
    ngAfterViewInit(): void {
        //this.cdr.detectChanges();
    }
}
