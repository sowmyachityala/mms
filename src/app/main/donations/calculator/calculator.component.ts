import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';

interface SubPanel {
  modelName: string;
  modelId: number;
  subTitle: string;
}

interface Panel {
  title: string;
  expanded: boolean;
  subPanels: SubPanel[];
}

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  direction: string = 'ltr';
  isAuthenticated: boolean = false;
  totalAssets: number = 0;
  zakathDue: number = 0;
  minTotalAssets:number=80933;
  newCalc:boolean=false;
  zakathCalc=[];

  panels: Panel[] = [
    { title: 'Money', expanded: false, subPanels: [
      { modelName: 'cashInHands', modelId: 0, subTitle: 'Cash In Hand' },
      { modelName: 'cashInBankAccounts', modelId: 0, subTitle: 'Cash In Bank Accounts' }
    ]},
    { title: 'Gold', expanded: false, subPanels: [
      { modelName: 'gold24Carats', modelId: 0, subTitle: 'Gold 24 Carats' },
      { modelName: 'gold22Carats', modelId: 0, subTitle: 'Gold 22 Carats' },
      { modelName: 'gold18Carats', modelId: 0, subTitle: 'Gold 18 Carats' }
    ]},
    { title: 'Silver', expanded: false, subPanels: [
      { modelName: 'silver', modelId: 0, subTitle: 'Silver' }
    ]},
    { title: 'Investments', expanded: false, subPanels: [
      { modelName: 'shares', modelId: 0, subTitle: 'Shares' },
      { modelName: 'otherInvestments', modelId: 0, subTitle: 'Other Investments' }
    ]},
    { title: 'Properties', expanded: false, subPanels: [
      { modelName: 'rentalIncomes', modelId: 0, subTitle: 'Rental Incomes' },
      { modelName: 'properties', modelId: 0, subTitle: 'Properties' }
    ]},
    { title: 'Business', expanded: false, subPanels: [
      { modelName: 'businessCash', modelId: 0, subTitle: 'Business Cash' },
      { modelName: 'goodsOrStocks', modelId: 0, subTitle: 'Goods/Stocks' }
    ]},
    { title: 'Others', expanded: false, subPanels: [
      { modelName: 'pension', modelId: 0, subTitle: 'Pension' },
      { modelName: 'loansToFamilyAndOthers', modelId: 0, subTitle: 'Loan to family & others' },
      { modelName: 'otherAssets', modelId: 0, subTitle: 'Other Assets' }
    ]},
    { title: 'Agriculture', expanded: false, subPanels: [
      { modelName: 'byRainWater', modelId: 0, subTitle: 'By Rain Water' },
      { modelName: 'byIrrigation', modelId: 0, subTitle: 'By Irrigation' },
      { modelName: 'byBoth', modelId: 0, subTitle: 'By both' }
    ]},
    { title: 'Cattle', expanded: false, subPanels: [
      { modelName: 'cow', modelId: 0, subTitle: 'Cow' },
      { modelName: 'camel', modelId: 0, subTitle: 'Camel' },
      { modelName: 'sheep', modelId: 0, subTitle: 'Sheep' }
    ]},
    { title: 'Precious Stones', expanded: false, subPanels: [
      { modelName: 'preciousStones', modelId: 0, subTitle: 'Precious Stones' }
    ]},
    { title: 'Payables', expanded: false, subPanels: [
      { modelName: 'creditCardPayment', modelId: 0, subTitle: 'Credit Card Payment' },
      { modelName: 'homePayment', modelId: 0, subTitle: 'Home Payment' },
      { modelName: 'carPayment', modelId: 0, subTitle: 'Car Payment' },
      { modelName: 'businessPayment', modelId: 0, subTitle: 'Business Payment' },
      { modelName: 'debtToFamily', modelId: 0, subTitle: 'Debit to Family' },
      { modelName: 'debtToOthers', modelId: 0, subTitle: 'Debit to Others' }
    ]}
  ];
  

  constructor(
    public calcDialogRef: MatDialogRef<CalculatorComponent>,
    private authService: AuthService,
    private toaster: ToasterService,
    private sharedService: SharedService,
    private translateSerive: LanguageTranslateService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem('isalaam-language') || 'id-ID');
  }

  ngOnInit(): void {
    this.sharedService.direction.subscribe((res) => this.direction = res || 'ltr');

    this.getCalculationList();
  }

  onClose(): void {
    this.calcDialogRef.close();
  }

  calculateSum(subPanels: SubPanel[]): number {
    return subPanels.reduce((sum, subPanel) => sum + subPanel.modelId, 0);
  }

  modelValue(subValue: SubPanel): void {
    this[subValue.modelName] = subValue.modelId;
  }

  calculateTotalAssets(): number {
    this.totalAssets = this.panels.reduce((sum, panel) => sum + this.calculateSum(panel.subPanels), 0);
    return this.totalAssets;
  }

  formatNumber(value: number): string {
    return value.toFixed(2);
  }

  calculateZakatDue(): number {
    const totalPayables = this.calculateSum(this.panels[this.panels.length-1].subPanels);    
    if(this.totalAssets >= this.minTotalAssets){
      this.zakathDue = (this.totalAssets - totalPayables) * 0.025;
    }
    return this.zakathDue;
  }

  logZakathCalculator(logType): void {
    const propertiesObject = this.panels.reduce((acc, panel) => {
      panel.subPanels.forEach(subPanel => acc[subPanel.modelName] = subPanel.modelId);
      return acc;
    }, {});

    let extraProperties ={
      zakatDue :this.zakathDue,
      totalAssets :this.totalAssets

    };
    const addAllProperties = {...propertiesObject,...extraProperties};
    this.sharedService.logZakathData(addAllProperties).subscribe((res: any) => {
      if (res?.result?.success) {
        this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
        if(logType == 'DN'){
          const response = { totalAssets: this.totalAssets, success: true };
          this.calcDialogRef.close(response);
        }
        else{
          this.newCalc = false;
          this.getCalculationList();
        }
      } else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    });
  }

  getCalculationList():void{
    this.sharedService.getZakathalculations().subscribe((res:any) =>{
      if(res?.result?.success){
        this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
        this.zakathCalc = res?.result?.data;
      }else{
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    })
  }
  

}
