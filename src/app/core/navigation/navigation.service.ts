import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, catchError, tap, throwError } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        return this._httpClient.get<Navigation>(environment.apiURL + environment.apiEndPoints.getNavigationList).pipe(
            // return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            catchError((error: any) => {
                // Handle the error here, you can log it or perform any other actions you need.
                console.error('API Error:', error);

                // Rethrow the error to propagate it further if needed.
                return throwError(error);
            }),
            tap((navigation: any) => {
                // this._navigation.next(navigation);
                if (navigation?.result?.success) {
                    this._navigation.next(navigation?.result?.data);
                }
            })
        );
    }

    
}
