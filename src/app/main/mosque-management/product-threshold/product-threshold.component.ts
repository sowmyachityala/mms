import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MasterService } from 'app/services/master.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-product-threshold',
    templateUrl: './product-threshold.component.html',
    styleUrl: './product-threshold.component.scss',
})
export class ProductThresholdComponent {
    productList = [];
    isLoading = true;
    searchKey: string;
    pageLength = 0;
    pageSize = 10;
    pageIndex = 1;
    searchForm: FormGroup;
    searchInputControl: FormControl = new FormControl();
    dataSource: any = new MatTableDataSource<any>();
    displayedColumns = [
        'productName',
        'productDescription',
        'miniThreshold',
        'maxThreshold',
        'availableQuantity',
        'entryBy',
        'entryOn',
        'isActive',
        'action',
    ];
    currentActions: any;
    mosqueGuid: string = '';
    mosqueInfo: any;
    direction: string = 'ltr';
    @ViewChild(MatPaginator) paginator: MatPaginator;
    isUpdate: boolean = false;
    @ViewChild('thresholdDialog', { static: true })
    thresholdDialog: TemplateRef<any>;
    categories = [];
    subCategories = [];
    categoryGuid: string = '';
    products = [];
    childCategoryGuid: string;
    pThresholdForm: FormGroup;
    imageEndPoints = environment.imageEndPoints;

    constructor(
        private userService: UserManagementService,
        private toaster: ToasterService,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private sharedService: SharedService,
        private _fuseConfirmationService: FuseConfirmationService,
        private fuseAlertService: FuseAlertService,
        private masterService: MasterService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private authService: AuthService
    ) {
        //set default language
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

        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid;
        }
        this.currentActions = this.sharedService.getCurrentPageActions();
        this.searchForm = this.fb.group({
            mosqueGuid: this.mosqueGuid,
            productName: [''],
            status: [],
            pageIndex: [],
            pageSize: [],
            isFilter: [false],
        });
        this.GetTresholdProductsList();
    }

    GetTresholdProductsList() {
        this.searchForm.patchValue({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
        });
        let formValue = this.searchForm.value;
        this.masterService
            .getThrsholdProducts(formValue)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.productList = res?.result?.data?.tresholdProducts;
                    this.dataSource = new MatTableDataSource(
                        res?.result?.data?.tresholdProducts
                    );
                    this.dataSource.paginator = this.paginator;
                    this.pageLength = res?.result?.data?.totalCount;
                } else {
                    this.toaster.triggerToast({
                        type: 'info',
                        message: 'Info',
                        description: res?.result?.message,
                    });
                }
            });
    }

    addUpdateProductThreshold(type, data) {
        this.pThresholdForm = this.fb.group({
            mosqueGuid: [this.mosqueGuid],
            mosqueId: [null],
            productId: [null, Validators.required],
            miniThreshold: [
                null,
                [
                    Validators.required,
                    Validators.min(1),
                    Validators.minLength(1),
                    Validators.maxLength(5),
                ],
            ],
            maxThreshold: [
                null,
                [
                    Validators.required,
                    Validators.min(1),
                    Validators.minLength(1),
                    Validators.maxLength(5),
                ],
            ],
            availableQty: [null],
            productName: [null],
        });

        if (type == 'Add') {
            this.pThresholdForm.reset();
            this.isUpdate = false;
            this.pThresholdForm.patchValue({
                mosqueGuid: this.mosqueGuid,
            });
            this.getCategories();
            this.dialog.open(this.thresholdDialog);
        } else {
            this.isUpdate = true;
            this.pThresholdForm.patchValue({
                mosqueGuid: this.mosqueGuid,
                mosqueId: data?.mosqueID,
                productId: data?.productID,
                productName: data?.productName,
                availableQty: data?.availableQuantity,
                miniThreshold: data?.miniThreshold,
                maxThreshold: data?.maxThreshold,
            });
            this.dialog.open(this.thresholdDialog);
        }
    }

    closeDialog(): void {
        this.dialog.closeAll();
    }

    getCategories() {
        this.masterService.getParentCategories().subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.categories = res?.result?.data;
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
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

    getSubCategories(pcid: string) {
        this.categoryGuid = pcid;
        this.masterService.getChildCategories(this.categoryGuid).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.subCategories = res?.result?.data;
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
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

    getProducts(cid: string) {
        this.childCategoryGuid = cid;
        const mosqueGuid = this.mosqueGuid === undefined ? '' : this.mosqueGuid;
        this.masterService
            .getProductsThrsholdByCategory(mosqueGuid, this.childCategoryGuid)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        this.products = res?.result?.data;
                    } else {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Validation error',
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

    selectedProduct(data) {
        this.pThresholdForm.patchValue({
            availableQty:
                data?.availableQuantity == null ? 0 : data?.availableQuantity,
        });
    }

    addOrUpdateProductThreshold() {
        if (this.pThresholdForm.invalid) {
            return true;
        }
        let body = this.pThresholdForm?.value;
        this.masterService
            .addUpdateProductThresholds(body)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    this.dialog.closeAll();
                    this.subCategories = [];
                    this.subCategories;
                    this.GetTresholdProductsList();
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }
    ResetFilterList() {
        this.pageSize = 10;
        this.pageIndex = 1;
        this.searchForm.patchValue({
            productName: '',
            status: null,
            isFilter: false,
        });
        this.GetTresholdProductsList();
    }
    SearchFilter() {
        this.searchForm.patchValue({
            isFilter: true,
        });
        this.GetTresholdProductsList();
    }
    onPageChange(event: any): void {
        this.pageIndex = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.GetTresholdProductsList();
    }
}
