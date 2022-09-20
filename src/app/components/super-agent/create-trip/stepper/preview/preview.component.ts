import { Component, OnDestroy, OnInit } from '@angular/core';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { CommonApiService } from 'src/app/Services/common-api-services';
import { AppStore } from 'src/app/stores/app.store';
import { StepperComponent } from '../stepper.component';
import { NotificationService } from 'src/app/common/services/notification.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HelperService } from 'src/app/common/services/helper-service';
import { DatePipe } from '@angular/common';
import { SuperAgentHelperService } from 'src/app/helpers/super-agent/super-agent-helper';
import { LandingApiService } from 'src/app/components/landing/service/landing-api-services';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})

export class PreviewComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  homePage:boolean = false;
  commonApiService:CommonApiService;
  onwardFlight: any;
  returnFlight: any;
  visa: any;
  transport: any;
  otherService: any;
  response: any;
  itinerary: any[];
  companyList: any[];
  routeList: any;
  campanyCode: number;
  routeCode: number;
  companyName: any;
  routeName: any;
  makkahHotel: any;
  madeenaHotel: any;
  readonly = true;
  appStore:AppStore;
  notification:NotificationService;
  shimmer:boolean = true;
  bttnactive:boolean = false;
  currency: string;
  hotelDetails: any;
  flightDetails: any;
  masterDatas: any;
  published:boolean = false;
  dateRange:any;
  dateRangeArray:any[]=[];
  minDate = new Date();
  editOkButton: boolean = false;
  searchDate: any;
  today = new Date()
  masterPackageDetails: any;
  changeDateDiv: any;

  constructor(private SuperAgentService:SuperAgentApiService,private helper:HelperService,private _commonService:CommonApiService,private _appStore:AppStore, private stepper :StepperComponent
    ,private router: Router,public datepipe:DatePipe,public superHelper:SuperAgentHelperService,private common: LandingApiService) {
    this.commonApiService = this._commonService;
    this.appStore = _appStore;
  }

  ngOnInit() {
    this.currency = sessionStorage.getItem('currency');
    window.scroll(0,0);
    this.checkPackagePublish();
  }

  checkPackagePublish(){
    if(sessionStorage.getItem('published') && sessionStorage.getItem('published') == 'true'){
      this.published = true;
      this.dateRangeArray = JSON.parse(sessionStorage.getItem('dateRangeArray'))
    }else{
      this.packageDetails();
    }
  }

  packageDetails(){
    this.SuperAgentService.getPackageDetails(sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.response = data;
      this.getSearchDate(data);
      this.shimmer = false;
      this.flightDetails = this.response.flight_details;
      this.hotelDetails = this.response.hotel_details;
      this.visa = this.response.visa_details;
      this.transport = this.response.transport_details;
      this.itinerary = this.response.master_package.package_itineraries;
      this.masterDatas = this.response.master_package;
    })
  }

  getSearchDate(data){
    if(sessionStorage.getItem('searchData') && sessionStorage.getItem('searchData') != null && sessionStorage.getItem('searchData') != undefined){
      this.searchDate = JSON.parse(sessionStorage.getItem('searchData')).travellersData.startDate;
      this.userDataCreate(data);
    }else{
      if(data.flight_details && data.flight_details.length > 0 && data.flight_details[0].flights && data.flight_details[0].flights.length > 0 && 
        data.flight_details[0].flights[0].onward_flight_departure_date && data.flight_details[0].flights[0].onward_flight_departure_date != null && 
        data.flight_details[0].flights[0].onward_flight_departure_date != undefined){
          this.searchDate = data.flight_details[0].flights[0].onward_flight_departure_date;
          this.userDataCreate(data);
      }else if(data.transport_details && data.transport_details.length > 0 && data.transport_details[0].transportations && data.transport_details[0].transportations.length > 0 && 
        data.transport_details[0].transportations[0].start_date && data.transport_details[0].transportations[0].start_date != null && 
        data.transport_details[0].transportations[0].start_date != undefined){
          this.searchDate = data.transport_details[0].transportations[0].start_date;
          this.userDataCreate(data);
      }else if(data.makkah_hotel_detail && data.makkah_hotel_detail.length > 0 && data.makkah_hotel_detail[0].hotels && data.makkah_hotel_detail[0].hotels.length > 0 && 
        data.makkah_hotel_detail[0].hotels[0].check_in && data.makkah_hotel_detail[0].hotels[0].check_in != null && 
        data.makkah_hotel_detail[0].hotels[0].check_in != undefined){
          this.searchDate = data.makkah_hotel_detail[0].hotels[0].check_in;
          this.userDataCreate(data);
      }else if(data.madinah_hotel_detail && data.madinah_hotel_detail.length > 0 && data.madinah_hotel_detail[0].hotels && data.madinah_hotel_detail[0].hotels.length > 0 && 
        data.madinah_hotel_detail[0].hotels[0].check_in && data.madinah_hotel_detail[0].hotels[0].check_in != null && 
        data.madinah_hotel_detail[0].hotels[0].check_in != undefined){
          this.searchDate = data.madinah_hotel_detail[0].hotels[0].check_in;
          this.userDataCreate(data);
      }else{
        this.searchDate = this.superHelper.incrementDate(this.today,7);
        this.userDataCreate(data);
      }
    }
  }

  dateChangeAndSessionChange(data){
    this.changeDateDiv = false;
  }

  userDataCreate(data){
    this.SuperAgentService.getMasterPackageById(sessionStorage.getItem('masterPackageId')).pipe(takeUntil(this.destroy$)).subscribe((res:any) =>{
      this.masterPackageDetails = res;
      if(sessionStorage.getItem('packageEdit') && sessionStorage.getItem('packageEdit') != null && sessionStorage.getItem('packageEdit') == 'true'){
        this.editOkButton = true;
        this.setSearchData(data,res)
      }
    })
    
  }

  setCurrency(currency){
    sessionStorage.setItem('currency',currency);
    this.common.getCurrencies().pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
      data.rates.forEach(element => {
        if(element.currency == currency){
          sessionStorage.setItem('currencySelect',JSON.stringify(element));
        }
      });
    })
  }

  currencyConversion(amount){
    return this.helper.priceConversion(amount);
  }

  setSearchData(pkgs,mstr){
    var travellersDatas = {};
    var flightDatas = {}
    var mekkahDatas = {}
    var medinaDatas = {}
    var transports = {}
    this.setCurrency(mstr.currency)
    if(mstr.services.hotel){
      if(pkgs.makkah_hotel_detail == null){
        var dates = this.superHelper.setCreatePackageList(mstr.no_of_days,(mstr.no_of_days - pkgs.madinah_hotel_detail.num_of_days),pkgs.madinah_hotel_detail.num_of_days,this.searchDate);
        mekkahDatas = {
          checkIn:this.dateFormaterYMd(dates.mk_start),
          checkOut:this.dateFormaterYMd(dates.mk_end),
          makkahDays:mstr.no_of_days - (pkgs.madinah_hotel_detail.num_of_days+1),
        }
        medinaDatas = {
          checkIn:this.dateFormaterYMd(dates.md_start),
          checkOut:this.dateFormaterYMd(dates.md_end),
          madeena:pkgs.madinah_hotel_detail.num_of_days + 1,
        }
      }else if(pkgs.madinah_hotel_detail == null){
        var dates = this.superHelper.setCreatePackageList(mstr.no_of_days,pkgs.makkah_hotel_detail.num_of_days,(mstr.no_of_days - pkgs.makkah_hotel_detail.num_of_days),this.searchDate);
        mekkahDatas = {
          checkIn:this.dateFormaterYMd(dates.mk_start),
          checkOut:this.dateFormaterYMd(dates.mk_end),
          makkahDays:pkgs.makkah_hotel_detail.num_of_days + 1,
        }
        medinaDatas = {
          checkIn:this.dateFormaterYMd(dates.md_start),
          checkOut:this.dateFormaterYMd(dates.md_end),
          madeena:mstr.no_of_days - (pkgs.makkah_hotel_detail.num_of_days + 1),
        }
      }else{
        var dates = this.superHelper.setCreatePackageList(mstr.no_of_days,pkgs.makkah_hotel_detail.num_of_days,pkgs.madinah_hotel_detail.num_of_days,this.searchDate);
        mekkahDatas = {
          checkIn:this.dateFormaterYMd(dates.mk_start),
          checkOut:this.dateFormaterYMd(dates.mk_end),
          makkahDays:pkgs.makkah_hotel_detail.num_of_days + 1,
        }
        medinaDatas = {
          checkIn:this.dateFormaterYMd(dates.md_start),
          checkOut:this.dateFormaterYMd(dates.md_end),
          madeena:pkgs.madinah_hotel_detail.num_of_days + 1,
        }
      }
      
    }else{
      var dates = this.superHelper.setCreatePackageList(mstr.no_of_days,(Math.round(mstr.no_of_days/2)),(Math.floor(mstr.no_of_days/2)),this.searchDate);
      mekkahDatas = {
        checkIn:this.dateFormaterYMd(dates.mk_start),
        checkOut:this.dateFormaterYMd(dates.mk_end),
        makkahDays:Math.round(mstr.no_of_days),
      }
      medinaDatas = {
        checkIn:this.dateFormaterYMd(dates.md_start),
        checkOut:this.dateFormaterYMd(dates.md_end),
        madeena:Math.floor(mstr.no_of_days/2),
      }
    }
    if(mstr.services.flight){
      flightDatas = {
        source:pkgs.flight_details[0].onward_flight_departure_airport,
        sourceName:pkgs.flight_details[0].onward_dep_airport_name.split('|')[1],
        destination:pkgs.flight_details[0].onward_flight_arrival_airport,
        destinationName:pkgs.flight_details[0].onward_arr_airport_name.split('|')[1],
        departureDate:this.dateFormaterYMd(dates.flight_start),
        returnDate:this.dateFormaterYMd(dates.flight_end),
        airline:pkgs.flight_details[0].onward_mac,
        airlineName:pkgs.flight_details[0].onward_flight_airline.split('|')[0],
      };
      transports = {
        depDate:pkgs.flight_details[0].flights[0].onward_flight_arrival_date,
        returnDate:this.dateFormaterYMd(dates.end_date),
      }
    }else{
      flightDatas = {
        source:'DXB',
        sourceName:'Dubai',
        destination:'JED',
        destinationName:'Jeddah',
        departureDate:this.dateFormaterYMd(dates.flight_start),
        returnDate:this.dateFormaterYMd(dates.flight_end),
        airline:'EK',
        airlineName:'Emirates',
      };
      transports = {
        depDate:this.dateFormaterYMd(dates.start_date),
        returnDate:this.dateFormaterYMd(dates.end_date),
      }
    }
    var searchDate = {
      travellersData : {
        adult: pkgs.max_passengers,
        startDate:this.dateFormaterYMd(dates.start_date),
        endDate:this.dateFormaterYMd(dates.end_date),
        packageDays: mstr.no_of_days,
      },
      flightData:flightDatas,
      mekkahData:mekkahDatas,
      medinaData:medinaDatas,
      transport:transports
    }
    sessionStorage.setItem('searchData',JSON.stringify(searchDate))
  } 

  dateFormaterYMd(date: any) {
    let latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
    return latest_date;
}

  expandItenary(event){
    var panel = event.target.previousElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  modifyButton(selector){
    this.stepper.stepContent(selector,'');
    sessionStorage.setItem('selector',selector);
    sessionStorage.setItem('modify','true')
  }

  modifyHotelBttn(selector,hotel){
    sessionStorage.setItem('modify','true');
    this.stepper.stepContent('hotel',hotel)
    sessionStorage.setItem('selector',selector)
  }

  publishTrip(){
    if(sessionStorage.getItem('masterPackageId') && sessionStorage.getItem('masterPackageId') != null){
      this.bttnactive =true;
      var body ={
      "status":"ACTIVE",
      }
      this.SuperAgentService.updateMasterPackage(body,parseInt(sessionStorage.getItem('masterPackageId'))).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
        this.bttnactive =false;
        Swal.fire({
          icon: 'success',
          text: 'Package created successfully',
          confirmButtonText: 'Ok'
        }).then((result) => {
          this.published = true;
          sessionStorage.setItem('published','true')
        })
      });
    }
  }

  availabilityPopUp(){
    this.published = true;
    sessionStorage.setItem('published','true')
  }

  back(){
    this.stepper.stepContent('itinerary','')
    sessionStorage.setItem('selector','itinerary')
  }

  toggleDetails(event,type){
    var panel = event.target;
    if (panel.style.transform) {
      panel.style.transform = null;
      (document.getElementById('toggleDiv'+type)).style.maxHeight = null;
    } else {
      panel.style.transform = 'rotate(-90deg)';
      (document.getElementById('toggleDiv'+type)).style.maxHeight = '0px'
    }
  }

  addRange(){
    var date = {
      start_date: this.dateFormater(this.dateRange[0]),
      end_date: this.dateFormater(this.dateRange[1])
    }
    this.dateRangeArray.push(date);
    sessionStorage.setItem('dateRangeArray',JSON.stringify(this.dateRangeArray))
  }

  dateFormater(date: any) {
    let latest_date = this.datepipe.transform(date, "dd-MM-yyyy");
    return latest_date;
  }

  removeRange(i){
    this.dateRangeArray.splice(i,1);
    sessionStorage.setItem('dateRangeArray',JSON.stringify(this.dateRangeArray))
  }

  availabilityAdd(){
    this.bttnactive = true;
    var body={
      date_ranges:this.dateRangeArray
    }
    this.SuperAgentService.availabilityAdd(body,sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
      this.bttnactive = false;
      Swal.fire({
        icon: 'success',
        text: 'Package Availability Adding successfully',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if(this.editOkButton){
          this.gotTopackages()
        }else{
          this.router.navigate(['superagent/createTrip']);
        }
        sessionStorage.removeItem('selector');
        sessionStorage.removeItem('published');
        sessionStorage.removeItem('dateRangeArray')
      })
    })
  }

  gotTopackages(){
    this.router.navigate(['superagent/view_package']);
  }

  packageView(){
    window.open('https://b2b.umrahtrip.com/superagent/package/'+sessionStorage.getItem('packageId')+'/view',"_blank")
  }

  changeSearchDate(){
    this.changeDateDiv = !this.changeDateDiv;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }
 
}