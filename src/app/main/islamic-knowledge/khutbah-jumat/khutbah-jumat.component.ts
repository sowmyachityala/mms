import {
    Component,
    ElementRef,
    HostListener,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-khutbah-jumat',
    templateUrl: './khutbah-jumat.component.html',
    styleUrl: './khutbah-jumat.component.scss',
})
export class KhutbahJumatComponent {
    constructor(private router: Router) {}
    @ViewChild('iconScroll', { static: true }) iconScroll!: ElementRef;
    @ViewChildren('iconItem') iconItemElements!: QueryList<ElementRef>;
    showScrollToTop = false;
    scrollToSection(id: string) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    activeIndex: number = 9;
    menuItems = [
        {
            image: 'assets/images/islamic-knowledge/99-names.png',
            english: '99 Names of Allah',
            label: 'Asmaul Husna',
        },
        {
            image: 'assets/images/islamic-knowledge/Islamic_Phrases.png',
            english: 'Key Islamic Phrases',
            label: 'Frasa Islami Penting',
        },
        {
            image: 'assets/images/islamic-knowledge/Rukun_Iman.png',
            english: 'Rukun Iman',
            label: 'Rukun Iman',
        },
        {
            image: 'assets/images/islamic-knowledge/Five_Pillers.png',
            english: 'Five Pillars of Islam',
            label: 'Rukun Islam',
        },
        {
            image: 'assets/images/islamic-knowledge/Wudu_Guide.png',
            english: 'Wudu Guide',
            label: 'Panduan Wudu',
        },
        {
            image: 'assets/images/islamic-knowledge/Baccan.png',
            english: 'Bacaan Salat',
            label: 'Bacaan Salat',
        },
        {
            image: 'assets/images/islamic-knowledge/Daily_Hadith.png',
            english: 'Daily Hadith',
            label: 'Hadit Harian',
        },
        {
            image: 'assets/images/islamic-knowledge/Daily_Ayat.png',
            english: 'Daily Ayat Al-Quran',
            label: 'Ayat Harian',
        },
        {
            image: 'assets/images/islamic-knowledge/Dakwah.png',
            english: 'Dakwah Harian',
            label: 'Dakwah Harian',
        },
        {
            image: 'assets/images/islamic-knowledge/KhutubahJumat.png',
            english: 'Khutbah Jumat',
            label: 'Khutbah Jumat',
        },
        {
            image: 'assets/images/islamic-knowledge/Doa_Harian.png',
            english: 'Doa Harian',
            label: 'Doa Harian',
        },
        {
            image: 'assets/images/islamic-knowledge/Ramadan.png',
            english: 'Ramadan',
            label: 'Ramadan',
        },
    ];

    scrollIcons(direction: 'left' | 'right'): void {
        const container = document.getElementById('iconScroll');
        const scrollAmount = 150;

        if (container) {
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    }

    ngAfterViewInit() {
        this.scrollToActiveItem();
    }

    scrollToActiveItem() {
        const activeElement = this.iconItemElements.toArray()[this.activeIndex];
        if (activeElement) {
            const container = this.iconScroll.nativeElement;
            const element = activeElement.nativeElement;
            container.scrollTo({
                left:
                    element.offsetLeft -
                    container.offsetWidth / 2 +
                    element.offsetWidth / 2,
                behavior: 'smooth',
            });
        }
    }

    navigateToPage(label: string, index: number): void {
        this.activeIndex = index;
        switch (label) {
            case 'Asmaul Husna':
                this.router.navigate(['/islamic-knowledge/nintynine-names']);
                break;
            case 'Bacaan Salat':
                this.router.navigate(['/islamic-knowledge/baccan-shalat']);
                break;
            case 'Panduan Wudu':
                this.router.navigate(['islamic-knowledge/wudu-guide']);
                break;
            case 'Frasa Islami Penting':
                this.router.navigate(['islamic-knowledge/islamic-phrases']);
                break;
            case 'Hadit Harian':
                this.router.navigate(['islamic-knowledge/daily-hadith']);
                break;
            case 'Ayat Harian':
                this.router.navigate(['islamic-knowledge/daily-ayat']);
                break;
            case 'Rukun Iman':
                this.router.navigate(['islamic-knowledge/rukun-iman']);
                break;
            case 'Dakwah Harian':
                this.router.navigate(['islamic-knowledge/dakwah']);
                break;
            case 'Rukun Islam':
                this.router.navigate(['islamic-knowledge/rukun-islam']);
                break;
            case 'Khutbah Jumat':
                this.router.navigate(['islamic-knowledge/khutbah-jumat']);
                break;
            case 'Doa Harian':
                this.router.navigate(['islamic-knowledge/daily-duas']);
                break;
            case 'Ramadan':
                this.router.navigate(['islamic-knowledge/insp-greetings']);
                break;
            default:
                this.router.navigate(['/islamic-knowledge/nintynine-names']);
                break;
        }
    }

    vectorImage = 'assets/images/islamic-knowledge/khutbah-jumat/vector.png';

    khutbahItems = [
        {
            title: 'KHUTBAH EMPAT CIRI SURGA DUNIA',
            id: 'khutbah-empat-ciri-surga-dunia',
        },
        {
            title: 'KHUTBAH NIAT DAN AMAL YANG IHSAN',
            id: 'khutbah-niat-dan-amal-yang-ihsan',
        },
        {
            title: 'KHUTBAH EMPAT BENTUK HIJRAH',
            id: 'khutbah-empat-bentuk-hijrah',
        },
    ];
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
