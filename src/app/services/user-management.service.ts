import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserManagementService {
    baseUrl = environment.apiURL;
    constructor(private http: HttpClient) {}

    getAllUsersList(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.getAllUsersList,
            body
        );
    }

    getAllRoles() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getAllRolesList
        );
    }

    updateUserStatus(userGuId, actionGuId) {
        return this.http.put(
            this.baseUrl +
                environment.apiEndPoints.updateUserStatus +
                '?userGuid=' +
                userGuId +
                '&actionGuid=' +
                actionGuId,
            {}
        );
    }

    getUserProfileById() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getUserProfileById
        );
    }

    uploadUserProfileImage(body: FormData) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.uploadUserProfileImage,
            body
        );
    }

    updateUserProfile(formBody) {
        return this.http.put(
            this.baseUrl + environment.apiEndPoints.updateUserProfile,
            formBody
        );
    }

    getAllRolesNew() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getAllRoles
        );
    }

    getMenuBasedOnRoleId(RoleId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getMenuBasedOnRoleId +
                '?RoleId=' +
                RoleId
        );
    }

    addNewRoleMenuAction(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addNewRoleMenuAction,
            body
        );
    }

    deleteRoleMenusActions(roleId, menuGuid, actionGuid) {
        return this.http.delete(
            this.baseUrl +
                environment.apiEndPoints.deleteRoleMenuAction +
                '?roleId=' +
                roleId +
                '&menuGuid=' +
                menuGuid +
                '&actionGuid=' +
                actionGuid
        );
    }

    getBusinessActions(roleId, menuGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getBusinessActions +
                '?roleId=' +
                roleId +
                '&menuGuid=' +
                menuGuid
        );
    }

    getChildMenuforParent(menuParentId, roleId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getChildMenus +
                '?menuParentId=' +
                menuParentId +
                '&roleId=' +
                roleId
        );
    }

    getAllParentMenus() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getParentMenuList
        );
    }

    getChildMenuById(menuParentId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getChildMenusById +
                '?menuParentId=' +
                menuParentId
        );
    }

    addNewParentMenu(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addParentMenu,
            body
        );
    }

    addNewChildMenu(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addChildMenu,
            body
        );
    }

    getAllBusinessActions() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getAllBusinessActions
        );
    }

    addOrUpdateActions(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addOrUpdateBusinessActions,
            body
        );
    }

    addOrUpdateRole(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addOrUpdateRole,
            body
        );
    }

    activeInactiveMenu(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.activeInactiveMenu,
            body
        );
    }

    getAllSuppliers(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.getAllSuppliers, body
        );
    }

    addOrUpdateSuppliers(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addOrUpdateSuppliers,
            body
        );
    }

    activeOrInactiveSupplier(body) {
        return this.http.put(
            this.baseUrl + environment.apiEndPoints.activeInactiveSupplier,
            body
        );
    }

    getAllInventoryProducts(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getAllInventoryProducts +
                mosqueGuid
        );
    }

    getMasterCurrencyTypes() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.masterCurrencyTypes
        );
    }

    updateCurrency(data) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.updateUserCurrencyType,
            data
        );
    }

    getUnAssignedAdminsForMosque(mosqueGuId, userRoleId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getUnAssignedAdminsForMosque +
                '?mosqueGuId=' +
                mosqueGuId +
                '&roleId=' +
                userRoleId
        );
    }
    switchUserRole(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.switchUserRole,
            body
        );
    }
    getFollowersListForMosque(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getFollowerList +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }
    getTodayAttendiesForMosque(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getTodayAttendies +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }

    getAllBanksList(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getAllBanksList +
                '?MosqueGuid=' +
                mosqueGuid
        );
    }
    addMosqueBankDetails(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addMosqueBank,
            body
        );
    }
    getAllPurposeDataList(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.getAllPurposeDataList,body
        );
    }

    addOrUpdatePurpose(body, isUpdate) {
        if (!isUpdate) {
            return this.http.post(
                this.baseUrl + environment.apiEndPoints.addPurposeData,
                body
            );
        } else {
            return this.http.put(
                this.baseUrl + environment.apiEndPoints.updatePurposeData,
                body
            );
        }
    }

    getAllBankChargesList() {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getAllBankChargesList 
        );
    }
    
}
