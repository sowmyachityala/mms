import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MasterService } from 'app/services/master.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';

@Component({
  selector: 'app-upload-invoice',
  templateUrl: './upload-invoice.component.html',
  styleUrls: ['./upload-invoice.component.scss']
})
export class UploadInvoiceComponent {
  direction: string = 'ltr';
  //imageSource: string;
  invGuid:string;
  inventoryGuid:string;
  mosqueGuid:string;
  files: any[]=[];

  constructor(public invoiceDialogRef: MatDialogRef<UploadInvoiceComponent>,
    private sharedService: SharedService,@Inject(MAT_DIALOG_DATA) public data,private router: Router,
    private activatedRoute: ActivatedRoute,private masterService:MasterService,
    private toaster: ToasterService,private translateSerive:LanguageTranslateService,private translate: TranslateService){
      this.activatedRoute.paramMap.subscribe((params) => {
        this.invGuid = params.get('inventoryGuid');
      }); 
      //set default language
      translate.setDefaultLang(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));
    }

  ngOnInit():void{
    this.sharedService.direction.subscribe((res) => {
      if (res) {
        this.direction = res;
      }
    });
    if (this.data) {
      this.inventoryGuid = this.data?.inventoryGuid;
      this.mosqueGuid = this.data?.mosqueGuid;
    }
  };

  onClose() {
    this.invoiceDialogRef.close();
  };

  onFileChange(pFileList: File[]){
    this.files = Object.keys(pFileList).map(key => pFileList[key]);
    const file = (this.files[0] as File);
    if (file) {
      if (!file.type.startsWith('image/') && file.type != 'application/pdf') 
      this.toaster.triggerToast({ type: 'error', message: 'Error', description: "File type is not allowed: " + file.type });
    }
  };

  saveUploadedInvoice(){
    if(this.files.length == 1){
      const formData = new FormData();
      formData.append('invoice', this.files[0]);
      formData.append('mosqueGuid', this.mosqueGuid);
      formData.append('inventoryGuid', this.inventoryGuid);
      this.masterService.uploadInvoice(formData).subscribe((res:any)=>{
        if (res?.result?.success) {
          this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
          this.invoiceDialogRef.close(true);
          //this.router.navigate(['/mosque/inventory/inventorytransactions/', this.invGuid]);
          //this.router.navigate(['/mosque/inventory']);
        }
        else {
          this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
         
        }
      });
    }
    else{
      this.toaster.triggerToast({ type: 'error', message: 'Error', description: "Please select file."});
    }
  };
  


}
