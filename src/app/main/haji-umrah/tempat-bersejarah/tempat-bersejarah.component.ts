import { Location } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tempat-bersejarah',
  templateUrl: './tempat-bersejarah.component.html',
  styleUrl: './tempat-bersejarah.component.scss'
})
export class TempatBersejarahComponent {
  showScrollToTop = false;
   constructor(private router: Router, private location: Location) {}

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
