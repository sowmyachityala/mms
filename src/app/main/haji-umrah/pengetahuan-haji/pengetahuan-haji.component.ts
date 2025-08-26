import { Location } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pengetahuan-haji',
    templateUrl: './pengetahuan-haji.component.html',
    styleUrl: './pengetahuan-haji.component.scss',
})
export class PengetahuanHajiComponent {
    showScrollToTop= false;
    constructor(private router: Router) {}

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
