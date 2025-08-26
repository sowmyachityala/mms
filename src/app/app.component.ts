import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SharedService } from './services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminMosquesComponent } from './main/mosque-admin/admin-mosques/admin-mosques.component';
import { AvailableAdminMosquesComponent } from './common/available-admin-mosques/available-admin-mosques.component';
import { environment } from 'environments/environment';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    mosqueInfo: any;
    direction: string = '';
    myKey: string = environment.GoogleMapAPIKey;
    mySubscription;
    /**
     * Constructor
     */
    constructor(
        private sharedService: SharedService,
        private dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.mySubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
            }
        });
    }

    ngOnInit(): void {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
        this.sharedService.mosqueProfileName.subscribe((res) => {
            if (res) {
                res.mosqueName = res?.mosqueName.toLowerCase();
                this.mosqueInfo = res;
            } else if (this.sharedService?.mosqueInfo) {
                this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            }
        });
        this.loadScript(
            'https://maps.googleapis.com/maps/api/js?key=' + this.myKey
        ).then(() => {
            //console.log('Success');
        });
        //this.loadGoogleMaps();
    }

    loadScript(name: string) {
        return new Promise<void>((resolve, reject) => {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = name;
            document.getElementsByTagName('head')[0].appendChild(script);
            resolve();
        });
    }

    initMap() {}

    ngOnDestroy() {
        if (this.mySubscription) {
            this.mySubscription.unsubscribe();
        }
    }

    loadGoogleMaps() {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.myKey}`;
        script.defer = true;
        script.async = true;
        document.body.appendChild(script);
    }
}
