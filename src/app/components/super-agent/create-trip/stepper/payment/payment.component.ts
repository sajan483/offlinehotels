import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { StepperAdapter } from 'src/app/adapters/super-agent/stepper-adapter';
import { AppStore } from 'src/app/stores/app.store'
import { StepperComponent } from '../stepper.component';
import Swal from 'sweetalert2';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit,OnDestroy {
  advancepayment : FormGroup;
  private destroy$ = new Subject();
  submitted = false;
  SuperAgentApiService:SuperAgentApiService;
  StepperAdapter : StepperAdapter;
  suggestedAmound: any;
  bttnactive: boolean = false;
  currency: string;
  fareSummary: any;
  totalAdult: number = 0;
  totalChild: number = 0;

  constructor(private formBuilder: FormBuilder,private _SuperAgentService:SuperAgentApiService,
    private appStore:AppStore,private stepper:StepperComponent) { 
    this.SuperAgentApiService=this._SuperAgentService;
    this.StepperAdapter = new StepperAdapter(null);
  }

  ngOnInit() {
    this.callSuggestedAmount();
    this.currency = sessionStorage.getItem('currency');
    
    this.advancepayment = this.StepperAdapter.paymentUpdateForm();
  }

  splitupTotal(value){
    this.totalAdult = (+value.flightAdult) + (+value.MakkahAdult) + (+value.madeenaAdult) + (+value.transport) + (+value.visaAdult) + (+value.service);
    this.totalChild = (+value.flightChild) + (+value.makkahChild) + (+value.madeenaChild) + (+value.transport) + (+value.visaChild) + (+value.service);
  }

  setFareSummary(data){
    if(data.flight_details.length > 0){
      this.fareSummary.flightAdult = data.flight_details[0].flights[0].adult_price;
      this.fareSummary.flightChild = data.flight_details[0].flights[0].child_price;
    }
    if(data.makkah_hotel_detail && data.makkah_hotel_detail != null && data.makkah_hotel_detail.hotels.length > 0){
      this.fareSummary.MakkahAdult = data.makkah_hotel_detail.hotels[0].adult_price;
      this.fareSummary.makkahChild = data.makkah_hotel_detail.hotels[0].child_price;
    }
    if(data.madinah_hotel_detail && data.madinah_hotel_detail != null && data.madinah_hotel_detail.hotels.length > 0){
      this.fareSummary.madeenaAdult = data.madinah_hotel_detail.hotels[0].adult_price;
      this.fareSummary.madeenaChild = data.madinah_hotel_detail.hotels[0].child_price;
    }
    if(data.transport_details.length > 0){
      this.fareSummary.transport = data.transport_details[0].transportations[0].price_per_pax;
    }
    if(data.visa_details.length > 0){
      this.fareSummary.visaAdult = data.visa_details[0].visas[0].adult_price;
      this.fareSummary.visaChild = data.visa_details[0].visas[0].child_price;
    }
    this.splitupTotal(this.fareSummary)
  }

  /**
   * this method for call suggested amounts
   */
  callSuggestedAmount(){
    this.fareSummary = {
      MakkahAdult: 0,
      flightAdult: 0,
      flightChild: 0,
      madeenaAdult: 0,
      madeenaChild: 0,
      makkahChild: 0,
      service: 0,
      transport: 0,
      visaAdult: 0,
      visaChild: 0,
    }
    this.SuperAgentApiService.getPackageDetails(sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      if(data.adult_price != null && data.adult_price != 0){
        this.advancepayment = this.StepperAdapter.savedPaymentForm(data);
      }
      this.setFareSummary(data);
    })
    
  }

  get f(){return this.advancepayment.controls}

  /**
   * this method for update price values
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.advancepayment.invalid) {
        return;
    }

    if(this.advancepayment.controls.advance_pct.value > 100 || this.advancepayment.controls.b2b_pct.value > 100){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Percentage must be less than 100 ',
      })
      return;
    }
    this.bttnactive = true;
    
    /**
     * payment detail update package api
     */
    this.SuperAgentApiService.updatePackageAPI(this.advancepayment.value,sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){
        sessionStorage.setItem('selector','preview');
        this.stepper.stepContent('preview','');
        sessionStorage.removeItem('modify');
      }else{
        sessionStorage.setItem('selector','otherInfo')
        this.stepper.stepContent('otherInfo','');
      }
      this.bttnactive = false;
    })
  }

  back(){
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){

    }else{
      this.stepper.stepContent('otherServices','')
      sessionStorage.setItem('selector','otherServices')  
    }
    
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }

}