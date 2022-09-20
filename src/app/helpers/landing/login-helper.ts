import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '../../common/services/notification.service';
import { AppStore } from 'src/app/stores/app.store';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserStateService } from 'src/app/components/sub-agent/services/User-service';

@Injectable()
export class loginHelper{
    constructor(private cookie: CookieService,
        private notifyService: NotificationService,
        private router: Router,private userStateService: UserStateService ){}

    /**
     * this method for saving username and password to cookie
     */
    setDataForCookies(data){
        this.cookie.set("countryCode", data.countryCode);
        this.cookie.set("userName", data.username);
        this.cookie.set("password", data.password);
    }

    loginResponse(data:any,rememberme:boolean){
        var access = data.access;
        var etype = data.staff.employer_type;
        sessionStorage.setItem('accesstoken', access);
        if(data.staff.employer_type && data.staff.employer_type != null && data.staff.employer_type != undefined && etype.toLowerCase()=='sub'){
          localStorage.setItem('agencyName',data.staff.employer_name);
          sessionStorage.setItem('agencyType',data.staff.employer_type);
        }
        localStorage.setItem('accesstoken', access);
        localStorage.setItem('phoneNumber', data.staff.phone_number);
        localStorage.setItem('phoneCountryCode', data.staff.phn_country_code);
        if (rememberme) {
          sessionStorage.setItem('isTouched', 'true');
        }
        if (!rememberme) {
          sessionStorage.setItem('isTouched', null);
          this.cookie.set("userName", null);
          this.cookie.set("password", null);
        }
        if (sessionStorage.getItem('accesstoken') != null) {
          if(data.staff.is_approved == 'False'){
            this.router.navigate(["upload/"+data.staff.agency_id])
          }else{
            if(data.staff.employer_type == 'SUPER'){
              this.notifyService.showSuccess('Success ');
              sessionStorage.setItem('agency_Id', data.staff.agency_id);
              this.router.navigate(["superagent/dashboard"]);
            }else if(data.staff.employer_type == 'SUB'){
              let currency:any;
              let lang:any;
              let code = JSON.parse(sessionStorage.getItem('country_code'));
              currency = code.currency;
              lang = 'en-US';
              this.notifyService.showSuccess('Success ');
              this.router.navigate(['subagent/dashboard/'+lang+'/'+currency]);
            }else if(data.staff.employer_type == 'BRANCH'){
              this.notifyService.showSuccess('Success ');
              this.router.navigate(["branch/packages"]);
            }
          }
        }
    }
}
