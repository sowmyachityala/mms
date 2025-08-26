import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AuthService } from 'app/services/auth.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { environment } from 'environments/environment';
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
} from 'ng-apexcharts';
import { UpdateQuranicVerseDialogComponent } from '../dialogs/update-quranic-verse-dialog/update-quranic-verse-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DateTime } from 'luxon';
import * as moment from 'moment-timezone';
import { MosqueService } from 'app/services/mosque.service';
import { DatePipe, formatDate } from '@angular/common';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { EventDetailsComponent } from '../event-management/event-details/event-details.component';
import { FuseAlertService } from '@fuse/components/alert';
import { PendingAssetsComponent } from '../mosque-management/pending-asset-donations/pending-assets.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CacheService } from 'app/services/cache.service';
import { EssentialProductsComponent } from './essential-products/essential-products.component';
import { MosqqueFollowerComponent } from '../dialogs/mosque-follower/mosqque-follower.component';
import { TodayAttendiesComponent } from '../dialogs/today-attendies/today-attendies.component';
import { TransactionHistoryComponent } from '../donations/transaction-history/transaction-history.component';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    currentTime: string;
    currentDate = new Date();
    public chartOptions: Partial<ChartOptions>;
    prayerTimings = [];
    imageEndPoints = environment.imageEndPoints;
    totalCards: number = 0;
    currentPage: number = 1;
    pagePosition: string = '0%';
    cardsPerPage: number;
    totalPages: number;
    overflowWidth: string;
    cardWidth: string;
    containerWidth: number;
    @ViewChild('container', { static: true, read: ElementRef })
    container: ElementRef;
    direction: string = 'ltr';
    user: any;
    timeDifferences: { [key: string]: string };
    @HostListener('window:resize') windowResize() {
        let newCardsPerPage = this.getPrayersPerPage();
        if (newCardsPerPage != this.cardsPerPage) {
            this.cardsPerPage = newCardsPerPage;
            this.initializeSlider();
            if (this.currentPage > this.totalPages) {
                this.currentPage = this.totalPages;
                this.populatePagePosition();
            }
        }
    }

    cards = [
        'Card 1',
        'Card 2',
        'Card 3',
        'Card 4',
        'Card 5',
        'Card 6',
        'Card 7',
    ];
    currentIndex = 0;
    verseOfTheDay: any;
    isVODUpdate = false;
    widgetType: string = 'Quranic Verse';
    nextPrayerName: string;
    nextPrayerTime: any;
    nextwebWidgetUri: string = environment.imageEndPoints.dashboardProfile;
    nexthijriDate: any;
    nextgregorianDate: any;
    currentTimeZone: string;
    upcomingEvents = [];
    ministryEventImageUrl = environment.imageEndPoints.ministryEvent;
    ministryEventInactiveImageUrl =
        environment.imageEndPoints.ministryEventInactive;
    mosqueEventImageUrl = environment.imageEndPoints.mosqueEvent;
    mosqueEventInactiveImageUrl =
        environment.imageEndPoints.mosqueEventInactive;
    month = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    mosqueGuid: string = '';
    mosqueInfo: any;
    latitude: any = null;
    longitude: any = null;
    daysLeft: number;
    hoursLeft: number;
    minsLeft: number;
    secsLeft: number;
    timeZone: string = '';
    daysLeftPrayer: number;
    hoursLeftPrayer: number;
    minsLeftPrayer: number;
    secsLeftPrayer: number;
    assignText = '';

    weatherico: string;
    weatherMain: string;
    weatherDesc: string;
    temp: number;

    prayerTimingsInfo$: BehaviorSubject<any> | null = null;
    prayerTimingsSubscription: Subscription | undefined;
    prayerTimingsInfo: any = [];

    yearlyZakatDonations: any = [];
    yearlyTotalDonations: any = [];
    DonationChartDetails: any;

    constructor(
        private sharedService: SharedService,
        private _authService: AuthService,
        private toaster: ToasterService,
        private dialog: MatDialog,
        private mosqueService: MosqueService,
        private datePipe: DatePipe,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private fuseAlertService: FuseAlertService,
        private cacheService: CacheService,
        private cdr: ChangeDetectorRef
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    onLeftArrowClick() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }

    onRightArrowClick() {
        if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
        }
    }

    ngOnInit() {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
        this._authService.check().subscribe((res) => {
            if (res) {
                this.user = AuthUtils._decodeToken(
                    localStorage.getItem('isalaamAccessToken')
                );
                this.user.roleName = JSON.parse(
                    this.user?.roleObject
                )?.[0]?.RoleName;
            }
        });

        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            if (this.mosqueInfo != null) {
                this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid;
                // this.latitude = this.mosqueInfo?.mosqueGeopoints[0].latitude;
                // this.longitude = this.mosqueInfo.mosqueGeopoints[0].longitude;
                this.latitude = this.mosqueInfo?.latitude;
                this.longitude = this.mosqueInfo.longitude;
            }
        }

        this.getCurrentPrayers();

        this.getCurrentTime();
        setInterval(() => {
            this.getCurrentTime();
        }, 1000);

        this.GetVerseOfTheDay(this.widgetType);
        this.GetUpcomingEvents();
        this.getWeatherReport();
        this.getDonationChartDetails();
    }
    getWeatherReport() {
        this.sharedService
            .getWeatherReportByCoordinates(this.latitude, this.longitude)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.weatherico =
                        'http://openweathermap.org/img/w/' +
                        res?.result?.data.weather[0].icon +
                        '.png';
                    this.temp = Math.round(res?.result?.data.main.temp / 10);
                    this.weatherMain = res?.result?.data.weather[0].main;
                    this.weatherDesc = res?.result?.data.weather[0].description;
                    //this.calcDegF = e.value * 9 / 5 + 32;
                    //this.calcDegC = (e.value -32) * 5 / 9;
                }
            });
    }

    getCurrentTime() {
        if (this.timeZone == '') {
            const date = new Date();
            this.currentTime = date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } else {
            const zoneTime = moment(new Date())
                .tz(this.timeZone.toLowerCase())
                .format('YYYY-MM-DDTHH:mm:ss');
            this.currentTime = this.datePipe.transform(zoneTime, 'hh:mm a');
        }
    }
    subscribeToPrayerTimingsInfo(): void {
        if (this.prayerTimingsInfo$) {
            this.prayerTimingsSubscription = this.prayerTimingsInfo$.subscribe(
                (prayerTimingsInfo) => {
                    this.timeZone = prayerTimingsInfo.timezone;
                    this.prayerTimings = prayerTimingsInfo.vMFilterDates;
                    this.prayerTimings.forEach((p) => {
                        setInterval(() => {
                            p.timer = this.nextPrayerStartsIn(p.prayerTime);
                        }, 1000);
                    });

                    this.prayerTimings.forEach((prayerTiming) => {
                        const nextgregorianDate = prayerTiming.gregorianDate;
                        const parts = nextgregorianDate.split(', ');
                        const weekday = parts[0];
                        const month = parts[1].split(' ')[1];
                        const transDay = this.translate.instant(
                            'DayName.' + weekday
                        );
                        const transMonth = this.translate.instant(
                            'MonthName.' + month
                        );
                        prayerTiming.gregorianDate =
                            transDay +
                            ', ' +
                            parts[1].split(' ')[0] +
                            ' ' +
                            transMonth +
                            ' ' +
                            parts[1].split(' ')[2];
                    });

                    if (this.prayerTimings) {
                        this.nextPrayerName = this.prayerTimings[1].prayerName;
                        this.nextPrayerTime = this.prayerTimings[1].prayerTime;
                        this.nextwebWidgetUri =
                            this.prayerTimings[1].webWidgetUri;
                        this.nextgregorianDate =
                            this.prayerTimings[1].gregorianDate;

                        // const nextgregorianDate = this.prayerTimings[1].gregorianDate;
                        // const parts = nextgregorianDate.split(', ');
                        // const weekday = parts[0];
                        // const month = parts[1].split(' ')[1];
                        // const transDay = this.translate.instant('DayName.' + weekday);
                        // const transMonth = this.translate.instant('MonthName.' + month);
                        // this.nextgregorianDate = transDay + ', ' + parts[1].split(' ')[0] + ' ' + transMonth + ' ' + parts[1].split(' ')[2];

                        this.nexthijriDate = this.prayerTimings[1].hijriDate;
                        setInterval(() => {
                            this.leftTime(this.nextPrayerTime);
                        }, 1000);
                    }

                    this.totalCards = this.prayerTimings?.length;
                    this.cardsPerPage = this.getPrayersPerPage();
                    this.initializeSlider();
                }
            );
        }
    }

    getCurrentPrayers(): void {
        this.prayerTimingsInfo$ = this.cacheService.get('prayerTimings');
        if (this.prayerTimingsInfo$) {
            this.subscribeToPrayerTimingsInfo();
        }
        // Fetch server data to update cache and view
        this.sharedService
            .getPrayerTimings(this.latitude, this.longitude)
            .subscribe(
                (res: any) => {
                    if (res?.result?.success) {
                        const currentTimeZone =
                            res?.result?.data?.currentTimeZoneDateTime;
                        res?.result?.data?.vMFilterDates?.forEach((x) => {
                            x.difference =
                                new Date(x?.prayerTime)?.getTime() -
                                new Date(currentTimeZone).getTime();
                            x.hours = Math.floor(x.difference / 3600000);
                            x.minutes = Math.round(
                                (x.difference % 3600000) / 60000
                            );
                            x.timer = [];
                        });

                        // Update prayerTimingsInfo and cache
                        this.prayerTimingsInfo = res?.result?.data;
                        this.prayerTimingsInfo$ = new BehaviorSubject<any>(
                            this.prayerTimingsInfo
                        );
                        this.cacheService.set(
                            'prayerTimings',
                            this.prayerTimingsInfo
                        );
                        this.subscribeToPrayerTimingsInfo();
                    }
                },
                (err) => {
                    console.error('Error fetching prayer timings:', err);
                    // Handle error
                }
            );
    }

    initializeSlider() {
        if (this.totalCards > 4) {
            this.totalPages = Math.ceil(this.totalCards - 3);
        } else {
            this.totalPages = Math.ceil(this.totalCards / this.cardsPerPage);
        }
        this.overflowWidth = `calc(${this.totalPages * 100}% + ${
            this.totalPages * 10
        }px)`;
        this.cardWidth = `calc((${256 / this.totalPages}% - ${
            this.cardsPerPage * 10
        }px) / ${this.cardsPerPage})`;
    }

    getPrayersPerPage() {
        return Math.floor(this.container.nativeElement.offsetWidth / 256);
    }

    changePage(incrementor) {
        this.currentPage += incrementor;
        this.populatePagePosition();
    }

    populatePagePosition() {
        this.pagePosition = `calc(${-20 * (this.currentPage - 1)}% - ${
            60 * (this.currentPage - 1)
        }px)`;
    }

    GetVerseOfTheDay(widgetType: string) {
        this.isVODUpdate = false;
        this.sharedService
            .getVerseOfTheDay(widgetType, this.mosqueGuid)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.verseOfTheDay = res?.result?.data;
                }
            });
    }

    editVerseOftheDay() {
        this.isVODUpdate = true;
    }

    updateQuranicVerseDetails() {
        let ltrButtons = [
            {
                color: 'primary',
                type: 'Confirm',
                label: 'Save',
                buttonClass:
                    this.direction === 'ltr'
                        ? 'mr-2'
                        : this.direction === 'rtl'
                        ? 'ml-2'
                        : '',
            },
            {
                type: 'Cancel',
                label: 'Cancel',
            },
        ];
        let rtlButtons = [
            {
                type: 'Cancel',
                label: 'Cancel',
            },
            {
                color: 'primary',
                type: 'Confirm',
                label: 'Save',
                buttonClass:
                    this.direction === 'ltr'
                        ? 'mr-2'
                        : this.direction === 'rtl'
                        ? 'ml-2'
                        : '',
            },
        ];
        const dialogRef = this.dialog.open(UpdateQuranicVerseDialogComponent, {
            maxWidth: '650px',
            minWidth: '650px',
            // height:'auto',
            data: {
                quranicDetails: this.verseOfTheDay,
                isCreate: true,
                buttons:
                    this.direction === 'ltr'
                        ? ltrButtons
                        : this.direction === 'rtl'
                        ? rtlButtons
                        : ltrButtons,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.GetVerseOfTheDay('Quranic Verse');
            }
        });
    }

    async leftTime(futureDate) {
        let zoneTime = moment(new Date())
            .tz(this.timeZone.toLowerCase())
            .format('YYYY-MM-DDTHH:mm:ss');
        let diffTime = Math.abs(
            new Date(zoneTime).valueOf() - new Date(futureDate).valueOf()
        );
        //let diffTime = new Date(futureDate).valueOf() - new Date(zoneTime).valueOf();
        this.daysLeft = diffTime / (24 * 60 * 60 * 1000);
        this.hoursLeft = (this.daysLeft % 1) * 24;
        this.minsLeft = (this.hoursLeft % 1) * 60;
        this.secsLeft = (this.minsLeft % 1) * 60;
        [this.daysLeft, this.hoursLeft, this.minsLeft, this.secsLeft] = [
            Math.floor(this.daysLeft),
            Math.floor(this.hoursLeft),
            Math.floor(this.minsLeft),
            Math.floor(this.secsLeft),
        ];
        await [this.daysLeft, this.hoursLeft, this.minsLeft, this.secsLeft];
        if (
            (this.hoursLeft == 0 && this.minsLeft == 0 && this.secsLeft == 0) ||
            diffTime == 0
        ) {
            this.getCurrentPrayers();
        }
    }

    GetUpcomingEvents() {
        this.mosqueService
            .getUpcomingEvents(this.mosqueGuid, new Date().getFullYear())
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    res?.result?.data?.map(
                        (x) => (
                            (x.differenceDays = Math.floor(
                                (Date.UTC(
                                    new Date().getFullYear(),
                                    new Date().getMonth(),
                                    new Date().getDate()
                                ) -
                                    Date.UTC(
                                        new Date(x.eventDate).getFullYear(),
                                        new Date(x.eventDate).getMonth(),
                                        new Date(x.eventDate).getDate()
                                    )) /
                                    (1000 * 60 * 60 * 24)
                            )),
                            (x.month =
                                this.month[new Date(x.eventDate)?.getMonth()]),
                            (x.day = String(
                                new Date(x.eventDate)?.getDate()
                            ).padStart(2, '0'))
                        )
                    );
                    this.upcomingEvents = res?.result?.data.filter(
                        (x) => x.differenceDays <= 0
                    );
                    this.upcomingEvents =
                        this.upcomingEvents.length > 4
                            ? this.upcomingEvents.slice(0, 4)
                            : this.upcomingEvents;
                }
            });
    }

    nextPrayerStartsIn(nextPrayer): any {
        let zoneTime = moment(new Date())
            .tz(this.timeZone.toLowerCase())
            .format('YYYY-MM-DDTHH:mm:ss');
        let diffTime = Math.abs(
            new Date(zoneTime).valueOf() - new Date(nextPrayer).valueOf()
        );
        this.daysLeftPrayer = diffTime / (24 * 60 * 60 * 1000);
        this.hoursLeftPrayer = (this.daysLeftPrayer % 1) * 24;
        this.minsLeftPrayer = (this.hoursLeftPrayer % 1) * 60;
        this.secsLeftPrayer = (this.minsLeftPrayer % 1) * 60;
        return [
            Math.floor(this.hoursLeftPrayer),
            Math.floor(this.minsLeftPrayer),
            Math.floor(this.secsLeftPrayer),
        ];
    }

    getEventDetails(item) {
        const dialogRef = this.dialog.open(EventDetailsComponent, {
            panelClass: 'fullscreen-dialog',
            data: {
                eventGuid: item?.eventGuid,
                data: item,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.updated) {
                this.assignText = `Event <b>“${result?.eventName}”</b> updated successfully`;
                this.fuseAlertService.show('assignAlert');
                setTimeout(() => {
                    this.fuseAlertService.dismiss('assignAlert');
                }, 3000);
                this.GetUpcomingEvents();
            }
        });
    }
    getPendingAssets(user) {
        if (
            user?.roleName === 'Super Admin' ||
            user?.roleName === 'Ministry Admin' ||
            user?.roleName === 'Mosque Admin'
        ) {
            const dialogRef = this.dialog.open(PendingAssetsComponent, {
                panelClass: 'fullscreen-dialog',
                data: {
                    mosqueGuid: this.mosqueGuid,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.GetVerseOfTheDay('Quranic Verse');
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Error',
                description: "You don't have access to view pending assets",
            });
        }
    }
    getEssentialProducts(user) {
        if (
            user?.roleName === 'Super Admin' ||
            user?.roleName === 'Ministry Admin' ||
            user?.roleName === 'Mosque Admin'
        ) {
            const dialogRef = this.dialog.open(EssentialProductsComponent, {
                panelClass: 'fullscreen-dialog',
                data: {
                    mosqueGuid: this.mosqueGuid,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                }
            });
        } else {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Error',
                description: "You don't have access to view essential products",
            });
        }
    }

    getFollowerList(user) {
        if (
            user?.roleName === 'Super Admin' ||
            user?.roleName === 'Ministry Admin' ||
            user?.roleName === 'Mosque Admin'
        ) {
            const dialogRef = this.dialog.open(MosqqueFollowerComponent, {
                panelClass: 'fullscreen-dialog',
                data: {
                    mosqueGuid: this.mosqueGuid,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                }
            });
        } else {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Error',
                description: "You don't have access to view",
            });
        }
    }
    getTodayAttendies(user) {
        if (
            user?.roleName === 'Super Admin' ||
            user?.roleName === 'Ministry Admin' ||
            user?.roleName === 'Mosque Admin'
        ) {
            const dialogRef = this.dialog.open(TodayAttendiesComponent, {
                panelClass: 'fullscreen-dialog',
                data: {
                    mosqueGuid: this.mosqueGuid,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                }
            });
        } else {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Error',
                description: "You don't have access to view",
            });
        }
    }

    getTransactionHistory(user) {
        if (
            user?.roleName === 'Super Admin' ||
            user?.roleName === 'Ministry Admin' ||
            user?.roleName === 'Mosque Admin'
        ) {
            const dialogRef = this.dialog.open(TransactionHistoryComponent, {
                panelClass: 'fullscreen-dialog',
                data: {
                    mosqueGuid: this.mosqueGuid,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                }
            });
        } else {
            this.toaster.triggerToast({
                type: 'error',
                message: 'Error',
                description: "You don't have access to view",
            });
        }
    }

    getDonationChartDetails() {
        this.sharedService
            .getDonationChartDetails(this.mosqueGuid)
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    this.DonationChartDetails = res?.result.data;
                    this.yearlyTotalDonations =
                        this.DonationChartDetails.yearlyTotalDonations;
                    this.yearlyZakatDonations =
                        this.DonationChartDetails.yearlyTotalZakatDonations;

                    this.chartOptions = {
                        series: [
                            {
                                name: 'TOTAL SUMBANGAN ZAKAT',
                                data: this.yearlyZakatDonations,
                                color: '#006E8C',
                            },
                            {
                                name: 'TOTAL SUMBANGAN SEDEKAH',
                                data: this.yearlyTotalDonations,
                                color: '#E8BC66',
                            },
                        ],
                        chart: {
                            type: 'bar',
                            height: 260,
                        },
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                columnWidth: '55%',
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        stroke: {
                            show: true,
                            width: 2,
                            colors: ['transparent'],
                        },
                        xaxis: {
                            categories: [
                                'Jan',
                                'Feb',
                                'Mar',
                                'Apr',
                                'May',
                                'Jun',
                                'Jul',
                                'Aug',
                                'Sep',
                                'Oct',
                                'Nov',
                                'Dec',
                            ],
                        },
                        yaxis: {
                            title: {
                                text: 'Rp (thousands)',
                            },
                        },
                        fill: {
                            opacity: 1,
                        },
                        tooltip: {
                            y: {
                                formatter: function (val) {
                                    return 'Rp ' + val + ' thousands';
                                },
                            },
                        },
                        legend: {
                            position: 'top',
                            horizontalAlign: 'left',
                        },
                    };
                }
            });
    }
    ngOnDestroy(): void {
        if (this.prayerTimingsSubscription) {
            this.prayerTimingsSubscription.unsubscribe();
        }
    }
}
