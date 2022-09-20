import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/interval';
import { Observable, Subject } from 'rxjs';
import { Subscription,timer} from "rxjs";
import Swal from "sweetalert2";
import { TranslateService } from '@ngx-translate/core';
import { AppStore } from 'src/app/stores/app.store';
import { NotificationService } from 'src/app/common/services/notification.service';
import { GeneralHelper } from 'src/app/helpers/General/general-helpers';
import { CreateTripHelper } from 'src/app/helpers/sub-agent/create-trip-helpers';
import { HelperService } from "src/app/common/services/helper-service";
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import { FormBuilder} from '@angular/forms';
import { LooseObject } from "src/app/models/visaTypes";
import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { SegmentService } from 'ngx-segment-analytics';
import { environment } from 'src/environments/environment';
import { Http,Headers} from '@angular/http';
import { DateTimeToDateFormat } from 'src/app/helpers/date_time/date_pipe';
import { takeUntil } from 'rxjs/operators';
import { SubAgentCurrencyLangHelper } from '../../../helpers/currency-lang-helper';
import { UserStateService } from '../../../services/User-service';
@Component({
  selector: 'app-itinerary-view',
  templateUrl: './itinerary-view.component.html',
  styleUrls: ['./itinerary-view.component.scss']
})
export class ItineraryViewComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  tripData: any;
  today = new Date();
  tripMakkahHotel: any[]=[];
  hotelMakkahFare: any;
  tripMakkahHotelrating: number;
  tripMadeenaHotel: any;
  hotelMadeenaFare: any;
  transportFare: any;
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
  makkahotel: boolean = false;
  cancellationtoggle: boolean = false;
  bknStatus: any;
  noOfTravellers: any;
  invoicetoggle: boolean = false;
  vouchertoggle: boolean = false;
  shimmer: boolean = true;
  btnactv: boolean;
  readonly:boolean = true;
  submitted = false;
  checkCancelData: LooseObject = {};
  timerStatus: boolean;
  allowUserToCancellBooking: boolean;
  downloadShow: boolean = false;
  roomQunty: number;
  passngrCount: number;
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  currency: any;
  swapHotel: boolean;
  hoteltotalamount: number = 0;
  cancellationAmount: number = 0;
  reciepttoggle: boolean;
  prodUrl: string = environment.prodUrl;
  baseUrl: string = "";
  showVatPopup: boolean = false;
  vatNumber: string = "";
  invoiceActive: boolean = false;
  receptActive: boolean = false;
  BaseUrl: string = environment.baseUrl;
  invData: any = "";
  getListSubscription: Subscription;
  pendingApiTimer = environment.pendingApiTime;
  getListResponse: boolean;
  checkCanResponse: any;
  canSubscription: any;
  currentDateTimeStamp: number;
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  selectLangCode:any;
  selectCurrency:any;
  tripId:any;

  constructor(private route: ActivatedRoute,
    private appStore: AppStore,
    private common: SubAgentApiService,
    private notifyService: NotificationService,
    private router: Router,
    private _gHelper: GeneralHelper,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private translate: TranslateService,
    private userStateService: UserStateService,
    private http:Http,
    private dateFormate:DateTimeToDateFormat,
    private segment:SegmentService) { 
      this.genHelper = _gHelper;
    }

  ngOnInit() {
    this.findProdUrlConfig()
    if(this.baseUrl  == this.prodUrl){
      window.analytics.page('subagent/view itinerary ',{
       user:localStorage.getItem("userTypeName"),
       userId:localStorage.getItem("userId"),
       portal:"B2B"
     });
    }
    if (sessionStorage && sessionStorage.getItem('accesstoken')) {
      this.getLanguage();
    }else{
      this.router.navigate(["/login"]);
    }
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
    this.setTimerForGetListApiIsPendingForMorethan30Seconds();
    this.getListResponse = false;
    this.getListSubscription = this.common.getPaymentDetails(this.tripId,this.selectLangCode,sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((data:any) => {
      this.getListResponse = true;
      if (data.message && data.message == "Request is processing" && this.counter < 10) {
        this.dataArray = Observable
          .interval(10 * 1000)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.getList();
            this.counter = this.counter + 1;
          });
      } else {
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

  setTimerForGetListApiIsPendingForMorethan30Seconds(){
    timer(this.pendingApiTimer).pipe(takeUntil(this.destroy$)).subscribe(x => {
        if(!this.getListResponse){
          if(this.getListSubscription != undefined && this.getListSubscription != null){
            this.getListSubscription.unsubscribe();
          }
        Swal.fire({
          icon: 'error',
          text: this.translate.instant("It seems like server busy from Maqam-GDS.Try again later"),
          confirmButtonText: this.translate.instant('Try Again')
        }).then((result) => {
          this.getList()
        })
      }
    });
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
  }

  setTimeStamp(data){
    if(data && data.cancellation_policy && data.cancellation_policy.rules &&  data.cancellation_policy.rules.length > 0){
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