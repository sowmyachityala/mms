import { Component, Inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MasterService } from 'app/services/master.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';
import moment from 'moment';
import { Moment } from 'moment';

@Component({
    selector: 'app-add-inventory',
    templateUrl: './add-inventory.component.html',
    styleUrls: ['./add-inventory.component.scss'],
})
export class AddInventoryComponent {
    categories = [];
    subCategories = [];
    categoryGuid: string = '';
    products = [];
    supplierList = [];
    direction: string = 'ltr';
    inventoryForm: FormGroup;
    mosqueGuid: string;
    mosqueInfo: any;
    currentActions: any;
    childCategoryGuid: string = '';
    isLoading: boolean = false;
    public minDate = new Date();
    //public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public showSpinners = true;
    public showSeconds = true;
    public touchUi = false;
    public color: ThemePalette = 'primary';
    files: any[] = [];
    public dateDisabled = true;
    isMaxThreshold: boolean = false;
    minThreshold: number = 0;
    maxThreshold: number = 0;
    availableQty: number;

    constructor(
        private userService: UserManagementService,
        private toaster: ToasterService,
        private fb: FormBuilder,
        private sharedService: SharedService,
        private masterService: MasterService,
        @Inject(MAT_DIALOG_DATA) public data,
        public addDialogRef: MatDialogRef<AddInventoryComponent>,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }
    ngOnInit(): void {
        if (this.data && this.data?.mosqueGuid) {
            this.mosqueGuid = this.data?.mosqueGuid;
        }

        this.inventoryForm = this.fb.group({
            inventoryGuid: [null],
            mosqueGuid: [this.mosqueGuid],
            categoryId: [null, Validators.required],
            subCategoryId: [null, Validators.required],
            productId: [null, Validators.required],
            selectedUOM: [null],
            supplierId: [null, Validators.required],
            quantity: [null, Validators.required, Validators.min(1)],
            purchasePrice: [null, Validators.required],
            purchaseDate: [null, Validators.required],
            warrentyThru: [null],
        });

        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
        this.currentActions = this.sharedService.getCurrentPageActions();
        this.getCategories();
    }

    onClose() {
        this.addDialogRef.close();
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
        this.isMaxThreshold = false;
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
                        this.getAllSppliersList();
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

    getAllSppliersList() {
        const mosqueGuid = this.mosqueGuid === undefined ? '' : this.mosqueGuid;
        this.userService.getAllSuppliers(mosqueGuid).subscribe((res: any) => {
            if (res?.result?.success) {
                this.supplierList = res?.result?.data;
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }

    selectedProduct(pId, uomName, data) {
        this.inventoryForm.patchValue({ productId: pId, selectedUOM: uomName });
        if (data?.maxThreshold == null) {
            this.availableQty = data?.availableQuantity;
            //this.minThreshold=0;
            //this.maxThreshold=0;
            this.isMaxThreshold = true;
        }
    }
    selectedSupplier(sId) {
        this.inventoryForm.patchValue({ supplierId: sId });
    }

    onFileChange(pFileList: File[]) {
        this.files = Object.keys(pFileList).map((key) => pFileList[key]);
        const file = this.files[0] as File;
        if (file) {
            if (
                !file.type.startsWith('image/') &&
                file.type != 'application/pdf'
            )
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Error',
                    description: 'File type is not allowed: ' + file.type,
                });
        }
        // const file = (event.target as HTMLInputElement).files[0];
        // this.inventoryForm.patchValue({ invoice: this.files[0] });
        // const file = (this.files[0] as File);
        // this.inventoryForm.get('invoice').setValue(file);
        //this.toaster.triggerToast({ type: 'success', message: 'Success', description: "File Upload" });
    }

    addOrUpdateInventory() {
        if (this.inventoryForm.invalid) {
            return true;
        }
        let body = this.inventoryForm?.value;
        //body.Invoice = this.files[0];
        // const formData: FormData = new FormData();
        // formData.append('invoice', this.files[0]);
        // formData.append('body', body);
        //let invoice = this.files[0];
        const formData = new FormData();
        // for (const key of Object.keys(body)) {
        //   const value = body[key];
        //   formData.append(key, value);
        // }
        Object.keys(body).forEach((key) => {
            if (key == 'purchaseDate' || key == 'warrentyThru') {
                const formattedValue =
                    body[key] instanceof Date
                        ? body[key].toISOString()
                        : body[key];
                formData.append(
                    key,
                    formattedValue == null ? '' : formattedValue
                );
            } else {
                formData.append(key, body[key] == null ? '' : body[key]);
            }
        });

        formData.append('invoice', this.files[0]);
        this.masterService
            .addOrUpdateInventory(formData)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.toaster.triggerToast({
                        type: 'success',
                        message: 'Success',
                        description: res?.result?.message,
                    });
                    this.addDialogRef.close(true);
                    //this.addDialogRef.close();
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }

    stringContainsSpecialChars(inPut: string) {
        const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        if (format.test(inPut)) {
            return true;
        } else {
            return false;
        }
    }

    onDateChange(event: MatDatepickerInputEvent<Moment>): void {
        const warrantyThru = event.value;
        const purchaseDate = this.inventoryForm.get('purchaseDate')?.value;

        if (!purchaseDate) {
            this.inventoryForm.get('warrentyThru')?.setValue(null);
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: this.translate.instant(
                    'Inventory.purchaseDateIsRequired'
                ),
            });
        } else if (
            warrantyThru &&
            moment(purchaseDate).isAfter(moment(warrantyThru))
        ) {
            this.inventoryForm.get('warrentyThru')?.setValue(null);
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: this.translate.instant(
                    'Inventory.warrentyDatePurchaseDate'
                ),
            });
        } else {
            this.inventoryForm.get('warrentyThru')?.setValue(warrantyThru);
        }

        this.inventoryForm.updateValueAndValidity();
    }
}
