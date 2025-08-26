import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MosqueService } from 'app/services/mosque.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
    selector: 'app-assign-administrator',
    templateUrl: './assign-administrator.component.html',
    styleUrls: ['./assign-administrator.component.scss'],
})
export class AssignAdministratorComponent implements OnInit {
    searchText: string = '';
    mosqueGuId: any;
    searchUsersList = [];
    selectedUser: any[] = [];
    roles: any[];
    selectedRole: string = '';
    isLoading: boolean;
    memberInfoForm: FormGroup;
    rolesList = [];
    unAsssignUsers = [];
    filteredUsersList: any;
    filteredUsers: Observable<any[]>;
    userFilterCtrl = new FormControl();
    mosqueName: string;

    constructor(
        public dialogRef: MatDialogRef<AssignAdministratorComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private mosqueService: MosqueService,
        private userService: UserManagementService,
        private toaster: ToasterService,
        private fb: FormBuilder,
        public sharedService: SharedService
    ) {}

    ngOnInit(): void {
        if (this.data?.mosqueGuid) {
            (this.mosqueGuId = this.data?.mosqueGuid),
                (this.mosqueName = this.data?.mosqueName);
        }

        this.memberInfoForm = this.fb.group({
            keyRoleId: [''],
            selectedUserId: ['', Validators.required],
            mosqueGuid: [this.mosqueGuId],
        });

        //this.getAllRoles();
        this.getAllRolesList();
    }

    getUnAssignedAdminsForMosque(userRoleId) {
        this.userService
            .getUnAssignedAdminsForMosque(this.mosqueGuId, userRoleId)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.unAsssignUsers = res?.result?.data;
                    this.filteredUsers = this.userFilterCtrl.valueChanges.pipe(
                        startWith(''),
                        map((value) => this._filterUsersList(value))
                    );
                    if (this.unAsssignUsers.length == 0) {
                        this.toaster.triggerToast({
                            type: 'info',
                            message: 'Info',
                            description:
                                'No UnAssigned users for selected role',
                        });
                    }
                }
            });
    }

    private _filterUsersList(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.unAsssignUsers.filter((type) =>
            type.fullName.toLowerCase().includes(filterValue)
        );
    }

    getAllRolesList() {
        this.userService.getAllRolesNew().subscribe((res: any) => {
            if (res?.result?.success) {
                this.rolesList = res?.result?.data;
            }
        });
    }
    selectedAdminUser(userIdToFilter) {
        this.filteredUsersList = this.unAsssignUsers.filter(
            (user) => user.userId === userIdToFilter
        )[0];
    }
    getAllRoles() {
        this.isLoading = true;
        this.userService.getAllRoles().subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.roles = res?.result?.data;
                } else {
                    this.isLoading = false;
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            },
            (err) => {
                this.isLoading = false;
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Error',
                    description: 'Something went wrong, Please try again!',
                });
            }
        );
    }

    onClose() {
        this.dialogRef.close();
    }

    searchAdminUsers() {
        this.mosqueService
            .searchUsersForMosqueAdminAssigning(
                this.mosqueGuId,
                this.searchText
            )
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.searchUsersList = res?.result?.data;
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }

    selectUserToAssignAdmin(event, userInfo) {
        if (event?.checked) {
            if (this.selectedRole) {
                userInfo.roleGuid = this.roles
                    .filter((x) => x.name === this.selectedRole)
                    .map((x) => x.roleGuid)?.[0];
            }
            this.selectedUser.push(userInfo);
        } else {
            this.selectedUser = [];
        }
    }

    assignRoleToSelectedUser(event) {
        this.selectedRole = event?.name;
        this.selectedUser?.length > 0
            ? this.selectedUser.map((x) => (x.roleGuid = event?.roleGuid))
            : null;
    }
    assignAdminForMosque() {
        if (this.memberInfoForm.invalid) {
            return true;
        }
        let body = this.memberInfoForm?.value;
        this.mosqueService.assignAdminForMosque(body).subscribe((res: any) => {
            if (res.result.success) {
                this.dialogRef.close({
                    mosqueName: this.filteredUsersList?.mosqueName,
                    selectedUser: this.filteredUsersList?.email,
                });
            }
        });
    }
    assignAdministrator() {
        if (!this.selectedUser?.[0]?.roleGuid) {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: 'Please select any role to assign',
            });
            return;
        }
        this.mosqueService.assignAdminToMosque(this.selectedUser[0]).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.dialogRef.close({
                        mosqueName: this.mosqueName,
                        selectedUser: this.selectedUser[0]?.email,
                    });
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            },
            (err) => {
                if (err?.error?.status === 400) {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: err?.error?.errors?.userId[0],
                    });
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: 'Something went wrong, please try again !',
                    });
                }
            }
        );
    }
}
