import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubAgentFormService } from 'src/app/Services/sub-agent-form/sub-agent-form-service';
import { CommonApiService } from 'src/app/Services/common-api-services';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { UserStateService } from '../../../services/User-service';
import { SubAgentGroundLeaderFormAdapter } from '../../../adapters/confirmation-page/ground-leader-form-adapter';
import { SubAgentBookingRequest } from '../../../adapters/confirmation-page/booking-request-adapter';
import { DatePipe } from '@angular/common';
import { SubAgentCurrencyLangHelper } from '../../../helpers/currency-lang-helper';
import { ApiServiceSubAgent } from '../../../services/api-service-sub-agent';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.scss']
})
export class ConfirmationPageComponent implements OnInit {
  searchDataParams: any;
  routerParam: any;
  private destroy$ = new Subject();
  tripData: any;
  shimmer:boolean = true;
  travellers:any;
  travellersForm: FormGroup  = new FormGroup({});
  private formAdapter:SubAgentGroundLeaderFormAdapter = new SubAgentGroundLeaderFormAdapter(this.fb);
  nationalityList: any[] = [];
  submitted:boolean = false;
  disablePayBttn: boolean = false;
  showPolicy: boolean = false;
  isLinkReady: boolean = false;
  agencyNumberList: any;
  showLinkPopup: boolean = false;
  customTripData: any;
  bookContinue:boolean = false;
  private bookingAdapter: SubAgentBookingRequest = new SubAgentBookingRequest();
  isHotelSeclection:boolean = false;
  confirmationPopup:boolean = false;
  cancellationData:any[]=[];
  bookingData: any;
  ibanNumberList: any[]=[];
  bookingId: any;
  spinnerLoader:boolean = false;
  timeToCallApi: number;
  selectLangCode:any;
  selectCurrency:any;
  isMobile:boolean = false;
  isDeepLink:boolean = false;
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);

  constructor(private activeRoute:ActivatedRoute,
    private service:SubAgentApiService,private userStateService: UserStateService,
    private formService:SubAgentFormService,private fb: FormBuilder,private apiService:ApiServiceSubAgent,
    private commonApiService:CommonApiService,private translate: TranslateService,private datePipe:DatePipe,
    private router:Router) { }

  ngOnInit() {
    if (window.innerWidth < 992) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    window.scrollTo(0,0)
    this.formService.groupLeaderForm = this.formAdapter.leaderForm()
    this.travellersForm = this.formService.groupLeaderForm;
    this.getParams()
  }

  getParams(){
    this.searchDataParams = this.activeRoute.snapshot.queryParams;
    this.routerParam = this.activeRoute.snapshot.params;
    if(this.searchDataParams.isLink !== undefined){
      if(this.searchDataParams.isLink){
        this.isDeepLink = true;
      }
    }
    this.currencyLangHelper.changeLanguage(this.routerParam.lang);
    this.currencyLangHelper.setCurrency(this.routerParam.currency);
    this.initialValues();
  }

  initialValues(){
    this.userStateService.globelCurrency.subscribe(t => this.selectCurrency = t);
    this.userStateService.globalLanguage.subscribe(t => this.selectLangCode = t);
    this.getCustomTrip();
  }

  getCustomTrip(){
    this.service.getTrip(this.searchDataParams.tripId,this.selectLangCode,this.searchDataParams.ulogId).pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.travellers = data.adults + data.children;
      this.shimmer = false;
      this.customTripData = data;
      if(this.searchDataParams.type == 'hotel'){
        this.tripData = data.trip_hotels_offline != null ? data.trip_hotels_offline[0]:data.medinah_trip_hotel;
        this.setHotelDataForCancellationCard(this.tripData);
        this.isHotelSeclection = true;
      }
      if(this.searchDataParams.type == 'transport'){
        this.tripData = data.trip_transportation;
        this.cancellationData = [data.trip_transportation.selected_transportation.cancellation_policy];
        this.isHotelSeclection = false;
      }
      this.fetchNationality()
      this.getIbanList()
    })
  }

  setHotelDataForCancellationCard(data){
    this.cancellationData = [];
    data.room_variations.forEach(element => {
      this.cancellationData = this.cancellationData.concat(element.room)
    });
  }

  fetchNationality(){
    this.commonApiService.getLanguageCountries(this.selectLangCode).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.nationalityList = data.map(x => ({ item_text: x.name, item_id: x.short_iso_code, item_code:x.code }));
    });
  }

  termsandcondition(){
    this.showPolicy = true;
  }

  closeTermsAndCondition(){
    this.showPolicy = false;
  }

  createLink(){
    this.isLinkReady = true;
    this.service.bookingRequestAgencyList().subscribe((data:any)=>{
      this.isLinkReady = false;
      this.agencyNumberList = data.data;
      this.showLinkPopup = true
    })
  }

  closeBookingRequestPopup(){
    this.showLinkPopup = false;
  }

  bookTrip(target){
    this.submitted = true;
    if (this.travellersForm.invalid) { return }
    if (!this.disablePayBttn){
      if(this.isMobile){
        target.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      }
      return;
    }
    this.bookContinue = true;
    this.travellersForm.disable();
    let travellers = [];
    let roomRef = '';
    let index = 0;
    if(this.isHotelSeclection){
      this.tripData.room_variations.forEach((element:any) => {
        element.room.forEach((value:any) =>{
          roomRef =roomRef + index+"_"+value.pax_info_str+"_";
          index++;
        })
      });
    }else{
      roomRef = '0_'+this.customTripData.adults+'ADT_'+this.customTripData.children+'CHD_0'
    }
    this.postForBookingData(this.travellersForm.value);
    travellers.push(this.bookingAdapter.createTripBookingRequest(this.travellersForm.value,roomRef));
    const body = {"travellers": travellers,"tag":this.travellersForm.controls.tag.value,"for_booking_tag":this.travellersForm.controls.for_booking_tag.value }
    this.service.bookTrip(body,this.searchDataParams.tripId,this.selectLangCode,this.searchDataParams.ulogId).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.service.checkAvailability(data.id,this.searchDataParams.ulogId).pipe(takeUntil(this.destroy$)).subscribe((response) => {
        this.bookingId = data.id;
        if(response.refetch_trip){

        }else{
          this.service.getPaymentDetails(data.id,this.selectLangCode,this.searchDataParams.ulogId).pipe(takeUntil(this.destroy$)).subscribe((value) =>{
            this.bookContinue = false;
            this.confirmationPopup = true;
            this.bookingData = value;
          },(error)=>{
            this.bookContinue = false;
            this.travellersForm.enable()
            Swal.fire({
              icon: 'error',
              text: this.translate.instant('GDS-Maqam server busy,please try later'),
              confirmButtonText: this.translate.instant('ok')
            })
        })
        }
      },(error)=>{
        this.bookContinue = false;
        this.travellersForm.enable()
        Swal.fire({
          icon: 'error',
          text: this.translate.instant('GDS-Maqam server busy,please try later'),
          confirmButtonText: this.translate.instant('ok')
        })
    })
    },(error)=>{
      if(error.status == "400"){
        this.bookContinue = false;
        this.travellersForm.enable()
      }else{
        this.bookContinue = false;
        this.travellersForm.enable()
        Swal.fire({
          icon: 'error',
          text: this.translate.instant('GDS-Maqam server busy,please try later'),
          confirmButtonText: this.translate.instant('ok')
        })
      }
    })
  }

  postForBookingData(data:any){
    if(data.for_booking_tag != ""){
      let code = '';

      let index = this.nationalityList.findIndex(x => x.item_text === data.nationality);
      if(index != -1){
        code = this.nationalityList[index].item_id;
      }

      let body = {
        country_code:code,
        tag:data.for_booking_tag,
        remark:""
      }
      this.apiService.postForBooking(body).subscribe(data=>{

      })
    }
  }

  getIbanList(){
    this.service.getIbanList().pipe(takeUntil(this.destroy$)).subscribe(data =>{
      this.ibanNumberList = data.data;
    })
  }

  getPaymentData(evt){
    if(evt.close){
      this.confirmationPopup = false;
      this.bookContinue = false;
      this.travellersForm.enable()
    }else{
      this.booking(evt);
    }
  }

  booking(evt){
    let body = {
      "booking_id": this.bookingId,
      "account_no": evt.account_no,
      "auth_code": evt.auth_code,
      "is_whatsapp_msg_sended":this.travellersForm.controls.whatsappSend.value
    }
    this.spinnerLoader = true;
    this.service.bookingPayment(body,this.searchDataParams.ulogId).pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
      if (res.status == "Success"){
        this.timeToCallApi = 0;
        this.callBookingStatusApi();
      }else{
        this.spinnerLoader = false;
        this.travellersForm.enable();
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('Payment Failed'),
          text: this.translate.instant('please try again'),
          confirmButtonText: this.translate.instant('ok')
        })
      }
    },(error)=>{
      this.spinnerLoader = false;
      this.travellersForm.enable();
      Swal.fire({
        icon: 'error',
        text: this.translate.instant('Account Does Not Exist'),
        confirmButtonText: this.translate.instant('ok')
      })
    })
  }

  callBookingStatusApi(){
    this.service.bookingStatus(this.bookingId,this.selectLangCode,this.searchDataParams.ulogId).pipe(takeUntil(this.destroy$)).subscribe(value =>{
        this.checkResponseStatus(value);
    },error => {
      this.spinnerLoader = false;
      this.confirmationPopup = false;
      this.travellersForm.enable()
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('Payment Failed'),
        text: this.translate.instant('please try again'),
        confirmButtonText: this.translate.instant('ok')
      })
    })
  }

  checkResponseStatus(value){
    if(value.code == '0'){
      this.spinnerLoader = false;
      this.confirmationPopup = false;
      this.router.navigate(['subagent/payment/' + this.bookingId + '/success/'+this.selectLangCode+'/'+this.selectCurrency]);
    }else if(value.code == '00111' || value.code == '00112'){
      if(this.timeToCallApi <= 8){
        this.timeToCallApi = this.timeToCallApi + 1;
        setTimeout(() => {
          this.callBookingStatusApi();
        }, 5000);
      }else{
        this.spinnerLoader = false;
        this.confirmationPopup = false;
        this.travellersForm.enable();
        Swal.fire({
          icon: 'error',
          text: this.translate.instant('This process will take some time in GDS-Maqam end. We will send you the confirmation on mail.'),
          confirmButtonText: this.translate.instant('ok')
        })
      }
    }else if(value.code == '01101'){
      this.spinnerLoader = false;
      this.confirmationPopup = false;
      this.travellersForm.enable();
      Swal.fire({
        icon: 'error',
        text: value.message[0],
        confirmButtonText: this.translate.instant('ok')
      })
    }else if(value.code == '00400'){
      this.spinnerLoader = false;
      this.confirmationPopup = false;
      this.travellersForm.enable()
      Swal.fire({
        icon: 'error',
        text: this.translate.instant('Some Technical Problem from GDS-Maqam,Please Try Later'),
        confirmButtonText: this.translate.instant('ok')
      })
    }
  }


}

