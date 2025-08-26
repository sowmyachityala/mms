import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { SharedService } from './shared.service';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _authenticated: boolean = false;
    baseUrl = environment.apiURL;
    private userRole: string;
    private authSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
    authStatus$ = this.authSubject.asObservable();
    private auth = getAuth(initializeApp(environment.firebaseConfig));
    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private navigation: NavigationService,
        private sharedService: SharedService
    ) {}

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        localStorage.removeItem('isalaamAccessToken');
        localStorage.removeItem('loggeduser');
        this.sharedService.setMosqueProfile(null);
        localStorage.clear();
        sessionStorage.clear();
        this._authenticated = false;
        return of(true);
    }

    check(): Observable<boolean> {
        if (
            this._authenticated &&
            !AuthUtils.isTokenExpired(this.isalaamAccessToken)
        ) {
            return of(true);
        }
        if (
            this.isalaamAccessToken &&
            !AuthUtils.isTokenExpired(this.isalaamAccessToken)
        ) {
            return of(true);
        }

        if (
            AuthUtils.isTokenExpired(this.isalaamAccessToken) &&
            this.isalaamAccessToken
        ) {
            this.signOut();
            return of(false);
        }

        return of(false);
    }

    newUserSignUp(body) {
        return this.httpClient.post(
            this.baseUrl + environment.apiEndPoints.signUpUser,
            body
        );
    }

    hasRole(expectedRole: string): boolean {
        const userDetails = AuthUtils._decodeToken(this.isalaamAccessToken);
        this.userRole = JSON.parse(
            userDetails.roleObject
        )?.[0]?.RoleName.toUpperCase();
        return this.userRole === expectedRole;
    }

    isExpectedRole(expectedRoles: any): boolean {
        if (this.isalaamAccessToken != '') {
            const userDetails = AuthUtils._decodeToken(this.isalaamAccessToken);
            this.userRole = JSON.parse(
                userDetails.roleObject
            )?.[0]?.RoleName.toUpperCase();
            return expectedRoles.includes(this.userRole);
        } else {
            return false;
        }
    }

    verifyOtp(body) {
        return this.httpClient
            .post(this.baseUrl + environment.apiEndPoints.verifyOtp, body)
            .pipe(
                switchMap((response: any) => {
                    if (response?.result?.success) {
                        this.isalaamAccessToken = response?.result?.data?.token;
                        // this.loggedUserDetails = JSON.stringify(response?.result);
                        const userDetails = AuthUtils._decodeToken(
                            this.isalaamAccessToken
                        );
                        this.userRole = JSON.parse(
                            userDetails.roleObject
                        )?.[0]?.RoleName.toUpperCase();
                        this._authenticated = true;
                    }
                    return of(response);
                })
            );
    }

    generateOtp(email) {
        return this.httpClient.get(
            this.baseUrl +
                environment.apiEndPoints.generateOtp +
                '?emailOrphone=' +
                email
        );
    }

    generateOtpEditPrfoile(body) {
        return this.httpClient.post(
            this.baseUrl + environment.apiEndPoints.generateOtpEditProfile,
            body
        );
    }

    resendOtp(guId) {
        return this.httpClient.get(
            this.baseUrl +
                environment.apiEndPoints.resendAuthOtp +
                '?ContactGuid=' +
                guId
        );
    }

    // setisalaamAccessToken(token) {
    //   this.isalaamAccessToken = token;
    // }

    /**
     * Setter & getter for access token
     */
    set isalaamAccessToken(token: string) {
        this._authenticated = true;
        localStorage.setItem('isalaamAccessToken', token);
    }

    get isalaamAccessToken(): string {
        return localStorage.getItem('isalaamAccessToken') ?? '';
    }

    /**
     * Setter & getter for user details
     */
    set loggedUserDetails(userDetails: string) {
        localStorage.setItem('loggeduser', userDetails);
    }

    get loggedUserDetails(): string {
        return localStorage.getItem('loggeduser') ?? '';
    }

    isAuthenticated(): boolean {
        return this._authenticated;
    }

    userLogOut() {
        return this.httpClient.post(
            this.baseUrl + environment.apiEndPoints.userLogOut,
            null
        );
    }

    InactiveUserAccount(body) {
        return this.httpClient.post(
            this.baseUrl + environment.apiEndPoints.InactiveAccount,
            body
        );
    }
    
    async signInWithGoogle() {
        try {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({
            prompt: "select_account"
          });
          const result = (await signInWithPopup(this.auth, provider)).user.getIdToken();
          return result;
        } catch (error) {
          console.error('Login failed:', error);
          return null;
        }
    }
    // googleAuthentication(body){
    //     return this.httpClient.post(
    //         this.baseUrl + environment.apiEndPoints.googleAuthentication,
    //         body
    //     );
    // }
    googleAuthentication(body) {
        return this.httpClient
            .post(this.baseUrl + environment.apiEndPoints.googleAuthentication, body)
            .pipe(
                switchMap((response: any) => {
                    if (response?.result?.success) {
                        this.isalaamAccessToken = response?.result?.data?.token;
                        const userDetails = AuthUtils._decodeToken(
                            this.isalaamAccessToken
                        );
                        this.userRole = JSON.parse(
                            userDetails.roleObject
                        )?.[0]?.RoleName.toUpperCase();
                        this._authenticated = true;
                    }
                    return of(response);
                })
            );
    }
}
