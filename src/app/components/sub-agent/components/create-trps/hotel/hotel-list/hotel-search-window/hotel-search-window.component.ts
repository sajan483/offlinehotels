import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubAgentDateTimeHelper } from 'src/app/components/sub-agent/helpers/date-time-helpers';


@Component({
  selector: 'app-hotel-search-window',
  templateUrl: './hotel-search-window.component.html',
  styleUrls: ['./hotel-search-window.component.scss']
})
export class HotelSearchWindowComponent implements OnInit {

  selectDestination:any = 'MAKKA';
  toDay = new Date();
  checkinMin:any;
  checkoutMin:any;
  checkInDate:any = '';
  CheckoutDate:any = '';
  @ViewChild('checkoutDatePicker', { read: ElementRef, static: false })
  checkoutDatePicker: ElementRef;
  submitted:boolean = false;
  roomAllocationData:any;
  @Output() setSearchBody = new EventEmitter();
  setOccupancy:string = "#1_4_0";
  lang:any;
  ulogId:string;
  private DateTimeHelper : SubAgentDateTimeHelper = new SubAgentDateTimeHelper(this.datepipe);
  noOfNights:number = 0;
  @Input() bttnActive:boolean = false;
  isMinimizeSearch:boolean = false;
  @Input() isMobile: boolean = false;

  constructor(private router:Router,private activeRoute:ActivatedRoute,private datepipe:DatePipe) { }

  ngOnInit() {
    this.initialValues()
  }

  initialValues(){
    this.checkinMin = this.DateTimeHelper.incrementDate(this.toDay,-1);
    this.checkoutMin = this.toDay;
    this.checkInDate = this.toDay;
    this.CheckoutDate = this.DateTimeHelper.incrementDate(this.checkInDate,5);
    this.checkNumberOfDays();
    this.checkQueryParam()
  }

  checkNumberOfDays(){
    this.bttnActive = false;
    this.noOfNights = this.DateTimeHelper.noOfDaysBetweenTwoDates(this.checkInDate,this.CheckoutDate);
  }

  onSelectCity(){
    this.bttnActive = false;
  }

  clickToExpant(){
    window.scrollTo(0,0);
    this.isMinimizeSearch = false;
  }
  
  checkQueryParam(){
    this.activeRoute.queryParams.subscribe(params =>{
      if(params.city !== undefined){
        this.selectDestination = params.city;
      }
      if(params.occupancy !== undefined){
        this.setOccupancy = params.occupancy;
      }
      if(params.checkin !== undefined){
        this.checkInDate = new Date(params.checkin);
      }
      if(params.checkout !== undefined){
        this.CheckoutDate = new Date(params.checkout);
        this.checkoutMin = this.checkInDate;
      }
      if(params.ulogId !== undefined){
        this.ulogId = params.ulogId;
      }
    })
  }

  selctCheckinDate(event:any){
    this.checkoutMin = this.DateTimeHelper.incrementDate(event,1);
    this.CheckoutDate = '';
    this.checkoutDatePicker.nativeElement.click();
  }

  getRoomAllocation(event:any){
    this.roomAllocationData = event;
    this.searchHotels()
  }

  searchHotelViaBttn(){
    if(this.isMobile){
      this.isMinimizeSearch = true;
    }
    this.searchHotels()
  }

  searchHotels(){
    this.submitted = true;
    let body = {
      check_in_date: this.DateTimeHelper.dateFormaterMdy(this.checkInDate),
      check_out_date: this.DateTimeHelper.dateFormaterMdy(this.CheckoutDate),
      location: this.selectDestination,
      room_type: this.roomAllocationData.roomType,
      rooms : this.roomAllocationData.rooms
    }
    this.activeRoute.params.subscribe(params =>{
      this.router.navigate(
        ['/subagent/hotel-list/'+params.lang+'/'+params.currency],
        { queryParams: { 
          checkin: this.DateTimeHelper.dateFormaterYMd(this.checkInDate), 
          checkout: this.DateTimeHelper.dateFormaterYMd(this.CheckoutDate),
          city:this.selectDestination,
          occupancy:this.roomAllocationData.occupancy,
          ulogId:this.ulogId
        } }
      );
    })

    let value = {
      traveller:this.roomAllocationData.travallersCount,
      roomCount:this.roomAllocationData.roomCount,
      occupancy:this.roomAllocationData.occupancy,
      ulogId:this.ulogId,
      travellCount:this.roomAllocationData.adults+this.roomAllocationData.children,
      body:body
    }
    
    this.setSearchBody.emit(value);
  }

}
