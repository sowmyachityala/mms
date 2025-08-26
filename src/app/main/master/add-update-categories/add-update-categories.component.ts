import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MasterService } from 'app/services/master.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';

@Component({
    selector: 'app-add-update-categories',
    templateUrl: './add-update-categories.component.html',
    styleUrls: ['./add-update-categories.component.scss'],
})
export class AddUpdateCategoriesComponent implements OnInit {
    direction: string = 'ltr';
    categoriesForm: FormGroup;
    productForm: FormGroup;
    isLoading = false;
    categoryParentGuid: any;
    productCategoryParentId: any;
    productUOM: any = [];
    selectedUOM: number;
    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data,
        public addDialogRef: MatDialogRef<AddUpdateCategoriesComponent>,
        private sharedService: SharedService,
        private masterService: MasterService,
        private toaster: ToasterService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private authService: AuthService,
        private _router: Router
    ) {
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    ngOnInit(): void {
        this.categoriesForm = this.fb.group({
            id: [0],
            categoryGuid: [''],
            categoryName: ['', Validators.required],
            categoryDescription: ['', Validators.required],
            categoryParentGuid: [null],
        });
        this.productForm = this.fb.group({
            id: [0],
            productGuid: [''],
            productName: ['', Validators.required],
            productDescription: ['', Validators.required],
            categoryGuid: [null],
            uomId: [1],
        });
        this.getProductUomList();
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
        if (
            this.data?.categoryParentGuid &&
            this.data?.productCategoryParentId
        ) {
            this.productCategoryParentId = this.data?.productCategoryParentId;
            this.categoryParentGuid = this.data?.categoryParentGuid;
            if (!this.data?.type) {
                this.productForm.patchValue({
                    categoryGuid: this.data?.categoryParentGuid,
                });
            }
        } else if (this.data?.categoryParentGuid) {
            this.categoryParentGuid = this.data?.categoryParentGuid;
            if (!this.data?.type) {
                this.categoriesForm.patchValue({
                    categoryParentGuid: this.data?.categoryParentGuid,
                });
            }
        }

        if (this.data?.type) {
            if (this.data?.type === 'Category') {
                this.categoriesForm.patchValue(this.data?.categoryDetails);
            } else if (this.data?.type === 'Sub Category') {
                this.categoriesForm.patchValue(this.data?.categoryDetails);
            } else if (this.data?.type === 'Product') {
                this.productForm.patchValue(this.data?.categoryDetails);
                this.selectedUOM = this.data?.categoryDetails.uomId;
            }
        }
    }

    onClose() {
        this.addDialogRef.close();
    }

    addOrUpdateCategory() {
        if (this.categoriesForm.invalid) {
            return true;
        }
        this.masterService
            .addOrUpdateCategories(this.categoriesForm?.value)
            .subscribe(
                (res: any) => {
                    if (res.result.success) {
                        this.addDialogRef.close({
                            status: true,
                            categoryName:
                                this.categoriesForm?.value?.categoryName,
                        });
                        this.toaster.triggerToast({
                            type: 'success',
                            message: 'Success',
                            description: 'Category added successfully',
                        });
                    } else {
                        if (res.result.statusCode === 409) {
                            this.toaster.triggerToast({
                                type: 'error',
                                message: 'Duplicate Entry',
                                description: res.result.message,
                            });
                        } else {
                            this.toaster.triggerToast({
                                type: 'error',
                                message: 'Error',
                                description: res.result.message,
                            });
                        }
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

    addOrUpdateProduct() {
        if (this.productForm.invalid) {
            return true;
        }
        this.masterService
            .addOrUpdateProducts(this.productForm?.value)
            .subscribe(
                (res: any) => {
                    if (res.result.success) {
                        this.addDialogRef.close({
                            status: true,
                            categoryName: this.productForm?.value?.productName,
                        });
                        this.toaster.triggerToast({
                            type: 'success',
                            message: 'Success',
                            description: 'Product added successfully',
                        });
                    } else {
                        if (res.result.statusCode === 409) {
                            this.toaster.triggerToast({
                                type: 'error',
                                message: 'Duplicate Entry',
                                description: res.result.message,
                            });
                        } else {
                            this.toaster.triggerToast({
                                type: 'error',
                                message: 'Error',
                                description: res.result.message,
                            });
                        }
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

    getProductUomList() {
        this.masterService.getProductUomList('Product').subscribe(
            (res: any) => {
                if (res.result.success) {
                    this.productUOM = res?.result?.data;
                    //this.toaster.triggerToast({ type: 'success', message: 'Success', description: res.result.message });
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
    getUomSelected(event) {
        console.log(event);
    }
}
