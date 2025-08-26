import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'app/services/auth.service';
import { UserManagementService } from 'app/services/user-management.service';
import { CreateUpdateUserComponent } from '../create-update-user/create-update-user.component';
import { environment } from 'environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { ToasterService } from 'app/services/toaster.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'app/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  isLoading = true;  pageLength = 0;  pageSize = 10; pageIndex =1;
  userType: boolean = false;  imageEndPoints = environment.imageEndPoints;
  //searchInputControl: FormControl = new FormControl();
  dataSource: any = new MatTableDataSource<any>;
  displayedColumns = ["fullName", "phoneNumber", 'email','userRole', "createdOn","updatedOn","deviceCount","status","actions"];
  isAuthenticated: boolean = false;  usersList = []; rolesList=[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  usersChecked = false;  direction: string = 'ltr';currentActions:any;
  roleSwitchForm: FormGroup;  searchUsersForm: FormGroup;
  @ViewChild('roleSwicthDialog', { static: true }) roleSwicthDialog: TemplateRef<any>;

  constructor(public dialog: MatDialog, private authService: AuthService, private userService: UserManagementService, private toaster: ToasterService, private _fuseConfirmationService: FuseConfirmationService,
    private translateSerive:LanguageTranslateService,private translate: TranslateService,private sharedService: SharedService, private fb: FormBuilder,private _router: Router) {
      //set default language
      translate.setDefaultLang(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));
    
      
     }

  ngOnInit(): void {
    this.authService.check().subscribe((res) => {
      if (res) {
        this.isAuthenticated = true;
      }
    });
    this.roleSwitchForm = this.fb.group({
      contactGuid: ['', Validators.required],
      userName: [''],
      userCurrentRole: [''],
      currentRoleId:[],
      switchRoleId: ['', Validators.required]
    });
    this.currentActions = this.sharedService.getCurrentPageActions();

    this.searchUsersForm = this.fb.group({
      emailId: [''],//,[Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]
      phoneNumber: [''],
      fullName: [''],
      roleName: [''],
      userStatus:[],
      pageIndex: [],
      pageSize: [],
      isFilter: [false],
    });

    this.getAllUsers();
    this.getAllRolesList();
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex + 1; 
    this.pageSize = event.pageSize; 
    this.getAllUsers();  
  }

  redirectToEmail(emailId: string): void {
    // Replace 'mailto' with the appropriate email client's URI if needed
    window.location.href = `mailto:${emailId}`
    window.location.href = `mailto:${emailId}`;
  }

  getAlternateUsers(event) {
    if (!event?.checked) {
      this.displayedColumns.push('actions')
    }
    else {
      //this.displayedColumns?.splice(4, 1)
      this.displayedColumns.splice(this.displayedColumns.length-1, 1);
    }
    this.userType = event?.checked;
    this.dataSource = new MatTableDataSource(event?.checked ? this.usersList.filter(x => x.isMosqueAdmin === event?.checked) : this.usersList);
    //this.dataSource = new MatTableDataSource(this.usersList.filter(x => x.isMosqueAdmin === event?.checked));
    this.dataSource.paginator = this.paginator;
    this.pageLength = event?.checked ? this.usersList.filter(x => x.isMosqueAdmin === event?.checked)?.length : this.usersList?.length;
    //this.pageLength = this.usersList.filter(x => x.isMosqueAdmin === event?.checked)?.length;
  }
  
  SearchUsersFilter(){
    this.searchUsersForm.patchValue({
      isFilter: true,
    });
    this.getAllUsers();
  }

  ResetUsersList(){
    this.pageSize = 10; this.pageIndex =1;
    this.searchUsersForm.patchValue({
      emailId: '',
      phoneNumber: '',
      fullName: '',
      roleName:'',
      userStatus:null,
      isFilter: false,
    });
    this.getAllUsers();
  }

  getAllUsers() { 
    this.searchUsersForm.patchValue({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    });
    let formValue = this.searchUsersForm.value;
    this.userService.getAllUsersList(formValue).subscribe((res: any) => {
      if (res?.result?.success) {
        this.usersList = res?.result?.data;      
        //this.dataSource = new MatTableDataSource(this.usersList.filter(x => x.isMosqueAdmin === this.userType));
        this.dataSource = new MatTableDataSource(this.usersList);
        this.dataSource.paginator = this.paginator;
        //this.pageLength = res?.result?.data.filter(x => x.isMosqueAdmin === false)?.length;
        //this.pageLength = res?.result?.data?.length;
        this.pageLength = res?.result?.data[0].totalCount
        setTimeout(() => {
          this.paginator.pageIndex = this.pageIndex-1;
          this.paginator.length = this.pageLength;
        });
        
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    })
  }

  confirmDeactiveUser(userDetails, type) {
    const confirmation = this._fuseConfirmationService.open({
      title: type === 'activate' ? 'Activate' : type === 'deactivate' ? 'Deactivate' : '',
      message: "Are you sure, you want to " + ' ' + type + ' ' + 'user',
      actions: {
        confirm: {
          label: 'Ok'
        }
      }
    });
    confirmation.afterClosed().subscribe(res => {
      if (res === 'confirmed') {
        type === 'activate' ? this.updateUserStatus(userDetails?.contactGuid, type, '9381a6ec-8e33-46eb-b52d-cc7fa688d437') : type === 'deactivate' ? this.updateUserStatus(userDetails?.contactGuid, type, '3022f59c-6676-4f6f-aded-7cf4fb9971a9') : null;
      }
    })
  }

  updateUserStatus(userId, type, actionId) {
    this.isLoading = true;
    this.userService.updateUserStatus(userId, actionId).subscribe((res: any) => {
      if (res?.result?.success) {
        this.toaster.triggerToast({ type: 'error', message: type === 'activate' ? 'Activated' : type === 'deactivate' ? 'Deactivated' : '', description: 'User' + type === 'activate' ? 'Activated' : type === 'deactivate' ? 'Deactivated' : '' + 'successfully' });
        this.getAllUsers();
      } else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
      this.isLoading = false;
    },
      err => {
        this.isLoading = false;
        this.toaster.triggerToast({ type: 'error', message: 'Internal error', description: 'Something went wrong, please try again !' });
      })
  }

  editMosque(userInfo) {
    const dialogRef = this.dialog.open(CreateUpdateUserComponent,
      {
        panelClass: 'fullscreen-dialog',
        data: { mosqueGuid: userInfo }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUsers();
      }
    });
  }

  swithUserRole(data){
    this.roleSwitchForm.reset();
    this.roleSwitchForm.patchValue({
      contactGuid:data?.contactGuid,
      userName:data?.fullName,
      userCurrentRole:data?.roleName,
      currentRoleId:data?.roleId
    });
    //this.getAllRolesList();
    this.dialog.open(this.roleSwicthDialog);
  }

  getAllRolesList() {
    this.userService.getAllRolesNew().subscribe((res: any) => {
        if (res?.result?.success) {
            this.rolesList = res?.result?.data;
            this.rolesList.sort((a, b) => a.roleName.localeCompare(b.roleName));
        } 
    });
  }
  UpdateUserRole(){
    if (this.roleSwitchForm.invalid) {
      return true;
    }   
    let body = this.roleSwitchForm?.value;
    this.userService.switchUserRole(body).subscribe((res:any)=>{
      if (res?.result?.success) {
        this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
        this.dialog.closeAll();
        this.getAllUsers();
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
       
      }
    });
  };

  closeDialog():void{
    this.dialog.closeAll();
  };

}
