import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';

@Component({
    selector: 'app-today-attendies',
    templateUrl: './today-attendies.component.html',
    styleUrl: './today-attendies.component.scss',
})
export class TodayAttendiesComponent {
    attendiesList = [];
    isLoading = true;
    searchKey: string;
    pageLength = 0;
    pageSize = 10;
    searchInputControl: FormControl = new FormControl();
    dataSource: any = new MatTableDataSource<any>();
    displayedColumns = [
        'fullName',
        'email',
        'phoneNumber',
        'prayerName',
        'prayeredDate',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    isUpdate: boolean = false;
    currentActions: any;
    direction: string = 'ltr';
    mosqueGuid: string = '';

    constructor(
        private sharedService: SharedService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private userService: UserManagementService,
        private toaster: ToasterService,
        public dialogRef: MatDialogRef<TodayAttendiesComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    ngOnInit() {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });

        this.currentActions = this.sharedService.getCurrentPageActions();
        if (this.data && this.data.mosqueGuid !== undefined) {
            this.mosqueGuid = this.data?.mosqueGuid;
        }
        this.GetTodayAttendies();
    }

    pageChangeEvent(event) {
        event;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.dataSource.filter = filterValue;
        this.searchKey = filterValue;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    GetTodayAttendies() {
        this.userService
            .getTodayAttendiesForMosque(this.mosqueGuid)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.attendiesList = res?.result?.data;
                    this.dataSource = new MatTableDataSource(res?.result?.data);
                    this.dataSource.paginator = this.paginator;
                    this.pageLength = res?.result?.data?.length;
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }
    onClose() {
        this.dialogRef.close(true);
    }
}
