import { Component, ViewChild } from '@angular/core';
import { AddUpdateCategoriesComponent } from '../add-update-categories/add-update-categories.component';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment';
import { SharedService } from 'app/services/shared.service';
import { FuseAlertService } from '@fuse/components/alert';
import { MasterService } from 'app/services/master.service';
import { ToasterService } from 'app/services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-product-sub-categories',
  templateUrl: './product-sub-categories.component.html',
  styleUrls: ['./product-sub-categories.component.scss']
})
export class ProductSubCategoriesComponent {
  isLoading = true;
  pageLength = 7;
  pageSize = 10;
  subCategories = [];
  searchInputControl: FormControl = new FormControl();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  direction: string = 'ltr';
  currentActions: any;
  searchKey: string;
  assignText: any;
  dataSource: any = new MatTableDataSource<any>;
  displayedColumns = ["categoryName", "subCategoryName", "subCategoryDescription", "createdOn", 'isActive', "actions"];
  imageEndPoints = environment.imageEndPoints;
  categoryGuid: string;
  constructor(private sharedService: SharedService, private fuseAlertService: FuseAlertService, private masterService: MasterService, private toaster: ToasterService,
    private dialog: MatDialog, private activatedRoute: ActivatedRoute,private authService: AuthService,private _router: Router) {
     
    this.activatedRoute.paramMap.subscribe((params) => {
      this.categoryGuid = params.get('categoryGuid');
    });
  }

  ngOnInit(): void {
    this.sharedService.direction.subscribe((res) => {
      if (res) {
        this.direction = res;
      }
    });
    // this.assignText = `Administrator assigned to “+ ${'result?.result?.categoryName'} +” successfully. And email notification sent to “+ ${'result?.result?.selectedUser'}”`;
    this.fuseAlertService.dismiss('assignAlert');
    this.currentActions = this.sharedService.getCurrentPageActions();
    this.getSubCategories();
  }

  getSubCategories() {
    this.masterService.getChildCategories('').subscribe((res: any) => {
      if (res?.result?.success) {
        this.subCategories = res?.result?.data;
        this.dataSource = new MatTableDataSource(res?.result?.data);
        this.dataSource.paginator = this.paginator;
        this.pageLength = res?.result?.data?.length;
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    }, err => {
      this.toaster.triggerToast({ type: 'error', message: 'Error', description: err.error.message })
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.searchKey = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  dismiss(name: string): void {
    this.fuseAlertService.dismiss(name);
  }

  pageChangeEvent(event) {
    event
  }

  confirmDeactiveCategory(mosqueInfo) {
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent,
    //   {
    //     maxWidth: '550px',
    //     // height:'auto',
    //     data: {
    //       mosqueGuid: mosqueInfo?.mosqueContactGuid,
    //       mosqueName: mosqueInfo?.mosqueName,
    //       isCreate: true,
    //       iconType: environment.imageEndPoints.alertIcon,
    //       buttons: [
    //         {
    //           type: 'Cancel',
    //           label: 'Cancel',
    //           buttonClass: 'ml-2'
    //         },
    //         {
    //           color: 'primary',
    //           type: 'Confirm',
    //           label: 'Yes, Confirm'
    //         }
    //       ]
    //     }
    //   });
    // dialogRef.componentInstance.messageType = 'DELETE';
    // dialogRef.afterClosed().subscribe((res) => {
    //   if (res) {
    //     this.deactivecategory(mosqueInfo);
    //   }
    // })
  }

  deactivecategory(categoryInfo) {

  }

  addSubCategory() {
    let categoryInfo;
    const dialogRef = this.dialog.open(AddUpdateCategoriesComponent,
      {
        panelClass: 'fullscreen-dialog',
        data: {
          parentCategoryId: this.categoryGuid
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.status) {
        this.assignText = `Category “${result?.result?.categoryName}” added successfully.`;
        this.fuseAlertService.show('assignAlert');
        setTimeout(() => {
          this.fuseAlertService.dismiss('assignAlert');
        }, 3000);
        this.getSubCategories();
      }
      else if (result) {
        this.getSubCategories();
      }
    });
  }

}
