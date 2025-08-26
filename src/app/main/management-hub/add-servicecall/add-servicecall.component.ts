import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MasterService } from 'app/services/master.service';
import { ToasterService } from 'app/services/toaster.service';
import { UserManagementService } from 'app/services/user-management.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';

interface Food {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-add-servicecall',
    providers: [provideNativeDateAdapter()],

    templateUrl: './add-servicecall.component.html',
    styleUrl: './add-servicecall.component.scss',
})
export class AddServiceCallComponent implements OnInit {
    categories = [];
    subCategories = [];
    vendorData = [];
    categoryGuid: string = '';
    products = [];
    supplierList = [];
    direction: string = 'ltr';
    uploadedFiles: any = [];
    existedFiles: File[] = [];
    serviceForm: FormGroup;
    isLoading: false;
    isMaxThreshold: boolean = false;
    childCategoryGuid: string = '';
    mosqueGuid: string = '';
    searchInputControl: FormControl = new FormControl();
    fileUploads: { [productId: number]: File | null } = {};
    combinedForm: FormGroup;
    selectedProductIds: number[] = [];
    categoryValue: number;
    parentCategory: any;
    paramId: string;
    serviceCallId: string;
    public minDate = new Date();
    public maxDate: moment.Moment;
    mosqueInfo: any;
    oneClickDisable: boolean = false;
    minVisitToDate: Date;

    constructor(
        private fb: FormBuilder,
        private masterService: MasterService,
        private toaster: ToasterService,
        private userService: UserManagementService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private http: HttpClient,
        private _router: Router,
        private route: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data,
        public addDialogRef: MatDialogRef<AddServiceCallComponent>,
        public sharedService: SharedService,
        private datePipe: DatePipe
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }
    ngOnInit(): void {
        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid;
        }
        if (this.data && this.data?.serviceCallId) {
            this.serviceCallId = this.data?.serviceCallId;
        }

        this.combinedForm = this.fb.group({
            serviceCallId: [''],
            mosqueGuid: [this.mosqueGuid],
            masjidId: [0],
            parentCategory: ['', Validators.required],
            categoryId: ['', Validators.required],
            vendorId: ['', Validators.required],
            adminDescription: [
                '',
                [Validators.required, Validators.maxLength(400)],
            ],
            natureOfFault: [
                '',
                [Validators.required, Validators.maxLength(40)],
            ],
            visitTimeFrom: ['', Validators.required],
            visitTimeTo: ['', Validators.required],
            status: [10, Validators.required],
            selectedProductIds: [[], Validators.required],
            vmServiceCallItem: this.fb.array([]),
        });

        this.getCategories();
        this.getVendorDetails();

        this.combinedForm.get('categoryId').valueChanges.subscribe((value) => {
            // Reset selected products when subcategory changes
            this.resetSelectedProducts();
            console.log('Selected Product IDs:', value);
        });

        this.combinedForm
            .get('selectedProductIds')
            .valueChanges.subscribe((selectedProductIds) => {
                console.log('Selected Product IDs:', selectedProductIds);
            });

        this.combinedForm
            .get('visitTimeFrom')
            ?.valueChanges.subscribe((fromDate: Date) => {
                this.minVisitToDate = fromDate;
            });
    }

    loadServiceCallDetails(serviceCallId: string): void {
        // this.getCategories();
        // Call the backend to get the service call details by `serviceCallId`
        this.masterService.updateServiceCallData(serviceCallId).subscribe(
            (response: any) => {
                if (response?.success) {
                    const serviceCallData = response.data;

                    // Patch the form with the retrieved data
                    this.combinedForm.patchValue({
                        serviceCallId:
                            serviceCallData.vmServiceCall.serviceCallId,
                        mosqueGuid: serviceCallData.vmServiceCall.mosqueGuid,
                        masjidId: serviceCallData.vmServiceCall.masjidId,
                        categoryId: serviceCallData.vmServiceCall.categoryId,
                        vendorId: serviceCallData.vmServiceCall.vendorId,
                        adminDescription:
                            serviceCallData.vmServiceCall.adminDescription,
                        natureOfFault:
                            serviceCallData.vmServiceCall.natureOfFault,
                        visitTimeFrom:
                            serviceCallData.vmServiceCall.visitTimeFrom,
                        visitTimeTo: serviceCallData.vmServiceCall.visitTimeTo,
                        status: serviceCallData.vmServiceCall.status,
                    });
                    serviceCallData.vmServiceCallItem.forEach((item: any) => {
                        this.addProduct(item.productId);
                        const currentSelectedIds =
                            this.combinedForm.get('selectedProductIds').value ||
                            [];

                        // Add the productId to the selected product IDs array
                        if (!currentSelectedIds.includes(item.productId)) {
                            currentSelectedIds.push(item.productId);
                        }

                        // Update the FormControl with the new array
                        this.combinedForm
                            .get('selectedProductIds')
                            .patchValue(currentSelectedIds);
                        // this.onProductSelect(item.productId);
                        //this.uploadedFiles.push(item);
                        const lastIndex = this.selectedProducts.length - 1; // Get the last index of the added product

                        // Now patch the values for this specific product
                        this.selectedProducts.at(lastIndex).patchValue({
                            serviceCallId: item.serviceCallId,
                            base64File: item.base64File,
                            defectImageName: item.defectImageName,
                            defectImagePath: item.defectImagePath,
                            quantity: item.quantity,
                        });
                    });

                    // Patch the products (vmServiceCallItem array) if there are any
                    // this.selectedProducts.clear();

                    // Patch values to the vmServiceCallItem FormArray

                    // Find the categoryGuid by matching categoryParentId
                    const childCategory = this.categories.find(
                        (category) =>
                            category.id ===
                            serviceCallData.vmServiceCall.categoryParentId
                    );

                    if (childCategory) {
                        this.parentCategory = childCategory.categoryGuid;
                        this.categoryValue =
                            serviceCallData.vmServiceCall.categoryId;
                        // Get categoryGuid and pass it to getSubCategories
                        const categoryGuid = childCategory.categoryGuid;
                        this.getSubCategories(categoryGuid);
                        console.log(this.subCategories + 'check');
                    } else {
                        console.error('Parent category not found');
                    }
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Error',
                        description: 'Failed to load service call details.',
                    });
                }
            },
            (error) => {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Error',
                    description:
                        'An error occurred while loading service call details.',
                });
            }
        );
    }

    get selectedProducts(): FormArray {
        return this.combinedForm.get('vmServiceCallItem') as FormArray;
    }

    backToList() {
        this._router.navigate(['managementhub/services']);
    }

    onClose() {
        this.addDialogRef.close();
    }
    resetSelectedProducts() {
        // Clear the FormArray (selected products)
        this.selectedProducts.clear();
        this.combinedForm.get('selectedProductIds').patchValue([]);
        // Optionally reset the products array if needed (based on subcategory change)
        this.products = []; // Reset or fetch new products based on new subcategory
    }

    addProduct(productId: string) {
        const productGroup = this.fb.group({
            serviceCallId: [''],
            productId: [productId],
            base64File: [null],
            defectImageName: ['', Validators.required],
            defectImagePath: [''],
            quantity: [
                '',
                [Validators.required, Validators.min(1), Validators.max(9999)],
            ],
        });
        this.selectedProducts.push(productGroup);
    }

    // removeProduct(index: number) {
    //
    //     this.selectedProducts.removeAt(index);
    // }

    onInputChange(event: any, index: number) {
        const value = event.target.value;
        if (value.length > 4) {
            event.target.value = value.substring(0, 4);
        }
        this.selectedProducts
            .at(index)
            .get('quantity')
            .setValue(event.target.value);
    }

    onProductSelect(event: MatSelectChange) {
        const selectedProductIds = event.value; // Get selected product IDs from mat-select
        this.combinedForm
            .get('selectedProductIds')
            .patchValue(selectedProductIds);

        // Create a set for existing product IDs
        const existingProductIds = new Set(
            this.selectedProducts.controls.map(
                (control) => control.get('productId').value
            )
        );

        // Handle addition of new products
        selectedProductIds.forEach((productId) => {
            if (!existingProductIds.has(productId)) {
                this.addProduct(productId);
            }
        });

        // Handle removal of deselected products
        this.selectedProducts.controls.forEach((control, index) => {
            const productId = control.get('productId').value;
            if (!selectedProductIds.includes(productId)) {
                this.selectedProducts.removeAt(index);
                //this.uploadedFiles[index] = null;
            }
        });
    }

    removeFile(index: number): void {
        // Clear the defectImageName form control
        this.selectedProducts.at(index).get('defectImageName')?.setValue(null);
        this.selectedProducts.at(index).get('defectImagePath')?.setValue(null);

        // Optionally, remove the uploaded file from the uploadedFiles array if needed
        const fileInput: HTMLInputElement | null =
            document.querySelector(`input[type="file"]`);
        if (fileInput) {
            fileInput.value = ''; // Clear the file input
        }
    }

    onFileChange(event: any, index: number) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const control = this.selectedProducts
                .at(index)
                .get('defectImageName');
            this.uploadedFiles[index] = file;
            const minLength = 10;
            let fileName = file.name;
            if (fileName.length > minLength) {
                fileName =
                    fileName.substring(0, minLength) +
                    '...' +
                    fileName.slice(-4);
            }

            this.selectedProducts
                .at(index)
                .get('defectImageName')
                ?.setValue(fileName);

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64File = e.target?.result as string;
                this.selectedProducts
                    .at(index)
                    .get('base64File')
                    ?.setValue(base64File);
            };
            reader.readAsDataURL(file);
            control?.markAsTouched();
        } else {
            // Optionally show an error message if the file is not an image
            this.toaster.triggerToast({
                type: 'error',
                message:
                    'Please upload a valid image file (jpg, jpeg, png, gif).',
                description: '',
            });
            // You can also clear the input or reset the form control here if needed:
            event.target.value = ''; // Clear the input field
        }
    }

    getProductName(productId: string): string {
        const product = this.products.find((p) => p.id === productId);
        return product ? product.productName : '';
    }

    getCategories() {
        this.masterService.getParentCategories().subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.categories = res?.result?.data;
                    if (this.serviceCallId) {
                        this.loadServiceCallDetails(this.serviceCallId);
                    } else {
                        console.log('no service call');
                    }
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

    getVendorDetails() {
        this.masterService.getAllVendorList().subscribe(
            (res: any) => {
                if (res?.success) {
                    this.vendorData = res?.data;
                    console.log(this.vendorData);
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
        //    this.resetSelectedProducts();

        this.categoryGuid = pcid;
        this.isMaxThreshold = false;
        this.masterService.getChildCategories(this.categoryGuid).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.subCategories = res?.result?.data;
                    this.onSubCategoryChange(this.categoryValue);
                    console.log(this.subCategories);
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

    onSubCategoryChange(subCategoryId: number): void {
        console.log(`Selected SubCategory ID: ${subCategoryId}`);
        const selectedSubCategory = this.subCategories.find(
            (category) => category.id === subCategoryId
        );

        if (selectedSubCategory) {
            this.combinedForm
                .get('parentCategory')
                .valueChanges.subscribe((value) => {
                    this.combinedForm.get('categoryId')?.reset();

                    // Reset selected products when subcategory changes
                    this.resetSelectedProducts();
                    console.log('Selected Product IDs:', value);
                });
            console.log(
                `Selected Category Guid: ${selectedSubCategory.categoryGuid}`
            );
            this.getProducts(selectedSubCategory.categoryGuid);
        } else {
            console.error('SubCategory not found for the selected ID.');
        }
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
    formatDate(date: string) {
        const formattedDate = this.datePipe.transform(
            date,
            'dd-MM-yyyy HH:mm:ss'
        );
        console.log(formattedDate); // Example output: "25-12-2024 06:30:00"
        return formattedDate;
    }
    submitForm() {
        this.combinedForm.get('vmServiceCallItem').markAllAsTouched();
        if (this.combinedForm.valid) {
            this.oneClickDisable = true;
            let formValue = this.combinedForm.value;
            if (this.serviceCallId) {
                // const visitTimeFrom = new Date(formValue.visitTimeFrom);
                // visitTimeFrom.setHours(visitTimeFrom.getHours() + 5);
                // visitTimeFrom.setMinutes(visitTimeFrom.getMinutes() + 30);

                // const visitTimeTo = new Date(formValue.visitTimeTo);
                // visitTimeTo.setHours(visitTimeTo.getHours() + 5);
                // visitTimeTo.setMinutes(visitTimeTo.getMinutes() + 30);
                const visitTimeFrom = this.formatDate(formValue.visitTimeFrom);
                const visitTimeTo = this.formatDate(formValue.visitTimeTo);
                const formBody = {
                    VmServiceCall: {
                        serviceCallId: formValue.serviceCallId,
                        mosqueGuid: formValue.mosqueGuid,
                        masjidId: formValue.masjidId,
                        categoryId: formValue.categoryId,
                        vendorId: formValue.vendorId,
                        adminDescription: formValue.adminDescription,
                        natureOfFault: formValue.natureOfFault,
                        visitTimeFrom: this.datePipe.transform(
                            formValue.visitTimeFrom,
                            'yyyy-MM-ddTHH:mm:ss'
                        ),
                        visitTimeTo: this.datePipe.transform(
                            formValue.visitTimeTo,
                            'yyyy-MM-ddTHH:mm:ss'
                        ),
                        status: formValue.status,
                    },
                    VmServiceCallItem: formValue.vmServiceCallItem,
                };

                this.masterService
                    .serviceCallCreate(formBody)
                    .subscribe((res: any) => {
                        if (res?.result.success) {
                            this.toaster.triggerToast({
                                type: 'success',
                                message: 'Success',
                                description: res?.result.message,
                            });
                        } else {
                            this.toaster.triggerToast({
                                type: 'error',
                                message: 'Validation error',
                                description: res?.result.message,
                            });
                        }
                        this.addDialogRef.close(true);
                    });
            } else {
                // const visitTimeFrom = new Date(formValue.visitTimeFrom);
                // visitTimeFrom.setHours(visitTimeFrom.getHours() + 5);
                // visitTimeFrom.setMinutes(visitTimeFrom.getMinutes() + 30);

                // const visitTimeTo = new Date(formValue.visitTimeTo);
                // visitTimeTo.setHours(visitTimeTo.getHours() + 5);
                // visitTimeTo.setMinutes(visitTimeTo.getMinutes() + 30);
                const visitTimeFrom = this.formatDate(formValue.visitTimeFrom);
                const visitTimeTo = this.formatDate(formValue.visitTimeTo);
                const formBody = {
                    VmServiceCall: {
                        serviceCallId: formValue.serviceCallId,
                        mosqueGuid: formValue.mosqueGuid,
                        masjidId: formValue.masjidId,
                        categoryId: formValue.categoryId,
                        vendorId: formValue.vendorId,
                        adminDescription: formValue.adminDescription,
                        natureOfFault: formValue.natureOfFault,
                        visitTimeFrom: this.datePipe.transform(
                            formValue.visitTimeFrom,
                            'yyyy-MM-ddTHH:mm:ss'
                        ),
                        visitTimeTo: this.datePipe.transform(
                            formValue.visitTimeTo,
                            'yyyy-MM-ddTHH:mm:ss'
                        ),
                        status: formValue.status,
                    },
                    VmServiceCallItem: formValue.vmServiceCallItem,
                };

                this.masterService
                    .serviceCallCreate(formBody)
                    .subscribe((res: any) => {
                        if (res?.result.success) {
                            this.toaster.triggerToast({
                                type: 'success',
                                message: 'Success',
                                description:
                                    'Service Call Created successfully',
                            });
                            this.addDialogRef.close(true);
                        } else {
                            this.toaster.triggerToast({
                                type: 'error',
                                message: 'Validation error',
                                description: '',
                            });
                            this.addDialogRef.close();
                        }
                    });
            }
        }
    }
}
