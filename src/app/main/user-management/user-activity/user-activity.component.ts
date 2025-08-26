import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent {
  direction: string = 'ltr'; searchKey: string;
  dataSource: any = new MatTableDataSource<any>;
  searchInputControl: FormControl = new FormControl();
  displayedColumns = ["ipAddress", "actionPerformed","createdOn"];
  pageSize:number = 10; pageIndex:number = 0; actionList = [];  pageLength:number = 10; 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions: number[] = [10, 20, 50];
  totalRows:number=0;doneLoading:boolean=true;

  constructor(private toaster: ToasterService,private sharedService: SharedService,
    public activityDialogRef: MatDialogRef<UserActivityComponent>,
    private translateSerive:LanguageTranslateService,private translate: TranslateService) 
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
    this.getUserActivityDetails();
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

  getUserActivityDetails() {    
    this.sharedService.getUserActivitiesById(this.pageSize,this.pageIndex).subscribe((res: any) => {
      if (res?.result?.success) {
        this.actionList = res?.result?.data?.vmUserActivityData;
        this.dataSource = new MatTableDataSource(res?.result?.data?.vmUserActivityData);
        this.dataSource.paginator = this.paginator;
        this.totalRows = res?.result?.data?.totalCount;
        this.doneLoading = false;
        setTimeout(() => {
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.length = res?.result?.data?.totalCount;
        });
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }
    })
  }

  // ngAfterViewInit(): void {   
  //   this.dataSource.paginator = this.paginator;
  // }

  pageChangeEvent(event) {
    this.pageSize =event?.pageSize;
    this.pageIndex =event?.pageIndex;
    this.getUserActivityDetails();
  }

 

}
