import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { User } from 'app/core/user/user.types';
import { AuthService } from 'app/services/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { SharedService } from 'app/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileSettingsComponent } from 'app/main/user-management/profile-settings/profile-settings.component';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Subject, Subscription, switchMap } from 'rxjs';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { UserActivityComponent } from 'app/main/user-management/user-activity/user-activity.component';
import { UserManagementService } from 'app/services/user-management.service';
import { ToasterService } from 'app/services/toaster.service';
import { ImamProfileComponent } from 'app/main/user-management/imam-profile/imam-profile.component';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
})
export class UserComponent implements OnInit, OnDestroy {
    direction: string = 'ltr';
    isAuthenticated: boolean = false;
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    profileImageUrl: string = '';
    private subscription: Subscription;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private sharedService: SharedService,
        private _authService: AuthService,
        private dialog: MatDialog,
        private _navigationService: NavigationService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private userService: UserManagementService,
        private toaster: ToasterService
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
        this._authService.check().subscribe((res) => {
            if (res) {
                this.isAuthenticated = true;
                this.user = AuthUtils._decodeToken(
                    localStorage.getItem('isalaamAccessToken')
                );
                this.user.roleName = JSON.parse(
                    this.user?.roleObject
                )?.[0]?.RoleName.toUpperCase();
                // this.user = AuthUtils._decodeToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImdvcGlrcmlzaG5hIiwidXNlcklkIjoiVVNFUjAwMDAwMyIsInJvbGVJZCI6IjM0MDU3MzE2LTNkN2YtNDExYS1hNzEzLTA3ZDg1YTEyMDc5NSIsImVtYWlsIjoiZ29waWtyaXNobmEubmFycmFAb3V0bG9vay5jb20iLCJsYXN0TG9nZ2VkSW4iOiIyMDIzLTA2LTE5VDE3OjAzOjQ4IiwiY29udGFjdEd1aWQiOiI1OTIzNDdlNS0zZTM1LTQzMzItOWJmYy1lMThmZThmZmQzZGYiLCJyb2xlTmFtZSI6Ik1vc3F1ZSBBZG1pbiIsIm5iZiI6MTY4NzE3NDQ5MSwiZXhwIjoxNjg3MTgxNjkxLCJpYXQiOjE2ODcxNzQ0OTEsImlzcyI6ImFncy5jb20ifQ.Mq67mDX3pokDUQODQHS87_pY-h39M1P1Qmnv")
                // this.user = JSON.parse(this._authService.loggedUserDetails)?.data
                this.getUserProfileDetails();
            }
        });

        this.subscription = this.sharedService.profileImageUrl$.subscribe(
            (url: string) => {
                this.profileImageUrl = `${url}?t=${new Date().getTime()}`;
                this._changeDetectorRef.detectChanges();
            }
        );
    }

    signIn() {
        this._router.navigate(['/sign-in']);
    }

    signUp() {
        this._router.navigate(['/sign-up']);
    }
    /**
     * Sign out
     */

    signOut(): void {
        this._authService
            .userLogOut()
            .pipe(
                switchMap(() => this._authService.signOut()),
                switchMap(() => this._authService.check())
            )
            .subscribe((res) => {
                this.isAuthenticated = res;
                this._router.navigate(['/dashboard']).then(() => {
                    window.location.reload();
                });
            });
    }

    userActivity(): void {
        const dialogRef = this.dialog.open(UserActivityComponent, {
            panelClass: 'fullscreen-dialog',
        });
    }
    getUserProfileDetails() {
        this.userService.getUserProfileById().subscribe((res: any) => {
            if (res?.result?.success) {
                const userProfile = res?.result?.data;
                this.user.phoneNumber = userProfile.phoneNumber;
                this.user.profilePictureUri = userProfile.profileImageUrl;
                this.profileImageUrl = userProfile.profileImageUrl;
                this.user.status = userProfile.userActivityStatus;
                this.user.email = userProfile.email;
                this.user.userName = userProfile.fullName;
                this._changeDetectorRef.detectChanges();
            } else {
                this.toaster.triggerToast({
                    type: 'info',
                    message: 'Info',
                    description: res?.result?.message,
                });
            }
        });
    }

    profileSettings(): void {
        if (this.user.roleName === 'IMAM') {
            const dialogRef = this.dialog.open(ImamProfileComponent, {
                panelClass: 'fullscreen-dialog',
            });
        } else {
            const dialogRef = this.dialog.open(ProfileSettingsComponent, {
                panelClass: 'fullscreen-dialog',
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.getUserProfileDetails();
                    this._changeDetectorRef.detectChanges();
                }
            });
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
