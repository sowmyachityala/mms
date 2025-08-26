import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-destinasi',
    templateUrl: './destinasi.component.html',
    styleUrl: './destinasi.component.scss',
})
export class DestinasiComponent {
    constructor(private router: Router) {}
    showScrollToTop= false;
    goBack() {
        this.router.navigate(['/haji-umrah']);
    }

    @HostListener('window:scroll', [])
         onWindowScroll() {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
    
            this.showScrollToTop = scrollTop + clientHeight >= scrollHeight - 20;
        }
    
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
}
