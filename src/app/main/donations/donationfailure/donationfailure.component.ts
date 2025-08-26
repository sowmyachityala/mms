import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donationfailure',
  templateUrl: './donationfailure.component.html',
  styleUrl: './donationfailure.component.scss'
})
export class DonationfailureComponent {

  constructor(private _router: Router,
  ){}

  navigateToDashboard(){
    this._router.navigate(['/dashboard']);
  }

}
