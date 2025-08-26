import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';

@Component({
    selector: 'app-menu-mapping',
    templateUrl: './menu-mapping.component.html',
    styleUrls: ['./menu-mapping.component.scss'],
})
export class MenuMappingComponent {
    isLoading = true;
    pageLength = 7;
    pageSize = 10;
    searchKey: string;
    searchInputControl: FormControl = new FormControl();
    dataSource: any = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns = [
        'roleName',
        'roleDescription',
        'assignedParentCount',
        'action',
    ];
    rolesList = [];
    allRoles = true;
    allMenu = false;
    userRoleName: string = '';
    userRoleId: string = '';
    assignText = '';
    dataSourceMenu: any = new MatTableDataSource<any>();
    searchInputControlMenu: FormControl = new FormControl();
    displayedMenuColumns = [
        'menuName',
        'menuDescription',
        'displayOrder',
        'assignedChildCount',
        'isAssigned',
        'action',
    ];
    menusList = [];

    allChildMenu = false;
    childMenusList = [];
    parentMenuName = '';
    searchInputControlChildMenu: FormControl = new FormControl();
    displayedChildMenuColumns = [
        'menuName',
        'menuDescription',
        'displayOrder',
        'isAssigned',
        'action',
    ];
    dataSourceChildMenu: any = new MatTableDataSource<any>();

    businessActions = false;
    businessActionsList = [];
    menuGuid = '';
    menuId = 0;
    menuName = '';
    childMenuName = '';
    mId = 0;
    searchInputControlAction: FormControl = new FormControl();
    displayedActionsColumns = [
        'name',
        'description',
        'displayOrder',
        'isAssigned',
    ];
    dataSourceActions: any = new MatTableDataSource<any>();

    constructor(
        private userService: UserManagementService,
        private toaster: ToasterService,
        private _fuseConfirmationService: FuseConfirmationService,
        private dialog: MatDialog,
        private fuseAlertService: FuseAlertService,
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

    menuRole(RoleId: string, RoleName: string): void {
        this.allRoles = false;
        this.allChildMenu = false;
        this.allMenu = true;
        this.businessActions = false;
        this.userRoleName = RoleName;
        this.userRoleId = RoleId;
        this.userService.getMenuBasedOnRoleId(RoleId).subscribe((res: any) => {
            if (res?.result?.success) {
                this.menusList = res?.result?.data;
                this.dataSourceMenu = new MatTableDataSource(res?.result?.data);
                this.dataSourceMenu.paginator = this.paginator;
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

    applyFilterMenu(filterValue: string) {
        this.dataSourceMenu.filter = filterValue.trim().toLowerCase();
        this.dataSourceMenu.filter = filterValue;
        this.searchKey = filterValue;
        if (this.dataSourceMenu.paginator) {
            this.dataSourceMenu.paginator.firstPage();
        }
    }

    updateRoleMenu(
        isAssigned: boolean,
        data: any,
        index: number,
        flag: string
    ): void {
        let AssignUnassign = isAssigned === true ? 'Assign' : 'Unassign';
        const confirmation = this._fuseConfirmationService.open({
            title: AssignUnassign,
            message:
                'Are you sure, you want to ' +
                ' ' +
                AssignUnassign +
                ' ' +
                'business action',
            actions: {
                confirm: {
                    label: 'Ok',
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                let body = {
                    roleId: this.userRoleId,
                    menuId: data.menuId,
                    menuGuid: data.menuGuid,
                    menuAction: data.menuName,
                    menuActionId: data.menuDescription,
                    isActive: data.isActive,
                    actionId: null,
                };
                if (!data.isAssigned) {
                    this.addNewRoleMenuAction(body, flag);
                } else {
                    this.deleteRoleMenusActions(
                        this.userRoleId.toString(),
                        data.menuGuid.toString(),
                        null,
                        flag
                    );
                }
            } else {
                if (flag == 'P') {
                    this.menuRole(this.userRoleId, this.userRoleName);
                }
                if (flag == 'C') {
                    this.childMenus(this.mId, this.parentMenuName);
                }
            }
        });
    }

    addNewRoleMenuAction(body: any, flag: string) {
        this.userService.addNewRoleMenuAction(body).subscribe((res: any) => {
            if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
                //window.location.reload();
                if (flag == 'P') {
                    this.menuRole(this.userRoleId, this.userRoleName);
                }
                if (flag == 'C') {
                    this.childMenus(this.mId, this.parentMenuName);
                }
                if (flag == 'A') {
                    this.getAllBusinessActions(body?.menuGuid);
                }
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }

    deleteRoleMenusActions(userRoleId, menuGuid, actionGuid, flag) {
        this.userService
            .deleteRoleMenusActions(userRoleId, menuGuid, actionGuid)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    //window.location.reload();
                    if (flag == 'P') {
                        this.menuRole(this.userRoleId, this.userRoleName);
                    }
                    if (flag == 'C') {
                        this.childMenus(this.mId, this.parentMenuName);
                    }
                    if (flag == 'A') {
                        this.getAllBusinessActions(menuGuid);
                    }
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }

    backToRoles(): void {
        this.allMenu = false;
        this.allChildMenu = false;
        this.businessActions = false;
        this.allRoles = true;
        this.parentMenuName = '';
        this.childMenuName = '';
        this.getAllRolesList();
    }

    backToMainMenu(): void {
        this.allChildMenu = false;
        this.allRoles = false;
        this.businessActions = false;
        this.allMenu = true;
        this.parentMenuName = '';
        this.childMenuName = '';
        this.menuRole(this.userRoleId, this.userRoleName);
    }

    backToChildMenu(): void {
        this.businessActions = false;
        this.allRoles = false;
        this.allMenu = false;
        this.allChildMenu = true;
    }

    childMenus(menuId, menuName): void {
        this.mId = menuId;
        this.parentMenuName = menuName;
        this.allRoles = false;
        this.allMenu = false;
        this.businessActions = false;
        this.allChildMenu = true;
        this.userService
            .getChildMenuforParent(this.mId, this.userRoleId)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.childMenusList = res?.result?.data;
                    this.dataSourceChildMenu = new MatTableDataSource(
                        res?.result?.data
                    );
                    this.dataSourceChildMenu.paginator = this.paginator;
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

    applyFilterChildMenu(filterValue: string) {
        this.dataSourceChildMenu.filter = filterValue.trim().toLowerCase();
        this.dataSourceChildMenu.filter = filterValue;
        this.searchKey = filterValue;
        if (this.dataSourceChildMenu.paginator) {
            this.dataSourceChildMenu.paginator.firstPage();
        }
    }
    addBusinessActions(menuGuid, menuName, menuId) {
        this.allRoles = false;
        this.allMenu = false;
        this.allChildMenu = false;
        this.businessActions = true;
        this.menuGuid = menuGuid;
        this.menuName = menuName;
        this.menuId = menuId;
        if (this.parentMenuName === '') {
            this.parentMenuName = menuName;
        } else {
            this.childMenuName = menuName;
        }
        this.getAllBusinessActions(this.menuGuid);
    }

    getAllBusinessActions(menuGuid) {
        this.userService
            .getBusinessActions(this.userRoleId, menuGuid)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.businessActionsList = res?.result?.data;
                    this.dataSourceActions = new MatTableDataSource(
                        res?.result?.data
                    );
                    this.dataSourceActions.paginator = this.paginator;
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

    updateRoleMenuAction(
        isAssigned: boolean,
        data: any,
        flag: string,
        index: number
    ): void {
        let AssignUnassign = isAssigned === true ? 'Assign' : 'Unassign';
        let menuActionName = data?.name;
        let isActive = data?.isActive;
        let actionId = data?.id;
        let actionGuid = data?.actionGuid;
        const confirmation = this._fuseConfirmationService.open({
            title: AssignUnassign,
            message:
                'Are you sure, you want to ' +
                ' ' +
                AssignUnassign +
                ' ' +
                'business action',
            actions: {
                confirm: {
                    label: 'Ok',
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                let body = {
                    roleId: this.userRoleId,
                    menuId: this.menuId,
                    menuGuid: this.menuGuid,
                    menuAction: menuActionName,
                    menuActionId: menuActionName,
                    isActive: isActive,
                    actionId: actionId,
                };
                if (isAssigned) {
                    this.addNewRoleMenuAction(body, flag);
                } else {
                    this.deleteRoleMenusActions(
                        this.userRoleId,
                        this.menuGuid,
                        actionGuid,
                        flag
                    );
                }
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Cancel',
                    description: 'Cancel the business action ' + AssignUnassign,
                });
                //this.checked[index] = isAssigned === true ? false : true;
                //this.toaster.triggerToast({ type: 'error', message: 'Cancel', description: 'Cancel the business action Assign/Unassign' });
                this.getAllBusinessActions(this.menuGuid);
            }
        });
    }

    addNewRoleBusinessMenuAction(body: any) {
        this.userService.addNewRoleMenuAction(body).subscribe((res: any) => {
            if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
                this.getAllBusinessActions(this.menuGuid);
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }

    deleteRoleBusinessMenusActions(userRoleId, menuGuid, actionGuid) {
        this.userService
            .deleteRoleMenusActions(userRoleId, menuGuid, actionGuid)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    this.getAllBusinessActions(this.menuGuid);
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }
}
