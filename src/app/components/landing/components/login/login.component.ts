import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  Headers,
} from "@angular/http";
import { AppStore } from 'src/app/stores/app.store';
import { Country } from 'src/app/models/airportList';
import { CookieService } from 'ngx-cookie-service';
import { GeneralHelper } from '../../../../helpers/General/general-helpers'
import { loginAdapter } from 'src/app/adapters/Landing/loginAdapter';
import { LandingApiService } from 'src/app/components/landing/service/landing-api-services';
import { CommonApiService } from 'src/app/Services/common-api-services';
import { TranslateService } from '@ngx-translate/core';
import { SegmentService } from 'ngx-segment-analytics';
import { environment } from 'src/environments/environment';
import { loginHelperCommon } from '../../helpers/login-helpers';
import { NotificationService } from 'src/app/common/services/notification.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  forgotPassword:FormGroup;
  countries: Country[]=[];
  countrycode1: any = environment.countryCodeCommen;
  rePhoneNumber: string = "";
  countrycode2: any = environment.countryCodeCommen;
  otp: string = "";
  ePassword: string = "";
  cPassword: string = "";
  phoneNumber: string = "";
  interval: any;
  timeLeft: number = environment.timeLeft;
  rememberme: boolean = false;
  username: string;
  password: string;
  access: any;
  token: any;
  gHelper: GeneralHelper;
  loginAdapter: loginAdapter;
  commonApiService:CommonApiService;
  bttnactive:boolean=false;
  loginCountrycode: any = environment.countryCodeCommen;
  @ViewChild('phoneInput', { read: ElementRef, static: false })
  phoneInput: ElementRef;
  baseUrl: string = "";
  prodUrl: string = environment.prodUrl
  shortCountryCode: any;
  resendPassword: boolean = false;
  accessToken: string = '';
  lat: number;
  lng: number;
  phoneInputObj: any;
  currency:any;
  loginHelperClass : loginHelperCommon = new loginHelperCommon(this.cookie,this.notifyService,this.router);

  constructor(
    private router: Router,
    private appStore: AppStore,
    private fb: FormBuilder,
    private common: LandingApiService,
    private cookie: CookieService,
    private _commonApiService:CommonApiService,
    private _gHelper: GeneralHelper,
    private translate: TranslateService,
    private notifyService: NotificationService,
    ) {
    this.gHelper = _gHelper;
    this.commonApiService = this._commonApiService;
    this.loginAdapter = new loginAdapter();
    this.token = this.gHelper.getAccessTocken();
    this.loginForm = this.loginAdapter.createLoginGroup();
  }

  ngOnInit(): void {
    this.initialValues();
  }

  initialValues(){
    this.translate.use('en-US');
    (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    this.clearAccessToken();
  }

  clearAccessToken() {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    this.getCountryList();
  }

  /**
   * this method is used for get countries list
   */
  getCountryList() {
    this.commonApiService.getCountries().subscribe(res => {
      this.countries = res;
    })
    this.findProdUrlConfig();
  }

  findProdUrlConfig(){
    const parsedUrl = new URL(window.location.href);
    this.baseUrl = parsedUrl.origin;
    // this.fetchFromCookies();
  }

  /**
   * fetch username from cookie
   */
  fetchFromCookies(){
    if(this.cookie.get('userName') !== null && this.cookie.get('userName') !== 'null'){
      this.loginForm.controls.username.patchValue(this.cookie.get("userName"));
      this.loginForm.controls.password.patchValue(this.cookie.get("password"));
      this.loginForm.controls.countryCode.patchValue(this.cookie.get("countryCode"));
      this.rememberme = true;
    }
    this.setUserDataForSegmentAnalysis()
  }

  setUserDataForSegmentAnalysis(){
    if(this.baseUrl  == this.prodUrl){
       window.analytics.page('subagent/login',{
        portal:"B2B"
      });
    }
  }

  // set country code in location vice

  telInputObject(obj) {
    this.phoneInputObj = obj;
    this.getLocation()
  }

  getLocation(){
    if(sessionStorage.getItem('country_code') && sessionStorage.getItem('country_code') != undefined && sessionStorage.getItem('country_code') != null){
      let code = JSON.parse(sessionStorage.getItem('country_code'));
      this.loginForm.controls.countryCode.patchValue(code.codeNum);
      this.phoneInputObj.setCountry(code.codeText);
      this.currency = code.currency;
    }else{
      this.loginForm.controls.countryCode.patchValue('966');
      this.phoneInputObj.setCountry('sa');
      this.getUserLocation();
    }
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.fetchIsoCode(this.lat,this.lng)
      });
    }
  }

  fetchIsoCode(lat,lng){
    this.common.getLocation(lat,lng).subscribe(data =>{
      if(data.status == "success"){
        this.phoneInputObj.setCountry(data.data.country_code);
        this.loginForm.controls.countryCode.patchValue(data.data.code);
        this.currency = data.data.currency;
        let code = {
          codeNum:data.data.code,
          codeText:data.data.country_code,
          currency:data.data.currency
        }
        sessionStorage.setItem('country_code',JSON.stringify(code))
      }
    })
  }

  

  /**
  * this methode is used for setting remember me boolean
   */
  setBoolean() {
    this.rememberme = !this.rememberme;
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('coockie enabled',{
       portal:"B2B",
     });
    }
  }

  /**
   * this function used for user login
   */
  submit = function () {
    if(this.loginForm.invalid){
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('Oops...'),
        text: this.translate.instant('Fields can not be empty'),
      })
      return;
    } 
    this.submitLogin(this.loginForm.value)
    
  }

  submitLogin(value){
    this.bttnactive = true;
    if (this.rememberme) {
      this.loginHelperClass.setDataForCookies(value);
    }
    const body = { 'username': value.username, 'password': value.password, 'phn_country_code' : value.countryCode }
    this.common.login(body).subscribe(data => {
      if(this.baseUrl  == this.prodUrl){
        window.analytics.track('loging',{
         portal:"B2B",
         contrycode:value.countryCode,
         username:value.username,
         password:value.password,
         status:"Success"
       });
      }
      this.loginHelperClass.loginResponse(data, this.rememberme);
      this.bttnactive = false;
    }, error => {
      this.bttnactive = false;
      if(this.baseUrl  == this.prodUrl){
        window.analytics.track('loging',{
         portal:"B2B",
         contrycode:value.countryCode,
         username:value.username,
         password:value.password,
         status:"Failed"
       });
      }
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('Oops...'),
        text: this.translate.instant('Invalid Username or Password'),
      })
    });
  }

  /**
   * this method is used for navigate signup page
   */
  navigatesignup() {
    this.router.navigate(["/signup"]);
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('signing in',{
       portal:"B2B",
     });
    }
  }

  /**
   * this method used for sent otp to user enter phone number
   */
  onSendOtpButtonClicked() {
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('forgot password clicked',{
       portal:"B2B"
     });
    }
    let data = { "phone_number": this.phoneNumber, "phn_country_code": this.countrycode1 }
    this.common.getOtp(data).subscribe(res => {
      if (res.status == 'success') {
        this.rePhoneNumber = this.phoneNumber;
        this.timeLeft = res.validity_in_minutes * 60;
        if(!this.resendPassword){
        document.getElementById("openModalButton").click();
        }
        this.resendPassword = false;
        this.startTimer()
      }
      if (res.status == 'failure') {
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('Oops...'),
          text: res.errors,
        })
      }
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('Oops...'),
        text: this.translate.instant('Something Went Wrong'),
      })
    })
  }

  /**
   * this method for add new password
   */
  onChangePasswordBtnClicked() {
    let  options = {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.accessToken,
      }),
    };

    let data = {
      "password1": this.ePassword,
      "password2": this.cPassword
    }
    this.common.updateForgotPassword(data,options).subscribe(res => {
      this.accessToken = '';
      if (res.status.toLowerCase() == 'success') {
        Swal.fire({
          icon:'success',
          title:this.translate.instant("Success"),
          text:this.translate.instant("Your password has been updated successfully")
        })
      }
      if (res.status.toLowerCase() == 'failure') {
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('Oops...'),
          text: res.errors[0],
        })
      }
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('Oops...'),
        text:this.translate.instant('Something Went Wrong'),
      })
    })
  }

  onVerifyButtonClicked() {
    let data = {
      "phn_country_code":  this.countrycode2,
      "phone_number": this.rePhoneNumber,
      "otp": this.otp,
     }
     if(this.otp.length==6){
      this.common.verifyOtp(data).subscribe(res => {
        if (res.status.toLowerCase() == 'success') {
          (<HTMLInputElement>document.getElementById("verifyOtpClose")).click();
          document.getElementById("openPasswordModalButton").click();
          this.resendPassword = false;
          this.accessToken = res.data.access_token;
        }
        if (res.status.toLowerCase() == 'failure') {
          Swal.fire({
            icon: 'error',
            title: this.translate.instant('Oops...'),
            text: res.errors[0],
          })
        }
      }, (error) => {
        console.log(error.json());
        if(error.json().status == 'failure'){
          Swal.fire({
            icon: 'error',
            title: this.translate.instant('Oops...'),
            text: error.json().errors[0],
          })
        }else{
          Swal.fire({
            icon: 'error',
            title: this.translate.instant('Oops...'),
            text:this.translate.instant('Something Went Wrong'),
          })
        }
      })
     }else{
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('Oops...'),
        text: this.translate.instant("Otp length should be at least 6 digits"),
      })
     }

  }

  /**
   * this method for disable or active sentotp button
   */
  hidebutton() {
    if (this.phoneNumber == null || this.phoneNumber == "") {
      return false;
    }
    return true;
  }

  /**
   * this method for hide forgot button
   */
  hideForgotPssBtn() {
    if (this.ePassword == null || this.ePassword == "") {
      return false;
    }
    if (this.cPassword == null || this.cPassword == "") {
      return false;
    }
    if (this.ePassword != this.cPassword) {
      return false;
    }
    // if(this.resendPassword){
    //   return false;
    // }
    return true;
  }

  hideOtpButton() {
    if (this.rePhoneNumber == null || this.rePhoneNumber == "") {
      return false;
    }
    if (this.otp == null || this.otp == "") {
      return false;
    }
    return true;
  }

  /**
   * this method is used set timer for enter otp
   */
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
      else if (this.timeLeft == 0) {
        this.resendPassword = true;
        // (<HTMLInputElement>document.getElementById("forgotClose")).click();
        clearInterval(this.interval);
      }
    }, 1000)
  }


  /**
   * this method for get country code
   */

   onCountryChange(event) {
    this.loginForm.controls.countryCode.patchValue(event.dialCode);
    let code = JSON.parse(sessionStorage.getItem('country_code'));
    code.codeNum = event.dialCode;
    code.codeText = event.iso2;
    sessionStorage.setItem('country_code',JSON.stringify(code))
  }


  getNumberPlaceHolderLength(): number {
    try {
      let phoneInput: HTMLElement = document.getElementById("phoneInput");
      if (phoneInput)
        return phoneInput.attributes.getNamedItem("placeholder").value.replace(/[^0-9a-zA-Z]/g, '').length;
    } catch (exception) {
    }
  }


  inputValidation(event?) {
    let mobileNumber = event.srcElement.value;
    this.loginForm.controls['username'].setValue(mobileNumber);
  }

}
