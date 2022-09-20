import { Component, OnInit, DoCheck } from "@angular/core";
import { Router } from "@angular/router";
import { AppStore } from "src/app/stores/app.store";
import { CookieService } from "ngx-cookie-service";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { LandingApiService } from 'src/app/components/landing/service/landing-api-services';
import { CommonApiService } from "src/app/Services/common-api-services";
import { TranslateService } from '@ngx-translate/core';
import { SupportComponent } from 'src/app/components/sub-agent/components/support/support.component';
import { SegmentService } from "ngx-segment-analytics";
import { environment } from "src/environments/environment";



@Component({
  selector: "app-hedder",
  templateUrl: "./hedder.component.html",
  styleUrls: ["./hedder.component.scss"]
})

export class HedderComponent implements OnInit, DoCheck {
  gettype: any;
  static globelCurrency:any;
  static globelRate:any;
  static globelDecimel:any;
  public currentUser: any;
  superAgencyActive: boolean;
  subAgencyActive: boolean;
  branchActive: boolean;
  languageList: any;
  activeArabic: boolean = false;
  showNavBar: boolean = false;
  commonApiService: CommonApiService;
  languageSelect: any = "en-US";
  currency:any = "SAR"
  userType: any;
  languageOptions : any = [{lang:'ar-AE',langName:'عربى'},{lang:'bn-BN',langName:'বাংলা'},{lang:'en-US',langName:'ENGLISH'},{lang:'fr-FR',langName:'français'},{lang:'hi-HI',langName:'हिंदी'},{lang:'id-ID',langName:'Bahasa Indonesia'},{lang:'ml-ML',langName:'മലയാളം'},{lang:'mr-MR',langName:'मराठी'},{lang:'ms-MS',langName:'Bahasa Melayu'},{lang:'ta-TA',langName:'தமிழ்'},{lang:'ur-UR',langName:'اردو'}]
  currencyList: any;
  supportPopup: boolean;
  baseUrl: string = "";
  prodUrl: string = environment.prodUrl;
  userLogo: any;
  agencyName: string;
  agentId: string;

  constructor(
    public router: Router,
    private appStore: AppStore,
    private common: LandingApiService,
    private cookie: CookieService,
    private _commonSpiService: CommonApiService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private segment:SegmentService
  ) {
    this.commonApiService = this._commonSpiService
  }

  ngOnInit() {
    this.versionIdentify();
    this.currncySelection();
    if (sessionStorage.getItem('userLanguage')) {
      this.languageSelect = sessionStorage.getItem('userLanguage');
    }else{
      sessionStorage.setItem('userLanguage',this.languageSelect)
    }
  }

  findProdUrlConfig(){
    const parsedUrl = new URL(window.location.href);
    this.baseUrl = parsedUrl.origin;
  }

  currncySelection(){
    this.common.getCurrencies().subscribe(data=>{
      this.currencyList = data.rates;
      this.checkCurrency();
    })
  }

  checkCurrency(){
    if(sessionStorage.getItem('currency')){
      this.currency = sessionStorage.getItem('currency');
    }
    this.changeCurrency(this.currency)
  }

  changeCurrency(value){
    sessionStorage.setItem('currency',value)
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('currency changed',{
      portal:"B2B",
      selectedCurrency:value
     });
    }
    this.currencyList.forEach(element => {
      if(element.currency == value){
        HedderComponent.globelCurrency = element.currency;
        HedderComponent.globelDecimel = element.precision;
        HedderComponent.globelRate = element.rate;
      }
    });

  }

  ngAfterViewChecked() {
    this.translate.use((sessionStorage.getItem('userLanguage') === 'ar-AE') ? "ar-AE" : sessionStorage.getItem('userLanguage'));
    if (sessionStorage.getItem('userLanguage') == "ar-AE" || sessionStorage.getItem('userLanguage') == "ur-UR") {
      (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
    } else {
      (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    }
  }

  logout() {
    let lang = sessionStorage.getItem('userLanguage');
    let country = JSON.parse(sessionStorage.getItem('country_code'))
    sessionStorage.clear();
    sessionStorage.setItem('userLanguage',lang)
    sessionStorage.setItem('country_code',JSON.stringify(country))
    this.superAgencyActive = false;
    this.branchActive = false;
    this.subAgencyActive = false;
    this.appStore.currentUser = "";
    this.router.navigate(["/login"]);
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('logged out',{
      portal:"B2B"
     });
    }
  }

  changeLangValue(value) {
    this.languageSelect = value;
    this.appStore.langCode = value;
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('language changed',{
      portal:"B2B",
      selectedLanguage:this.languageSelect
     });
    }
    this.translate.use((this.appStore.langCode === 'ar-AE') ? "ar-AE" : value);
    localStorage.setItem("userLanguage", value)
    sessionStorage.setItem("userLanguage", value)
    if (this.appStore.langCode == "ar-AE" || this.appStore.langCode == "ur-UR") {
      (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
    } else {
      (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    }
  }

  callChat(){
   if(this.baseUrl  == this.prodUrl){
      window.analytics.track('chat initialized',{
      portal:"B2B"
     });
    }
  }



  ngDoCheck() {
    if (sessionStorage.getItem("currentUser") == "SUPER") {
      this.superAgencyActive = true;
      this.userType = sessionStorage.getItem('userTypeName');
    }
    if (sessionStorage.getItem("currentUser") == "BRANCH") {
      this.branchActive = true;
      this.userType = sessionStorage.getItem('userTypeName')
    }
    if (sessionStorage.getItem("currentUser") == "SUB") {
      this.subAgencyActive = true;
      this.agentId = sessionStorage.getItem('agencyId');
      this.agencyName = localStorage.getItem('agencyName');
      this.userType = sessionStorage.getItem('userTypeName');
      this.userLogo = localStorage.getItem("agentLogo");
    }
    if (sessionStorage.getItem('userLanguage')) {
      this.languageSelect = sessionStorage.getItem('userLanguage');
    }

  }

  navigatepage(link: any) {
    if (link == 'superagent/createTrip') {
      sessionStorage.removeItem('selector')
    }
    this.router.navigate([link]);
    sessionStorage.removeItem('params')
    sessionStorage.removeItem('custom_trip_id')
  }

  navigateagencyprofile() {
    this.router.navigate(["/superagent/profile/", sessionStorage.getItem("agency_Id")]);
  }

  versionIdentify(){
    sessionStorage.setItem('acceptWebp','true')
    var objappVersion = navigator.appVersion; var objAgent = navigator.userAgent; var objbrowserName = navigator.appName; var objfullVersion = ''+parseFloat(navigator.appVersion); var objBrMajorVersion = parseInt(navigator.appVersion,10); var objOffsetName,objOffsetVersion,ix;
    if ((objOffsetVersion=objAgent.indexOf("Chrome"))!=-1) { objbrowserName = "Chrome"; objfullVersion = objAgent.substring(objOffsetVersion+7); }
    else if ((objOffsetVersion=objAgent.indexOf("Firefox"))!=-1) { objbrowserName = "Firefox"; }
    else if ((objOffsetVersion=objAgent.indexOf("MSIE"))!=-1) { objbrowserName = "Microsoft Internet Explorer"; objfullVersion = objAgent.substring(objOffsetVersion+5); }
    else if ( (objOffsetName=objAgent.lastIndexOf(' ')+1) < (objOffsetVersion=objAgent.lastIndexOf('/')) ) { objbrowserName = objAgent.substring(objOffsetName,objOffsetVersion); objfullVersion = objAgent.substring(objOffsetVersion+1); if (objbrowserName.toLowerCase()==objbrowserName.toUpperCase()) { objbrowserName = navigator.appName; } }
    if ((ix=objfullVersion.indexOf(";"))!=-1) objfullVersion=objfullVersion.substring(0,ix); if ((ix=objfullVersion.indexOf(" "))!=-1) objfullVersion=objfullVersion.substring(0,ix); objBrMajorVersion = parseInt(''+objfullVersion,10); if (isNaN(objBrMajorVersion)) { objfullVersion = ''+parseFloat(navigator.appVersion); objBrMajorVersion = parseInt(navigator.appVersion,10); }

    if(objbrowserName == 'Chrome'){
      if(objOffsetVersion < 25){
        sessionStorage.setItem('acceptWebp','false')
      }
    }
    if(objbrowserName == 'Firefox'){
      if(objOffsetVersion < 65){
        sessionStorage.setItem('acceptWebp','false')
      }
    }
  }

  suppoer(){
    var Tawk_API=Tawk_API||{};
    Tawk_API.visitor = {
      name : sessionStorage.getItem('userTypeName'),
      email : sessionStorage.getItem('userMail')
    };

    var Tawk_LoadStart=new Date();
    (function(){
      var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
      s1.async=true;
      s1.src='https://embed.tawk.to/61125186649e0a0a5cd06b57/1fcnosua7';
      s1.charset='UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode.insertBefore(s1,s0);
    })();
  }

}
