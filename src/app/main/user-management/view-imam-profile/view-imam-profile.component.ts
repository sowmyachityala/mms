import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { User } from 'app/core/user/user.types';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MosqueService } from 'app/services/mosque.service';
import { ToasterService } from 'app/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-imam-profile',
  templateUrl: './view-imam-profile.component.html',
  styleUrl: './view-imam-profile.component.scss'
})
export class ViewImamProfileComponent {
  imamProfileInfo:any=[]; direction: string = 'ltr';  user: User; 
  isLoadingType: string;userId:string; imamUserId:string;roleName:string;

  constructor(private toaster: ToasterService,private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data,
    private mosqueService: MosqueService,private spinnerService: NgxSpinnerService,private translateSerive: LanguageTranslateService,
    private translate: TranslateService, public profileDialogRef: MatDialogRef<ViewImamProfileComponent>){
      this.isLoadingType = 'pacman';
      //set default language
      translate.setDefaultLang(
          localStorage.getItem('isalaam-language') === null
              ? 'id-ID'
              : localStorage.getItem('isalaam-language')
      );
      this.user = AuthUtils._decodeToken(localStorage.getItem("isalaamAccessToken"));
      this.userId = this.user?.userId;
      if (this.data) {
        this.imamUserId = this.data?.imamUserId;
        this.roleName = this.data?.roleName;
      }
  }

  ngOnInit(){
    this.getImamProfileDataById();
  }

  getImamProfileDataById() {
    this.spinnerService.show();
    this.mosqueService.getImamProfileData(this.imamUserId,this.roleName).subscribe((res: any) => {
      if (res?.result?.success) {
        this.imamProfileInfo = res?.result?.data;
        this.spinnerService.hide();
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    }, err => {
      this.toaster.triggerToast({ type: 'error', message: 'Server error', description: err?.message });
    });
  }

  onClose() {
    this.profileDialogRef.close();
  }

}
