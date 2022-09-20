import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from "@angular/common/http";

import { Http } from "@angular/http";

import { environment } from "src/environments/environment";


@Injectable()
export class SubAgentInterceptor implements HttpInterceptor {

    constructor(private http:Http) {
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ) {
        if (request.url.includes('assets/i18n/')) {
            return next.handle(request)
        }
        if (request.url.includes('voucher_template')) {
            let headers: HttpHeaders = new HttpHeaders({
                "Authorization": 'Bearer ' + sessionStorage.getItem("accesstoken"),
            })      
            request = request.clone({
                url: environment.baseUrl2 + request.url,
                headers 
            });
            return next.handle(request);

        }
        if (request.url.includes('invoice_template') || request.url.includes('voucher') || request.url.includes('invoice_template')) {
            let headers: HttpHeaders = new HttpHeaders({
                "Authorization": 'Bearer ' + sessionStorage.getItem("accesstoken"),
            })      
            request = request.clone({
                url: environment.baseUrl + request.url,
                headers 
            });
            return next.handle(request);

        }
        else if(request.url.includes('agency_logo')){
            let headers: HttpHeaders = new HttpHeaders({
                Authorization: 'Bearer ' + sessionStorage.getItem("accesstoken"),
            });
            request = request.clone({
                url: environment.baseUrl + request.url,
                headers
            });
            return next.handle(request);
        }
         else {
            let headers: HttpHeaders = new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + sessionStorage.getItem("accesstoken"),

            });
            request = request.clone({
                url: environment.baseUrl + request.url,
                headers
            });
            return next.handle(request);

        }

    }

}
