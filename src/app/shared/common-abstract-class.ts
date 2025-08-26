import { FormGroup } from "@angular/forms";
import { AuthService } from "app/services/auth.service";
import { SharedService } from "app/services/shared.service";

export abstract class CommonBaseClass {
    public mosqueInfo: any;
    public userDetails;
    public isAuthenticated;    
    constructor(public authService: AuthService, public sharedService: SharedService) {
        this.authService.check().subscribe((res) => {
            if (res) {
                this.isAuthenticated = true;
            }
        });
        if (this.sharedService?.mosqueInfo) {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
        }
    }

}