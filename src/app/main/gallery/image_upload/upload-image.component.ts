import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent {

  direction: string = 'ltr';
  currentPicture:number = 0;
  allImages:any=[];

  constructor(private dialog: MatDialog,public imgDialogRef: MatDialogRef<UploadImageComponent>, @Inject(MAT_DIALOG_DATA) public data,
  private translateSerive:LanguageTranslateService,private translate: TranslateService){
    //set default language
    translate.setDefaultLang(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));
    this.translate.use(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));

  };
  
  ngOnInit(): void {
    if (this.data) {
      this.allImages = this.data?.apiProperties?.allImages;
      this.currentPicture = this.data?.apiProperties?.currentIndex;
    }
  }
 

  select(index) {
    this.currentPicture = index;
  }

  selectArrow() {
    if (this.currentPicture < this.allImages.length - 1) {
      this.currentPicture++;
    }
  }
  
  selectLeftArrow() {
    if (this.currentPicture > 0) {
      this.currentPicture--;
    }
  }

  closeDialog(){
    this.dialog.closeAll();
  }
  
  

}


