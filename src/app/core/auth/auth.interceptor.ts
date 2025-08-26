import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AuthService } from 'app/services/auth.service';
import { ToasterService } from 'app/services/toaster.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    /**
     * Constructor
     */
    //language = localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language');  
    constructor(private _authService: AuthService, private toaster: ToasterService, private _router: Router) {
    }

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request object
        let newReq = req.clone();
        if (this._authService.isalaamAccessToken && !AuthUtils.isTokenExpired(this._authService.isalaamAccessToken)) {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this._authService.isalaamAccessToken)
                .set('Accept-Language', localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'))
                .set('Device-ID', 'WEB')
            });
        }
        else if(this._authService.isalaamAccessToken && AuthUtils.isTokenExpired(this._authService.isalaamAccessToken)){
            this.toaster.triggerToast({ type: 'error', message: 'Authentication error', description: 'Your session has expired. Please log in again.' });
            this._router.navigateByUrl('/sign-in');
        }
        else{
            newReq = req.clone({
                headers: req.headers.set('Accept-Language', localStorage.getItem('isalaam-language') === null ? 'id-ID' : localStorage.getItem('isalaam-language'))
                .set('Device-ID', 'WEB')
            });
        }        
       
        // Response
        return next.handle(newReq).pipe(
            catchError((error) => {
                // Catch "401 Unauthorized" responses
                if (error instanceof HttpErrorResponse && error.status === 401) {
                     // Show error notification
                    this.toaster.triggerToast({ type: 'error', message: 'Authentication error', description: 'Your session has expired. Please log in again.' });
                    // Sign out
                    this._authService.signOut();
                    // Reload the app
                    location.reload();
                }

                return throwError(error);
            })
        );
    }
}
