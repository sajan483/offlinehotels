import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SegmentService } from 'ngx-segment-analytics';
import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-transport',
  templateUrl: './payment-transport.component.html',
  styleUrls: ['./payment-transport.component.scss']
})

export class PaymentTransportComponent implements OnInit, OnChanges {
  @Input() tripTransport: any;
  @Input() tripData: any;
  @Input() transportFailed: any;
  @Output() notifyCreatetrip = new EventEmitter();
  showTransportNotAvailable: boolean = false;
  transporttoggle: boolean = false;
  additionalService :any[] = [];
  aditionalAmount: number;
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  currency: any;
  prodUrl: string = environment.prodUrl;
  baseUrl: string = "";
  totalTravelers: string = "1";
  deepLinkStatus: string = "0";
  noOfVehicle: number = 1;
  today = new Date();
  constructor(private translate: TranslateService,private segment:SegmentService) { }

  ngOnInit() {
    this.findProdUrlConfig()
    if(this.baseUrl  == this.prodUrl){
      window.analytics.page('subagent/visa & payment ',{
       portal:"B2B"
     });
    }
    this.additionalService = this.tripTransport.selected_transportation.vehicle_types[0].categories[0].additional_services;
    if(this.additionalService.length != 0){
      var amount = 0;
      this.additionalService.forEach((data)=>{
        data.fare_summary.forEach((price)=>{
          if(price.is_total){
            amount = amount + price.amount;
          }
        })
      })
      this.aditionalAmount = amount;
    }
  }
  
  findProdUrlConfig(){
    const parsedUrl = new URL(window.location.href);
       this.baseUrl = parsedUrl.origin;
   }

   decrementDateByOne(date){
    let date1 = new Date(date);
    date1.setDate(date1.getDate() - 1);
    return date1;
  }

  ngAfterViewChecked() {
    this.translate.use((sessionStorage.getItem('userLanguage') === 'ar-AE') ? "ar-AE" : sessionStorage.getItem('userLanguage'));
    if (sessionStorage.getItem('userLanguage') == "ar-AE" || sessionStorage.getItem('userLanguage') == "ur-UR") {
      (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
    } else {
      (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    }
  }

  ngOnChanges() {
    if (this.transportFailed != "") {
      this.showTransportNotAvailable = true;
    } else {
      this.showTransportNotAvailable = false;
    }
  }

  changeTransport() {
    this.notifyCreatetrip.emit('event');
  }

  currencyConversion(amount){
    return this.subagentHelper.currencyCalculation(amount)
  }

  ngDoCheck(){
    this.currency = HedderComponent.globelCurrency;
    this.totalTravelers = sessionStorage.getItem('transportPassingers');
    this.deepLinkStatus = sessionStorage.getItem('deepLinkStatus');
    var obj = JSON.parse(sessionStorage.getItem('userObject'));
    if(obj != null && obj.vehicleCounts){
      this.noOfVehicle = obj.vehicleCounts;
    }
  }

}