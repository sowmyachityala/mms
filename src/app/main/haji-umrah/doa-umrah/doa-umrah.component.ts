import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-doa-umrah',
  templateUrl: './doa-umrah.component.html',
  styleUrl: './doa-umrah.component.scss'
})
export class DoaUmrahComponent {
  isOpen: { [key: number]: boolean } = {};
  showScrollToTop = false;
   constructor(private router: Router) {}

    goBack() {
        this.router.navigate(['/haji-umrah']);
    }

    toggleCollapse(index: number): void {
        this.isOpen[index] = !this.isOpen[index];
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
