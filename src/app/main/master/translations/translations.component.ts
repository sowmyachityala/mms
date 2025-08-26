import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent {
  isLoading = true;searchKey: string;
  pageLength = 7;  pageSize = 10;transList=[];
  dataSource: any = new MatTableDataSource<any>;
  searchInputControl: FormControl = new FormControl();
  actionInfoForm: FormGroup;isUpdate:boolean=false;
  displayedColumns = ["english","language","action"];
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  currentActions:any;direction: string = 'ltr';
  TrsForm: FormGroup;

  constructor(private toaster: ToasterService,private sharedService: SharedService,
    private translateSerive:LanguageTranslateService,private translate: TranslateService,
    private fb: FormBuilder, private _formBuilder: FormBuilder,private authService: AuthService,private _router: Router){
      translate.setDefaultLang(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));
     
  }

  ngOnInit(): void{
    this.TrsForm = this._formBuilder.group({
      TrsRecord: this._formBuilder.array([])
    });

    
    this.sharedService.direction.subscribe((res) => {
      if (res) {
        this.direction = res;
      }
    });
    this.GetAllTraslationsFields();
    this.translate.use(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));
  };

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.searchKey = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  };

  pageChangeEvent(event) {
    event
  };

  GetAllTraslationsFields():void{
    this.translateSerive.getAllTraslations().subscribe((res:any)=>{
      if (res?.result?.success) {
        this.transList = res?.result?.data;
        this.TrsForm = this.fb.group({
          TrsRecord: this.fb.array(this.transList.map(val => this.fb.group({
            transGuid: new FormControl(val.transGuid),
            language: new FormControl(val.language),
            english: new FormControl(val.english),
            isEditable: new FormControl(true),
          })
          )) 
        }); 
        //this.dataSource = new MatTableDataSource(res?.result?.data);
        this.dataSource = new MatTableDataSource((this.TrsForm.get('TrsRecord') as FormArray).controls);
        
        // Define custom filter predicate
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const dataStr = (data.get('transGuid')?.value || '') +
                          (data.get('language')?.value || '') +
                          (data.get('english')?.value || '');
          return dataStr.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        };

        this.dataSource.paginator = this.paginator;
        this.pageLength = res?.result?.data?.length;
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    });
  };

  EditTrsRecord(TrsFormElement, i) {
    TrsFormElement.get('TrsRecord').at(i).get('isEditable').patchValue(false);
  }

  SaveTrsRecord(transGuid, transData) {
    let body = {
      transGuid : transGuid,
      transData : transData
    };
    this.translateSerive.updateTranslationData(body).subscribe((res:any)=>{
      if (res?.result?.success) {
        this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
        this.GetAllTraslationsFields();
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
       
      }
    });
  }

  CancelTrsRecord(TrsFormElement, i) {
    //TrsFormElement.get('TrsRecord').at(i).get('isEditable').patchValue(true);
    this.GetAllTraslationsFields();
  }

}
