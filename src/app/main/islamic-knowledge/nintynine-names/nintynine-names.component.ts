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
    selector: 'app-nintynine-names',
    templateUrl: './nintynine-names.component.html',
    styleUrl: './nintynine-names.component.scss',
})
export class NintynineNamesComponent {
    @ViewChild('iconScroll', { static: true }) iconScroll!: ElementRef;
    @ViewChildren('iconItem') iconItemElements!: QueryList<ElementRef>;
    @ViewChild('scrollContainer') scrollContainer!: ElementRef;
    constructor(private router: Router) {}
    activeIndex: number = 0;
    showScrollToTop = false;
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

    audioList = [
        {
            title: 'Maghfiroh M Hussein',
            url: 'https://isalaam.me/mosquehubapi/Resources/Islamic_Knowledge/Hussein.mp3',
        },
        {
            title: 'Opick',
            url: 'https://isalaam.me/mosquehubapi/Resources/Islamic_Knowledge/Opick.mp3',
        },
        {
            title: 'Sharifah Khasif',
            url: 'https://isalaam.me/mosquehubapi/Resources/Islamic_Knowledge/Sharifah_Khasif.mp3',
        },
        {
            title: 'TVRI',
            url: 'https://isalaam.me/mosquehubapi/Resources/Islamic_Knowledge/TVRI.mp3',
        },
        {
            title: 'Dengan Instrumental',
            url: 'https://isalaam.me/mosquehubapi/Resources/Islamic_Knowledge/Dengan_Instrumental.mp3',
        },
    ];

    selectedAudioTitle = '';
    selectedAudioUrl = '';
    isAudioModalOpen = false;

    playAudio(item: { title: string; url: string }) {
        this.selectedAudioTitle = item.title;
        this.selectedAudioUrl = item.url;
        this.isAudioModalOpen = true;

        setTimeout(() => {
            const audio = document.getElementById(
                'audioPlayer'
            ) as HTMLAudioElement;
            if (audio) {
                audio.load();
                audio.play();
            }
        }, 100);
    }
    closeModal() {
        this.isAudioModalOpen = false;
        const audio = document.getElementById(
            'audioPlayer'
        ) as HTMLAudioElement;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

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

    NintyNineNames = [
        {
            id: 1,
            latin: 'Ar-Rahmânu',
            arabic: 'الرَّحْمـٰنُ',
            indonesian: 'Yang Maha Pengasih',
        },
        {
            id: 2,
            latin: 'Ar-Raḫîmu',
            arabic: 'الرَّحِيْمُ',
            indonesian: 'Yang Maha Penyayang',
        },
        {
            id: 3,
            latin: 'Al-Maliku',
            arabic: 'الْمَلِكُ',
            indonesian: 'Yang Maha Merajai/Memerintah',
        },
        {
            id: 4,
            latin: 'Al-Quddûsu',
            arabic: 'الْقُدُّوْسُ',
            indonesian: 'Yang Mahasuci',
        },
        {
            id: 5,
            latin: 'As-Salâmu',
            arabic: 'السَّلاَمُ',
            indonesian: 'Yang Maha Memberi Kesejahteraan',
        },
        {
            id: 6,
            latin: 'Al-Mu’minu',
            arabic: 'الْمُؤْمِنُ',
            indonesian: 'Yang Maha Memberi Keamanan',
        },
        {
            id: 7,
            latin: 'Al-Muhaiminu',
            arabic: 'الْمُهَيْمِنُ',
            indonesian: 'Yang Maha Pemelihara',
        },
        {
            id: 8,
            latin: 'Al-`Azizu',
            arabic: 'الْعَزِيْزُ',
            indonesian: 'Yang Memiliki Mutlak Kegagahan',
        },
        {
            id: 9,
            latin: 'Al-Jabbâru',
            arabic: 'الْجَبَّارُ',
            indonesian: 'Yang Maha Perkasa',
        },
        {
            id: 10,
            latin: 'Al-Mutakabbiru',
            arabic: 'الْمُتَكَبِّرُ',
            indonesian: 'Yang Maha Megah',
        },
        {
            id: 11,
            latin: 'Al-Khâliqu',
            arabic: 'الْخَالِقُ',
            indonesian: 'Yang Maha Pencipta',
        },
        {
            id: 12,
            latin: 'Al-Bâri’u',
            arabic: 'الْبَارِئُ',
            indonesian: 'Yang Maha Melepaskan',
        },
        {
            id: 13,
            latin: 'Al-Mushawwiru',
            arabic: 'الْمُصَوِّرُ',
            indonesian: 'Yang Maha Membentuk Rupa (makhluknya)',
        },
        {
            id: 14,
            latin: 'Al-Ghaffaru',
            arabic: 'الْغَفَّارُ',
            indonesian: 'Yang Maha Pengampun',
        },
        {
            id: 15,
            latin: 'Al-Qahhâru',
            arabic: 'الْقَهَّارُ',
            indonesian: 'Yang Maha Memaksa',
        },
        {
            id: 16,
            latin: 'Al-Wahhâbu',
            arabic: 'الْوَهَّابُ',
            indonesian: 'Yang Maha Pemberi Karunia',
        },
        {
            id: 17,
            latin: 'Ar-Razzâqu',
            arabic: 'الرَّزَّاقُ',
            indonesian: 'Yang Maha Pemberi Rezeki',
        },
        {
            id: 18,
            latin: 'Al-Fattâhu',
            arabic: 'الْفَتَّاحُ',
            indonesian: 'Yang Maha Pembuka Rahmat',
        },
        {
            id: 19,
            latin: 'Al-`Alîmu',
            arabic: 'الْعَلِيْمُ',
            indonesian: 'Yang Maha Mengetahui (Memiliki Ilmu)',
        },
        {
            id: 20,
            latin: 'Al-Qâbidlu',
            arabic: 'الْقَابِضُ',
            indonesian: 'Yang Maha Menyempitkan (makhluknya)',
        },
        {
            id: 21,
            latin: 'Al-Bâsithu',
            arabic: 'الْبَاسِطُ',
            indonesian: 'Yang Maha Melapangkan (makhluknya)',
        },
        {
            id: 22,
            latin: 'Al-Khâfidlu',
            arabic: 'الْخَافِضُ',
            indonesian: 'Yang Maha Merendahkan (makhluknya)',
        },
        {
            id: 23,
            latin: 'Ar-Râfi`u',
            arabic: 'الرَّافِعُ',
            indonesian: 'Yang Maha Meninggikan (makhluknya)',
        },
        {
            id: 24,
            latin: 'Al-Mu`izzu',
            arabic: 'الْمُعِزُّ',
            indonesian: 'Yang Maha Memuliakan (makhluknya)',
        },
        {
            id: 25,
            latin: 'Al-Mudzillu',
            arabic: 'الْمُذِلُّ',
            indonesian: 'Yang Maha Menghinakan (makhluknya)',
        },
        {
            id: 26,
            latin: 'As-Samî`u',
            arabic: 'السَّمِيْعُ',
            indonesian: 'Yang Maha Mendengar',
        },
        {
            id: 27,
            latin: 'Al-Bashîru',
            arabic: 'الْبَصِيْرُ',
            indonesian: 'Yang Maha Melihat',
        },
        {
            id: 28,
            latin: 'Al-Ḫakamu',
            arabic: 'الْحَكَمُ',
            indonesian: 'Yang Maha Menetapkan',
        },
        {
            id: 29,
            latin: 'Al-`Adlu',
            arabic: 'الْعَدْلُ',
            indonesian: 'Yang Mahaadil',
        },
        {
            id: 30,
            latin: 'Al-Lathîfu',
            arabic: 'اللَّطِيْفُ',
            indonesian: 'Yang Mahalembut',
        },
        {
            id: 31,
            latin: 'Al-Khabîru',
            arabic: 'الْخَبِيْرُ',
            indonesian: 'Yang Maha Mengenal',
        },
        {
            id: 32,
            latin: 'Al-Halîmu',
            arabic: 'الْحَلِيْمُ',
            indonesian: 'Yang Maha Penyantun',
        },
        {
            id: 33,
            latin: 'Al-`Azîmu',
            arabic: 'الْعَظِيْمُ',
            indonesian: 'Yang Maha Agung',
        },
        {
            id: 34,
            latin: 'Al-Ghafûru',
            arabic: 'الْغَفُوْرُ',
            indonesian: 'Yang Maha Pengampun',
        },
        {
            id: 35,
            latin: 'Asy-Syakûru',
            arabic: 'الشَّكُوْرُ',
            indonesian: 'Yang Maha Pembalas Budi (berterima kasih)',
        },
        {
            id: 36,
            latin: 'Al-`Aliyyu',
            arabic: 'الْعَلِيُّ',
            indonesian: 'Yang Maha Tinggi',
        },
        {
            id: 37,
            latin: 'Al-Kabîru',
            arabic: 'الْكَبِيْرُ',
            indonesian: 'Yang Maha Besar',
        },
        {
            id: 38,
            latin: 'Al-Hafîzhu',
            arabic: 'الْحَفِيْظُ',
            indonesian: 'Yang Maha Memelihara',
        },
        {
            id: 39,
            latin: 'Al-Muqîtu',
            arabic: 'الْمُقيِتُ',
            indonesian: 'Yang Maha Pemberi Kecukupan',
        },
        {
            id: 40,
            latin: 'Al-Ḫasîbu',
            arabic: 'الْحسِيبُ',
            indonesian: 'Yang Maha Membuat Perhitungan',
        },
        {
            id: 41,
            latin: 'Al-Jalîlu',
            arabic: 'الْجَلِيلُ',
            indonesian: 'Yang Maha Mulia',
        },
        {
            id: 42,
            latin: 'Al-Karîmu',
            arabic: 'الْكَرِيْمُ',
            indonesian: 'Yang Maha Pemurah',
        },
        {
            id: 43,
            latin: 'Ar-Raqîbu',
            arabic: 'الرَّقِيْبُ',
            indonesian: 'Yang Maha Mengawasi',
        },
        {
            id: 44,
            latin: 'Al-Mujîbu',
            arabic: 'الْمُجِيْبُ',
            indonesian: 'Yang Maha Mengabulkan',
        },
        {
            id: 45,
            latin: 'Al-Wâsi`u',
            arabic: 'الْوَاسِعُ',
            indonesian: 'Yang Maha Luas',
        },
        {
            id: 46,
            latin: 'Al-Ḫakîmu',
            arabic: 'الْحَكِيْمُ',
            indonesian: 'Yang Maha Bijaksana',
        },
        {
            id: 47,
            latin: 'Al-Wadûdu',
            arabic: 'الْوَدُودُ',
            indonesian: 'Yang Maha Mengasihi',
        },
        {
            id: 48,
            latin: 'Al-Majîdu',
            arabic: 'الْمَجِيدُ',
            indonesian: 'Yang Maha Mulia',
        },
        {
            id: 49,
            latin: 'Al-Ba`îtsu',
            arabic: 'الْبَاعِثُ',
            indonesian: 'Yang Maha Membangkitkan',
        },
        {
            id: 50,
            latin: 'Asy-Syahîdu',
            arabic: 'الشَّهِيدُ',
            indonesian: 'Yang Maha Menyaksikan',
        },
        {
            id: 80,
            latin: 'At-Tawwabu',
            arabic: 'التَّوَّابُ',
            indonesian: 'Yang Maha Penerima Tobat',
        },
        {
            id: 81,
            latin: 'Al-Muntaqimu',
            arabic: 'الْمُنْتَقِمُ',
            indonesian: 'Yang Maha Penuntut Balas',
        },
        {
            id: 82,
            latin: 'Al-`Afuwwu',
            arabic: 'الْعَفُوُّ',
            indonesian: 'Yang Maha Pemaaf',
        },
        {
            id: 83,
            latin: 'Ar-Ra’ûfu',
            arabic: 'الرَّؤُوْفُ',
            indonesian: 'Yang Maha Pengasih',
        },
        {
            id: 84,
            latin: 'Mâlikul-mulki',
            arabic: 'مَالِكُ الْمُلْكِ',
            indonesian: 'Yang Maha Penguasa Kerajaan (Semesta)',
        },
        {
            id: 85,
            latin: 'Dzul-Jalâli wal-Ikram',
            arabic: 'ذُوْ الْجَلَالِ وَالْاِكْرَامِ',
            indonesian: 'Yang Maha Pemilik Kebesaran dan Kemuliaan',
        },
        {
            id: 86,
            latin: 'Al-Muqsithu',
            arabic: 'الْمُقْسِطُ',
            indonesian: 'Yang Mahaadil',
        },
        {
            id: 87,
            latin: 'Al-Jâmi`u',
            arabic: 'الْجَامِعُ',
            indonesian: 'Yang Maha Mengumpulkan',
        },
        {
            id: 88,
            latin: 'Al-Ghaniyyu',
            arabic: 'الْغَنِيُّ',
            indonesian: 'Yang Maha Berkecukupan',
        },
        {
            id: 89,
            latin: 'Al-Mughnî',
            arabic: 'الْمُغْنِيْ',
            indonesian: 'Yang Maha Memberi Kekayaan',
        },
        {
            id: 90,
            latin: 'Al-Mâni`u',
            arabic: 'الْمَانِعُ',
            indonesian: 'Yang Maha Mencegah',
        },
        {
            id: 91,
            latin: 'Adl-Dlâru',
            arabic: 'الضَّارُ',
            indonesian: 'Yang Maha Memberi Derita',
        },
        {
            id: 92,
            latin: 'An-Nâfi`u',
            arabic: 'النَّافِعُ',
            indonesian: 'Yang Maha Memberi Manfaat',
        },
        {
            id: 93,
            latin: 'An-Nûru',
            arabic: 'النُّوْرُ',
            indonesian: 'Yang Maha Bercahaya (Menerangi, Memberi Cahaya)',
        },
        {
            id: 94,
            latin: 'Al-Hâdî',
            arabic: 'الْهَادِيْ',
            indonesian: 'Yang Maha Pemberi Petunjuk',
        },
        {
            id: 95,
            latin: 'Al-Badî`u',
            arabic: 'الْبَدِيْعُ',
            indonesian: 'Yang Maha Pencipta',
        },
        {
            id: 96,
            latin: 'Al-Bâqî',
            arabic: 'الْبَاقِيْ',
            indonesian: 'Yang Mahakekal',
        },
        {
            id: 97,
            latin: 'Al-Wâritsu',
            arabic: 'الْوَارِثُ',
            indonesian: 'Yang Maha Pewaris',
        },
        {
            id: 98,
            latin: 'Ar-Rasyîdu',
            arabic: 'الرَّشِيْدُ',
            indonesian: 'Yang Mahapandai',
        },
        {
            id: 99,
            latin: 'Ash-Shabûru',
            arabic: 'الصَّبُوْرُ',
            indonesian: 'Yang Mahasabar',
        },
    ];

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
    ngAfterViewInit() {
        this.scrollContainer.nativeElement.addEventListener('scroll', () => {
            const scrollTop = this.scrollContainer.nativeElement.scrollTop;
            this.showScrollToTop = scrollTop > 300;
        });
        this.scrollToActiveItem();
    }
    scrollToTop() {
        this.scrollContainer.nativeElement.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
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
}
