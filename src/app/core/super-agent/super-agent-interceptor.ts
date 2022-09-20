import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpHeaders
} from "@angular/common/http";

import {
    Http,
    Response,
    Headers,
    RequestOptions,
    URLSearchParams,
    ResponseContentType,
  } from "@angular/http";


@Injectable()
export class SuperAgentInterceptor implements HttpInterceptor {

    constructor(private http:Http) {}

    intercept(request: HttpRequest<any>,next: HttpHandler) {
        if (request.url.includes('assets/i18n/')) return next.handle(request)
        if (request.url.includes('upload_images')) {
            let headers: HttpHeaders = new HttpHeaders({
                Authorization: 'Bearer ' + sessionStorage.getItem("accesstoken"),
            })      
            request = request.clone({
                url: request.url,headers 
            });
            return next.handle(request);
        }
        else {
            let headers: HttpHeaders = new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + sessionStorage.getItem("accesstoken"),
            });
            request = request.clone({
                url: request.url,
                headers
            });
            return next.handle(request);
        }
    }
}