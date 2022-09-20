import { TranslateService } from "@ngx-translate/core";
import { UserStateService } from "../services/User-service";

export class SubAgentCurrencyLangHelper {

    constructor(private userStateService: UserStateService,private translate: TranslateService){}

    setCurrency(currency:any){
        if(this.userStateService.currency.length > 0){
            let currencyList:any[] = this.userStateService.currency;
            currencyList.forEach(data=>{
                if(currency == data.currency){
                    this.userStateService.globelCurrency.next(data.currency)
                    this.userStateService.globelDecimel.next(data.precision)
                    this.userStateService.globelRate.next(data.rate)
                }
            })
        }else{
            setTimeout(()=>{ 
                this.setCurrency(currency)
            },2000)
        }
    }

    changeLanguage(lang:any){
        if(lang == 'ar-AE'){
            this.userStateService.globalLanguage.next('ar-AE');
            this.userStateService.globalLanguageName.next('العربية');
            this.translate.use('ar-AE');
            (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
        }else{
            this.userStateService.globalLanguage.next('en-US');
            this.userStateService.globalLanguageName.next('ENGLISH');
            this.translate.use('en-US');
            (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
        }
    }
}