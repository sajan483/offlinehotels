import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { NotificationService } from 'src/app/common/services/notification.service';
@Injectable({
  providedIn: 'root'
})
export class GeneralHelper {
  constructor(private notifyService : NotificationService,
    private router : Router) { }
  getAccessTocken(): string {
    if (sessionStorage && sessionStorage.getItem('accesstoken')) {
      return sessionStorage.getItem('accesstoken');
    }
    return "";
  }

  checkForAccessToken(): void {
    if (sessionStorage.getItem('accesstoken') == "" || 
       sessionStorage.getItem('accesstoken') == null) {
      this.router.navigate(['/login']);
    }
  }

  checkForAccessTokenForDeepLink(): void {
    if (sessionStorage.getItem('accesstoken') == "" || sessionStorage.getItem('accesstoken') == null) {
      if(localStorage && localStorage.getItem('accesstoken')){
        sessionStorage.setItem('accesstoken',localStorage.getItem('accesstoken'))
      }else{
        this.router.navigate(['/login']);
      }
    }
  }

}