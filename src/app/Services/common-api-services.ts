import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  URLSearchParams,
  ResponseContentType,
} from "@angular/http";
import { Router } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable()
export class CommonApiService {
  BASE_URL: any = environment.baseUrl;
  BASE_URL2: any = environment.baseUrl2;

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("accesstoken"),
    }),
  };
  options = {
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("accesstoken"),
    }),
  };

  optionsForForm = {
    headers: new Headers({
      Authorization: "Bearer " + sessionStorage.getItem("accesstoken"),
    }),
  };

  constructor(
    private http: Http,
    private _httpClient: HttpClient,
    private router: Router,
    private https: HttpClient
  ) {}
 
  
  getLanguages() {
    return this.http
      .get(this.BASE_URL + "languages/", this.options)
      .map((res) => res.json());
  }

  getCountries(){
    return this.http.get(this.BASE_URL + "countries/", this.options).map(res => res.json());
  }


  getIp(){
    return this.http.get("http://ip-api.com/json").map(res => res.json());
  }

  getNationality(data, lang) {
    return this.http
      .get(this.BASE_URL + "nationalities/?search=" + data + "&lang=" + lang, this.options)
      .map((res) => res.json());
  }

  getCountry(data, lang) {
    return this.http
      .get(this.BASE_URL + "countries/?search=" + data + "&lang=" + lang, this.options)
      .map((res) => res.json());
  }

  getLanguageCountries(lang){
    return this.http
      .get(this.BASE_URL + "countries/?lang=" + lang, this.options)
      .map((res) => res.json());
  }

  getRoutes(lang) {
    return this.http
      .get(this.BASE_URL + "ground_transports/routes/?lang=" + 'en-US' , this.options)
      .map((res) => res.json());
  }

  getVehicles(lang) {
    return this.http
      .get(this.BASE_URL + "ground_transports/vehicle_types/?lang=" + 'en-US' , this.options)
      .map((res) => res.json());
  }
  getCompanies(lang) {
    return this.http
      .get(this.BASE_URL + "ground_transports/companies/?lang=" + lang , this.options)
      .map((res) => res.json());
  }

  getPackages(){
    return this.http.get(this.BASE_URL + "packages/suggested/", this.options).map(res => res.json());
  }
}