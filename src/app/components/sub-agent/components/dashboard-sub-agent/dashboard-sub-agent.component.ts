import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SubAgentCurrencyLangHelper } from '../../helpers/currency-lang-helper';
import { ApiServiceSubAgent } from '../../services/api-service-sub-agent';
import { UserStateService } from '../../services/User-service';

@Component({
  selector: 'app-dashboard-sub-agent',
  templateUrl: './dashboard-sub-agent.component.html',
  styleUrls: ['./dashboard-sub-agent.component.scss']
})
export class DashboardSubAgentComponent implements OnInit {

  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  selectLangCode:any;
  selectCurrency:any;
  whatsappText:string='';

  constructor(private userStateService: UserStateService,private translate: TranslateService,
    private activeRoute:ActivatedRoute,private route:Router,private apiService:ApiServiceSubAgent) { }

  ngOnInit() {
    this.getLanguage();
  }

  getLanguage(){
    this.activeRoute.params.subscribe(params =>{
      this.currencyLangHelper.changeLanguage(params.lang);
      this.currencyLangHelper.setCurrency(params.currency);
    })
    this.initialValues();
  }

  initialValues(){
    this.userStateService.globelCurrency.subscribe(t => this.selectCurrency = t);
    this.userStateService.globalLanguage.subscribe(t => this.selectLangCode = t);
    this.getProfileDetails()
  }

  getProfileDetails(){
    this.apiService.getStaffDetails().subscribe(data=>{
      this.whatsappText = 'this is '+data.name+' from '+data.agency.name+' travels,'+data.agency.country;
    })
  }

  navigetService(link:any,service:string){
    let x = this.randomKeyGenerator(5,service)
    this.route.navigate([link+"/"+this.selectLangCode+"/"+this.selectCurrency],
    { queryParams: { 
      ulogId:x
    }}
    )
  }

  navigetServiceBookings(){
    this.route.navigate(["/subagent/booking-requests/"+this.selectLangCode+"/"+this.selectCurrency])
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
}
