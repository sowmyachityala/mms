import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';

@Component({
  selector: 'app-business-actions',
  templateUrl: './business-actions.component.html',
  styleUrls: ['./business-actions.component.scss']
})
export class BusinessActionsComponent {
  isLoading = true;searchKey: string;
  pageLength = 7;  pageSize = 10;actList=[];
  dataSource: any = new MatTableDataSource<any>;
  searchInputControl: FormControl = new FormControl();
  actionInfoForm: FormGroup;isUpdate:boolean=false;
  displayedColumns = ["name", "description","displayOrder","updatedOn","action"];//,"isActive"
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('actionInfoDialog', { static: true }) actionInfoDialog: TemplateRef<any>;
  currentActions:any;direction: string = 'ltr';
  
  constructor(private userService:UserManagementService,private toaster: ToasterService,
    private fb: FormBuilder,private dialog: MatDialog,private sharedService: SharedService,
    private translateSerive:LanguageTranslateService,private translate: TranslateService,
    private authService: AuthService,private _router: Router){
      //set default language
      translate.setDefaultLang(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));
    
   
  }

  ngOnInit(): void{
    this.sharedService.direction.subscribe((res) => {
      if (res) {
        this.direction = res;
      }
    });

    this.actionInfoForm = this.fb.group({
      id: [0],
      actionGuid: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      displayOrder:[0, Validators.required],
      isActive: [true]
    });
    this.currentActions = this.sharedService.getCurrentPageActions();
    this.GetAllActions();
  }

  GetAllActions():void{
    this.userService.getAllBusinessActions().subscribe((res:any)=>{
      if (res?.result?.success) {
        this.actList = res?.result?.data;
        this.dataSource = new MatTableDataSource(res?.result?.data);
        this.dataSource.paginator = this.paginator;
        this.pageLength = res?.result?.data?.length;
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    });
  };

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.searchKey = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  pageChangeEvent(event) {
    event
  }

  closeDialog():void{
    this.dialog.closeAll();
  }

  addBusinessAction():void{
    this.actionInfoForm.reset();
    this.isUpdate=false;
    this.actionInfoForm.patchValue({
      id:0,
      isActive:true
    });
    this.dialog.open(this.actionInfoDialog);
  }
  
  addOrUpdateAction(){
    if (this.actionInfoForm.invalid) {
      return true;
    }   
    let body = this.actionInfoForm?.value;
    this.userService.addOrUpdateActions(body).subscribe((res:any)=>{
      if (res?.result?.success) {
        this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
        this.dialog.closeAll();
        this.GetAllActions();
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
       
      }
    });
  }

  editBusinessAction(data){
    // this.actionInfoForm.reset();
    // this.actionInfoForm.patchValue({
    //   id:data?.id,
    //   actionGuid:data.actionGuId,
    //   isActive:true,
    // });
    this.isUpdate=true;    
    this.actionInfoForm.patchValue(data);
    this.dialog.open(this.actionInfoDialog);
  }
}
