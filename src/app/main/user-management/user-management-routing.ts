import { Route } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { MenuMappingComponent } from './menu-mapping/menu-mapping.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { RoleGuard } from 'app/core/auth/guards/role.guard';

export const UserManagementRoutes: Route[] = [
    {
        path     : '',
        children : [
            // {
            //     path :'',
            //     component : UsersComponent
            // },
            {
                path :'registeredusers',
                component : UsersComponent,                
                canActivate :   [RoleGuard],
                data        :   { expectedRoles:  ['SUPER ADMIN','MINISTRY ADMIN'] }
            },
            {
                path     : 'profilesettings',
                component: ProfileSettingsComponent
            },
            {
                path     : 'menumapping',
                component: MenuMappingComponent,               
                canActivate :   [RoleGuard],
                data        :   { expectedRoles:  ['SUPER ADMIN','MINISTRY ADMIN'] }
            },{
                path      : 'useractivity',
                component : UserActivityComponent
            }
        ]
        
    },
   
   
];
