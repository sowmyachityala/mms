import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MosqueService {
    baseUrl = environment.apiURL;
    partnerToken: string =
        localStorage.getItem('partnerToken') === null
            ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJPQXV0aENsaWVudCI6IjY2MDJjNzFmZWE0MzFhZmJmZWRlYmY1MyIsIlVzZXIiOnsiX2lkIjoiNjYwM2IwYzVkMzU1YTdhY2ZmZjk0MmYwIiwiaG9tZXMiOlsiNjYwM2IwZjRiYTU5MTQzNmRlNjQ4MmM2Il0sInBhcnRuZXIiOiI2NjAyYjYwZTAzNDg4ZTQxNTI2NjdkMTUifSwiaWF0IjoxNzEzMTU3MzM4LCJleHAiOjE3MTMyNDM3Mzh9.FpoiXN6HIifevARVEpw0fXIV63tZiwGg1Jb9ZOW0qyA'
            : localStorage.getItem('partnerToken');

    constructor(private http: HttpClient) {}

    addOrUpdateMosque(body) {
        if (body.get('mosqueContactGuid') && body.get('id')) {
            return this.http.post(
                this.baseUrl +
                    environment.apiEndPoints.updateExistingMosqueDetails,
                body
            );
        } else {
            return this.http.post(
                this.baseUrl + environment.apiEndPoints.addNewMosque,
                body
            );
        }
    }

    getMosqueProfileDetails(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getMosqueDetails +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }

    getMosqueProfileDetailsWP(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getMosqueDetailsWP +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }

    deactivateMosque(mosqueGuid, flagType) {
        return this.http.put(
            this.baseUrl +
                environment.apiEndPoints.deactivateMosque +
                '?mosqueGuid=' +
                mosqueGuid +
                '&flagType=' +
                flagType,
            ''
        );
    }

    assignAdminToMosque(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.assignRoleUserToMosque,
            body
        );
    }
    assignAdminForMosque(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.assignAdminForMosque,
            body
        );
    }
    searchUsersForMosqueAdminAssigning(mosqueGuId, userInfo) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.searchUsersForAdminAssign +
                '?mosqueGuid=' +
                mosqueGuId +
                '&userFilter=' +
                userInfo
        );
    }

    getMosqueMembers(mosqueGuId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getMosqueMembers +
                '?mosqueGuid=' +
                mosqueGuId
        );
    }

    createOrUpdateMosqueMember(body) {
        if (body.get('memberGuid')) {
            return this.http.put(
                this.baseUrl +
                    environment.apiEndPoints.updateMosquememberDetails,
                body
            );
        } else {
            return this.http.post(
                this.baseUrl + environment.apiEndPoints.addMosqueMember,
                body
            );
        }
    }

    getMosqueMemberInfo(memberGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getMosqueMemberInfo +
                '?memberGuid=' +
                memberGuid
        );
    }

    getAllEvents(mosqueGuId: string, year: number) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getAllEvents +
                '?mosqueGuid=' +
                mosqueGuId +
                '&year=' +
                year
        );
    }

    getEventsByMonth(mosqueGuId, month, year) {
        month = month + 1;
        if (!mosqueGuId) {
            mosqueGuId = '';
        }
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getEventsByMonth +
                '?year=' +
                year +
                '&month=' +
                month +
                '&mosqueGuid=' +
                mosqueGuId
        );
    }

    createOrUpdateEvent(body) {
        if (body.get('eventGuid') && body.get('id')) {
            return this.http.put(
                this.baseUrl +
                    environment.apiEndPoints.updateExistingEventDetails,
                body
            );
        } else {
            return this.http.post(
                this.baseUrl + environment.apiEndPoints.createNewEvent,
                body
            );
        }
    }

    getMosquesAssignedToUser() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getMosquesAssignedForUser
        );
    }

    uploadMosqueProfileOrCoverImage(body) {
        return this.http.post(
            this.baseUrl +
                environment.apiEndPoints.uploadMosqueProfileOrCoverImage,
            body
        );
    }

    uploadMosqueCoverImage(body:FormData) {
        return this.http.put(
            this.baseUrl +
            environment.apiEndPoints.uploadMosqueCoverImage,
            body
        );
    }

    getCoverPhotosForMosque(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
            environment.apiEndPoints.getCoverPhotosForMosque +
            '?mosqueGuid=' +
            mosqueGuid
        )
    }

    deleteMosqueCoverImage(photoGuid) {
        return this.http.get(
            this.baseUrl +
            environment.apiEndPoints.deleteMosqueCoverImages +
            '?photoGuid=' +
            photoGuid
        )
    }

    getEventDetails(eventGuId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getEventDetailsById +
                '?eventGuid=' +
                eventGuId
        );
    }

    updateEventStatus(eventGuId, actionGuId) {
        return this.http.put(
            this.baseUrl +
                environment.apiEndPoints.updateEventStatus +
                '?eventGuid=' +
                eventGuId +
                '&actionGuid=' +
                actionGuId,
            {}
        );
    }

    getUpcomingEvents(mosqueGuid: string, year: number) {
        // return this.http.get(
        //     this.baseUrl + environment.apiEndPoints.getUpcomingEvents
        //          +'?mosqueGuid'+ mosqueGuid + '?year=' +  year
        // );
        return this.http.get(
            `${this.baseUrl}${environment.apiEndPoints.getUpcomingEvents}?mosqueGuid=${mosqueGuid}&year=${year}`
        );
    }

    getPartnerSignInHTMLResponse() {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.partnerSignIn,
            {}
        );
    }

    getPartnerOAuthToken(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.partnerOAuth,
            body
        );
    }

    getEnergyConsumption(body) {
        const customHeaders = new HttpHeaders().set(
            'Partner-Token',
            this.partnerToken
        );
        const options = { headers: customHeaders };
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.energyCosumption,
            body,
            options
        );
    }

    getSwitchQueryData(body) {
        const customHeaders = new HttpHeaders().set(
            'Partner-Token',
            this.partnerToken
        );
        const options = { headers: customHeaders };
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.switchQueryData,
            body,
            options
        );
    }

    updateSwitchData(body) {
        const customHeaders = new HttpHeaders().set(
            'Partner-Token',
            this.partnerToken
        );
        const options = { headers: customHeaders };
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.updateSwitchData,
            body,
            options
        );
    }

    getTemperatureSensorData(body) {
        const customHeaders = new HttpHeaders().set(
            'Partner-Token',
            this.partnerToken
        );
        const options = { headers: customHeaders };
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.TemperatureSensor,
            body,
            options
        );
    }

    PartnerRefreshToken(body) {
        const customHeaders = new HttpHeaders().set(
            'Partner-Token',
            this.partnerToken
        );
        const options = { headers: customHeaders };
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.PartnerRefreshToken,
            body,
            options
        );
    }

    SetAcTemperature(body) {
        const customHeaders = new HttpHeaders().set(
            'Partner-Token',
            this.partnerToken
        );
        const options = { headers: customHeaders };
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.SetAcTemperature,
            body,
            options
        );
    }

    getMosqueTypes() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getMosqueTypes
        );
    }

    getMasterLocations() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getMasterLocations
        );
    }

    getAllCountries() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getCountries
        );
    }

    getAllLocations(Id, typeId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getLocations +
                '?Id=' +
                Id +
                '&typeId=' +
                typeId
        );
    }
    getMosqueCompleteProfileDetails(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getCompleteMosqueDetails +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }

    getMosqueCompleteProfileDetailsWNP(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getCompleteMosqueDetailsWNP +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }

    getNextPrayerForMosque(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getNextPrayerForMosque +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }

    getAllImamMasterData() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getImamMasters
        );
    }
    addOrUpdateImamProfile(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addImamProfile,
            body
        );
    }
    getImamProfileData(keyMemberId, roleName) {
        if (roleName == 'Imam') {
            return this.http.get(
                this.baseUrl +
                    environment.apiEndPoints.getImamProfileData +
                    '?imamUserId=' +
                    keyMemberId
            );
        } else {
            return this.http.get(
                this.baseUrl +
                    environment.apiEndPoints.getUserProfileData +
                    '?keyMemberId=' +
                    keyMemberId
            );
        }
    }
    VerifyImamProfile() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.verifyImamProfile
        );
    }
    getAssignedMosqueKeyMembers(mosqueGuId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getAssignedMosqueKeyMembers +
                '?mosqueGuid=' +
                mosqueGuId
        );
    }
    ToFollowTheMosque(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.toFollowMosque,
            body
        );
    }
    verifyUserExistAsMember(userEmail) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.verifyUserExistAsMember +
                '?userEmail=' +
                userEmail
        );
    }

    sendOnboardRequest(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.sendMosqueOnboardRequest,
            body
        );
    }

    getOnboardMosqueList() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getOnboardMosqueList
        );
    }
    approveOnboardRequest(mosqueGuid) {
        return this.http.put(
            this.baseUrl + environment.apiEndPoints.approveOnboardRequest,
            { MosqueContactGuid: mosqueGuid }
        );
    }
}
