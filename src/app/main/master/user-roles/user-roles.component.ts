import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CustomPaginator } from 'app/CustomPaginator';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';

@Component({
    selector: 'app-user-roles',
    templateUrl: './user-roles.component.html',
    styleUrls: ['./user-roles.component.scss'],
    providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }],
})
export class UserRolesComponent {
    isLoading = true;
    searchKey: string;
    pageLength = 7;
    pageSize = 10;
    rolesList = [];
    dataSource: any = new MatTableDataSource<any>();
    searchInputControl: FormControl = new FormControl();
    roleInfoForm: FormGroup;
    isUpdate: boolean = false;
    displayedColumns = [
        'roleName',
        'roleDescription',
        'priorityIndex',
        'updatedOn',
        'action',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('roleInfoDialog', { static: true })
    roleInfoDialog: TemplateRef<any>;
    roles = true;
    currentActions: any;
    direction: string = 'ltr';
    AccessLevels = [];

    constructor(
        private userService: UserManagementService,
        private toaster: ToasterService,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private sharedService: SharedService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private authService: AuthService,
        private _router: Router
    ) {
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
        this.roleInfoForm = this.fb.group({
            id: [''],
            roleGuid: [''],
            name: ['', Validators.required],
            description: [''],
            priorityIndex: [0, Validators.required],
            accessId: ['', Validators.required],
        });
        this.currentActions = this.sharedService.getCurrentPageActions();
        this.getAllRolesList();
    }

    getAllRolesList() {
        this.userService.getAllRolesNew().subscribe((res: any) => {
            if (res?.result?.success) {
                this.rolesList = res?.result?.data;
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

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.dataSource.filter = filterValue;
        this.searchKey = filterValue;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    pageChangeEvent(event) {
        event;
    }

    closeDialog(): void {
        this.dialog.closeAll();
    }

    addUserRole(): void {
        this.roleInfoForm.reset();
        this.isUpdate = false;
        this.GetAccessLevels();
        this.dialog.open(this.roleInfoDialog);
    }

    addOrUpdateAction() {
        if (this.roleInfoForm.invalid) {
            return true;
        }
        let body = this.roleInfoForm?.value;
        this.userService.addOrUpdateRole(body).subscribe((res: any) => {
            if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
                this.dialog.closeAll();
                this.getAllRolesList();
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }

    editRole(data) {
        this.isUpdate = true;
        //this.roleInfoForm.patchValue(data);
        this.roleInfoForm.patchValue({
            id: data?.roleId,
            name: data?.roleName,
            description: data?.roleDescription,
            priorityIndex: data?.priorityIndex,
            accessId: data?.accessLevel,
        });

        this.GetAccessLevels();
        this.dialog.open(this.roleInfoDialog);
    }

    GetAccessLevels() {
        this.sharedService.GetRoleAccessLevel().subscribe((res: any) => {
            if (res?.result?.success) {
                this.AccessLevels = res?.result?.data;
            }
        });
    }
}
