import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import {
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { SharedService } from 'app/services/shared.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { HttpRequest } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'languages',
    templateUrl: './languages.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'languages',
})
export class LanguagesComponent implements OnInit, OnDestroy {
    availableLangs: AvailableLangs;
    activeLang: string = 'id-ID';
    inactiveLang: string = 'ar';
    flagCodes: any;
    direction: string;
    allLangs: any[] = [];
    navigation: Navigation;
    selectLang = new FormControl();
    selectLangFlag: string;
    tooltip: string;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _translocoService: TranslocoService,
        private sharedService: SharedService,
        private languageTranslate: LanguageTranslateService,
        private _navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the available languages from transloco
        //this.availableLangs = this._translocoService.getAvailableLangs();

        // Subscribe to language changes
        // this._translocoService.langChanges$.subscribe((activeLang) => {

        //     // Get the active lang
        //     this.activeLang = activeLang;

        //     // Update the navigation
        //     this._updateNavigation(activeLang);
        // });

        // Set the country iso codes for languages for flags

        this.activeLang =
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language');
        this.flagCodes = {
            'en-US': 'EN',
            'ar-SA': 'AR',
            'id-ID': 'BI',
        };

        this.getAvailableLanguages();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: string): void {
        // Set the active lang
        if (this.activeLang === 'id-ID') {
            this.inactiveLang = this.activeLang;
            this.direction = 'rtl';
            this.activeLang = 'ar';
            lang = 'ar';
        } else {
            this.inactiveLang = this.activeLang;
            this.direction = 'ltr';
            this.activeLang = 'id-ID';
            lang = 'id-ID';
        }
        this.sharedService.setDirection(this.direction);
        document.documentElement.setAttribute('dir', this.direction);
        this._translocoService.setActiveLang(lang);
    }

    selectPreferedLang(sLang, flagUri): void {
        // Set the active lang
        let lang = sLang;

        this.allLangs.forEach((lang) => {
            if (sLang == lang.cultureCode) {
                this.direction = lang.layout.toLowerCase();
            }
        });
        //let direction =sLang?.direction;
        this.sharedService.setDirection(this.direction);
        document.documentElement.setAttribute('dir', this.direction);
        this._translocoService.setActiveLang(lang);
        this.sharedService.setActiveLanguge(lang);
        document.documentElement.setAttribute('isalaam-language', lang);
        localStorage.setItem('isalaam-language', lang);
        localStorage.setItem('isalaam-dir', this.direction);
        //this._navigationService.get().subscribe();
        window.location.reload();
        this.selectLangFlag = flagUri;
        //this.reloadWindow();
    }

    getAvailableLanguages() {
        this.languageTranslate.getAvailableLanguages().subscribe((res: any) => {
            if (res) {
                this.allLangs = res?.result?.data;
                //const selectedLang = localStorage.getItem('isalaam-language') === null ? this.languages[3].cultureCode : localStorage.getItem('isalaam-language');
                const selectedLang =
                    localStorage.getItem('isalaam-language') === null
                        ? 'id-ID'
                        : localStorage.getItem('isalaam-language');
                //const lanDirection = localStorage.getItem('direction') === null ? this.languages[3].layout.toLowerCase() : localStorage.getItem('direction');
                const lanDirection =
                    localStorage.getItem('isalaam-dir') === null
                        ? 'ltr'
                        : localStorage.getItem('isalaam-dir');
                localStorage.setItem('isalaam-language', selectedLang);
                localStorage.setItem('isalaam-dir', lanDirection);
                document.documentElement.setAttribute('dir', lanDirection);
                this.selectLang.setValue(selectedLang);
                this.sharedService.setDirection(lanDirection);
                //this.selectLangFlag = this.flagCodes[selectedLang];
            }
        });
    }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the navigation
     *
     * @param lang
     * @private
     */
    private _updateNavigation(lang: string): void {
        // For the demonstration purposes, we will only update the Dashboard names
        // from the navigation but you can do a full swap and change the entire
        // navigation data.
        //
        // You can import the data from a file or request it from your backend,
        // it's up to you.

        // Get the component -> navigation data -> item
        const navComponent =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                'mainNavigation'
            );

        // Return if the navigation component does not exist
        if (!navComponent) {
            return null;
        }

        // Get the flat navigation data
        const navigation = navComponent.navigation;

        // Get the Project dashboard item and update its title
        const projectDashboardItem = this._fuseNavigationService.getItem(
            'dashboards.project',
            navigation
        );
        if (projectDashboardItem) {
            this._translocoService
                .selectTranslate('Project')
                .pipe(take(1))
                .subscribe((translation) => {
                    // Set the title
                    projectDashboardItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        // Get the Analytics dashboard item and update its title
        const analyticsDashboardItem = this._fuseNavigationService.getItem(
            'dashboards.analytics',
            navigation
        );
        if (analyticsDashboardItem) {
            this._translocoService
                .selectTranslate('Analytics')
                .pipe(take(1))
                .subscribe((translation) => {
                    // Set the title
                    analyticsDashboardItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
    }

    reloadWindow() {
        this.router.navigate([this.router.url]);
    }
}
