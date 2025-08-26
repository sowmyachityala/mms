import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MosqueService } from 'app/services/mosque.service';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-routed-dashboard',
  templateUrl: './routed-dashboard.component.html',
  styleUrls: ['./routed-dashboard.component.scss']
})
export class RoutedDashboardComponent implements OnInit {
  mosqueGuId: any;
  constructor(private activatedRoute: ActivatedRoute, private mosqueService: MosqueService, private sharedService: SharedService, private router: Router) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.mosqueGuId = params.get('id');
    });
  }

  ngOnInit(): void {
    this.getMosqueDetailsById();
  }

  getMosqueDetailsById() {
    this.mosqueService.getMosqueProfileDetails(this.mosqueGuId).subscribe((res: any) => {
      this.sharedService.setMosqueProfile(res.result.data);
      this.router.navigate(['/dashboard']);
    });
  }
}
