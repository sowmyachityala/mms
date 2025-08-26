import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'app/services/shared.service';

@Component({
    selector: 'app-haji-umrah',
    templateUrl: './haji-umrah.component.html',
    styleUrl: './haji-umrah.component.scss',
})
export class HajiUmrahComponent {
    constructor(private router: Router, private sharedService: SharedService) {}

    menuItems = [
        {
            image: 'assets/images/haji-umrah/pengetahuan-haji.png',
            label: 'Pengetahuan Haji',
        },
        {
            image: 'assets/images/haji-umrah/doa.png',
            label: 'Doa Haji',
        },
        {
            image: 'assets/images/haji-umrah/destinasi.png',
            label: 'Destinasi',
        },
        {
            image: 'assets/images/haji-umrah/tempat-tempat.png',
            label: 'Tempat Tempat',
        },
        {
            image: 'assets/images/haji-umrah/tempat-bersejarah.png',
            label: 'Tempat Bersejarah',
        },
    ];

    menuItemsUmrah = [
        {
            image: 'assets/images/haji-umrah/pengetahuan-haji.png',
            label: 'Pengetahuan Umrah',
        },
        {
            image: 'assets/images/haji-umrah/doa-umrah.png',
            label: 'Doa Umrah',
        },
        {
            image: 'assets/images/haji-umrah/destinasi.png',
            label: 'Destinasi',
        },
        {
            image: 'assets/images/haji-umrah/tempat-tempat.png',
            label: 'Tempat Tempat',
        },
        {
            image: 'assets/images/haji-umrah/tempat-bersejarah.png',
            label: 'Tempat Bersejarah',
        },
    ];

    selectedTabIndex = 0;

    ngOnInit() {
       this.selectedTabIndex = this.sharedService.getTabIndex()
    }

    setTab(index: number) {
        this.selectedTabIndex = index;
        this.sharedService.setTabIndex(index);
    }

    get currentMenuItems() {
       return this.selectedTabIndex === 0 ? this.menuItems : this.menuItemsUmrah;
    }

    navigateToPage(label: string): void {
        switch (label) {
            case 'Pengetahuan Haji':
                this.router.navigate(['haji-umrah/pengetahuan-haji']);
                break;
            case 'Doa Haji':
                this.router.navigate(['haji-umrah/doa-haji']);
                break;
            case 'Pengetahuan Umrah':
                this.router.navigate(['haji-umrah/pengetahuan-umrah']);
                break;
            case 'Doa Umrah':
                this.router.navigate(['haji-umrah/doa-umrah']);
                break;
            case 'Destinasi':
                this.router.navigate(['haji-umrah/destinasi']);
                break;
            case 'Tempat Tempat':
                this.router.navigate(['haji-umrah/tempa-mustajab-doa']);
                break;
            case 'Tempat Bersejarah':
                this.router.navigate(['haji-umrah/tempat-bersejarah']);
                break;
        }
    }
}
