import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MinistryService {
  baseUrl = environment.apiURL;
  constructor(private http: HttpClient) { }

  getAllMosquesList() {
    return this.http.get(this.baseUrl + environment.apiEndPoints.getAllMosqueList)
  }
   getAllMosquesListWithFilter(body) {
     return this.http.post(
            this.baseUrl + environment.apiEndPoints.getAllMosqueListFilter,
            body
        );
  }
}
