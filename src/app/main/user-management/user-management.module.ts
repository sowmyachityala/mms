import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { CreateUpdateUserComponent } from './create-update-user/create-update-user.component';
import { RouterModule } from '@angular/router';
import { UserManagementRoutes } from './user-management-routing';
import { SharedModule } from 'app/shared/shared.module';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { MenuMappingComponent } from './menu-mapping/menu-mapping.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { FcmDeviceComponent } from './fcm-device/fcm-device.component';
import { ImamProfileComponent } from './imam-profile/imam-profile.component';
import { ViewImamProfileComponent } from './view-imam-profile/view-imam-profile.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    UsersComponent,
    CreateUpdateUserComponent,
    ProfileSettingsComponent,
    MenuMappingComponent,
    UserActivityComponent,
    FcmDeviceComponent,
    ImamProfileComponent,
    ViewImamProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UserManagementRoutes),
    SharedModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class UserManagementModule { }
