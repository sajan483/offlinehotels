import { Component, Input, OnInit, ViewChild,Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material';
import { StepperAdapter } from 'src/app/adapters/super-agent/stepper-adapter';
import { NotificationService } from 'src/app/common/services/notification.service';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { AppStore } from 'src/app/stores/app.store';
import { StepperComponent } from '../stepper.component';
import { HotelsList } from "src/app/models/custome_trip";
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/common/services/helper-service';
import { SuperAgentHelperService } from 'src/app/helpers/super-agent/super-agent-helper';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})

export class HotelComponent implements OnInit {
  private destroy$ = new Subject();
  showHtlModifyBtn:boolean = true;
  hotelSearchForm:FormGroup;
  @Input() hotelCity : any;
  hotelsList: HotelsList = {response:[],city:undefined} ;
  formBuilder:FormBuilder;
  superAgentApiService : SuperAgentApiService;
  showHotelDetails;
  loader:boolean=true;
  detailsLoader:boolean=false;
  userFilter: any = { name: '' };

  @ViewChild('pickerEnd' , {read: undefined, static: false}) pickerEnd: MatDatepicker<Date>;
  private stepperAdapter: StepperAdapter = new StepperAdapter(null);
  selectedHotel: any;
  selectedRoomGroups: any[];
  makkaInDate: any;
  makkaHName: any;
  hotelPics: any[];
  hotelPics1: any[];
  hotelPics2: any[];
  moreimages: boolean;
  imageshow: number;
  popupData: any;
  currency: string;
  unSubscribe: any;
  searchDatas: any;

  constructor(private fb:FormBuilder,private _superAgentApiService:SuperAgentApiService,private helper:HelperService,private superHelper:SuperAgentHelperService,
    private notifyService:NotificationService,private appStore:AppStore, private stepper:StepperComponent,private router: Router) {
    this.formBuilder = fb;
    this.superAgentApiService = _superAgentApiService; 
   }

  ngOnInit() {
    window.scroll(0,0);
    this.searchDatas = JSON.parse(sessionStorage.getItem('searchData'))
    this.currency = sessionStorage.getItem('currency')
    if(sessionStorage.getItem('hotelDetails')=='open'){
      this.loader=false
      this.showHotelDetails = 'true'
      this.hotelSearch()
      this.setHotelSearchForm();
    } else {
      this.showHotelDetails = 'false'
      this.setHotelSearchForm();
      this.hotelSearch()
    }
  }

  currencyConversion(amount){
    return this.helper.priceConversion(amount);
  }

  hotelSearch() {
    this.getHotelList(this.searchDatas)
  }

  repeateSearch(){
    this.searchDatas.mekkahData.checkIn = this.superHelper.incrementDate(this.searchDatas.mekkahData.checkIn,1);
    this.searchDatas.mekkahData.checkOut = this.superHelper.incrementDate(this.searchDatas.mekkahData.checkOut,1)
    this.searchDatas.medinaData.checkIn = this.superHelper.incrementDate(this.searchDatas.medinaData.checkIn,1)
    this.searchDatas.medinaData.checkOut = this.superHelper.incrementDate(this.searchDatas.medinaData.checkOut,1);
    this.getHotelList(this.searchDatas)
  }

  getHotelList(data){
    this.unSubscribe = this.superAgentApiService.agencyHotelSearch(this.stepperAdapter.hotelSearchRequest(this.hotelCity, data, null),'en-US').pipe(takeUntil(this.destroy$)).subscribe((data:any) => {
      this.loader=false
      if(data.length > 0){
        this.hotelsList.response = data;
        this.hotelsList.city = this.hotelCity;
      }else{
        Swal.fire({
          icon: 'error',
          showCancelButton: true,
          text: 'Something Went Wrong',
          confirmButtonText: 'Search Again',
          cancelButtonText:'Skip'
        }).then((result) => {
          if(result.isConfirmed){
            this.repeateSearch();
          }else{
            this.skiphotel()
          }
          
        })
      }
    }, error => {
      Swal.fire({
        icon: 'error',
        showCancelButton: true,
        text: 'Something Went Wrong',
        confirmButtonText: 'Search Again',
        cancelButtonText:'Skip'
      }).then((result) => {
        if(result.isConfirmed){
          this.repeateSearch();
        }else{
          this.skiphotel()
        }
        
      })
    });
  }

  skiphotel(){
    this.unSubscribe.unsubscribe();
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){
      sessionStorage.setItem('selector','preview');
      this.stepper.stepContent('preview','');
      sessionStorage.removeItem('modify');
    }else{
      if(this.hotelCity == 'MAKKA'){
        this.stepper.stepContent('hotel','MADEENA')
        sessionStorage.setItem('selector','hotelMadeena') 
        this.hotelCity = 'MADEENA';
      }else{
        sessionStorage.setItem('selector','transport');
        this.stepper.stepContent('transport',null);
      }
    }
  }

  setHotelSearchForm(){
    this.hotelSearchForm = this.formBuilder.group({
      hotelCheckInDate :["",Validators.required],
      hotelCheckOutDate : ["",Validators.required]
    });
  }

  get form() { return this.hotelSearchForm.controls; }

  get modifyHotelSearchActive():boolean { return this.hotelSearchForm.invalid ? false : true;}

  modifyHotelSearch(city){
    if(!this.hotelSearchForm.invalid){
      this.showHtlModifyBtn = !this.showHtlModifyBtn;
      this.searchHotels(city)
    }
  }

  searchHotels(city){
    this.superAgentApiService.agencyHotelSearch(this.stepperAdapter.hotelSearchRequest(city,null,this.hotelSearchForm),this.appStore.langCode)
    .pipe(takeUntil(this.destroy$))
    .subscribe((response:any) =>{
      if(response.length > 0){
        this.hotelsList.response = response;
        this.hotelsList.city = city;
      }else{
        Swal.fire({
          icon: 'error',
          text: 'Something Went Wrong',
          showCancelButton: true,
          confirmButtonText: 'Search Again',
          cancelButtonText:'Skip'
        }).then((result) => {
          if (result.isConfirmed){
            this.router.navigate(['superagent/createTrip']);
            sessionStorage.removeItem('selector')
          }else{
            this.skiphotel()
          }
        })
      }
    });
  }
  
  
  setHotelCheckOutDateRange(){
    this.pickerEnd.open();
  }

  showHotelDetailsPopUp(item,city){
    this.detailsLoader = true
    window.scrollTo(0,0);
    this.fetchSelectedHotelInfo(item,city)
  }

  hideHotelDetailsPopup(){
    this.detailsLoader = false;
    this.unSubscribe.unsubscribe();
  }

  fetchSelectedHotelInfo(item,city) {
    this.unSubscribe = this.superAgentApiService.getPackageHotelInfo(this.stepperAdapter.selectedHotelRequest(item,city),'SAR','en-US').pipe(takeUntil(this.destroy$)).subscribe((data:any) => {
        if(data.status == "failure"){
          this.showHotelDetails = 'false';
          this.detailsLoader = false;
          this.notifyService.showError("something wrong please select another hotel")
        }else{
          this.popupData = data;
          this.popupData.city = city
          sessionStorage.setItem('hotelDetailsData',JSON.stringify(this.popupData))
          sessionStorage.setItem('hotelDetails','open')
          this.detailsLoader = false
          this.showHotelDetails = 'true';
        }
      },(error)=>{
        this.showHotelDetails = 'false';
      }
    );
  }
    
  dateFormater(makkahCheckInDate: any) {
    throw new Error('Method not implemented.');
  }
  makkahCheckInDate(makkahCheckInDate: any) {
    throw new Error('Method not implemented.');
  }
  makkahCheckOutDate(makkahCheckOutDate: any) {
    throw new Error('Method not implemented.');
  }

  getPopupFlag(event){
    this.showHotelDetails = event;
  }

  back(){
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){

    }else{
      if(this.hotelsList.city == 'MAKKA'){
        this.stepper.stepContent('flight','')
        sessionStorage.setItem('selector','flight')
      }
      else{
        this.stepper.stepContent('hotel','MAKKA')
        sessionStorage.setItem('selector','hotelMakkah')   
      }
    }
    
  }

  readMore( event,i ){
    (<HTMLElement>document.getElementById("readLessBttn"+i)).style.display = "inline-block";
    (<HTMLElement>document.getElementById("readMoreBttn"+i)).style.display = "none";
    event.target.previousElementSibling.style.maxHeight = event.target.previousElementSibling.scrollHeight + "px";
  }

  readLess(event,i){
    (<HTMLElement>document.getElementById("readLessBttn"+i)).style.display = "none";
    (<HTMLElement>document.getElementById("readMoreBttn"+i)).style.display = "inline-block";
    event.target.previousElementSibling.previousElementSibling.style.maxHeight = null;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }

}