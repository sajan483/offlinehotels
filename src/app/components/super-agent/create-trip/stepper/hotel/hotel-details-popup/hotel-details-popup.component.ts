import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { StepperAdapter } from 'src/app/adapters/super-agent/stepper-adapter';
import { HelperService } from 'src/app/common/services/helper-service';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { AppStore } from 'src/app/stores/app.store';
import { StepperComponent } from '../../stepper.component';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hotel-details-popup',
  templateUrl: './hotel-details-popup.component.html',
  styleUrls: ['./hotel-details-popup.component.scss']
})

export class HotelDetailsPopupComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  viewImagePopup:boolean=false;
  loader:boolean=true;
  private stepperAdapter: StepperAdapter = new StepperAdapter(null);
  showHotelDetails:string = 'true';
  @Output() showHotelDetailsEmitter = new EventEmitter();
  selectedHotel: any;
  selectedRoomGroups: any[];
  hotelPics: any[];
  hotelPics1: any[];
  hotelPics2: any[];
  moreimages: boolean;
  imageshow: number;
  popupData
  selectedRoomInfo: any;
  selectedRoomDetails: boolean = false;
  roomVariation: any[] = [];
  medinahRoomVariation: any;
  hotelRoomCount: number = 0;
  totalTravellers:number;
  selectedRoomCount:number = 1;
  noOfDays : number;
  noOfImages:number = 1;
  adultPrice: number;
  childPrice: number;
  currency: string;
  bttnactive: boolean;
  roomdata: any;
  position: any;

  constructor(private stepper: StepperComponent,
    private superAgentApiService:SuperAgentApiService, private appStore : AppStore,
    private helperService : HelperService) { }

  ngOnInit() {
    window.scroll(0,0);
    this.currency = sessionStorage.getItem('currency')
    this.popupData = JSON.parse(sessionStorage.getItem('hotelDetailsData'))
    this.loader=false
    this.setPopUp()
  }

  currencyConversion(amount){
    return this.helperService.priceConversion(amount);
  }

  roomCount(i){
    let totalRoom = 0;
    if(i!=0){ 
      for(let j = (i-1); j>=0 ; j--){
        totalRoom += this.selectedRoomGroups[j].length;
      }
    }
    return totalRoom;
  }

  setPopUp(){
    if(typeof(this.popupData) != 'undefined'){
      this.selectedHotel = [];
      this.selectedRoomGroups = [];
      this.selectedHotel = this.popupData;
      this.totalTravellers = this.appStore.totalTravellers;
      this.noOfDays = this.helperService.noOfDaysBetweenTwoDates(this.selectedHotel.check_in_time,this.selectedHotel.check_out_time)
      this.selectedHotel.room_groups.forEach(element => {
        element.rooms.forEach(room => {
          this.selectedRoomGroups.push(room)
        });
      });
      
      let arr:any[] = [];
      this.selectedRoomGroups.forEach(function (element) {
        arr = [];
        arr.push(element.name);
        element.nameArray = arr;
      });

      this.selectedRoomGroups.forEach((element,i)=>{
        element.isChecked = false;
        if(element.pax_info[i] && element.pax_info[i].type && element.pax_info[i].type == 'ADT'){
          element.adult_number = element.pax_info[i].quantity
        }
        if(element.pax_info[i] && element.pax_info[i].type && element.pax_info[i].type == 'CHD'){
          element.child_number = element.pax_info[i].quantity
        }
      })

      this.hotelPics = [];
      this.hotelPics1 = [];
      this.hotelPics2 = [];
      this.moreimages = false;
      this.imageshow = 0;

      for(let i=0;i<this.selectedHotel.meta_data.images.length;++i){
        this.hotelPics.push(this.selectedHotel.meta_data.images[i].image_url)
        if (i<=5) {
          this.hotelPics1.push(this.selectedHotel.meta_data.images[i].image_url)
        } 
        if(i>=6 && i<=11) {
          this.hotelPics2.push(this.selectedHotel.meta_data.images[i].image_url)
          this.moreimages = true;
        }
      }
    }
  }

  saveSelectedHotel(city){
    var days = this.helperService.noOfDaysBetweenTwoDates(this.selectedHotel.check_in_time,this.selectedHotel.check_out_time)
    var body = this.stepperAdapter.saveHotelRequest(this.selectedHotel,this.roomdata,city,days)
    this.setRoomVariation(this.roomdata,this.position)
    this.bttnactive = true;
    this.superAgentApiService.updatePackageAPI(body,sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.callAvailability(city,res)
    });
  }


  callAvailability(city,res){
    if(city == 'MAKKA'){
      var availability = {
        package:res.id,
        package_details:res.makkah_hotel_detail.id,
        adult_price:this.adultPrice,
        child_price:this.childPrice,
        check_in_timestamp:Math.floor(new Date(this.selectedHotel.check_in_time).getTime()/1000),
        check_out_timestamp:Math.floor(new Date(this.selectedHotel.check_out_time).getTime()/1000),
      }
    }
    if(city == 'MADEENA'){
      var availability = {
        package:res.id,
        package_details:res.madinah_hotel_detail.id,
        adult_price:this.adultPrice,
        child_price:this.childPrice,
        check_in_timestamp:Math.floor(new Date(this.selectedHotel.check_in_time).getTime()/1000),
        check_out_timestamp:Math.floor(new Date(this.selectedHotel.check_out_time).getTime()/1000),
      }
    }
    this.superAgentApiService.hotel_availability_add(availability).pipe(takeUntil(this.destroy$)).subscribe(data =>{
      this.navigateData(city)
    })
  }

  navigateData(city){
    this.bttnactive = false;
    sessionStorage.removeItem('hotelDetails');
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){
      sessionStorage.setItem('selector','preview');
      this.stepper.stepContent('preview','');
      sessionStorage.removeItem('modify');
    }else{
      if(city == 'MAKKA'){
        this.stepper.stepContent('hotel','MADEENA');
        sessionStorage.setItem('selector','hotelMadeena')
        sessionStorage.setItem('hotelDetails','close')
      }
      if(city == 'MADEENA'){
        this.stepper.stepContent('transport',null);
        sessionStorage.setItem('selector','transport')
        sessionStorage.setItem('hotelDetails','close')
      }
    }
  }

  showRoomDetailsPopUp(room){
    this.selectedRoomInfo = room;
    this.selectedRoomDetails = !this.selectedRoomDetails;
  }

  selectHotelRoom(e, room, i){
    document.getElementById("hotelSelectionSection").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    this.selectedRoomGroups.forEach((el,j)=>{(j == i)?el.isChecked = true:el.isChecked = false});
    this.roomdata = room;
    this.adultPrice = +this.currencyConversion(this.roomdata.amount);
    this.childPrice = +this.currencyConversion(this.roomdata.amount);
    this.position = i;
    this.hotelRoomCount = 1;
  }

  setRoomVariation(room,i){
    this.roomVariation = [];
    let q =  {
      "currency": this.currency,
      "available_rooms": room.available_count,
      "total_rooms": room.max_rooms,
      "title": room.name,
      "adult_price": this.adultPrice,
      "child_price": this.childPrice,
      "per_room_price": room.amount,
      "custom_pax_info": room.pax_info_str,
      "description": room.description,
      "room_id": room.room_id,
      "room_name":room.name,
      "room_type_code":room.room_type_code,
      "room_group_obj": room.room_group_obj
    }
      this.roomVariation.push(q)
    }

  hideHotelDetailsPopup(){
    this.showHotelDetails = 'false';  
    this.showHotelDetailsEmitter.emit(this.showHotelDetails);
    sessionStorage.setItem('hotelDetails','close')
  }

  disableHotelSaveBtn(){
    if(this.hotelRoomCount > 0 && this.adultPrice > 0 && this.childPrice > 0){return true;}
    return false;
  }

    openImgPopup(){
      this.viewImagePopup=true
    }

    getImgPopupFlag(event){
      if(event == 'hide')
      this.viewImagePopup=false
    }

    getDetailsPopupFlag(event){
      if(event == 'hide')
      this.selectedRoomDetails=false
    }

    ngOnDestroy(){
      this.destroy$.next();
      this.destroy$.complete(); 
     }

  }