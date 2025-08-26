import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateMosqueComponent } from '../add-update-mosque/add-update-mosque.component';
import { AuthService } from 'app/services/auth.service';
import { MinistryService } from 'app/services/ministry.service';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'environments/environment';
import { AssignAdministratorComponent } from '../assign-administrator/assign-administrator.component';
import { MosqueService } from 'app/services/mosque.service';
import { ToasterService } from 'app/services/toaster.service';
import { ConfirmationDialogComponent } from 'app/main/dialogs/mosque-confirmation-dialog/confirmation-dialog.component';
import { FuseAlertService } from '@fuse/components/alert';
import { SharedService } from 'app/services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';

@Component({
    selector: 'app-mosques',
    templateUrl: './mosques.component.html',
    styleUrls: ['./mosques.component.scss'],
})
export class MosquesComponent implements OnInit {
    isLoading = true;
    pageLength = 0;
    pageSize = 10;
    pageIndex = 1;
    imageEndPoints = environment.imageEndPoints;
    searchInputControl: FormControl = new FormControl();
    searchKey: string;
    assignText: any;
    dataSource: any = new MatTableDataSource<any>();
    displayedColumns = [
        'mosqueName',
        'mosqueAddress',
        'mosqueContactNumber',
        'mosqueEmail',
        'createdOn',
        'adminName',
        'mosqueStatus',
        'actions',
    ];
    isAuthenticated: boolean = false;
    mosquesList = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    direction: string = 'ltr';
    currentActions: any;
    mosqueLaunchURL = environment.mosqueLaunchURL;
    shareMosqueUri = environment.shareMosqueUri;
    searchForm: FormGroup;
    constructor(
        public dialog: MatDialog,
        private fuseAlertService: FuseAlertService,
        private authService: AuthService,
        private ministryService: MinistryService,
        private mosqueService: MosqueService,
        private toaster: ToasterService,
        private sharedService: SharedService,
        private sanitizer: DomSanitizer,
        private router: Router,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private clipboardService: ClipboardService,
        private fb: FormBuilder
    ) {
        if (this.router.url === '/ministry/mosques') {
            this.sharedService.setMosqueProfile(null);
        }
        //set default language
        translate.setDefaultLang(
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
        // this.assignText = `Administrator assigned to “+ ${'result?.result?.mosqueName'} +” successfully. And email notification sent to “+ ${'result?.result?.selectedUser'}”`;
        this.fuseAlertService.dismiss('assignAlert');
        // this.authService.check().subscribe((res) => {
        //   if (res) {
        //     this.isAuthenticated = true;
        //   }
        // });

        this.currentActions = this.sharedService.getCurrentPageActions();

        this.searchForm = this.fb.group({
            mosqueName: [''],
            mosqueStatus: [''],
            pageIndex: [],
            pageSize: [],
            isFilter: [false],
        });
        this.getAllMosquesList();
    }

    getAllMosquesList() {
        this.searchForm.patchValue({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
        });
        let formValue = this.searchForm.value;
        this.ministryService
            .getAllMosquesListWithFilter(formValue)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.mosquesList = res?.result?.data.items;
                    this.dataSource = new MatTableDataSource(
                        res?.result?.data.items
                    );
                    this.dataSource.paginator = this.paginator;
                    this.pageLength = res?.result?.data.totalCount;
                    setTimeout(() => {
                        this.paginator.pageIndex = this.pageIndex - 1;
                        this.paginator.length = this.pageLength;
                    });
                } else {
                    this.toaster.triggerToast({
                        type: 'info',
                        message: 'Info',
                        description: res?.result?.message,
                    });
                }
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.dataSource.filter = filterValue;
        this.searchKey = filterValue;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    addMosque() {
        const dialogRef = this.dialog.open(AddUpdateMosqueComponent, {
            panelClass: 'fullscreen-dialog',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.admin) {
                this.assignText = `Administrator assigned to “${result?.result?.mosqueName}” successfully. And email notification sent to “${result?.result?.selectedUser}”`;
                this.fuseAlertService.show('assignAlert');
                setTimeout(() => {
                    this.fuseAlertService.dismiss('assignAlert');
                }, 3000);
                this.getAllMosquesList();
            } else if (result) {
                this.getAllMosquesList();
            }
        });
    }

    editMosque(mosqueInfo) {
        const dialogRef = this.dialog.open(AddUpdateMosqueComponent, {
            panelClass: 'fullscreen-dialog',
            data: { mosqueGuid: mosqueInfo?.mosqueContactGuid },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getAllMosquesList();
            }
        });
    }

    assignAdmin(mosqueInfo) {
        if (!mosqueInfo?.mosqueStatus) {
            return;
        }
        const dialogRef = this.dialog.open(AssignAdministratorComponent, {
            panelClass: 'fullscreen-dialog',
            data: {
                mosqueGuid: mosqueInfo?.mosqueContactGuid,
                mosqueName: mosqueInfo?.mosqueName,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.assignText =
                    'Administrator assigned to “ ' +
                    result?.mosqueName +
                    ' ” successfully. And email notification sent to “' +
                    result?.selectedUser +
                    '”';
                this.fuseAlertService.show('assignAlert');
                setTimeout(() => {
                    this.fuseAlertService.dismiss('assignAlert');
                }, 3000);
                this.getAllMosquesList();
            }
        });
    }

    confirmDeactiveMosque(mosqueInfo, flagType) {
        if (flagType == 'Active') {
            this.deactiveMosque(mosqueInfo, flagType);
        } else {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                maxWidth: '550px',
                // height:'auto',
                data: {
                    mosqueGuid: mosqueInfo?.mosqueContactGuid,
                    mosqueName: mosqueInfo?.mosqueName,
                    isCreate: true,
                    iconType: environment.imageEndPoints.alertIcon,
                    buttons: [
                        {
                            type: 'Cancel',
                            label: 'Cancel',
                        },
                        {
                            color: 'primary',
                            type: 'Confirm',
                            label: 'Yes, Confirm',
                            buttonClass: 'ml-2',
                        },
                    ],
                },
            });
            dialogRef.componentInstance.messageType = 'DELETE';
            dialogRef.afterClosed().subscribe((res) => {
                if (res) {
                    this.deactiveMosque(mosqueInfo, flagType);
                }
            });
        }
    }

    deactiveMosque(mosqueInfo, flagType) {
        this.mosqueService
            .deactivateMosque(mosqueInfo?.mosqueContactGuid, flagType)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.toaster.triggerToast({
                            type: 'success',
                            message: 'Success',
                            description: res?.result?.message,
                        });
                        this.getAllMosquesList();
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
                        description: 'Something went wrong, Please try again!',
                    });
                }
            );
    }

    dismiss(name: string): void {
        this.fuseAlertService.dismiss(name);
    }

    onPageChange(event: any): void {
        this.pageIndex = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.getAllMosquesList();
    }

    launchMosque(mosqueGuid) {
        window.open(this.mosqueLaunchURL + mosqueGuid, '_blank');
        //window.open('/mmsdev/dashboard/' + mosqueGuid, '_blank');
    }

    sendEmail(emailId: string) {
        // Replace 'mailto' with the appropriate email client's URI if needed
        const mailtoLink = `mailto:${emailId}?subject=${'encodedSubject'}&body=${'encodedBody'}`;
        window.location.href = mailtoLink;
        return this.sanitizer.bypassSecurityTrustUrl(mailtoLink);
    }

    shareSiteUri(mosque) {
        const mosqueGuid = mosque?.mosqueContactGuid;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            maxWidth: '550px',
            // height:'auto',
            data: {
                inputData: `${this.shareMosqueUri}${mosqueGuid}`,
                isCreate: true,
                iconType: environment.imageEndPoints.checkIcon,
                buttons: [
                    {
                        color: 'primary',
                        type: 'Confirm',
                        label: 'Yes, Copy',
                    },
                    {
                        type: 'Cancel',
                        label: 'No, Thank you',
                        buttonClass: 'ml-2',
                    },
                ],
            },
        });
        dialogRef.componentInstance.messageType = 'INFO';
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.copyUrlToClipboard(mosqueGuid);
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: 'Site url copied successfully.',
                });
            }
        });
    }

    copyUrlToClipboard(mosqueGuid) {
        const fullUrl = `${this.shareMosqueUri}${mosqueGuid}`;
        this.clipboardService.copyFromContent(fullUrl);
    }

    ResetList() {
        this.pageSize = 10;
        this.pageIndex = 1;
        this.searchForm.patchValue({
            mosqueName: '',
            mosqueStatus: null,
            isFilter: false,
        });
        this.getAllMosquesList();
    }
    SearchFilter() {
        this.searchForm.patchValue({
            isFilter: true,
        });
        this.getAllMosquesList();
    }
}
