import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ExcelService } from 'app/services/Excel/excel.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';

@Component({
  selector: 'app-essential-products', 
  templateUrl: './essential-products.component.html',
  styleUrl: './essential-products.component.scss'
})

export class EssentialProductsComponent {
  direction: string = 'ltr'; searchKey: string;
  dataSource :any= new MatTableDataSource<any>;
  searchInputControl: FormControl = new FormControl();
  displayedColumns = ["productName", "availableQty","miniThreshold","maxThreshold"];
  pageSize:number = 10; pageIndex:number = 0; actionList = [];  pageLength:number = 10; 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions: number[] = [10, 20, 50];
  totalRows:number=0;doneLoading:boolean=true;mosqueGuid: string = '';

  constructor(private toaster: ToasterService,private sharedService: SharedService,
    public activityDialogRef: MatDialogRef<EssentialProductsComponent>,@Inject(MAT_DIALOG_DATA) public data,
    private translateSerive:LanguageTranslateService,private translate: TranslateService,
    private excelService: ExcelService) 
  {
    //set default language
    translate.setDefaultLang(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'));
  }

  ngOnInit(): void {
    this.sharedService.direction.subscribe((res) => {
      if (res) {
        this.direction = res;
      }
    });
     if (this.data && this.data?.mosqueGuid) {
      this.mosqueGuid = this.data?.mosqueGuid;
    }; 
    this.getEssentialProductDetails();
  }

  onClose() {
    this.activityDialogRef.close();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.searchKey = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  pageChangeEvent(event) {
    this.pageSize =event?.pageSize;
    this.pageIndex =event?.pageIndex;
    this.getEssentialProductDetails();
  }

  getEssentialProductDetails() {    
    this.sharedService.getEssentialProductDetails(this.mosqueGuid).subscribe((res: any) => {
      if (res?.result?.success) {
        this.actionList = res?.result?.data;
        this.dataSource = new MatTableDataSource(res?.result?.data);
        this.dataSource.paginator = this.paginator;
        this.totalRows = res?.result?.data?.length;
        this.doneLoading = false;
        setTimeout(() => {
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.length = res?.result?.data?.length;
        });
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    })
  }
  
  exportToExcel(): void {
    //this.excelService.exportToExcel(this.dataSource.data, 'products', 'sheet1');
    // Fetch translated headers
    const translatedHeaders = this.displayedColumns.map(column => this.translate.instant('essentialProducts.' + column));

    // Extract data for export
    const dataToExport = this.dataSource.data.map(item => {
      const translatedColumns: { [key: string]: any } = {};
      this.displayedColumns.forEach(column => {
        translatedColumns[this.translate.instant('essentialProducts.' + column)] = item[column];
      });

      return translatedColumns;
    });   
    // Call export service with translated headers
    this.excelService.exportToExcel(dataToExport, translatedHeaders, 'products', 'sheet1');
  }

}
