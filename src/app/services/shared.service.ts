import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    baseUrl = environment.apiURL;
    mosqueProfileName: BehaviorSubject<any> = new BehaviorSubject(null);
    direction: BehaviorSubject<any> = new BehaviorSubject(null);
    langObsevable: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    private profileImageUrlSubject = new BehaviorSubject<string>('');
    profileImageUrl$ = this.profileImageUrlSubject.asObservable();

    private selectedTab = 0;

    constructor(
        private navigation: NavigationService,
        private router: Router,
        private http: HttpClient
    ) {}

    setTabIndex(index: number) {
      this.selectedTab = index;
    }

    getTabIndex(): number {
      return this.selectedTab;
    }

    setMosqueProfile(data) {
        this.mosqueInfo = data;
        this.mosqueProfileName.next(data);
    }

    setDirection(direction) {
        this.direction.next(direction);
    }

    setActiveLanguge(lang: string) {
        this.langObsevable.next(lang);
    }

    /**
     * Setter & getter for mosque info
     */
    set mosqueInfo(data: string) {
        console.log(data);
        sessionStorage.setItem('mosqueInfo', JSON.stringify(data));
    }

    get mosqueInfo(): string {
        return sessionStorage.getItem('mosqueInfo') ?? '';
    }

    updateProfileImageUrl(url: string) {
        this.profileImageUrlSubject.next(url);
    }

    getCurrentPageActions() {
        let actions;
        let response;
        this.navigation.navigation$.subscribe((res: any) => {
            if (res) {
                response = res;
            }
        });
        response?.filter((x) => {
            if (x?.link === this.router.url) {
                actions = {
                    mainMenuActions: x?.mainMenuActions,
                    childMenuActions: [],
                };
                return actions;
            }
            if (x.children?.length > 0) {
                const innerMenuItems = x.children?.filter(
                    (y) => y.link === this.router.url
                );
                if (innerMenuItems?.length > 0) {
                    actions = {
                        mainMenuActions: x?.mainMenuActions,
                        childMenuActions: innerMenuItems[0]?.childMenuActions,
                    };
                    return actions;
                }
            }
        });
        return actions;
    }

    getPrayerTimings(latitude, longitude) {
        if (latitude != null && longitude != null) {
            return this.http.get(
                this.baseUrl +
                    environment.apiEndPoints.getPrayersTimings +
                    '?latitude=' +
                    latitude +
                    '&longitude=' +
                    longitude
            );
        } else {
            return this.http.get(
                this.baseUrl + environment.apiEndPoints.getPrayersTimings
            );
        }
    }

    updateUploadedImage(payload, endPoint) {
        return this.http.put(
            this.baseUrl + environment.apiEndPoints[endPoint],
            payload
        );
    }

    findPlacesBySearchKey(inputKey) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getLocationsBySearch +
                inputKey
        );
    }

    getVerseOfTheDay(widgetType, mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getVerseOfTheDay +
                '?widgetType=' +
                widgetType +
                '&mosqueGuid=' +
                mosqueGuid
        );
    }

    updateVerseOfTheDay(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addOrEditVerseOfTheDay,
            body
        );
    }

    getWeatherReportByCoordinates(latitude, longitude) {
        if (latitude != null && longitude != null) {
            return this.http.get(
                this.baseUrl +
                    environment.apiEndPoints.getWeatherReport +
                    '?latitude=' +
                    latitude +
                    '&longitude=' +
                    longitude
            );
        } else {
            return this.http.get(
                this.baseUrl + environment.apiEndPoints.getWeatherReport
            );
        }
    }

    getIslamicMediaChannels() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getIslamicMediaChannels
        );
    }

    addIslamicChannel(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addIslamicChannel,
            body
        );
    }

    addIslamicVideo(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addIslamicVideo,
            body
        );
    }

    getVideosAndArticles() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getVideosAndArticles
        );
    }

    getIslamicMediaGalleryImages(mosqueGuid, galleryTypeId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getMediaGalleryImages +
                '?mosqueGuid=' +
                mosqueGuid +
                '&galleryTypeId=' +
                galleryTypeId
        );
    }

    deleteMediaGalleryImages(mediaGuid) {
        return this.http.delete(
            this.baseUrl +
                environment.apiEndPoints.deleteMediaGallery +
                '?mediaGuid=' +
                mediaGuid
        );
    }

    deleteMediaGalleryVideos(videoGuid) {
        return this.http.delete(
            this.baseUrl +
                environment.apiEndPoints.deleteMediaGalleryVideos +
                '?videoGuid=' +
                videoGuid
        );
    }
    deleteMediaGalleryChannels(channelGuid) {
        return this.http.delete(
            this.baseUrl +
                environment.apiEndPoints.deleteMediaGalleryChannels +
                '?channelGuid=' +
                channelGuid
        );
    }

    downloadImage(mediaGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.downloadImage +
                '?mediaGuid=' +
                mediaGuid,
            { responseType: 'blob' }
        );
    }

    getUserActivitiesById(pageSize, pageIndex) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getUserActivitiesById +
                '?pageSize=' +
                pageSize +
                '&pageIndex=' +
                pageIndex
        );
    }

    unRegisterUserDeviceId(deviceId) {
        return this.http.delete(
            this.baseUrl +
                environment.apiEndPoints.unRegisterDeviceId +
                '?deviceId=' +
                deviceId
        );
    }

    getKeyMemberTypes() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getKeyMemberTypes
        );
    }

    deRegisterAll(deviceIds) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.deRegisterAll,
            deviceIds
        );
    }

    logZakathData(data) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.loaZakathData,
            data
        );
    }

    getZakathalculations() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.zakatCalculation
        );
    }

    getCalculationByZakatId(zakatId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.calculationByZakatId +
                '?zakatId=' +
                zakatId
        );
    }

    deleteCalculation(zakatId) {
        return this.http.delete(
            this.baseUrl +
                environment.apiEndPoints.deleteCalculation +
                '?zakatId=' +
                zakatId
        );
    }

    getUserCurrencyType() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getUserCurrencyType
        );
    }

    GetRoleAccessLevel() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getAccessLevels
        );
    }
    getEssentialProductDetails(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getEssentialProducts +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }

    deleteBankDetails(bankGuid) {
        return this.http.post(
            this.baseUrl +
                environment.apiEndPoints.InactiveMosqueBank +
                '?BankGuid=' +
                bankGuid,
            null
        );
    }
    getDonationChartDetails(mosqueGuid){
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getDonationChartDetails +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }
    getdailyAyat(){
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.dailyAyathData 
        );
    }
    getHaditTopics(){
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getHaditTopics 
        );
    }
    getDailyHadithTopicById(topicId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.hadithTopicById +
                '?TopikId=' +
                topicId
        );
    }
}
