import { Component, OnInit } from "@angular/core";
import { StepperAdapter } from "src/app/adapters/super-agent/stepper-adapter";
import { HelperService } from "src/app/common/services/helper-service";
import { HotelsList } from "src/app/models/custome_trip";
import { SuperAgentApiService } from "src/app/Services/super-agent-api-services";
import { AppStore } from "src/app/stores/app.store";

@Component({
  selector: "app-stepper",
  templateUrl: "./stepper.component.html",
  styleUrls: ["./stepper.component.scss"],
  providers: [],
})
export class StepperComponent implements OnInit {
  private stepperAdapter: StepperAdapter = new StepperAdapter(null);
  showShimmer: boolean;
  selector
  static searchData: any;
  hotelFlag;
  superAgentApiService: SuperAgentApiService;
  helperService: HelperService;
  dataFromSearchPage: any;
  hotelCity

  constructor(
    private _superAgentApiService: SuperAgentApiService,
    private appStore: AppStore,
    private _healperService:HelperService
  ) {
    this.superAgentApiService = _superAgentApiService;
    this.helperService = _healperService;
  }

  ngOnInit() {
    if(sessionStorage.getItem('selector') == null || sessionStorage.getItem('selector') === 'flight'){
      this.selector = 'flight'
      document.getElementById(this.selector).style.backgroundColor = "#f3ac3c";
      this.dataFromSearchPage = StepperComponent.searchData;
    }

    if(sessionStorage.getItem('selector') === 'hotelMakkah'){
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#f3ac3c";
      this.selector = 'hotel'
      this.hotelFlag='MAKKA'
    }
    
    if(sessionStorage.getItem('selector') === 'hotelMadeena'){
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#f3ac3c";
      this.selector = 'hotel'
      this.hotelFlag='MADEENA'
    }

    if(sessionStorage.getItem('selector') === 'transport'){
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#f3ac3c";
      this.selector = 'transport'
    }

    if(sessionStorage.getItem('selector') === 'otherServices'){
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#6da631";
      document.getElementById('otherServices').style.backgroundColor = "#f3ac3c";
      this.selector = 'otherServices'
    }

    if(sessionStorage.getItem('selector') === 'payment'){
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#6da631";
      document.getElementById('otherServices').style.backgroundColor = "#6da631";
      document.getElementById('payment').style.backgroundColor = "#f3ac3c";
      this.selector = 'payment'
    }

    if(sessionStorage.getItem('selector') === 'otherInfo'){
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#6da631";
      document.getElementById('otherServices').style.backgroundColor = "#6da631";
      document.getElementById('payment').style.backgroundColor = "#6da631";
      document.getElementById('otherInfo').style.backgroundColor = "#f3ac3c";
      this.selector = 'otherInfo'
    }

    if(sessionStorage.getItem('selector') === 'itinerary'){
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#6da631";
      document.getElementById('otherServices').style.backgroundColor = "#6da631";
      document.getElementById('payment').style.backgroundColor = "#6da631";
      document.getElementById('otherInfo').style.backgroundColor = "#6da631";
      document.getElementById('itinerary').style.backgroundColor = "#f3ac3c";
      this.selector = 'itinerary'
    }

    if(sessionStorage.getItem('selector') === 'preview'){
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#6da631";
      document.getElementById('otherServices').style.backgroundColor = "#6da631";
      document.getElementById('payment').style.backgroundColor = "#6da631";
      document.getElementById('otherInfo').style.backgroundColor = "#6da631";
      document.getElementById('itinerary').style.backgroundColor = "#6da631";
      document.getElementById('preview').style.backgroundColor = "#f3ac3c";
      this.selector = 'preview'
    }

  }

  stepContent(component, flag) {

    if(component == 'flight'){
      document.getElementById('flight').style.backgroundColor = "#f3ac3c";
      this.selector = 'flight'
    }

    if (component == "hotel") {
      this.selector = component;
      this.hotelFlag = flag;

      if(flag == "MAKKA"){
        document.getElementById('flight').style.backgroundColor = "#6da631";
        document.getElementById(flag).style.backgroundColor = "#f3ac3c";
      }
      else {
        document.getElementById('flight').style.backgroundColor = "#6da631";
        document.getElementById('MAKKA').style.backgroundColor = "#6da631";
        document.getElementById(flag).style.backgroundColor = "#f3ac3c";
      }

    }

    if(component == 'transport'){
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#f3ac3c";
      this.selector = 'transport'
    }

    if(component == 'otherServices'){
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#6da631";
      document.getElementById('otherServices').style.backgroundColor = "#f3ac3c";
      this.selector = 'otherServices'
    }

    if(component == 'payment'){
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#6da631";
      document.getElementById('otherServices').style.backgroundColor = "#6da631";
      document.getElementById('payment').style.backgroundColor = "#f3ac3c";
      this.selector = 'payment'
    }

    if(component == 'otherInfo'){
      this.selector = 'otherInfo';
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#6da631";
      document.getElementById('otherServices').style.backgroundColor = "#6da631";
      document.getElementById('payment').style.backgroundColor = "#6da631";
      document.getElementById('otherInfo').style.backgroundColor = "#f3ac3c";
    }

    if(component == 'itinerary'){
      this.selector = 'itinerary'
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#6da631";
      document.getElementById('otherServices').style.backgroundColor = "#6da631";
      document.getElementById('payment').style.backgroundColor = "#6da631";
      document.getElementById('otherInfo').style.backgroundColor = "#6da631";
      document.getElementById('itinerary').style.backgroundColor = "#f3ac3c";
    }

    if(component == 'preview'){
      this.selector = 'preview'
      document.getElementById('flight').style.backgroundColor = "#6da631";
      document.getElementById('MAKKA').style.backgroundColor = "#6da631";
      document.getElementById('MADEENA').style.backgroundColor = "#6da631";
      document.getElementById('transport').style.backgroundColor = "#6da631";
      document.getElementById('otherServices').style.backgroundColor = "#6da631";
      document.getElementById('payment').style.backgroundColor = "#6da631";
      document.getElementById('otherInfo').style.backgroundColor = "#6da631";
      document.getElementById('itinerary').style.backgroundColor = "#6da631";
      document.getElementById('preview').style.backgroundColor = "#f3ac3c";
    }

  }

}