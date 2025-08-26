import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MosqueService } from 'app/services/mosque.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-admin-mosques',
  templateUrl: './admin-mosques.component.html',
  styleUrls: ['./admin-mosques.component.scss']
})
export class AdminMosquesComponent implements OnInit {
  imageWIthTextUrl = environment.imageEndPoints.menuLogoWithText;
  isLoading = false;filteredMosques: any=[];
  availableMosques = [];
  imageEndPoints = environment.imageEndPoints;
  direction: string = 'ltr';

  constructor(private sharedService: SharedService, private mosqueService: MosqueService,
    private toaster: ToasterService, private router: Router,
    private translateSerive: LanguageTranslateService,
    private translate: TranslateService,private authService: AuthService,private _router: Router) {
      //set default language
      translate.setDefaultLang(localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language')); 
    
     }

  ngOnInit(): void {
    this.sharedService.direction.subscribe((res) => {
      if (res) {
        this.direction = res;
      }
    });
    this.getMosquesAssigned();
  }

  getMosquesAssigned() {
    this.mosqueService.getMosquesAssignedToUser().subscribe((res: any) => {
      if (res?.result?.success) {
        this.availableMosques = this.filteredMosques = [...res.result.data];
      }
      else {
        this.toaster.triggerToast({ type: 'error', message: 'Validation error', description: res?.result?.message });
      }

    }, err => {
      this.toaster.triggerToast({ type: 'error', message: 'Internal error', description: 'Something went wrong, please try again !' });
    })
  }

  applyFilter(filterValue) {
    const filter = filterValue ? filterValue.toLowerCase().trim() : '';
    if (filter) {
        this.filteredMosques = this.availableMosques.filter(mosque => {
          const name = mosque.mosqueName ? mosque.mosqueName.toLowerCase() : '';
          const location = mosque.mosqueLocation ? mosque.mosqueLocation.toLowerCase() : '';
          return name.includes(filter) || location.includes(filter);
        });
    } else {
        this.filteredMosques = this.availableMosques;
    } 
  }

  launchSelectedMosque(mosqueDetails) {
    this.router.navigate(['/dashboard', mosqueDetails?.mosqueContactGuid])
  }
}
