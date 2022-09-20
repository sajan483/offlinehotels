import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { DateTimeToDateFormat } from 'src/app/helpers/date_time/date_pipe';
import { UserStateService } from 'src/app/components/sub-agent/services/User-service';
import { TranslateService } from '@ngx-translate/core';
import { SubAgentHotelDetailsHelper } from 'src/app/components/sub-agent/helpers/hotel/hotel-details-helpers';
import { SubAgentDateTimeHelper } from 'src/app/components/sub-agent/helpers/date-time-helpers';
import { DatePipe } from '@angular/common';
import { SubAgentHotelDetailsAdapter } from 'src/app/components/sub-agent/adapters/hotel/hotel-details-adapter';
import { ApiServiceSubAgent } from 'src/app/components/sub-agent/services/api-service-sub-agent';
import { SubAgentCurrencyLangHelper } from 'src/app/components/sub-agent/helpers/currency-lang-helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss']
})
export class HotelDetailsComponent implements OnInit {

  hotelListTimer: number = environment.nextApiCallingTime;
  hotelListCounter: number = environment.listApiCallingCount;
  isTimeOutActive:any;
  searchDataParams:any;
  routerParam:any;
  hotelDetailSubscription: Subscription;
  taskId:any="";
  private destroy$ = new Subject();
  selectedHotel:any;
  selectedRoomGroups: any[] = [];
  makkaSelectActivate: boolean = true;
  isGrouped: boolean;
  roomLength:any;
  shimmer:boolean= true;
  roomShimmer:boolean = false;
  hotelPics: any[];
  travellers: any;
  ImageGallery: any;
  showRoomDetails: boolean = false;
  roomDetails: any;
  totalRoomPrice: number = 0;
  selectedRoomCount: number = 0;
  rooms: any[];
  hotlName: any[] = [];
  diasbleMakkaSave: boolean = true;
  private hotelAdapter: SubAgentHotelDetailsAdapter = new SubAgentHotelDetailsAdapter(this.datepipe,this.dateForm)
  numberOfDays:number;
  activeBttn: boolean = false;
  childCount: number;
  adultCount: number;
  selectLangCode:any;
  selectCurrency:any;
  private hotelDetailsHelper : SubAgentHotelDetailsHelper = new SubAgentHotelDetailsHelper();
  private DateTimeHelper : SubAgentDateTimeHelper = new SubAgentDateTimeHelper(this.datepipe);
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);

  constructor(private route:Router,private activeRoute:ActivatedRoute,private service:ApiServiceSubAgent,
    private dateForm:DateTimeToDateFormat,private datepipe:DatePipe,
    private userStateService: UserStateService,private translate: TranslateService) { }

  ngOnInit() {
    this.initialValues();
  }

  ngAfterViewInit() {
    this.getQueryParamsDatas();
  }

  initialValues(){
    this.userStateService.globelCurrency.subscribe(t => this.selectCurrency = t);
    this.userStateService.globalLanguage.subscribe(t => this.selectLangCode = t);
  }

  getQueryParamsDatas(){
    this.searchDataParams = this.activeRoute.snapshot.queryParams;
    this.routerParam = this.activeRoute.snapshot.params;
    this.currencyLangHelper.changeLanguage(this.routerParam.lang);
    this.currencyLangHelper.setCurrency(this.routerParam.currency);
    let x = this.hotelDetailsHelper.getRoomDetailsFromOccupancyParams(this.searchDataParams.occupancy);
    this.roomLength = x.roomCount;
    this.travellers = x.adultCount + x.childCount;
    this.childCount = x.childCount;
    this.adultCount = x.adultCount;
    this.rooms = x.roomObject;
    this.posthotelDetails()
  }
  
  posthotelDetails(){
    console.log("fsf",this.searchDataParams)
    let body = {
      hotel_name: this.searchDataParams.name,
      lang: this.selectLangCode,
      search: this.searchDataParams.search,
      special_code: this.searchDataParams.special_code,
      subpcc_code: this.searchDataParams.subpcc_code,
      umrah_hotel_code: this.searchDataParams.umrah_hotel_code,
      providers:[{
        amount: this.searchDataParams.amoud,
        currencyCode: this.selectCurrency,
        hotel_code: this.searchDataParams.provider_htl_code,
        provider: this.searchDataParams.provider,
        vendor: this.searchDataParams.vendor
      }]
    }

    this.hotelDetailSubscription = this.service.postSelectedHotelInfoV3(body,this.selectLangCode,this.searchDataParams.ulogId).pipe(takeUntil(this.destroy$)).subscribe(
      (data)=>{
        this.getHotelDetails(data.task_id,data.cache_key);
      }
    )
    
  }

  getHotelDetails(taskid,cache_key){
    this.hotelDetailSubscription = this.service.getSelectedHotelInfoV3(this.searchDataParams.ulogId,taskid,cache_key).pipe(takeUntil(this.destroy$)).subscribe(data=>{
        if(data.code == "0" ){
          this.setDatas(data.data)
        }else if(data.code == "00111" || data.code == "00123"){
          this.isTimeOutActive = setTimeout(() => {
            this.getHotelDetails(taskid,cache_key)
          }, this.hotelListTimer);
        }
    })
  }

  setDatas(data){
    this.shimmer = false;
    this.roomShimmer = false;
    this.selectedHotel = data;
    this.numberOfDays = this.DateTimeHelper.noOfDaysBetweenTwoDates(this.selectedHotel.check_in_time,this.selectedHotel.check_out_time);
    const x = this.hotelDetailsHelper.setDataForHotelDeatils(data,this.searchDataParams.city);
    this.selectedRoomGroups = x.rooomGroup;
    this.ImageGallery = x.imagesArray;
    this.isGrouped = x.isGrouped;
    this.hotelPics = x.hotelPics;
  }

  applySubPcc(event){
    this.selectedRoomCount = 0;
    this.totalRoomPrice = 0;
    this.route.navigate(
      ["subagent/hotel-details/"+this.selectLangCode+"/"+this.selectCurrency],
      { queryParams: { 
        name:this.searchDataParams.name,
        search:this.searchDataParams.search,
        umrah_hotel_code:this.searchDataParams.umrah_hotel_code,
        city:this.searchDataParams.city,
        provider:this.searchDataParams.provider,
        vendor:this.searchDataParams.vendor,
        amoud:this.searchDataParams.amoud,
        provider_htl_code:this.searchDataParams.provider_htl_code,
        special_code:event.specialCode,
        occupancy:this.searchDataParams.occupancy,
        subpcc_code:event.promoCode,
        ulogId:this.searchDataParams.ulogId
      } }
    )

    let value = { 
      name:this.searchDataParams.name,
      search:this.searchDataParams.search,
      umrah_hotel_code:this.searchDataParams.umrah_hotel_code,
      city:this.searchDataParams.city,
      provider:this.searchDataParams.provider,
      vendor:this.searchDataParams.vendor,
      amoud:this.searchDataParams.amoud,
      provider_htl_code:this.searchDataParams.provider_htl_code,
      special_code:event.specialCode,
      occupancy:this.searchDataParams.occupancy,
      subpcc_code:event.promoCode,
      ulogId:this.searchDataParams.ulogId
    }
    this.searchDataParams = value;
    this.roomShimmer = true;
    this.posthotelDetails()
  }

  showRoomDetailsPopUp(room) {
    this.showRoomDetails = true;
    this.roomDetails = room;
  }

  closeRoomDetailsPopUp(){
    this.showRoomDetails = false;
  }

  onTotalRoomPriceChanged(price) {
    this.getRoomCount();
    this.totalRoomPrice = price;
  }

  getRoomCount() {
    if (this.isGrouped) {
      this.selectedRoomCount = 0
      this.selectedRoomGroups.forEach(x => x.rooms.forEach(y => { if (y.isRoomSelectionChecked) { this.selectedRoomCount = this.selectedRoomCount + y.insertedQuantity } }))
      this.selectedRoomCount == this.rooms.length ? this.makkaSelectActivate = false : this.makkaSelectActivate = true;
    } else {
      this.selectedRoomCount = 0
      let v = this.selectedRoomGroups.concat.apply([], this.selectedRoomGroups)
      v.forEach(x => x.rooms.forEach(y => { if (y.isRoomSelectionChecked) { this.selectedRoomCount = this.selectedRoomCount + y.insertedQuantity } }))
      this.selectedRoomCount == this.rooms.length ? this.makkaSelectActivate = false : this.makkaSelectActivate = true;
    }
  }

  onHotelNameClear(){
    this.hotlName = [];
  }

  onHotelNameAdded(val){
    this.hotlName.push(val);
  }

  onMakkaSelectActivate(){
    this.makkaSelectActivate  =true;
  }

  onDisableMakkaSave(){
    this.diasbleMakkaSave = true;
  }

  onSelectedRoomCountChange(val){
    this.selectedRoomCount = val;
  }

  onMakkaSelectDeactivate(){
    this.makkaSelectActivate  =false;
  }

  bookHotel() {
    this.activeBttn = true;
    let x=this.hotelAdapter.bookHotelRequest(this.isGrouped,this.selectedRoomGroups,this.selectedHotel,this.searchDataParams.city,this.numberOfDays,this.adultCount,this.childCount,this.searchDataParams.search);
    this.service.createCustomTrip(x,this.selectLangCode,this.searchDataParams.ulogId).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.route.navigate(
        ['/subagent/booking/'+this.selectLangCode+'/'+this.selectCurrency],
        { queryParams: { 
          type:'hotel',
          tripId:data.id,
          ulogId:this.searchDataParams.ulogId
        } }
      )
    })
  }

  ngOnDestroy(){
    clearTimeout(this.isTimeOutActive);
    this.destroy$.next();
    this.destroy$.complete(); 
  }


}
