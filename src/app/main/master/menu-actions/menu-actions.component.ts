import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
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
  selector: 'app-menu-actions',
  templateUrl: './menu-actions.component.html',
  styleUrls: ['./menu-actions.component.scss']
})
export class MenuActionsComponent {
  isLoading = true; searchKey: string;
  pageLength = 7;  pageSize = 10;
  pGrid =true;  menusList=[];
  dataSourceMenu: any = new MatTableDataSource<any>;
  searchInputControlMenu: FormControl = new FormControl();
  displayedMenuColumns = ["menuName", "menuDescription","displayOrder","subMenuCount","updatedOn","action"];//,"isActive"
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  cMenuList=[];
  dataSourceCMenu: any = new MatTableDataSource<any>;
  searchInputControlCMenu: FormControl = new FormControl();
  displayedCMenuColumns = ["menuName", "menuDescription","displayOrder","updatedOn","action"];//,"isActive"
  cGrid =false;
  menuInfoForm: FormGroup;
  autocompleteControl = new FormControl();
  @ViewChild('menuInfoDialog', { static: true }) menuInfoDialog: TemplateRef<any>;
  isUpdate:boolean=false;menuGuid:string='';
  isActive =true;isChild=false; pName:string='';menuId:number=null;
  currentActions:any;direction: string = 'ltr';
  //selected = true;
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

    this.menuInfoForm = this.fb.group({
      id: [0],
      menuGuid: [''],
      menuName: ['', Validators.required],
      menuDescription: [''],
      menuParentId:[null],
      menuIconPath: [''],
      displayOrder: [null, Validators.required],
      isActive: [this.isActive],
      link: [''],
    });
    this.currentActions = this.sharedService.getCurrentPageActions();
    this.GetParentMenus();   
  }

  GetParentMenus():void{
    this.userService.getAllParentMenus().subscribe((res:any)=>{
      if (res?.result?.success) {
        this.menusList = res?.result?.data;
        //this.menusList.forEach(obj => obj.updatedOn = new Date(obj.updatedOn));
        this.dataSourceMenu = new MatTableDataSource(this.menusList);
        this.dataSourceMenu.paginator = this.paginator;
        this.pageLength = this.menusList.length;
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    });
  };

  GetChildMenus(menuParentId):void{   
    this.userService.getChildMenuById(menuParentId).subscribe((res:any)=>{
      if (res?.result?.success) {
        this.cMenuList = res?.result?.data;
        this.dataSourceCMenu = new MatTableDataSource(res?.result?.data);
        this.dataSourceCMenu.paginator = this.paginator;
        this.pageLength = res?.result?.data?.length;
        this.pGrid = false
        this.cGrid = true;
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    });
  };

  getChildMenus(data):void{
    this.menuInfoForm.reset();
    this.menuInfoForm.patchValue({
      id:0,
      menuParentId: data?.id,
      menuGuid: data?.menuGuid
    });
    this.pName = data?.menuName;
    this.menuId= data?.id;
    this.menuGuid= data?.menuGuid;
    this.GetChildMenus(this.menuId);
  }

  BackParentMenu():void{
    this.cGrid = false;
    this.pGrid = true;
    this.pName ='';
    this.menuId = null;
    this.menuGuid ='';
    this.GetParentMenus();
  }

  addParentMenu():void{
    this.menuInfoForm.reset();
    this.isUpdate = false;
    this.isChild = false;
    this.menuInfoForm.patchValue({
      id:0
    });
    this.dialog.open(this.menuInfoDialog);
  }

  AddChildMenu():void{
    this.isUpdate = false;
    this.isChild = true;
    this.menuInfoForm.patchValue({
      menuGuid: null
    });
    this.dialog.open(this.menuInfoDialog);
  }

  closeDialog():void{
    this.dialog.closeAll();
  }

  addOrUpdateMenu(){
    if (this.menuInfoForm.invalid) {
      return true;
    }   
    let body = this.menuInfoForm?.value;
    if(body.menuName){
      body.link ='/' + body.menuName.replace(/\s/g, "").toLowerCase();
      body.isActive =true;
    }    
    if(!this.isChild){
      this.userService.addNewParentMenu(body).subscribe((res:any)=>{
        if (res?.result?.success) {
          this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
          this.dialog.closeAll();
          this.GetParentMenus();
        }
        else {
          this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
         
        }
      });
    }
    else{
      this.userService.addNewChildMenu(body).subscribe((res:any)=>{
        if (res?.result?.success) {
          this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
          this.dialog.closeAll();
          this.recallChildMenu(this.menuId,this.menuGuid,this.pName);
        }
        else {
          this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
        }
      });
    }
  }
  recallChildMenu(menuId,menuGuid,pName){
    this.pName = pName;
    this.menuInfoForm.reset();
      this.menuInfoForm.patchValue({
        id:0,
        menuParentId: menuId,
        menuGuid: menuGuid
      });
    this.GetChildMenus(menuId);
  };

  editParentMenu(data){
    this.menuInfoForm.patchValue(data);
    this.isUpdate = true;
    this.isChild = false;
    this.dialog.open(this.menuInfoDialog);
  };

  changeParentMenu(isActive,data){
    this.menuInfoForm.patchValue(data);
    this.menuInfoForm.patchValue({
      isChecked:isActive
    });
  };

  editChildMenu(data){
    this.menuInfoForm.patchValue(data);
    this.isChild = true;
    this.isUpdate = true;
    this.dialog.open(this.menuInfoDialog);
  };

  applyFilterMenu(filterValue: string) {
    this.dataSourceMenu.filter = filterValue.trim().toLowerCase();
    this.dataSourceMenu.filter = filterValue;
    this.searchKey = filterValue;
    if (this.dataSourceMenu.paginator) {
      this.dataSourceMenu.paginator.firstPage();
    }
  };

  pageChangeEvent(event) {
    event
  };
  
  masterMenuActiveInactive(flag,menuId){
    let body ={
      flag : flag,
      menuId : menuId
    };
    // this.userService.activeInactiveMenu(body).subscribe((res :any) =>{

    // })
  };
}
