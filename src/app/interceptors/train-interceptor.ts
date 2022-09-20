import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";


@Injectable()
export class TrainInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url.includes('assets/i18n/')) { return next.handle(request) }

    if(request.url.includes('rail')){
      const token = sessionStorage.getItem('guestBookingToken') ? sessionStorage.getItem('guestBookingToken') : 'Guest'
      console.log(token);
      let headers: HttpHeaders = new HttpHeaders({
        // "Content-Type": "application/json",
        "Authorization": 'Bearer ' + token,
      });
      request = request.clone({url: request.url,headers});
    }
    return next.handle(request);
  }

}
