import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { AuthService } from 'app/services/auth.service';
import { SharedService } from 'app/services/shared.service';
import { CommonBaseClass } from 'app/shared/common-abstract-class';
import { AddKeyMemberComponent } from '../add-key-member/add-key-member.component';
import { MosqueService } from 'app/services/mosque.service';
import { ToasterService } from 'app/services/toaster.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-key-members',
    templateUrl: './key-members.component.html',
    styleUrls: ['./key-members.component.scss'],
})
export class KeyMembersComponent extends CommonBaseClass implements OnInit {
    keyMembersList = [];
    assignText = '';
    searchInputControl: FormControl = new FormControl();
    isLoading: boolean = false;
    direction: string = 'ltr';
    mosqueLinkInfo: any;
    mosqueGuId: any;

    constructor(
        public authService: AuthService,
        public sharedService: SharedService,
        private fuseAlertService: FuseAlertService,
        private dialog: MatDialog,
        private mosqueService: MosqueService,
        private toaster: ToasterService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        public cdRef: ChangeDetectorRef
    ) {
        super(authService, sharedService);
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    ngOnInit(): void {
        this.fuseAlertService.dismiss('assignAlert');
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
        this.getAllKeymembers();
    }

    ngAfterViewInit(): void {
        this.cdRef.detectChanges();
    }

    getAllKeymembers() {
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

    applyFilter(filterValue) {
        if (filterValue) {
            const filteredArray = this.keyMembersList.filter((obj) => {
                // Check if any property value matches the search value
                return Object.values(obj).some(
                    (value) =>
                        typeof value === 'string' &&
                        value.toLowerCase().includes(filterValue.toLowerCase())
                );
            });
            this.keyMembersList = filteredArray;
        }
    }

    addNewKeyMember() {
        const dialogRef = this.dialog.open(AddKeyMemberComponent, {
            panelClass: 'fullscreen-dialog',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // this.assignText = `Key member added to  “${result?.result?.mosqueName}” successfully`;
                // this.fuseAlertService.show('assignAlert');
                // setTimeout(() => {
                //   this.fuseAlertService.dismiss('assignAlert');
                // }, 3000);
                this.getAllKeymembers();
            } else if (result) {
                this.getAllKeymembers();
            }
        });
    }
}
