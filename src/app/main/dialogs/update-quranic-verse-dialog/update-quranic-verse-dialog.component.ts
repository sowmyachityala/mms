import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';

@Component({
    selector: 'app-update-quranic-verse-dialog',
    templateUrl: './update-quranic-verse-dialog.component.html',
    styleUrls: ['./update-quranic-verse-dialog.component.scss'],
})
export class UpdateQuranicVerseDialogComponent {
    direction: string = 'ltr';
    quranicVerseForm: FormGroup;
    constructor(
        public dialogRef: MatDialogRef<UpdateQuranicVerseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private formBuilder: FormBuilder,
        private sharedService: SharedService,
        private toaster: ToasterService,
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

    ngOnInit() {
        this.quranicVerseForm = this.formBuilder.group({
            widgetGuid: ['', Validators.required],
            widgetHeader: ['', Validators.required],
            widgetBody: ['', Validators.required],
            widgetReference: ['', Validators.required],
            widgetType: [''],
        });
        if (this.data?.quranicDetails) {
            this.quranicVerseForm.patchValue(this.data?.quranicDetails);
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    onActionClick(buttonInfo) {
        if (buttonInfo?.type === 'Cancel') {
            this.dialogRef.close();
        } else {
            this.updateVerseOfTheDay();
            // this.dialogRef.close(true);
        }
    }

    updateVerseOfTheDay() {
        this.sharedService
            .updateVerseOfTheDay(this.quranicVerseForm.value)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.dialogRef.close(true);
                }
            });
    }
}
