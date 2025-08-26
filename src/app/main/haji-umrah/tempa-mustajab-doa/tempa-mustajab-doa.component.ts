import { Location } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tempa-mustajab-doa',
  templateUrl: './tempa-mustajab-doa.component.html',
  styleUrl: './tempa-mustajab-doa.component.scss'
})
export class TempaMustajabDoaComponent {
   showScrollToTop = false;
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
