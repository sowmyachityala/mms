import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { NgxQrcodeStylingComponent } from 'ngx-qrcode-styling';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'app/services/shared.service';
import { MasterService } from 'app/services/master.service';

@Component({
    selector: 'app-mosque-qrcode',
    templateUrl: './mosque-qrcode.component.html',
    styleUrl: './mosque-qrcode.component.scss',
})
export class MosqueQrcodeComponent {
    direction: string = 'ltr';
    @ViewChild(NgxQrcodeStylingComponent, { static: false })
    qrcode: NgxQrcodeStylingComponent;
    @ViewChild('printSection', { static: false }) printSection: ElementRef;
    //qrData: any = { mId: '', type: 'AF' };
    //qrDonateData: any = { mId: '', type: 'DN', expiryDate: '' };
    qrAttData: any;
    qrDonate: any;
    mosqueGuid: string = '';
    mosqueName: string = '';
    mosqueInfo: any;
    todayDate = new Date().toISOString().split('T')[0];
    expiryDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
    qrDonteTwo = '';
    constructor(
        private userService: UserManagementService,
        private toaster: ToasterService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
        private _router: Router,
        private sharedService: SharedService,
        private masterService: MasterService
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );

        this.initializeDates();
    }

    ngOnInit(): void {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });

        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            if (this.mosqueInfo != null) {
                this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid;
                this.mosqueName = this.mosqueInfo?.mosqueName;
                //this.qrData.mId = this.mosqueGuid;
                //this.qrAttData = JSON.stringify(this.qrData);
                //this.qrDonateData.mId = this.mosqueGuid;
                //this.qrDonate = JSON.stringify(this.qrDonateData);
                this.qrAttData = `https://isalaam.me/mosque/mms-ulink.html?mId=${this.mosqueGuid}&type=AF`;
                this.qrDonate = `https://isalaam.me/mosque/mms-ulink.html?mId=${this.mosqueGuid}&type=DN`;
            } else {
                this.callForMosqueData();
            }
        } else {
            this.callForMosqueData();
        }
    }
    callForMosqueData() {
        this.masterService.getMosqueQrData().subscribe((res: any) => {
            if (res?.result.success) {
                this.mosqueGuid = res?.result.data.mosqueContactGuid;
                this.mosqueName = res?.result.data.mosqueName;
            }
            //this.qrData.mId = this.mosqueGuid;
            //this.qrAttData = JSON.stringify(this.qrData);
            //this.qrDonateData.mId = this.mosqueGuid;
            //this.qrDonate = JSON.stringify(this.qrDonateData);
            this.qrAttData = `https://isalaam.me/mosque/mms-ulink.html?mId=${this.mosqueGuid}&type=AF`;
            this.qrDonate = `https://isalaam.me/mosque/mms-ulink.html?mId=${this.mosqueGuid}&type=DN&exp=${this.expiryDate}`;
        });
    }

    initializeDates() {
        const today = new Date();
        const expiry = new Date();
        expiry.setDate(today.getDate() + 15);
        //this.qrData.todayDate = today.toISOString().split('T')[0];
        //this.qrDonateData.todayDate = today.toISOString().split('T')[0];
        //this.qrDonateData.expiryDate = expiry.toISOString().split('T')[0];
    }

    saveAsImageMosqueQR(content: HTMLElement) {
        const mName = this.mosqueName.replace(/ /g, '_');
        const downloadButton = content.querySelector('button');
        if (downloadButton) {
            downloadButton.style.display = 'none';
        }
        html2canvas(content, {
            backgroundColor: '#f0f0f0',
            useCORS: true,
            scale: 2,
        }).then((canvas) => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = mName + '.png';
            link.click();
            if (downloadButton) {
                downloadButton.style.display = 'block';
            }
        });
    }
}
