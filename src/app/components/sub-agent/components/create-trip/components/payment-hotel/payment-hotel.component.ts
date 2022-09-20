import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { TranslateService } from '@ngx-translate/core';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { environment } from 'src/environments/environment';
import { SegmentService } from 'ngx-segment-analytics';

@Component({
  selector: 'app-payment-hotel',
  templateUrl: './payment-hotel.component.html',
  styleUrls: ['./payment-hotel.component.scss']
})

export class PaymentHotelComponent implements OnInit, OnChanges {
  @Input() tripHotel: any;
  @Input() city: any;
  @Output() notifyCreateTrip = new EventEmitter();
  showMakkah: boolean = false;
  showMadinah: boolean = false;
  makkahotel: boolean = false;
  travelCount: number;
  readonly = true;
  baseFareAmount: number;
  taxAmount: number;
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  currency: any;
  swapHotel: boolean;
  prodUrl: string = environment.prodUrl;
  baseUrl: string = "";
  deepLinkStatus: string = "";
  constructor(private appStore: AppStore, private translate: TranslateService,private segment:SegmentService) { }

  ngOnInit() {
    this.findProdUrlConfig()
    if(this.baseUrl  == this.prodUrl){
      window.analytics.page('subagent/visa & payment ',{
       portal:"B2B"
     });
    }
    var obj = JSON.parse(sessionStorage.getItem('userObject'))
    this.travelCount = obj.adults + obj.children;
    this.swapHotel = obj.swapHotel;
    this.deepLinkStatus =sessionStorage.getItem("deepLinkStatus")
  }

  findProdUrlConfig(){
    const parsedUrl = new URL(window.location.href);
       this.baseUrl = parsedUrl.origin;
   }

   fareSplitAmount(name:string){
    let amt:number = 0;
    this.tripHotel.room_variations.forEach(element => {
      element.room.forEach(room => {
        room.fare_summary.forEach(payment => {
          if(payment.name == name){
            amt = amt + (payment.amount * room.quantity)
          }
        });
      });
    });
    return this.subagentHelper.currencyCalculation(amt);
  }

  ngOnChanges() {
    if (this.city == "makkah") { this.showMakkah = true } else { this.showMakkah = false }
    if (this.city == "madinah") { this.showMadinah = true } else { this.showMadinah = false }
  }

  ngAfterViewChecked() {
    this.translate.use((sessionStorage.getItem('userLanguage') === 'ar-AE') ? "ar-AE" : sessionStorage.getItem('userLanguage'));
    if (sessionStorage.getItem('userLanguage') == "ar-AE" || sessionStorage.getItem('userLanguage') == "ur-UR") {
      (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
    } else {
      (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    }
  }

  goToHotelStepper(event) {
    let stepLength = JSON.parse(sessionStorage.getItem('steps')).length
    if (stepLength > 1) {
      if (event == "makkah") {
        if(this.swapHotel){
          sessionStorage.setItem('stage', '1')
        }else{
          sessionStorage.setItem('stage', '0')
        }
        sessionStorage.setItem('modify', 'yes')
        location.reload()
      }
      else {
        if(this.swapHotel){
          sessionStorage.setItem('stage', '0')
        }else{
          sessionStorage.setItem('stage', '1')
        }
        sessionStorage.setItem('modify', 'yes')
        location.reload()
      }
    }
    else {
      sessionStorage.setItem('stage', '0')
      location.reload()
    }

  }

  currencyConversion(amount){
    return this.subagentHelper.currencyCalculation(amount)
  }

  ngDoCheck(){
    this.currency = HedderComponent.globelCurrency;
  }
}
