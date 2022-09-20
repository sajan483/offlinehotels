import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/interval';
import Swal from "sweetalert2";
import { TranslateService } from '@ngx-translate/core';
import { GeneralHelper } from 'src/app/helpers/General/general-helpers';
import { CreateTripHelper } from 'src/app/helpers/sub-agent/create-trip-helpers';
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import { LooseObject } from "src/app/models/visaTypes";
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { environment } from 'src/environments/environment';
import { Subject, Subscription,timer} from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { SubAgentCurrencyLangHelper } from '../../../helpers/currency-lang-helper';
import { UserStateService } from '../../../services/User-service';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})

export class PaymentStatusComponent implements OnInit,OnDestroy{
  private destroy$ = new Subject();
  tripData: any;
  selectedTransport: any;
  tripTransport: any;
  tripService: any;
  tripVisaData: any;
  status: any;
  tripTravellers: any;
  tripFlight: any;
  makkahCancellation: any;
  medinahCancellation: any;
  serviceCancellation: any;
  transportCancellation: any;
  canCancel: any;
  dataArray: any;
  counter = 0;
  reference_no: any
  selectedValue: string;
  cancelationPopup: boolean = false;
  makkahchecked: boolean = false;
  medinahchecked: boolean = false;
  transportchecked: boolean = false;
  viewbttn: boolean = false;
  makka: boolean = true;
  medinah: boolean = true;
  trnsprt: boolean = true;
  genHelper: GeneralHelper;
  createHelper: CreateTripHelper;
  makkahotel: boolean = false;
  cancellationtoggle: boolean = false;
  bknStatus: any;
  noOfTravellers: any;
  invoicetoggle: boolean = false;
  vouchertoggle: boolean = false;
  shimmer: boolean = true;
  btnactv: boolean;
  submitted = false;
  checkCancelData: LooseObject = {};
  interval;
  allowUserToCancellBooking: boolean;
  setBooleanToCheckTheBrnStatus: boolean = false;
  processing: boolean = false;
  readonly:boolean = true;
  downloadShow: boolean = false;
  roomQunty: number;
  passngrCount: number;
  statusCounter: number = 0;
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  currency: any;
  hoteltotalamount: number = 0;
  cancellationAmount: number = 0;
  reciepttoggle: boolean;
  prodUrl: string = environment.prodUrl ;
  baseUrl: string = "";
  BaseUrl:string = environment.baseUrl
  showVatPopup: boolean = false;
  vatNumber: string = "";
  invoiceActive: boolean = false;
  receptActive: boolean = false;
  invData: any = "";
  showInvoicePoup: boolean = false;
  pendingApiTimer =  environment.pendingApiTime;
  getListResponse: any;
  getListSubscription: Subscription;
  checkCanResponse: any;
  canSubscription: Subscription;
  currentDateTimeStamp: number;
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  selectLangCode:any;
  selectCurrency:any;
  tripId:any;

  
  constructor(private route: ActivatedRoute,
    private common: SubAgentApiService,
    private _gHelper: GeneralHelper,
    private translate: TranslateService,
    private userStateService: UserStateService,) {
    this.genHelper = _gHelper;

   
  }

  ngOnInit() {
    this.findProdUrlConfig()
    if(this.baseUrl  == this.prodUrl){
      window.analytics.page('subagent/payment success ',{
        user:localStorage.getItem("userTypeName"),
       userId:localStorage.getItem("userId"),
       portal:"B2B"
     });
    }
    this.genHelper.checkForAccessToken();
    this.getLanguage();
  }

  getLanguage(){
    this.route.params.subscribe(params =>{
      this.currencyLangHelper.changeLanguage(params.lang);
      this.currencyLangHelper.setCurrency(params.currency);
      this.status = params.status;
      this.tripId = params.id;
    })
    this.initialValues();
  }

  initialValues(){
    this.userStateService.globelCurrency.subscribe(t => this.selectCurrency = t);
    this.userStateService.globalLanguage.subscribe(t => this.selectLangCode = t);
    this.getList();
  }

  findProdUrlConfig(){
    const parsedUrl = new URL(window.location.href);
       this.baseUrl = parsedUrl.origin;
   }


  getList() {
    this.getListSubscription = this.common.getPaymentDetails(this.route.snapshot.params.id,sessionStorage.getItem('userLanguage'),sessionStorage.getItem("ulogId")).pipe(takeUntil(this.destroy$)).subscribe((data) => {
     if(data && data.message == "Request is processing"){
      if(this.counter < 10){
        this.setTimerForGetList();
        this.counter = this.counter + 1;
      }else
      { 
        Swal.fire({
          text: this.translate.instant('Server is busy now, please try after some time'),
          icon: "warning",
          confirmButtonText: this.translate.instant("ok"),
        });
      }
    }else{
      this.getData(data);
    } 
    },(error)=>{
      this.getListResponse = true;
      Swal.fire({
        icon: 'error',
        text: this.translate.instant("Some error occurred. Please try again later"),
        confirmButtonText: this.translate.instant('Ok'),
      })
    });
  }

  setTimerForGetList() {
    setTimeout(()=>{
      this.getList();
    }, 5000);
   }

   
  getData(data) {
    this.shimmer = false;
    this.bknStatus = data.status
    this.reference_no = data.reference_no;
    if (this.dataArray) { this.dataArray.unsubscribe(); }
    this.tripData = data;
    if(this.tripData.status == 'success' || this.tripData.status == 'partial_success'){
      this.downloadShow = true;
    }
    this.checkCancelData.details = this.tripData;
  
    if (data.transport_booking) {
      this.setTimeStamp(this.selectedTransport)
    }
   
    if(data.status != "success"){
     this.processing = true;
     this.counter = 0
    
     if(this.statusCounter < 3){
      this.setTimerForGetListStatus()
      this.statusCounter += 1;
     }else{
      this.processing = false;
     }
     
    }else{
      this.processing = false;
    }
  }

  setTimerForGetListStatus() {
    setTimeout(()=>{
      this.callGetListForStstus();
    }, 10000);
   }

  callGetListForStstus(){
    this.common.getPaymentDetails(this.route.snapshot.params.id,sessionStorage.getItem('userLanguage'),sessionStorage.getItem("ulogId")).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.getData(data)
      })
  }
  

  setTimeStamp(data){
    if(data && data.cancellation_policy && data.cancellation_policy.rules && data.cancellation_policy.rules.length > 0){
      this.currentDateTimeStamp = new Date().getTime()/1000;
      data.cancellation_policy.currentDateTimeStamp = new Date().getTime()/1000;
      data.cancellation_policy.rules.forEach(element => {
        element.start_timer = new Date(element.from_date_time).getTime()/1000;
        element.end_timer = new Date(element.to_date_time).getTime()/1000;
      });
    }      
  }


  

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }

}