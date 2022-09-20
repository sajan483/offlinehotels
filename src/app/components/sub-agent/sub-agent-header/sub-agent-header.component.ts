import { AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import {  fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { UserStateService } from '../services/User-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ApiServiceSubAgent } from '../services/api-service-sub-agent';
import { SubAgentCurrencyLangHelper } from '../helpers/currency-lang-helper';

@Component({
  selector: 'app-sub-agent-header',
  templateUrl: './sub-agent-header.component.html',
  styleUrls: ['./sub-agent-header.component.scss']
})
export class SubAgentHeaderComponent implements OnInit {

  currencyList: any;
  selectCurrency: any;
  selectLang:any;
  selectLangCode:any;
  languageOptions : any = [ {lang:'ar-AE',langName:'العربية'},{lang:'en-US',langName:'ENGLISH'}];
  private scrollSubscription: Subscription;
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  userDetails:any;
  menuState: string ='hidden';
  isSubUser:boolean = false;

  constructor(private renderder: Renderer2,private apiService:ApiServiceSubAgent,private translate: TranslateService,
    private userStateService: UserStateService,private route:Router,private datePipe:DatePipe,
    private zone: NgZone,@Inject(PLATFORM_ID) private platform?: any) {

    this.zone.runOutsideAngular(() => {
      if (isPlatformBrowser(this.platform)) {
        this.scrollSubscription = fromEvent(window, 'scroll', { passive: true, capture: true }).pipe(debounceTime(100)).subscribe(e => {
          if(window.pageYOffset>=40) {
            this.renderder.addClass((<HTMLInputElement>document.getElementById("stickHeader")), 'sticky-header');
          } else {
            renderder.removeClass((<HTMLInputElement>document.getElementById("stickHeader")), 'sticky-header');
          }
        });
      }
    });

   }

  ngOnInit() {
    this.getCurrency();
    this.setInitialization()
  }

  setInitialization(){
    this.userStateService.globalLanguageName.subscribe(t => this.selectLang = t);
    this.userStateService.globelCurrency.subscribe(t => this.selectCurrency = t);
    this.userStateService.globalLanguage.subscribe(t => this.selectLangCode = t);
  }

  getCurrency(){
    this.apiService.getCurrencies().subscribe((data:any)=>{
      this.currencyList = data.rates;
      this.currencyList.forEach(element => {
        this.userStateService.currency.push(element);
      });
    })
    this.apiService.getStaffDetails().subscribe(data=>{
      this.userDetails = data;
      if(data.role == 'EMPLOYEE'){
        this.isSubUser = true;
      }
    })
  }

  selctCurrency(data:any){
    this.userStateService.globelCurrency.next(data.currency);
    this.userStateService.globelDecimel.next(data.precision);
    this.userStateService.globelRate.next(data.rate);
  }

  setLanguage(lang:any){
    this.userStateService.globalLanguageName.next(lang.langName);
    this.userStateService.globalLanguage.next(lang.lang);
    this.currencyLangHelper.changeLanguage(lang.lang);
  }

  navigate(link:any){
    this.route.navigate([link+"/"+this.selectLangCode+"/"+this.selectCurrency])
  }

  hedearNavigate(event:any){
    this.navigetService(event.url,event.service);
  }

  navigetService(link:any,service:string){
    let x = this.randomKeyGenerator(5,service)
    this.route.navigate([link+"/"+this.selectLangCode+"/"+this.selectCurrency],
    { queryParams: { 
      ulogId:x
    }}
    )
  }

  randomKeyGenerator(length,service) {
    let key = new Date().getTime().toString();
    let result           = [];var x = "";
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));}
    x = service + result.join('') + key
    return x;
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.route.navigate(["/login"]);
  }

  openSideNav(){
    this.menuState = 'visible';
  }

  closeSideNav(){
    this.menuState = 'hidden';
  }

}
