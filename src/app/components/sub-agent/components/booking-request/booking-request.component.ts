import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SubAgentCurrencyLangHelper } from '../../helpers/currency-lang-helper';
import { ApiServiceSubAgent } from '../../services/api-service-sub-agent';
import { UserStateService } from '../../services/User-service';

@Component({
  selector: 'app-booking-request',
  templateUrl: './booking-request.component.html',
  styleUrls: ['./booking-request.component.scss']
})
export class BookingRequestComponent implements OnInit {

  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  selectLangCode:any;
  selectCurrency:any;
  phoneNumber:string='';

  constructor(private userStateService: UserStateService,private apiService:ApiServiceSubAgent,
    private translate: TranslateService,private activeRoute:ActivatedRoute) { }

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
    this.getProfile();
  }

  getProfile(){
    this.apiService.getStaffDetails().subscribe(data =>{
      this.phoneNumber = data.agency.phn_country_code+"-"+data.agency.phone_number
    })
  }

}
