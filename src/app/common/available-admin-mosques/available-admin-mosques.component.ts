import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MosqueService } from 'app/services/mosque.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-available-admin-mosques',
  templateUrl: './available-admin-mosques.component.html',
  styleUrls: ['./available-admin-mosques.component.scss']
})
export class AvailableAdminMosquesComponent implements OnInit {
  isLoading = false;
  direction: string = 'ltr';
  availableMosques = [];filteredMosques: any=[];
  defaultMosqueImg:string = environment.imageEndPoints.defaultMosqueImg;
  constructor(public adminMosquesRef: MatDialogRef<AvailableAdminMosquesComponent>, private sharedService: SharedService, private mosqueService: MosqueService, private toaster: ToasterService, private router: Router) { }

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

    this.router.navigate(['/dashboard', mosqueDetails?.mosqueContactGuid]);
    setTimeout(() => {
      this.onClose();
    }, 500);
  }

  onClose() {
    this.adminMosquesRef.close();
  }
}
