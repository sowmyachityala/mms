import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';

interface SubPanel {
    modelName: string;
    modelId: number;
    subTitle: string;
    isSum: boolean;
}

interface Panel {
    title: string;
    expanded: boolean;
    subPanels: SubPanel[];
}

@Component({
    selector: 'app-zakat-calculator',
    templateUrl: './zakat-calculator.component.html',
    styleUrl: './zakat-calculator.component.scss',
})
export class ZakatCalculatorComponent {
    direction: string = 'ltr';
    isAuthenticated: boolean = false;
    totalAssets: number = 0;
    zakathDue: number = 0;
    minTotalAssets: number = 80933;
    newCalc: boolean = false;
    zakathCalc = [];
    zakatCalculator = environment.imageEndPoints.zakatCalculator;
    trashIcon = environment.imageEndPoints.trashIcon;
    zakatId: number = 0;
    currencyType: string;

    panels: Panel[] = [
        {
            title: 'money',
            expanded: true,
            subPanels: [
                {
                    modelName: 'cashInHands',
                    modelId: null,
                    subTitle: 'cashInHands',
                    isSum: true,
                },
                {
                    modelName: 'cashInBankAccounts',
                    modelId: null,
                    subTitle: 'cashInBankAccounts',
                    isSum: true,
                },
                {
                    modelName: 'pension',
                    modelId: null,
                    subTitle: 'pension',
                    isSum: true,
                },
                {
                    modelName: 'otherAssets',
                    modelId: null,
                    subTitle: 'otherAssets',
                    isSum: true,
                },
            ],
        },
        {
            title: 'gold',
            expanded: true,
            subPanels: [
                {
                    modelName: 'gold24Carats',
                    modelId: null,
                    subTitle: 'gold24Karats',
                    isSum: true,
                },
                {
                    modelName: 'gold22Carats',
                    modelId: null,
                    subTitle: 'gold22Karats',
                    isSum: true,
                },
                {
                    modelName: 'gold18Carats',
                    modelId: null,
                    subTitle: 'gold18Karats',
                    isSum: true,
                },
            ],
        },
        {
            title: 'silver',
            expanded: true,
            subPanels: [
                {
                    modelName: 'silver',
                    modelId: null,
                    subTitle: 'silver',
                    isSum: true,
                },
            ],
        },
        {
            title: 'investments',
            expanded: true,
            subPanels: [
                {
                    modelName: 'shares',
                    modelId: null,
                    subTitle: 'shares',
                    isSum: true,
                },
                {
                    modelName: 'otherInvestments',
                    modelId: null,
                    subTitle: 'otherInvestments',
                    isSum: true,
                },
            ],
        },
        {
            title: 'realEstate',
            expanded: true,
            subPanels: [
                {
                    modelName: 'rentalIncomes',
                    modelId: null,
                    subTitle: 'rentalIncomes',
                    isSum: true,
                },
                {
                    modelName: 'properties',
                    modelId: null,
                    subTitle: 'propertiesValue',
                    isSum: true,
                },
            ],
        },
        {
            title: 'business',
            expanded: true,
            subPanels: [
                {
                    modelName: 'businessCash',
                    modelId: null,
                    subTitle: 'businessCash',
                    isSum: true,
                },
                {
                    modelName: 'goodsOrStocks',
                    modelId: null,
                    subTitle: 'goodsOrStocks',
                    isSum: true,
                },
            ],
        },
        {
            title: 'preciousStones',
            expanded: true,
            subPanels: [
                {
                    modelName: 'preciousStones',
                    modelId: null,
                    subTitle: 'preciousStones',
                    isSum: true,
                },
            ],
        },
        {
            title: 'debtsLiabilities',
            expanded: true,
            subPanels: [
                {
                    modelName: 'businessPayment',
                    modelId: null,
                    subTitle: 'businessPayment',
                    isSum: false,
                },
                {
                    modelName: 'homePayment',
                    modelId: null,
                    subTitle: 'homePayment',
                    isSum: false,
                },
                {
                    modelName: 'carPayment',
                    modelId: null,
                    subTitle: 'carPayment',
                    isSum: false,
                },
                {
                    modelName: 'loansToFamilyAndOthers',
                    modelId: null,
                    subTitle: 'loansToFamilyAndOthers',
                    isSum: false,
                },
                {
                    modelName: 'creditCardPayment',
                    modelId: null,
                    subTitle: 'creditCardPayment',
                    isSum: false,
                },
                {
                    modelName: 'debtToFamily',
                    modelId: null,
                    subTitle: 'debtToFamilyAndOthers',
                    isSum: false,
                },
            ],
        },
    ];

    constructor(
        public calcDialogRef: MatDialogRef<ZakatCalculatorComponent>,
        private authService: AuthService,
        private toaster: ToasterService,
        private sharedService: SharedService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') || 'id-ID'
        );
    }

    ngOnInit(): void {
        this.sharedService.direction.subscribe(
            (res) => (this.direction = res || 'ltr')
        );

        this.getCalculationList();
    }

    onClose(): void {
        this.calcDialogRef.close();
    }

    IsExpandedChange(event, index) {
        this.panels[index].expanded = event?.checked;
    }

    calculateSum(subPanels: SubPanel[]): number {
        return subPanels.reduce((sum, subPanel) => sum + subPanel.modelId, 0);
    }

    formatNumber(value: number): string {
        return value.toFixed(2);
    }

    calculateTotalAssets(): number {
        this.totalAssets = this.panels.reduce(
            (sum, panel) =>
                sum +
                (panel.title === 'debtsLiabilities'
                    ? -this.calculateSum(panel.subPanels)
                    : this.calculateSum(panel.subPanels)),
            0
        );
        return this.totalAssets;
    }

    calculateZakatDue(): number {
        const totalPayables = this.calculateSum(
            this.panels[this.panels.length - 1].subPanels
        );
        if (this.totalAssets >= this.minTotalAssets) {
            // this.zakathDue =
            //     (this.totalAssets - totalPayables) * 0.025 > 0
            //         ? (this.totalAssets - totalPayables) * 0.025
            //         : 0;
            const calculatedZakat = (this.totalAssets - totalPayables) * 0.025;
            this.zakathDue =
                calculatedZakat > 0 ? Math.round(calculatedZakat) : 0;
        }

        return this.zakathDue;
    }

    modelValue(subValue: SubPanel): void {
        this[subValue.modelName] = subValue.modelId;
    }

    logZakathCalculator(logType): void {
        if (this.totalAssets > 0) {
            const propertiesObject = this.panels.reduce((acc, panel) => {
                panel.subPanels.forEach(
                    (subPanel) => (acc[subPanel.modelName] = subPanel.modelId)
                );
                return acc;
            }, {});

            let extraProperties = {
                //zakatDue: this.zakathDue.toFixed(2),
                zakatDue: this.zakathDue,
                totalAssets: this.totalAssets,
                userCurrency: this.currencyType,
                zakatId: this.zakatId,
            };

            const addAllProperties = {
                ...propertiesObject,
                ...extraProperties,
            };
            this.sharedService
                .logZakathData(addAllProperties)
                .subscribe((res: any) => {
                    if (res?.result?.success) {
                        this.toaster.triggerToast({
                            type: 'success',
                            message: 'Success',
                            description: res?.result?.message,
                        });
                        if (logType == 'DN') {
                            const response = {
                                //zakathDue: this.zakathDue.toFixed(2),
                                zakathDue: this.zakathDue,
                                success: true,
                            };
                            this.calcDialogRef.close(response);
                        } else {
                            this.calcDialogRef.close();
                        }
                    } else {
                        this.toaster.triggerToast({
                            type: 'error',
                            message: 'Validation error',
                            description: res?.result?.message,
                        });
                    }
                });
        } else {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Validation error',
                description: 'Total assets must be greter then zero',
            });
        }
    }

    getCalculationList(): void {
        this.sharedService.getZakathalculations().subscribe((res: any) => {
            if (res?.result?.success) {
                //this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
                this.zakathCalc = res?.result?.data;
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Validation error',
                    description: res?.result?.message,
                });
            }
        });
    }

    getCalculationByZakatId(zakatId): void {
        this.newCalc = true;
        this.zakatId = zakatId;
        this.sharedService
            .getCalculationByZakatId(zakatId)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    const zakatObject = res?.result?.data;
                    this.currencyType = zakatObject.userCurrency;
                    this.panels.forEach((panel) => {
                        panel.subPanels.forEach((subPanel) => {
                            const modelName = subPanel.modelName;
                            if (zakatObject.hasOwnProperty(modelName)) {
                                subPanel.modelId = zakatObject[modelName];
                            }
                        });
                    });
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
    }

    newCalculation(): void {
        this.zakatId = 0;
        this.sharedService.getUserCurrencyType().subscribe((res: any) => {
            if (res?.result?.success) {
                this.currencyType = res?.result?.data;
                this.newCalc = true;
                this.panels.forEach((panel) => {
                    panel.subPanels.forEach((subPanel) => {
                        subPanel.modelId = null;
                    });
                });
                this.zakathDue = 0;
                this.totalAssets = 0;
            } else {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Cancel',
                    description: res?.result?.message,
                });
            }
        });
    }

    deleteCalculationConfirm(zakatId): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete',
            message: 'Are you sure, you want to delete calculation',
            actions: {
                confirm: {
                    label: 'Ok',
                },
            },
        });
        confirmation.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.deleteCalculation(zakatId);
            }
        });
    }

    deleteCalculation(zakatId): void {
        this.sharedService.deleteCalculation(zakatId).subscribe((res: any) => {
            if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
                this.newCalc = false;
                //this.zakatId = 0;
                this.getCalculationList();
            }
        });
    }
}
