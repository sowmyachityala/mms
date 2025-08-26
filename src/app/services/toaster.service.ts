import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface toast {
  type: string;
  message: string;
  description: string;
  redirectRoute?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toastService: ToastrService) { }

  triggerToast(toastDetails: toast) {
    this.toastService[toastDetails.type](toastDetails.description, toastDetails.message,{
      setTimeout:5,
    })
  }
  
}
