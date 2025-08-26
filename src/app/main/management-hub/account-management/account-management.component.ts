import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-account-management',
    templateUrl: './account-management.component.html',
    styleUrl: './account-management.component.scss',
})
export class AccountManagementComponent {
    direction: string = 'ltr';
    mosqueInfo: any;
    mosqueEmail: string;
    constructor(
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private sharedService: SharedService
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );

        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            this.mosqueEmail = this.mosqueInfo?.email ?? '';
        } else {
            this.mosqueEmail = 'agsds-isalaam@isalaam.id';
        }
    }

    ngOnInit(): void {}

    navigateToAccounts() {
        window.open(environment.accountsUrl, '_blank');
    }
}
