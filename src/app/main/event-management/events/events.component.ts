import {
    ChangeDetectorRef,
    Component,
    DebugElement,
    OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FuseAlertService } from '@fuse/components/alert';
import { AuthService } from 'app/services/auth.service';
import { MosqueService } from 'app/services/mosque.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import { CommonBaseClass } from 'app/shared/common-abstract-class';
import { CreateUpdateEventComponent } from '../create-update-event/create-update-event.component';
import { MatDialog } from '@angular/material/dialog';
import {
    CalendarEvent,
    CalendarEventTimesChangedEvent,
    CalendarView,
} from 'angular-calendar';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { environment } from 'environments/environment';
import { User } from 'app/core/user/user.types';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { TranslateService } from '@ngx-translate/core';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
    },
};

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
})
export class EventsComponent extends CommonBaseClass implements OnInit {
    eventsList = [];
    eventDisplayType = 'Upcoming';
    assignText = '';
    searchInputControl: FormControl = new FormControl();
    searchKey: string;
    isLoading = false;
    eventByCalendar = false;
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
    hijriMonth = [
        'Muharram',
        'Safar',
        'Rabi al-Awwal',
        'Rabi al-Thani',
        'Jumada al-Awwal',
        'Jumada al-Thani',
        'Rajab',
        'Shaban',
        'Ramadan',
        'Shawwal',
        'Dhu al-Qadah',
        'Dhu al-Hijjah',
    ];
    curdate;
    ministryEventImageUrl = environment.imageEndPoints.ministryEvent;
    ministryEventInactiveImageUrl =
        environment.imageEndPoints.ministryEventInactive;
    mosqueEventImageUrl = environment.imageEndPoints.mosqueEvent;
    mosqueEventInactiveImageUrl =
        environment.imageEndPoints.mosqueEventInactive;

    selectedDate: Date = new Date();
    refresh: Subject<any> = new Subject();
    viewDate: Date = new Date();
    view: CalendarView = CalendarView.Month;
    events: CalendarEvent[];
    activeDayIsOpen: boolean = false;
    eventServerList: Array<any> = [];
    direction: string = 'ltr';
    isAuthenticated: boolean = false;
    currentActions: any;
    user: User;
    noResultsFound: boolean = false;

    constructor(
        private fuseAlertService: FuseAlertService,
        public authService: AuthService,
        private mosqueService: MosqueService,
        private toaster: ToasterService,
        public sharedService: SharedService,
        private dialog: MatDialog,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private cdr: ChangeDetectorRef
    ) {
        super(authService, sharedService);
        this.fuseAlertService.dismiss('assignAlert');
        this.curdate = new Date().getFullYear();
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );
    }

    ngOnInit(): void {
        this.fuseAlertService.dismiss('assignAlert');
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });

        // this._authService.check().subscribe((res) => {
        //   if (res) {
        //       this.isAuthenticated = true;
        //       this.user = AuthUtils._decodeToken(localStorage.getItem("isalaamAccessToken"));
        //       this.user.roleName = JSON.parse(this.user?.roleObject)?.[0]?.RoleName.toUpperCase();
        //   }
        // })

        this.currentActions = this.sharedService.getCurrentPageActions();
        this.getAllEvents();
    }

    getPreviousOrNextMonthEvents(type) {
        const monthType = type === 'previous' ? -1 : type === 'next' ? +1 : +0;
        if (this.eventByCalendar) {
            this.selectedDate.setMonth(
                this.selectedDate.getMonth() + monthType
            );
            this.curdate =
                this.month[this.selectedDate.getMonth()] +
                ' ' +
                this.selectedDate.getFullYear();
            this.getEventsByMonthandYear();
        } else {
            this.selectedDate.setFullYear(
                this.selectedDate.getFullYear() + monthType
            );
            this.curdate = this.selectedDate.getFullYear();
            this.getAllEvents();
        }
    }

    createEvent() {
        const dialogRef = this.dialog.open(CreateUpdateEventComponent, {
            panelClass: 'fullscreen-dialog',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.assignText = `Event <b>“${result?.eventName}”</b> created successfully`;
                this.fuseAlertService.show('assignAlert');
                setTimeout(() => {
                    this.fuseAlertService.dismiss('assignAlert');
                }, 3000);
                this.getAllEvents();
            }
        });
    }

    displayEventsByType(type) {
        this.eventDisplayType = type;
        if (type === 'All') {
            this.eventsList = this.eventServerList;
        } else if (type === 'Past') {
            this.eventsList = this.eventServerList.filter(
                (x) => x.differenceDays > 0
            );
        } else if (type === 'Upcoming') {
            this.eventsList = this.eventServerList.filter(
                (x) => x.differenceDays <= 0
            );
        } else if (type === 'Important') {
            this.eventsList = this.eventServerList.filter(
                (x) => x.isImportantEvent
            );
        }
        if (this.eventByCalendar) {
            this.eventsList.map((x) =>
                x.eventGuid
                    ? ((x.title = x?.eventName),
                      (x.start = new Date(x.eventDate)))
                    : ''
            );
        }
    }

    getAllEvents() {
        // if (this.mosqueInfo) {
        const mosqueGuid =
            this.mosqueInfo?.mosqueContactGuid === undefined
                ? ''
                : this.mosqueInfo?.mosqueContactGuid;
        this.mosqueService
            .getAllEvents(mosqueGuid, this.selectedDate.getFullYear())
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    if (res?.result?.data?.length > 0) {
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
                                    this.month[
                                        new Date(x.eventDate)?.getMonth()
                                    ]),
                                (x.day = String(
                                    new Date(x.eventDate)?.getDate()
                                ).padStart(2, '0'))
                            )
                        );
                        const index = res?.result?.data?.findIndex(
                            (x) =>
                                x.differenceDays === 0 || x.differenceDays < 0
                        );
                        index >= 0
                            ? (res.result.data[index].activeEvent = true)
                            : null;
                    }
                    this.eventServerList = res?.result?.data;
                    this.displayEventsByType(this.eventDisplayType);
                    //this.eventsList = res?.result?.data?.vMMonthEvents;
                    // this.eventsList = this.eventServerList?.filter(x => x.differenceDays <= 0);
                } else {
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
        // }
    }

    getEventsByMonthandYear() {
        // if (this.mosqueInfo) {
        const mosqueGuid =
            this.mosqueInfo?.mosqueContactGuid === undefined
                ? ''
                : this.mosqueInfo?.mosqueContactGuid;
        this.mosqueService
            .getEventsByMonth(
                mosqueGuid,
                this.selectedDate.getMonth(),
                this.selectedDate.getFullYear()
            )
            .subscribe((res: any) => {
                if (res?.result?.success) {
                    if (res?.result?.data?.length > 0) {
                        res?.result?.data?.map((x) =>
                            x.eventGuid
                                ? ((x.title = x?.eventName),
                                  (x.start = new Date(x.eventDate)))
                                : ''
                        );

                        // res?.result?.data?.map(x => (x.differenceDays = Math.floor((Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - Date.UTC(new Date(x.eventDate).getFullYear(), new Date(x.eventDate).getMonth(), new Date(x.eventDate).getDate())) / (1000 * 60 * 60 * 24)), x.month = this.month[new Date(x.eventDate)?.getMonth()], x.day = String(new Date(x.eventDate)?.getDate()).padStart(2, '0')));
                        // const index = res?.result?.data?.findIndex(x => (x.differenceDays === 0 || x.differenceDays < 0));
                        // index >= 0 ? res.result.data[index].activeEvent = true : null;

                        this.eventsList = res?.result?.data;

                        //   if(this.eventDisplayType =="Upcoming"){
                        //     this.eventsList = this.eventsList?.filter(x => x.differenceDays <= 0);
                        //   }
                        // this.cdr.detectChanges();
                        this.eventsList = res?.result?.data
                            ?.map((x) => {
                                if (!x.eventGuid) return null;

                                const eventDate = new Date(x.eventDate);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0); // Zero out time for date-only comparison
                                eventDate.setHours(0, 0, 0, 0); // Same here to compare only the date part

                                // Determine past or future event
                                const cssClass =
                                    eventDate < today
                                        ? 'past-event'
                                        : 'upcoming-event';

                                return {
                                    ...x,
                                    title: x.eventName,
                                    start: eventDate,
                                    cssClass: cssClass, // Add the class here
                                };
                            })
                            .filter((x) => x !== null); // Remove nulls from the array if any
                    } else {
                        this.eventsList = [];
                    }
                } else {
                    this.eventsList = [];
                    this.toaster.triggerToast({
                        type: 'error',
                        message: 'Validation error',
                        description: res?.result?.message,
                    });
                }
            });
        // }
    }

    getEventByDisplayType(event) {
        this.eventByCalendar = event?.checked;
        this.selectedDate = new Date();
        this.viewDate = new Date();
        this.getPreviousOrNextMonthEvents('');
        this.eventDisplayType = 'Upcoming';
        // if (this.eventByCalendar) {
        //   this.curdate = this.month[new Date().getMonth()] + ' ' + new Date().getFullYear();
        //   this.getEventsByMonthandYear();
        // }
        // else {
        //   this.curdate = new Date().getFullYear();
        //   this.getAllEvents();
        // }
    }

    applyFilter(filterValue: string) {
        if (filterValue) {
            this.displayEventsByType(this.eventDisplayType);
            const filteredArray = this.eventsList.filter((obj) => {
                // Check if any property value matches the search value
                return Object.values(obj).some(
                    (value) =>
                        typeof value === 'string' &&
                        value.toLowerCase().includes(filterValue.toLowerCase())
                );
            });
            this.eventsList = filteredArray;
            // Check if any results were found
            this.noResultsFound = filteredArray.length === 0;
        } else {
            this.displayEventsByType(this.eventDisplayType);
            // Reset the noResultsFound flag when filter is empty
            this.noResultsFound = false;
        }
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.getEventDetails(event);
        // this.modalData = { event, action };
        // this.modal.open(this.modalContent, { size: 'lg' });
    }

    addEvent(): void {
        this.events = [
            ...this.events,
            {
                title: 'New event',
                start: startOfDay(new Date()),
                end: endOfDay(new Date()),
                color: colors.red,
                draggable: true,
                resizable: {
                    beforeStart: true,
                    afterEnd: true,
                },
            },
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
                this.getAllEvents();
            }
        });
    }

    deleteEvent(eventToDelete: CalendarEvent) {
        this.events = this.events.filter((event) => event !== eventToDelete);
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

    dayClicked({
        date,
        events,
    }: {
        date: Date;
        events: CalendarEvent[];
    }): void {
        if (isSameMonth(date, this.viewDate)) {
            this.viewDate = date;
            if (
                (isSameDay(this.viewDate, date) &&
                    this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd,
    }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map((iEvent) => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd,
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }
}
