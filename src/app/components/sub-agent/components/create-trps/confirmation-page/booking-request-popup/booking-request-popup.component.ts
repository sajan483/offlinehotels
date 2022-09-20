import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import { takeUntil } from "rxjs/operators";
import { Subject, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/common/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-booking-request-popup',
  templateUrl: './booking-request-popup.component.html',
  styleUrls: ['./booking-request-popup.component.scss']
})
export class BookingRequestPopupComponent implements OnInit {

  private destroy$ = new Subject();
  @Output() closeBookingPopUp = new EventEmitter();
  @Input() agencyNumberList:any;
  @Input() nationalityList:any[]=[];
  mobileNumber:any = '';
  shareLinkBtnActiv: boolean;
  countryCodeReq: any = '966';
  phoneInputObj: any;
  @Input() tripData:any;
  isLinkReady:boolean = false;
  @Input() service:any;
  @Input() ulogId:any;
  @Input() formValue:any;
  @Input() tripId:any;
  @Input() travellersCount:any;
  @Input() startDate:any;


  constructor(private apiService:SubAgentApiService,private notifyService: NotificationService,private translate: TranslateService) { }

  ngOnInit() {
  }

  close(){
    this.closeBookingPopUp.emit();
  }

  inputValidationDeep(event?) {
    if (event) {
      if (event.target.value.length > 0) {
        this.shareLinkBtnActiv = true;
      }else{
        this.shareLinkBtnActiv = false;
      }
    }
  }

  telInputObject(obj) {
    this.phoneInputObj = obj;
  }

  onCountryChangeDeep(event) {
    this.countryCodeReq = event.dialCode
  }

  addAgencyNumberForBookingRequest(data){
    for(let i=0;i<this.nationalityList.length;i++){
      if(this.nationalityList[i].item_code == data.phn_country_code){
        this.phoneInputObj.setCountry(this.nationalityList[i].item_id);
        break;
      }
    }
    this.countryCodeReq = data.phn_country_code;
  }

  callLinkCreator(){
    this.isLinkReady = true;
    let serviceObj = {
      "service":"",
      "name":"",
      "price":"",
      "start_date":"",
      "occupancy":"",
      "type":"",
    }
    let step = 1;
    if(this.service == 'hotel'){
      serviceObj.service = this.tripData.location+" hotel";
      serviceObj.name = this.tripData.hotel.name;
      serviceObj.price = this.tripData.prices_summary.total_price;
      serviceObj.start_date = this.tripData.check_in_time;
      serviceObj.occupancy = this.tripData.rooms.length + ' Room(s)';
      serviceObj.type = this.tripData.hotel.city;
      if(this.tripData.location == 'makkah'){
        step = 1;
      }
      if(this.tripData.location == 'medinah'){
        step = 2;
      }
    }
    if(this.service == 'transport'){
      serviceObj.service = "transportation";
      serviceObj.name = this.tripData.company.name;
      serviceObj.price = this.tripData.prices_summary.total_price;
      serviceObj.start_date = this.tripData.start_date;
      serviceObj.occupancy = this.tripData.trip_vehicles[0].booked_quantity + 'Vehicle(s)';
      serviceObj.type = this.tripData.selected_transportation.vehicle_types[0].vehicle_type_name;
      step = 3;
    }

    let tagData = [];
    let valuetag = {
      services:[serviceObj],
      step:step,
      request_date: new Date().toJSON().split("T")[0],
      start_date:this.startDate,
      travellerForm:this.formValue,
      total_travelers:this.travellersCount
    }
    tagData.push(valuetag)

    let body = {
      "contry_code":this.countryCodeReq,
      "phone_number":this.mobileNumber,
      "custome_trip_id":this.tripId.toString(),
      "tag":tagData
    }

    this.apiService.generateShareLink(this.tripId,body,this.ulogId).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      if(data.code == "0"){
        this.isLinkReady = false;
        this.notifyService.showSuccess(this.translate.instant("Sent successfully"));
        this.close();
      }else{
        this.notifyService.showError(this.translate.instant(data.message[0]))
      }
    },(error)=>{
      this.isLinkReady = false;
      this.notifyService.showError(this.translate.instant("sorry"))
    })

  }

}
