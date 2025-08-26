import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donationsuccess',
  templateUrl: './donationsuccess.component.html',
  styleUrl: './donationsuccess.component.scss'
})
export class DonationsuccessComponent {

  constructor(private _router: Router,
  ){

  }
  navigateToDashboard(){
    this._router.navigate(['/dashboard']);
  }


}
