import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertService } from '@fuse/components/alert';
import { MasterService } from 'app/services/master.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';
import { UploadInvoiceComponent } from '../upload-invoice/upload-invoice.component';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';

interface StatusFields {
  id: number;
  viewValue: string;
  engValue:string;
}

@Component({
  selector: 'app-inventory-trasaction',
  templateUrl: './inventory-trasaction.component.html',
  styleUrls: ['./inventory-trasaction.component.scss']
})
export class InventoryTrasactionComponent {
  imageEndPoints = environment.imageEndPoints;
  isLoading = true;searchKey: string;
  pageLength = 7;  pageSize = 10;inventoryList=[];
  dataSource: any = new MatTableDataSource<any>;
  searchInputControl: FormControl = new FormControl();
  inventoryForm: FormGroup;isUpdate:boolean=false;
  displayedColumns = ["supplierName","supplierMobileNumber","quantity","createdBy","updatedOn","stockType","isDonated","productStatus","action"];
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild('inventoryDialog', { static: true }) inventoryDialog: TemplateRef<any>;
  currentActions:any;direction: string = 'ltr';
  inventoryGuid:string;selectedInventory:any;
  availableQty:number=0;
  assignText:string;

  productStatus: StatusFields[] = [
    {id: 10, viewValue: 'Baru',engValue:'New'},
    {id: 20, viewValue: 'Tertunda',engValue:'Pending'},
    {id: 30, viewValue: 'Disetujui',engValue:'Approved'},
    {id: 40, viewValue: 'Ditolak',engValue:'Rejected'},
  ];

  constructor(private sharedService: SharedService, private fuseAlertService: FuseAlertService, private masterService: MasterService,
     private toaster: ToasterService, private dialog: MatDialog, 
     private activatedRoute: ActivatedRoute,private router: Router,private _fuseConfirmationService: FuseConfirmationService,
     private translateSerive:LanguageTranslateService,private translate: TranslateService) {

    this.activatedRoute.paramMap.subscribe((params) => {
      this.inventoryGuid = params.get('inventoryGuid');
    });

    //set default language
    translate.setDefaultLang(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));
  }
  ngOnInit(): void{ 
    this.sharedService.direction.subscribe((res) => {
      if (res) {
        this.direction = res;
      }
    });
    
    this.currentActions = this.sharedService.getCurrentPageActions();
    this.getTrasactions();
    
  };

  getTrasactions() {
    this.masterService.getInventoryTrasactions(this.inventoryGuid).subscribe((res: any) => {
      if (res?.result?.success) {
        this.inventoryList = res?.result?.data;
        this.dataSource = new MatTableDataSource(res?.result?.data);
        this.dataSource.paginator = this.paginator;
        this.pageLength = res?.result?.data?.length;
        this.getAvailableQuantity();
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    }, err => {
      this.toaster.triggerToast({ type: 'error', message: 'Error', description: err.error.message })
    })
  }
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

  backToInventory() {
    this.router.navigate(['/mosque/inventory']);
    sessionStorage.setItem("selectedInventory", '');
    this.selectedInventory = null;
  }

  getAvailableQuantity() {
    let stockInQty : number=0;
    let stockOutQty : number=0;
    this.inventoryList.forEach( arg =>{ 
      if(arg.stockType ==='Stock-In'){
        stockInQty += arg.quantity
      } 
      else{
        stockOutQty += arg.quantity
      }
      this.availableQty = stockInQty - stockOutQty;
    }
    
    )
    return this.availableQty;
  }
  
  uploadInvoice(mosqueGuid,inventoryGuid) {
    const dialogRef = this.dialog.open(UploadInvoiceComponent,
      {
        data: {
          mosqueGuid: mosqueGuid,
          inventoryGuid: inventoryGuid,
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.assignText = `Invoice “${result}” upload successfully.`;
        // this.fuseAlertService.show('assignAlert');
        // setTimeout(() => {
        //   this.fuseAlertService.dismiss('assignAlert');
        // }, 3000); 
        this.getTrasactions();  
      }
    });
  }

  openPdfOrImage(fileUrl:string): void {
    window.open(fileUrl, '_blank');
  };

  changeProductStatus(status,invGuid):void{
    let msg = status === 20 ? 'Tertunda' : status === 30 ? 'Disetujui' : status === 40 ? 'Ditolak' : 'Baru';
    const confirmation = this._fuseConfirmationService.open({
      title: 'Perbarui',
      message: "Apakah Anda yakin ingin memperbarui status produk menjadi " + msg,
      icon       : {
        color: 'warn'
      },
      actions: {
        confirm: {
          label: 'Ok'
        }
      }
    });
    confirmation.afterClosed().subscribe(res => {
      if (res === 'confirmed') {
        this.updateProductStatus(status,invGuid);
      }
      else{
        this.getTrasactions();
      }
    })
  }

  updateProductStatus(status:number,invGuid:string){
    let body = {
      statusId : status,
      invTrxId: invGuid
    }
    this.masterService.updateProductStatus(body).subscribe((res: any) => {
      if (res?.result?.success) {
        this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    }, err => {
      this.toaster.triggerToast({ type: 'error', message: 'Error', description: err.error.message })
    })
  }
  
}
