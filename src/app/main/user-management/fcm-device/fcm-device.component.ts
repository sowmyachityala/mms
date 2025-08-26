import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from 'app/main/dialogs/mosque-confirmation-dialog/confirmation-dialog.component';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-fcm-device',
  templateUrl: './fcm-device.component.html',
  styleUrls: ['./fcm-device.component.scss']
})
export class FcmDeviceComponent {
  direction: string = 'ltr';
  deviceId:string;deviceName:string;
  displayedColumns = ["deviceName","updatedOn","delete"];
  @ViewChild('fcmDialog', { static: true }) fcmDialog: TemplateRef<any>;
  dataSource: any = new MatTableDataSource<any>;
  imageUrl = environment.imageEndPoints;
  deviceIds:string[]=[];

  constructor(public fcmDialogRef: MatDialogRef<FcmDeviceComponent>, private dialog: MatDialog,
    private toaster: ToasterService,private translateSerive:LanguageTranslateService,
    private translate: TranslateService,private sharedService: SharedService, @Inject(MAT_DIALOG_DATA) public data){
      //set default language
    translate.setDefaultLang(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));
  }

  ngOnInit(): void {
    this.sharedService.direction.subscribe((res) => {
      if (res) {
        this.direction = res;
      }
    });
    if (this.data) {
      this.dataSource =this.data?.deviceData;
    }
  }

  onClose() {
    this.fcmDialogRef.close();
  }

  deleteDeviceFCMToken(deviceId,deviceName){
    this.deviceId = deviceId;
    this.deviceName = deviceName;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,
      {
        maxWidth: '550px',
        // height:'auto',
        data: {
          mosqueName: null,
          messageData:deviceId,
          inputData:deviceName,
          isCreate: true,
          iconType: environment.imageEndPoints.checkIcon,
          buttons: [            
            {
              color: 'primary',
              type: 'Confirm',
              label: 'Yes, Continue'
            },
            {
              type: 'Cancel',
              label: 'No, Thank you',
              buttonClass: 'ml-2'
            }
          ]
        }
      });
    dialogRef.componentInstance.messageType = 'DELETE';
    dialogRef.afterClosed().subscribe((res) => {  
      if (res) {
       this.UnRegisterDeviceId();
      }
      else {
        this.fcmDialogRef.close(true);
      }
    })
  }

  UnRegisterDeviceId(){
    this.sharedService.unRegisterUserDeviceId(this.deviceId).subscribe((res:any)=>{
      if (res?.result?.success) {
        this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
        this.fcmDialogRef.close(true);
      }
    })
  }

  deRegisterAll(deviceList){
    this.deviceIds = deviceList.map(obj => obj.deviceId);
    this.sharedService.deRegisterAll(this.deviceIds).subscribe((res:any) =>{
      if(res?.result?.success){
        
      }
    },
    (error) => {
      this.toaster.triggerToast({ type: 'error', message: 'error', description: error});
    })
  }

}
