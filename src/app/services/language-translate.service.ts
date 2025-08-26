import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageTranslateService {
  
  baseUrl = environment.apiURL;
  constructor(private http: HttpClient) {   }
  
  getAvailableLanguages() {
    return this.http.get(this.baseUrl + environment.apiEndPoints.getAvailableLanguages);
  }

  getAllTraslations() {
    return this.http.get(this.baseUrl + environment.apiEndPoints.getAllTraslations);
  }

  updateTranslationData(body){
    return this.http.post(this.baseUrl + environment.apiEndPoints.updateTranslationRecord, body);
  }
}
