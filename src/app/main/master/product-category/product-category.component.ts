import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertService } from '@fuse/components/alert';
import { MasterService } from 'app/services/master.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { AddUpdateCategoriesComponent } from '../add-update-categories/add-update-categories.component';
import { environment } from 'environments/environment';
import { ConfirmationDialogComponent } from 'app/main/dialogs/mosque-confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';

@Component({
    selector: 'app-product-category',
    templateUrl: './product-category.component.html',
    styleUrls: ['./product-category.component.scss'],
})
export class ProductCategoryComponent implements OnInit {
    isLoading = true;
    pageLength = 0;    pageSize = 10; pageIndex = 1;
    categories = [];  searchForm: FormGroup;    
    searchInputControl: FormControl = new FormControl();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    direction: string = 'ltr';
    currentActions: any;
    searchKey: string;
    assignText: any;
    dataSource: any = new MatTableDataSource<any>();
    displayedColumns = [
        'categoryName',
        'categoryDescription',
        'childCategoryCount',
        'updatedOn',
        'isActive',
        'actions',
    ];
    imageEndPoints = environment.imageEndPoints;
    categoryGuid: any;
    subCategories = [];
    parentCategoryId: any;
    products = [];
    selectedCategory: any;
    selectedSubCategory: any;
    constructor(
        private sharedService: SharedService,
        private fuseAlertService: FuseAlertService,
        private masterService: MasterService,
        private toaster: ToasterService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private authService: AuthService,
        private _router: Router,
        private fb: FormBuilder
    ) {
        this.activatedRoute.paramMap.subscribe((params) => {
            this.categoryGuid = params.get('categoryGuid');
            this.parentCategoryId = params.get('categoryParentId');
        });
        this.fuseAlertService.dismiss('assignAlert');
        if (!this.categoryGuid && !this.parentCategoryId) {
            sessionStorage.setItem('selectedCategory', '');
            sessionStorage.setItem('selectedSubCategory', '');
        }
        this.selectedCategory = sessionStorage.getItem('selectedCategory')
            ? JSON.parse?.(sessionStorage.getItem('selectedCategory'))
            : null;
        this.selectedSubCategory = sessionStorage.getItem('selectedSubCategory')
            ? JSON.parse?.(sessionStorage.getItem('selectedSubCategory'))
            : null;
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );        
       
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

        this.searchForm = this.fb.group({
            catProdName: [''],
            catProdStatus: [],
            pageIndex: [],
            pageSize: [],
            isFilter: [false],
            parentGuid:[]
        });

        this.getRelatedData();
    }

    getCategories() {
        this.searchForm.patchValue({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
        });
        let formValue = this.searchForm.value;
        this.masterService.getParentCategoriesFilter(formValue).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.categories = res?.result?.data?.vmCategories;
                    this.dataSource = new MatTableDataSource(res?.result?.data.vmCategories);
                    this.dataSource.paginator = this.paginator;
                    this.pageLength = res?.result?.data?.totalCount;
                } else {
                    this.toaster.triggerToast({
                        type: 'info',
                        message: 'Info',
                        description: res?.result?.message,
                    });
                }
            },
            (err) => {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Error',
                    description: err.error.message,
                });
            }
        );
    }

    getSubCategories() {
        this.searchForm.patchValue({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            parentGuid: this.categoryGuid
        });
        let formValue = this.searchForm.value;
        debugger;
        this.masterService.getChildCategoriesFilter(formValue).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.displayedColumns = [
                        'categoryName',
                        'categoryDescription',
                        'productsCount',
                        'updatedOn',
                        'isActive',
                        'actions',
                    ];
                    this.subCategories = res?.result?.data?.vmCategories;
                    this.dataSource = new MatTableDataSource(res?.result?.data?.vmCategories);
                    this.dataSource.paginator = this.paginator;
                    this.pageLength = res?.result?.data?.totalCount;
                    this.currentActions =
                        this.sharedService.getCurrentPageActions();
                } else {
                    this.toaster.triggerToast({
                        type: 'info',
                        message: 'Info',
                        description: res?.result?.message,
                    });
                }
            },
            (err) => {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Error',
                    description: err.error.message,
                });
            }
        );
    }

    getProducts() {
         this.searchForm.patchValue({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            parentGuid: this.categoryGuid
        });
        let formValue = this.searchForm.value;
        debugger;
        this.masterService.getProductsByCategoryFilter(formValue).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.displayedColumns = [
                        'productName',
                        'productDescription',
                        'uomId',
                        'updatedOn',
                        'isActive',
                        'actions',
                    ];
                    this.products = res?.result?.data?.vmProducts;
                    this.dataSource = new MatTableDataSource(res?.result?.data?.vmProducts);
                    this.dataSource.paginator = this.paginator;
                    this.pageLength = res?.result?.data?.totalCount;
                } else {
                    this.toaster.triggerToast({
                        type: 'info',
                        message: 'Info',
                        description: res?.result?.message,
                    });
                }
            },
            (err) => {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Error',
                    description: err.error.message,
                });
            }
        );
    }
   
    dismiss(name: string): void {
        this.fuseAlertService.dismiss(name);
    }
   
    confirmDeactiveProduct(data, type) {
        const body = {
            isActive: false,
            guid: data?.productGuid,
            type: type,
        };
        this.ActiveInactiveCategoryOrProducts(body);
    }
    confirmActiveProduct(data, type) {
        const body = {
            isActive: true,
            guid: data?.productGuid,
            type: type,
        };
        this.ActiveInactiveCategoryOrProducts(body);
    }
    confirmDeactiveCategory(data, type) {
        const body = {
            isActive: false,
            guid: data?.categoryGuid,
            type: type,
        };
        this.ActiveInactiveCategoryOrProducts(body);
    }

    confirmActiveCategory(data, type) {
        const body = {
            isActive: true,
            guid: data?.categoryGuid,
            type: type,
        };
        this.ActiveInactiveCategoryOrProducts(body);
    }

    ActiveInactiveCategoryOrProducts(body: any) {
        this.masterService
            .activeOrInactiveCategoryProduct(body)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    this.getRelatedData();
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }
    deactivecategory(categoryInfo) {}

    addcategory() {
        const dialogRef = this.dialog.open(AddUpdateCategoriesComponent, {
            panelClass: 'fullscreen-dialog',
            data: {
                categoryParentGuid: this.categoryGuid,
                productCategoryParentId: this.parentCategoryId,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.status) {
                this.assignText = `Category “${result?.categoryName}” added successfully.`;
                this.fuseAlertService.show('assignAlert');
                setTimeout(() => {
                    this.fuseAlertService.dismiss('assignAlert');
                }, 3000);
               this.getRelatedData();
            } else if (result) {
                this.getRelatedData();
            }
        });
    }

    editCategory(element, type) {
        const dialogRef = this.dialog.open(AddUpdateCategoriesComponent, {
            panelClass: 'fullscreen-dialog',
            data: {
                categoryParentGuid: this.categoryGuid,
                productCategoryParentId: this.parentCategoryId,
                categoryDetails: element,
                type: type,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.status) {
                this.assignText = `Category “${result?.categoryName}” updated successfully.`;
                this.fuseAlertService.show('assignAlert');
                setTimeout(() => {
                    this.fuseAlertService.dismiss('assignAlert');
                }, 3000);
                this.getRelatedData();
            } else if (result) {
                this.getRelatedData();
            }
        });
    }

    backToCategories() {
        this.router.navigate(['/master/productcategory']);
        sessionStorage.setItem('selectedCategory', '');
        sessionStorage.setItem('selectedSubCategory', '');
        this.selectedCategory = null;
        this.selectedSubCategory = null;
    }

    backToSubCategories() {
        sessionStorage.setItem('selectedSubCategory', '');
        sessionStorage.setItem(
            'selectedCategory',
            JSON.stringify(this.selectedCategory)
        );
        //this.router.navigate(['/master/productcategory', this.selectedCategory?.categoryGuid + '-' + this.selectedCategory?.id])
        this.router.navigate([
            '/master/productcategory',
            this.selectedCategory?.categoryGuid,
        ]);
    }

    backToProducts() {
        sessionStorage.setItem(
            'selectedSubCategory',
            JSON.stringify(this.selectedSubCategory)
        );
        //this.router.navigate(['/master/productcategory', this.selectedSubCategory?.categoryParentId, this.selectedSubCategory?.categoryGuid + '-' + this.selectedSubCategory?.id])
        this.router.navigate([
            '/master/productcategory',
            this.selectedSubCategory?.categoryParentId,
            this.selectedSubCategory?.categoryGuid,
        ]);
    }

    navigateToSubcategories(element) {
        sessionStorage.setItem('selectedCategory', JSON.stringify(element));
        //this.router.navigate(['/master/productcategory', element?.categoryGuid + '-' + element?.id])
        this.router.navigate([
            '/master/productcategory',
            element?.categoryGuid,
        ]);
    }

    navigateToProducts(element) {
        sessionStorage.setItem('selectedSubCategory', JSON.stringify(element));
        //this.router.navigate(['/master/productcategory', element?.categoryParentId, element?.categoryGuid + '-' + element?.id])
        this.router.navigate([
            '/master/productcategory',
            element?.categoryParentId,
            element?.categoryGuid,
        ]);
    }

     ResetFilterList() {
        this.pageSize = 10;
        this.pageIndex = 1;
        this.searchForm.patchValue({
            catProdName: '',
            catProdStatus: null,
            isFilter: false,
        });
        this.getRelatedData();
    }
    SearchFilter() {
        this.searchForm.patchValue({
            isFilter: true,
        });
       this.getRelatedData();
    }
    onPageChange(event: any): void {
      this.pageIndex = event.pageIndex + 1; 
      this.pageSize = event.pageSize; 
      this.getRelatedData();
    }

    getRelatedData(){
        debugger;
        if (this.parentCategoryId) {
            this.getProducts();
        } else if (this.categoryGuid && !this.parentCategoryId) {
            this.getSubCategories();
        } else {
            this.getCategories();
        }
    }

    get catProdPlaceholder(): string {
        if (!this.categoryGuid && !this.parentCategoryId) {
            return this.translate.instant('ProductCat.categoryName');
        } else if (this.categoryGuid && !this.parentCategoryId) {
            return this.translate.instant('ProductCat.subCategoryName');
        } else if (this.categoryGuid && this.parentCategoryId) {
            return this.translate.instant('ProductCat.productName');
        }
        return '';
    }
}
