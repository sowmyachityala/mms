import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MosqueService } from 'app/services/mosque.service'
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';

@Component({
    selector: 'app-mosque-onboarding',
    templateUrl: './mosque-onboarding.component.html',
    styleUrl: './mosque-onboarding.component.scss',
})
export class MosqueOnboardingRequestComponent {
  isLoading = true;
  searchKey: string;
  pageLength = 0;
  pageSize = 10;
 
  dataSource: any = new MatTableDataSource<any>();
  searchInputControl: FormControl = new FormControl();  

  displayedColumns = [
    'createdOn',
    'mosqueName',
    //'aboutMosque',
    //'mosqueTypeName',
    'establishedYear',
    'mosqueAddress',
    'mosqueLocation',
    'email',
    'website',
    'personIncharge',
    'smAdminEmail',
    'mosqueAdminEmail',
    'mosqueAccountantEmail',
    'action'
  ]

  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentActions: any;
  direction: string = 'ltr';
  onBoardMosqueList = [];

  constructor(
    private mosqueService: MosqueService,
    private toaster: ToasterService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private translateSerive: LanguageTranslateService,
    private translate: TranslateService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) {
    //set default language
    translate.setDefaultLang(
      localStorage.getItem('language') === null ? 'en-US' : localStorage.getItem('language')
    );
  }

  ngOnInit(): void {
    this.sharedService.direction.subscribe((res) => {
      if (res) {
        this.direction = res;
      }
    });
    this.currentActions = this.sharedService.getCurrentPageActions();
    this.getAllOnBoardMosqueList();
  }


  getAllOnBoardMosqueList() {
    this.mosqueService.getOnboardMosqueList().subscribe((res: any) => {
      if(res?.result?.success) {
        this.onBoardMosqueList = res?.result?.data;
        this.dataSource = new MatTableDataSource(res?.result?.data);
        this.dataSource.paginator = this.paginator;
        this.pageLength = res?.result?.data?.length;
      } else {
        this.toaster.triggerToast({
          type: 'error',
          message: 'Validation Error',
          description: res?.result?.message,
        });
      }
    });
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
    event;
  }

  approveOnboardRequest(mosqueContactGuid){
      const confirmation = this._fuseConfirmationService.open({
        title: 'Are you sure you want to accept onboard request',
        message: ``,
        icon: {
            name: 'heroicons_outline:check-circle',
            color: 'success',
        },
        actions: {
            confirm: {
                label: 'Yes',
                color: 'primary',
            },
            cancel: {
                label: 'No'
            },
        },
      });
    confirmation.afterClosed().subscribe((res) => {
        if (res === 'confirmed') {
          this.mosqueService.approveOnboardRequest(mosqueContactGuid).subscribe((res:any) =>{
            if(res?.result?.success) {
              this.toaster.triggerToast({
                type: 'success',
                message: 'Success',
                description: res?.result?.message,
              });
              this.getAllOnBoardMosqueList();
            } else {
              this.toaster.triggerToast({
                type: 'error',
                message: 'Validation Error',
                description: res?.result?.message,
              });
            }
          })
        }
    });
  }
  
}
