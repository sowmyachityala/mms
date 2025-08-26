import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MasterService } from 'app/services/master.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';
import { environment } from 'environments/environment';
import { AddInventoryComponent } from '../add-inventory/add-inventory.component';
import { min } from 'lodash';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-mosque-inventory',
  templateUrl: './mosque-inventory.component.html',
  styleUrls: ['./mosque-inventory.component.scss']
})
export class MosqueInventoryComponent {
  isLoading = true;searchKey: string;
  pageLength = 7;  pageSize = 10;inventoryList=[];
  dataSource: any = new MatTableDataSource<any>;
  searchInputControl: FormControl = new FormControl();
  inventoryForm: FormGroup;isUpdate:boolean=false;
  displayedColumns = ["productName","supplierName","supplierMobileNumber","quantity","createdBy","updatedOn","isActive","action"];
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild('inventoryDialog', { static: true }) inventoryDialog: TemplateRef<any>;
  currentActions:any;direction: string = 'ltr';
  categories=[];subCategories=[];categoryGuid:string="";products=[];supplierList=[];
  childCategoryGuid:string="";
  imageEndPoints = environment.imageEndPoints;
  mosqueGuid:string="";  mosqueInfo: any;selectedInventory:any;
  //inventoryGuid:string='';
  public minDate = new Date();
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public showSpinners = true;
  public showSeconds = true;
  public touchUi = false;
  public color: ThemePalette = 'primary';
  stockOutForm:FormGroup;
  @ViewChild('stockOutDialog', { static: true }) stockOutDialog: TemplateRef<any>;
  availableQuantity:number;
  constructor(private userService:UserManagementService,private toaster: ToasterService,
    private fb: FormBuilder,private dialog: MatDialog,private sharedService: SharedService,
    private _fuseConfirmationService: FuseConfirmationService,private fuseAlertService: FuseAlertService,
    private masterService: MasterService, private router: Router,private activatedRoute: ActivatedRoute,
    private translateSerive:LanguageTranslateService,private translate: TranslateService,
    private authService: AuthService){     
    //set default language
    translate.setDefaultLang(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));   
   
  }
  
  ngOnInit(): void{
    this.inventoryForm = this.fb.group({
      inventoryGuid: [null],
      //categoryGuid:[null],
      //childCategoryGuid:[null],
      mosqueGuid:[this.mosqueGuid],
      productId:[null, Validators.required],
      selectedUOM:[null],
      supplierId:[null, Validators.required],
      quantity:[null, Validators.required],
      purchaseDate:[],
      warrentyThru:[]
    });
    this.stockOutForm = this.fb.group({
      inventoryGuid: [null,Validators.required],
      productName:[null],
      availableQuantity:[null, Validators.required],
      stockOutQuantity:[null, [Validators.required,Validators.min(1),(control: AbstractControl) => Validators.max(this.availableQuantity)(control)]],
      stockType:['Stock-Out'],
    });
    this.sharedService.direction.subscribe((res) => {
      if (res) {
        this.direction = res;
      }
    });

    if(this.sharedService?.mosqueInfo != ""){
      this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
      this.mosqueGuid= this.mosqueInfo?.mosqueContactGuid;
    }
    // else{
    //   this.mosqueGuid='0623f2e7-2a80-426b-870b-7dc48d80afd8';
    // }

    this.currentActions = this.sharedService.getCurrentPageActions();
    this.GetAllInventoryProducts();
    
  };

  pageChangeEvent(event) {
    event
  };

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.searchKey = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  };

  GetAllInventoryProducts():void{
    this.userService.getAllInventoryProducts(this.mosqueGuid).subscribe((res:any)=>{
      if (res?.result?.success) {
        this.inventoryList = res?.result?.data;
        this.dataSource = new MatTableDataSource(res?.result?.data);
        this.dataSource.paginator = this.paginator;
        this.pageLength = res?.result?.data?.length;
        //this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });        
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    });
  };

  async getCategories() {
     await this.masterService.getParentCategories().subscribe((res: any) => {
            if (res?.result?.success) {
              this.categories = res?.result?.data;
            }
            else {
              this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
            }
          }, err => {
            this.toaster.triggerToast({ type: 'error', message: 'Error', description: err.error.message })
          })
  };

  async getSubCategories(pcid:string) {    
    this.categoryGuid =pcid;
     await this.masterService.getChildCategories(this.categoryGuid).subscribe((res: any) => {
            if (res?.result?.success) {
              this.subCategories = res?.result?.data;
            }
            else {
              this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
            }
          }, err => {
            this.toaster.triggerToast({ type: 'error', message: 'Error', description: err.error.message })
          })
  }

  async getProducts(cid:string) {
     this.childCategoryGuid =cid;
    await this.masterService.getProductsByCategory(this.childCategoryGuid).subscribe((res: any) => {
            if (res?.result?.success) {
              this.products = res?.result?.data;
            }
            else {
              this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
            }
          }, err => {
            this.toaster.triggerToast({ type: 'error', message: 'Error', description: err.error.message })
          })
  }
  async getAllSppliersList(){
    await this.userService.getAllSuppliers(this.mosqueGuid).subscribe((res:any)=>{
            if (res?.result?.success) {
              this.supplierList = res?.result?.data;
            }
            else {
              this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
            }
          });
  };

  addOrUpdateInventory(){
    if (this.inventoryForm.invalid) {
      return true;
    }   
    let body = this.inventoryForm?.value;
    this.masterService.addOrUpdateInventory(body).subscribe((res:any)=>{
      if (res?.result?.success) {
        this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
        this.dialog.closeAll();
        this.GetAllInventoryProducts();
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
       
      }
    });
  }
  addInventory():void{
      this.inventoryForm.reset();
      this.isUpdate=false;
      this.inventoryForm.patchValue({
        inventoryGuid:null,
        mosqueGuid:this.mosqueGuid,
        //productId:this.productId,
        //supplierId:this.supplierId
      });
      this.dialog.open(this.inventoryDialog);
      this.getCategories();
      this.getAllSppliersList();
  };
  
  getUomSelected(event){
    console.log(event);
  }
  selectedProduct(pId,uomName){
    this.inventoryForm.patchValue({productId:pId,selectedUOM:uomName});

  }
  selectedSupplier(sId){
    this.inventoryForm.patchValue({supplierId:sId});
  }
  closeDialog():void{
    this.dialog.closeAll();
  }

  confirmDeactiveProduct(guid) {
    const body = {
      isActive:false,
      guid:guid,
    };
    this.ActiveInactiveCategoryOrProducts(body);
  }
  confirmActiveProduct(guid) {
    const body = {
      isActive:true,
      guid:guid,
    };
    this.ActiveInactiveCategoryOrProducts(body);
  }

  ActiveInactiveCategoryOrProducts(body:any){
    this.masterService.activeOrInactiveInventory(body).subscribe((res:any)=>{
      if (res?.result?.success) {
        this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
        this.GetAllInventoryProducts();
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
       
      }
    });
  }
    
  navigateToTrasactions(element) {
    //sessionStorage.setItem("selectedInventory", JSON.stringify(element));
    this.router.navigate(['/mosque/inventory/inventorytransactions', element?.inventoryGuid]);
  }
  addInventoryNew() {
    const dialogRef = this.dialog.open(AddInventoryComponent,
      {
        panelClass: 'fullscreen-dialog',
        data: {
          mosqueGuid: this.mosqueGuid,
        }
      });

    dialogRef.afterClosed().subscribe(result => {  
      if (result) {
        // this.assignText = `Key member added to  “${result?.result?.mosqueName}” successfully`;
        // this.fuseAlertService.show('assignAlert');
        // setTimeout(() => {
        //   this.fuseAlertService.dismiss('assignAlert');
        // }, 3000);
        this.GetAllInventoryProducts();
      }
      
    });
  }

  confirmStockOutProduct(guid:string,availableQuantity:number,productName:string){
    this.stockOutForm.reset();
    this.availableQuantity = availableQuantity;
      this.stockOutForm.patchValue({
        inventoryGuid:guid,
        productName:productName,
        availableQuantity:availableQuantity,
        stockType:"Stock-Out"
      });
      this.dialog.open(this.stockOutDialog);
  }
  
  stockOutProduct(){
    if (this.stockOutForm.invalid) {
      return true;
    }   
    let body = this.stockOutForm?.value;
    this.masterService.stockOutInventoryProduct(body).subscribe((res:any)=>{
      if (res?.result?.success) {
        this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
        this.dialog.closeAll();
        this.GetAllInventoryProducts();
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
       
      }
    });
  }
  
}
