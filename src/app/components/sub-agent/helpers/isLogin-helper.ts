import { Router } from "@angular/router";

export class IsLoginHelpers {

    constructor(private router:Router){}

    checkIsLogin(){
        if(localStorage.getItem('accesstoken')){
            if(localStorage.getItem('agencyType') && localStorage.getItem('agencyType').toLowerCase() == 'sub'){
                let token = localStorage.getItem('accesstoken');
                sessionStorage.setItem('accesstoken',token);
            }else{
                this.router.navigate(["login"])
            }
        }else{
            this.router.navigate(["login"])
        }
    }
}