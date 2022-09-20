import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/common/services/notification.service';
import Swal from 'sweetalert2';

export class loginHelperCommon{
    constructor(private cookie: CookieService,
        private notifyService: NotificationService,
        private router: Router ){}

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
        localStorage.setItem('accesstoken', access);
        if(data.staff.employer_type && data.staff.employer_type != null && data.staff.employer_type != undefined && etype.toLowerCase()=='sub'){
          localStorage.setItem('agencyName',data.staff.employer_name);
          sessionStorage.setItem('agencyType',data.staff.employer_type);
          localStorage.setItem('agencyType',data.staff.employer_type);
        }
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
              sessionStorage.setItem('agency_Id', data.staff.agency_id);
              this.router.navigate(["superagent/dashboard"]);
            }else if(data.staff.employer_type == 'SUB'){
              let currency:any = 'SAR';
              if(sessionStorage.getItem('country_code') && sessionStorage.getItem('country_code') != null && sessionStorage.getItem('country_code') != undefined){
                let code = JSON.parse(sessionStorage.getItem('country_code'));
                currency = code.currency;
              }
              let lang:any = 'en-US';
              this.router.navigate(['subagent/dashboard/'+lang+'/'+currency]);
              // Swal.fire({
              //   icon: 'error',
              //   title: 'Oops...',
              //   text: 'Invalid Username or Password',
              // })
            }else if(data.staff.employer_type == 'BRANCH'){
              this.router.navigate(["branch/packages"]);
            }
          }
        }
    }
}
