import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup,FormBuilder} from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { Country } from 'src/app/models/airportList';
import { signupAdapter } from 'src/app/adapters/Landing/signupAdapter';
import { LandingApiService } from 'src/app/components/landing/service/landing-api-services';
import { CommonApiService } from 'src/app/Services/common-api-services';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { TranslateService } from '@ngx-translate/core';
import { AppStore } from "src/app/stores/app.store";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  eyes: boolean;
  show: boolean;
  signupForm:FormGroup;
  submitted = false;
  licensefield: boolean = false;
  bttnshow: boolean = false;
  countries : Country[];
  slctcntry : any = environment.selectedCountryCommen;
  countrycode : any = environment.countryCodeCommen;
  signupAdapter : signupAdapter;
  commonApiService : CommonApiService;
  ibanValidation: boolean;
  ibanMessge: string;
  @ViewChild('phoneInput', { read: ElementRef, static: false })
  phoneInput: ElementRef;
  
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  phoneInputObj: any;
  

  constructor(private common: LandingApiService,
    private appStore: AppStore,
    private router: Router,private formBuilder: FormBuilder
    ,private spinner: NgxSpinnerService,
    private _commonApiService:CommonApiService,
    private translate: TranslateService) { 
    this.signupAdapter = new signupAdapter();
    this.signupForm = this.signupAdapter.createSignupGroup();
    this.commonApiService = this._commonApiService
  }

  get f() { return this.signupForm.controls; }

  ngOnInit() {
    this.initialValues();
  }

  initialValues(){
    this.translate.use('en-US');
    (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
  }

  // set country code in location vice

  telInputObject(obj) {
    this.phoneInputObj = obj;
    this.getLocation()
  }

  getLocation(){
    if(sessionStorage.getItem('country_code') && sessionStorage.getItem('country_code') != undefined && sessionStorage.getItem('country_code') != null){
      let code = JSON.parse(sessionStorage.getItem('country_code'));
      this.signupForm.controls.countryCode.patchValue(code.codeNum);
      this.phoneInputObj.setCountry(code.codeText);
      this.countrycode = code.codeNum;
      this.coutryList();
    }else{
      this.signupForm.controls.countryCode.patchValue('966');
      this.phoneInputObj.setCountry('sa');
      this.getUserLocation();
    }
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        this.fetchIsoCode(lat,lng)
      });
    }
  }

  fetchIsoCode(lat,lng){
    this.common.getLocation(lat,lng).subscribe(data =>{
      if(data.status == "success"){
        this.phoneInputObj.setCountry(data.data.country_code);
        this.signupForm.controls.countryCode.patchValue(data.data.country_code);
        let code = {
          codeNum:data.data.code,
          codeText:data.data.country_code,
          currency:data.data.currency
        }
        this.countrycode = data.data.code;
        sessionStorage.setItem('country_code',JSON.stringify(code))
      }
    })
    this.coutryList();
  }

  /**
   * this method for fetch coutry list
   */
  coutryList(){
    this.commonApiService.getCountries().subscribe(res =>{
      this.countries = res;
      this.countries.forEach(element => {
        if(element.code == this.countrycode){
          this.slctcntry = element.name;
        }
      });
    })
  }

  /**
   * this method for get country code
   */
  
   onCountryChange(event) {
    this.signupForm.controls.countryCode.patchValue(event.dialCode);
    let code = JSON.parse(sessionStorage.getItem('country_code'));
    code.codeNum = event.dialCode;
    code.codeText = event.iso2;
    sessionStorage.setItem('country_code',JSON.stringify(code))
  }

   
  getNumberPlaceHolderLength1(): number {
    try {
      let phoneInput: HTMLElement = document.getElementById("phoneInput1");
      if (phoneInput)
        return phoneInput.attributes.getNamedItem("placeholder").value.replace(/[^0-9a-zA-Z]/g, '').length;
    } catch (exception) {
    }
  }

  
  inputValidation1(event?) {
    // try {
    //   let mobileNumber: string = '';
    //   this.signupForm.controls['phnnumber'].setValue(mobileNumber);
    // } catch (exception) {
    // }
  }
  
  /**
   * This function used for Iban Number Validation
   * **/
   iBanNumberValidation(event?){
    this.ibanValidation = false;
    var iban = event.srcElement.value;
    var test = this.subagentHelper.ibanTextValidation(iban)
    if(test != 'true'){
      this.ibanValidation = true;
      this.ibanMessge = test;
      this.spinner.hide();
      return;
    }
   }

  /**
   * this method used for signup
   */
  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.signupForm.invalid) {
      this.spinner.hide();
      return;
    }
    if(this.ibanValidation){
      this.spinner.hide();
      return;
    }
    if(this.licensefield){
      if((<HTMLInputElement>document.getElementById("license")).value == ""){
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('Oops...'),
          text: this.translate.instant('Please enter License Number'),
        })
        this.spinner.hide();
        return;
      }
     
    }
    if(this.signupForm.value.password != this.signupForm.value.cnfrmpasswrd){
      this.spinner.hide();
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('Oops...'),
        text: this.translate.instant('Password and Confirm Password is not match'),
      })
      return; 
    }
    else{
      if(this.licensefield){
        const body = {
          "name": this.signupForm.value.cmpnyname, 
          "iban": (<HTMLInputElement>document.getElementById("iban")).value,
          "licence_no": (<HTMLInputElement>document.getElementById("license")).value, 
          "address": this.signupForm.value.cmpnyadress, 
          "city": this.signupForm.value.city, 
          "country": this.slctcntry,
          "phn_country_code": this.signupForm.value.countryCode,
          "phone_number": this.signupForm.value.phnnumber,
          "email": this.signupForm.value.email,
          "primary_contact": {
            "phn_country_code": this.signupForm.value.countryCode,
            "phone_number":this.signupForm.value.phnnumber, 
            "name": this.signupForm.value.cname, 
            "password": this.signupForm.value.password, 
            "confirmation_password": this.signupForm.value.cnfrmpasswrd
          }
        }

      this.common.signup(body).subscribe(data => {
        if(data.status_code == 202){
          this.spinner.hide();
          Swal.fire({
            icon: 'error',
            title: data.message,
            showConfirmButton: true,
          })
        }else{
          this.spinner.hide();
          Swal.fire({
            icon: 'success',
            title: data.message,
            showConfirmButton: true,
          }).then((result) => {
            if (result.value) {
              this.router.navigate(["/login"]);
            }
          }) 
        }
       //console.log()
      }
      // (err) => {
      //   console.log("err",err)

      //   let y = err._body.replace("/\\/","").replace("{","").replace("}","").replace('"',"").replace('message',"").replace(':',"").replace('"',"").replace('"',"").replace('"',"")
      //   this.spinner.hide();
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: y,
      //   })
      // }
      );
    }
    else{
      const body = {
        "name": this.signupForm.value.cmpnyname, 
        "iban": "",
        "licence_no": "",
        "address": this.signupForm.value.cmpnyadress, 
        "city": this.signupForm.value.city, 
        "country": this.slctcntry,
        "phn_country_code": this.signupForm.value.countryCode,
        "phone_number": this.signupForm.value.phnnumber,
        "email": this.signupForm.value.email,
        "primary_contact": {
          "phn_country_code": this.signupForm.value.countryCode,
          "phone_number": this.signupForm.value.phnnumber, 
          "name": this.signupForm.value.cname, 
          "password": this.signupForm.value.password, 
          "confirmation_password": this.signupForm.value.cnfrmpasswrd
        }
      }
      this.common.signup(body).subscribe(data => {

      if(data.status_code == 202){
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: data.message,
          showConfirmButton: true,
        })
      }else{
        this.spinner.hide();
        Swal.fire({
          icon: 'success',
          title: data.message,
          showConfirmButton: true,
        }).then((result) => {
          if (result.value) {
            this.router.navigate(["/login"]);
          }
        }) 
      }
    },error=>{
      this.spinner.hide();
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('Oops...'),
        text: this.translate.instant('Contact person phone number already exist'),
      })
    });
    } 
    }
  }
  

  /**
   * this method for navigate login page
   */
  navigatelogin(){
    this.router.navigate(["/login"])
  }

  /**
   * this method for activate license agent
   */
  licenseyes(){
    this.bttnshow = true;
    this.licensefield = true;
  }

  /**
   * this method for deactivate license agent
   */
  licenseno(){
    this.licensefield = false;
    this.bttnshow = true;
  }

  /**
   * this method for block spacial characters
   */

  omit_special_char(event){   
   var k;  
   k = event.charCode;  //         k = event.keyCode;  (Both can be used)
   return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
   
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  
  navigateYoutube(){
    window.open("https://www.youtube.com/watch?v=o6r8Yz87ECw", "_blank");
  }
}
