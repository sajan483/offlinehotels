import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import {
  Http,
  Headers,
} from "@angular/http";
import { Router } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable()
export class LandingApiService {
  BASE_URL:any = environment.baseUrl
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("accesstoken"),
    }),
  };
  options = {
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " +sessionStorage.getItem("accesstoken"),
    }),
  };

  optionsForForm = {
    headers: new Headers({
      Authorization: "Bearer " + sessionStorage.getItem("accesstoken"),
    }),
  };

  constructor(
    private http: Http,
  ) {}

  login(data: any) {
    return this.http
      .post(this.BASE_URL + "staff/login/", data, this.options)
      .map((res) => res.json());
  }

  getOtp(data) {
    return this.http
      .post(this.BASE_URL + "staff/forgot_password/", data)
      .map((res) => res.json());
  }

  changePassword(data) {
    return this.http
      .post(this.BASE_URL + "staff/change_password/", data)
      .map((res) => res.json());
  }

  signup(body:any){
    return this.http
      .post(this.BASE_URL + "agencies/signup/",body)
      .map((res) => res.json());
  }

  otaUpgrade(passportFile: File, body:any, id:any){
    const formData: FormData = new FormData();
    formData.append('passport',passportFile);
    // formData.append('signatory_name',body.signatiureName);
    // formData.append('passport_number',body.passportNo);
    // formData.append('iata_license',body.iataLicence);
    // formData.append('mobile',body.mobileNo);
    // formData.append('commercial_regno',body.commercialreg);
    // formData.append('request_text',body.reqstText)

    return this.http
      .post(this.BASE_URL + "agencies/"+id+"/approval_request/",formData)
      .map((res) => res.json());
  }

  getAgencyApprovedDetails(id:any) {
    return this.http
      .get(this.BASE_URL + "agencies/"+id+"/approval_details/", this.options)
      .map((res) => res.json());
  }

  getCurrencies() {
    return this.http
      .get(this.BASE_URL + "currency/")
      .map((res) => res.json());
  }

  updateForgotPassword(data, opt){
    console.log(opt);
    return this.http
    .post(this.BASE_URL + "staff/forget_change_password/", data,opt)
    .map((res) => res.json());
  }

  verifyOtp(data){
    return this.http.post(this.BASE_URL + "staff/verify_otp/",data ).map((res)=>res.json());
  }

  getLocation(lat,lon){
    return this.http
      .get(this.BASE_URL + "get_location/?latitude="+lat+"&longitude="+lon)
      .map((res) => res.json());
  }
}
