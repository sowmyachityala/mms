import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DonationsService {
    baseUrl = environment.apiURL;
    constructor(private http: HttpClient) {}

    savePaymentDetails(data) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.savePaymentDetailsById,
            data
        );
    }

    getTransactionLogList(mosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getAllTransactions +
                '?mosqueGuid=' +
                mosqueGuid
        );
    }

    getUpcomingEventsForMosque(MosqueGuid) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getUpcomingEventsForMosque +
                '?MosqueGuid=' +
                MosqueGuid
        );
    }

    getAssetInvoice(txId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getAssetInvoice +
                '?txId=' +
                txId,
            { responseType: 'blob' }
        );
    }

    plinkTransactionData(data) {
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.plinkTransactionCallDetails,
            data
        );
    }
    checkMosqueRegForXendit(mosqueId) {
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.checkRegMosqueXendit +
                '?MosqueGuid=' +
                mosqueId
        );
    
    }
    
    regMosqueRegForXendit(body){
    
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.registerMosqueForXenditt,
            body
        );
    }
    
    callXendittMethod(body){
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.callXendittForDonation,
            body
        );
    }
    getAllPayOuts(body){
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.getAllMasjidPayOuts, body
        );
    }
    getAllXenditTransactions(externalId){ 
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getAllXenditTransactions +
                '?ExenditGuid=' +
                externalId
        );
     
    }
    getAllPaymentTransactions(body){ 
        return this.http.post(
            this.baseUrl +
                environment.apiEndPoints.getAllPaymentTransactions,body
        );
     
    }
     
    getMosqueAvailableBalance(externalId){     
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getMosqueAvailableBalance +
                '?ExenditGuid=' +
                externalId
        );
     
    }
    
    getMosqueBankDetailsForPayout(mosqueId){
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getMosqueBankDetails +
                '?MosqueGuid=' +
                mosqueId
        );
    
    }
    
    
    payOutXenditMethod(body){
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.payOutXenditt,
            body
        );
    }

    payRequestToAms(body){
        return this.http.post(
            this.baseUrl + environment.apiEndPoints.workOrderPaymentAms,
            body
        );
    }   
    getBanksForPaymentMode(BankType,MethodType){
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getBanksForPaymentMode +
                '?BankType=' + BankType +'&MethodType=' + MethodType
        );
    }
    getBanksCharges(BankNameId,InputAmount){
        return this.http.get(
            this.baseUrl +
                environment.apiEndPoints.getBanksCharges +
                '?InputAmount=' + InputAmount +'&BankNameId=' + BankNameId
        );
    }
}
