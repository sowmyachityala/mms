import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MasterService {
    baseUrl = environment.apiURL;
    constructor(private http: HttpClient) {}

    getDonationTypes(PurposeFlag, MosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getDonationTypes +
                '?PurposeFlag=' +
                PurposeFlag +
                '&MosqueGuid=' +
                MosqueGuid
        );
    }

    addOrUpdateCategories(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addCategories,
            body
        );
    }

    getParentCategories() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getAllParentCategories
        );
    }

    getChildCategories(categoryId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getChildCategories +
                categoryId
        );
    }

    getParentCategoriesFilter(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.getAllParentCategoriesFilter, body
        );
    }

    getChildCategoriesFilter(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.getChildCategoriesFilter, body
        );
    }

    getProductsByCategory(parentCategoryId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getAllProductsByCategories +
                parentCategoryId
        );
    }
    getProductsByCategoryFilter(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.getAllProdsByCatFilter, body
        );
    }

    addOrUpdateProducts(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addProducts,
            body
        );
    }

    getProductUomList(uomType) {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getProductUom + uomType
        );
    }

    activeOrInactiveCategoryProduct(body) {
        return this.http.put(
            this.baseUrl +
                environment.apiEndPoints.activeInactiveCategoryProduct,
            body
        );
    }

    addOrUpdateInventory(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addMosqueInventoryProduct,
            body
        );
    }

    activeOrInactiveInventory(body) {
        return this.http.put(
            this.baseUrl + environment.apiEndPoints.activeOrInactiveInventory,
            body
        );
    }

    getInventoryTrasactions(inventoryGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.inventoryTransaction +
                inventoryGuid
        );
    }

    stockOutInventoryProduct(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.stockOutInventoryProduct,
            body
        );
    }

    uploadInvoice(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.uploadInvoice,
            body
        );
    }

    getUserDonationTypes() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getUserDonationTypes
        );
    }

    getAllMosques(PurposeFlag) {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getAllMosques+'?PurposeFlag=' + PurposeFlag
        );
    }

    donateAssetForMosque(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.donateAssetForMosque,
            body
        );
    }

    updateProductStatus(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.donatedProductStatus,
            body
        );
    }

    getPendingAssets(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.getPendingAssets,
            body
        );
    }

    getProductsThrsholdByCategory(mosqueGuid, parentCategoryId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getAllProductsThresholdByCategory +
                '?mosqueGuid=' +
                mosqueGuid +
                '&categoryGuid=' +
                parentCategoryId
        );
    }

    getThrsholdProducts(body) {
        return this.http.post(
            this.baseUrl +
                environment.apiEndPoints.getThrsholdProductsByMosque,body
        );
    }

    addUpdateProductThresholds(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.addUpdateThrsholdProducts,
            body
        );
    }

    OrganizationFacilityResources() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.facilityResources
        );
    }

    serviceCallCreate(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.createServiceCall,
            body
        );
    }

    getVendorList(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getVendorDetails +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }

    getAllVendorList() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getAllVendorDataList
        );
    }
    getServiceCallData(mosqueGuid, status) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getServiceCallList +
                '?mosqueGuid=' +
                mosqueGuid +
                '&status=' +
                status
        );
    }
    getServiceCallChildData(serviceCallId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getServiceCallChildList +
                '?ServiceCallId=' +
                serviceCallId
        );
    }

    updateServiceCallData(serviceCallId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.updateServiceCallId +
                '?ServiceCallId=' +
                serviceCallId
        );
    }

    serviceTicketStatusUpdate(body) {
        return this.http.put(
            this.baseUrl + environment.apiEndPoints.serviceCallIdStatusUpdate,
            body
        );
    }

    getWorkOrderCounts(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getWorkOrderCounts +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }

    approveSericeItemEstimation(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.estimatedAmountAccept,
            body
        );
    }

    confirmDonation(body) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.donationConfirm,
            body
        );
    }
    getMosqueQrData() {
        return this.http.get(
            this.baseUrl + environment.apiEndPoints.getMosqueQrInfo
        );
    }
   
}
