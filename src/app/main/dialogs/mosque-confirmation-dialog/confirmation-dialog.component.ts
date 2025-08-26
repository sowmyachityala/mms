import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
    messageType: string;
    mosqueName: string;
    messageData: string;
    inputData: string;
    check = environment.imageEndPoints.checkIcon;
    alert = environment.imageEndPoints.alertIcon;
    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    ngOnInit(): void {
        if (this.data) {
            this.mosqueName = this.data?.mosqueName;
            this.messageData = this.data?.messageData;
            this.inputData = this.data?.inputData;
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    onActionClick(buttonInfo) {
        if (buttonInfo?.type === 'Cancel') {
            this.dialogRef.close();
        } else {
            this.dialogRef.close(true);
        }
    }
}
