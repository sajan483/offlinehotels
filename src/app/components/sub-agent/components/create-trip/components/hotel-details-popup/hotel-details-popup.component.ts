import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, } from "@angular/core";
import { CreateTripAdapter } from "src/app/adapters/sub-agent/create-trip-adapter";
import { HelperService } from "src/app/common/services/helper-service";
import { CreateTripHelper } from "src/app/helpers/sub-agent/create-trip-helpers";
import { SelectedHotel } from "src/app/models/selected_hotel";
import { NotificationService } from "src/app/common/services/notification.service";
import { AppStore } from "src/app/stores/app.store";
import { SubAgentApiService } from "src/app/Services/sub-agent-api-services";
import { TranslateService } from "@ngx-translate/core";
import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { environment } from "src/environments/environment";
import { SegmentService } from "ngx-segment-analytics";
import { DomSanitizer } from "@angular/platform-browser";
import { MakkaHotelComponent } from "../makka-hotel/makka-hotel.component";
import Swal from 'sweetalert2';
import { Subject, Subscription,timer} from "rxjs";
import { DateTimeToDateFormat } from "src/app/helpers/date_time/date_pipe";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-hotel-details-popup",
  templateUrl: "./hotel-details-popup.component.html",
  styleUrls: ["./hotel-details-popup.component.scss"]
})

export class HotelDetailsPopupComponent implements OnInit, OnChanges,OnDestroy {
  static imageView: boolean;
  private destroy$ = new Subject();
  static roomMoreDetails: boolean;
  static loadRoomDetails: boolean;
  selectedCurrency: any;
  selectedLanguage: any;
  readonly = true;
  selectedHotel: any;
  selectedRoomGroups: any[] = [];
  makkaHotelName: any;
  makkaCheckInTime: any;
  makkaCheckOutTime: any;
  hotelPics: any[];
  moreimages: boolean;
  imageshow: number;
  isGrouped: boolean;
  rooms: any[];
  showHotelDetails: boolean = false;
  makkaSelectActivate: boolean;
  totalRoomPrice: number = 0;
  selectedRoomCount: number = 0;
  selectedHotelInfo: SelectedHotel;
  showhotelDetails: boolean;
  makkahticked: boolean;
  stage: any;
  madeendetailshow: boolean;
  steps: any;
  loader: boolean;
  isGroupedMakka: any;
  ddate: any;
  countadult: any;
  countchild: any;
  numberOfDays: number;
  search: string = "";
  setViewData: {};
  selectedRoomDetails: boolean = false;
  selectedRoomInfo: any;
  private createTripAdapter: CreateTripAdapter = new CreateTripAdapter(this.helperService,this.dateForm);
  private createTripHelper: CreateTripHelper = new CreateTripHelper(this.helperService,this.translate,this.dateForm);
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  showHotelDetailsShimmer: boolean;
  roomImageGallery: boolean;
  totalTravellers: number;
  noOfImages: number;
  hotelData: any;
  hotelInfo: any;
  isRoomLimitEceeded: boolean = false;
  activeBttn: boolean = false;
  @Output() detailsFlag = new EventEmitter();
  activateSearchBtn: boolean = true;
  currency: any;
  hotelDetailShimmer: boolean;
  b2cHelper: any;
  roomData: any;
  countImgs: any;
  diasbleMakkaSave: boolean = true;
  showGrpOptionButton: boolean;
  @ViewChild('blinkButton', { read: ElementRef, static: false }) blinkButton: ElementRef;
  baseUrl: string = "";
  prodUrl: string = environment.prodUrl;
  showLinkPopup: boolean = false;
  isLinkReady: boolean;
  b2bLink: any;
  b2bWhtLnk: string;
  b2bUrl: any;
  hotlName: any[] = [];
  hotel: any;
  price: any;
  tagName: string[] = [];
  countryCode: any = environment.countryCodeCommen;
  phoneNumber: string = "";
  callB2bLink: boolean = true;
  promoCode: any[] = [];
  subPccValue: any;
  appliedPromoCode: boolean;
  phone_error: boolean = false;
  activateCreateLinkBtn: boolean = false;
  specialCode: any;
  addSPCode: boolean;
  viewSpecialCodedata: boolean;
  service:string = "";
  saveHotelSubscription:Subscription;
  pendingApiTimer: number = environment.pendingApiTime;
  saveDeepLinkResponse: boolean = false;
  saveHotelDeepSubscription: Subscription;
  selectedInfoSubscription: Subscription;
  selectedInfoResponse: boolean;
  shareLinkResponse: boolean;
  creatTripSubscription: Subscription;
  taskId: any ="";
  disableTimer: boolean = false;
  constructor(
    private commonService: SubAgentApiService,
    private helperService: HelperService,
    private appStore: AppStore,
    private notifyService: NotificationService,
    private translate: TranslateService,
    private segment:SegmentService,
    private dom:DomSanitizer,
    private dateForm:DateTimeToDateFormat
  ) {}

  @Output() handleNotif = new EventEmitter();
  @Output() changeItinerary = new EventEmitter();
  @Input() hotelDetailsData: any;

  ngAfterViewChecked() {
    this.translate.use((sessionStorage.getItem('userLanguage') === 'ar-AE') ? "ar-AE" : sessionStorage.getItem('userLanguage'));
    if (sessionStorage.getItem('userLanguage') == "ar-AE" || sessionStorage.getItem('userLanguage') == "ur-UR") {
      (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
    } else {
      (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    }
  }

  /*
   * this method for notify parent component
   */
  onNotify() {
    this.handleNotif.emit("notify parent");
  }

  /*
   * this method for notify parent component
   */
  onNotifyCreteTripForItineraryChange() {
    this.changeItinerary.emit("notify parent");
  }

  ngOnInit() {
    this.getSubPccList();
    this.setDefaultLangAndCurrency()
    this.findProdUrlConfig()
    if (this.baseUrl == this.prodUrl) {
      window.analytics.page('subagent/hotel details', {
        portal: "B2B"
      });
    }
    var obj = JSON.parse(sessionStorage.getItem('userObject'))
    this.totalTravellers = obj.adults + obj.children;
    this.rooms = JSON.parse(sessionStorage.getItem('roomData'));
    this.selectedRoomCount = 0;
    /*
    * this method for fetching selected hotel details
    */
   console.log("sda",this.hotelDetailsData);
   
    if (this.hotelDetailsData != null) {
      console.log("22");
      this.selectedHotel = this.hotelDetailsData;
      this.setData()
    } else {
      console.log("221");
      this.fetchSelectedHotelInfoAfterRefresh()
    }
  }

  getSubPccList() {
    if (sessionStorage.getItem('specialCode') && sessionStorage.getItem('specialCode') != null) {
      this.specialCode = sessionStorage.getItem('specialCode');
      this.addSPCode = true;
      this.viewSpecialCodedata = true;
    }
    if (sessionStorage.getItem('promoCode') && sessionStorage.getItem('promoCode') != null) {
      this.subPccValue = sessionStorage.getItem('promoCode');
      this.appliedPromoCode = true;
    }
    var hotelCode = this.hotelDetailsData.umrah_hotel_code;
    this.commonService.getSubPcc(sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(data => {
      data.forEach(element => {
        if (element.hotel_code == hotelCode) {
          if (element.sub_pcc.length > 0) {
            this.promoCode.push(element.sub_pcc)
          }
        }
      });
    })

  }

  ngOnChanges() {
  }

  fetchSelectedHotelInfoAfterRefresh() {
    console.log("gff");
    
    this.selectedLanguage = sessionStorage.getItem('userLanguage');
    if(!this.disableTimer  ){this.setTimerForHotelInfoApiIsPendingForMorethan30Seconds()}
    this.selectedInfoResponse = false;
    this.selectedInfoSubscription =
    this.commonService.getSelectedHotelInfoV2_5(this.createTripAdapter.selectedHotelInfoRequest(this.selectedLanguage, JSON.parse(sessionStorage.getItem('selectedHotelInfo')), this.search), this.selectedLanguage,sessionStorage.getItem('ulogId'),this.taskId).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        console.log("545");
        
        if(data.code == "0" ){
          this.disableTimer  = false;
          HotelDetailsPopupComponent.loadRoomDetails = false;
          this.selectedInfoResponse = true;
            this.selectedHotel = data.data;
            this.setData()
        }else if(data.code == "00111"){
          HotelDetailsPopupComponent.loadRoomDetails = true;
          this.taskId = data.task_id;
          this.disableTimer  = true
          this.fetchSelectedHotelInfoAfterRefresh()
        }
        else if(data.code == "00123"){
          HotelDetailsPopupComponent.loadRoomDetails = false;
          this.disableTimer  = true
          this.taskId = data.task_id;
          this.fetchSelectedHotelInfoAfterRefresh()
        }
      },(error)=>{
        this.disableTimer  = false;
        HotelDetailsPopupComponent.loadRoomDetails = false;
        this.selectedInfoResponse = true;
      });
  }
  setTimerForHotelInfoApiIsPendingForMorethan30Seconds(){
    timer(this.pendingApiTimer).pipe(takeUntil(this.destroy$)).subscribe(x => {
        if(!this.selectedInfoResponse){
        if(this.selectedInfoSubscription != undefined && this.selectedInfoSubscription != null){
          this.selectedInfoSubscription.unsubscribe();
        }
        Swal.fire({
          icon: 'error',
          showCancelButton: true,
          text: this.translate.instant("It seems like server busy from Maqam-GDS."),
          cancelButtonText:'Cancel',
          confirmButtonText: this.translate.instant('Try Again'),
        }).then((result) => {
          if (result.isConfirmed){
            this.disableTimer  = false;
            this.fetchSelectedHotelInfoAfterRefresh()
          }else{
            this.disableTimer  = false;
            HotelDetailsPopupComponent.loadRoomDetails = false;
          }
        })
      }
    });
  }


  setDefaultLangAndCurrency() {
    if (typeof this.selectedCurrency == "undefined") {
      this.selectedCurrency = this.appStore.currencyCode;
    }
    if (typeof this.selectedLanguage == "undefined") {
      var lang: any = this.selectedLanguage = "en-US";
    }
  }

  /*
     * this method for setting dom data
     */
  setData() {
    this.hotelInfo = JSON.parse(sessionStorage.getItem('hotelInfo'))
    this.hotelInfo = JSON.parse(sessionStorage.getItem('hotelInfo'))
    this.hotelDetailShimmer = false;
    const x = this.createTripHelper.setDataForHotelDeatilsV2(this.selectedHotel, this.hotelInfo, this.rooms);
    this.selectedRoomGroups = x.rooomGroup;
    this.makkaSelectActivate = x.isGrouped;
    this.appStore.showHotelDetailsShimmer = false;
    this.showHotelDetailsShimmer = false;
    this.showHotelDetails = true;
    this.hotelPics = x.hotelPics;
    this.isGrouped = x.isGrouped;
    this.noOfImages = this.hotelPics.length;
    this.numberOfDays = JSON.parse(sessionStorage.getItem('noOfDays'))
    if (this.isGrouped) { this.selectedRoomCount = 0 }
    this.getRoomCount();
  }


  makkaIsGroupedRadioClicked(i, j) {
    this.selectedRoomCount = 0;
    this.totalRoomPrice = 0;
    for (let k = 0; k < this.selectedRoomGroups.length; k++) {
      this.selectedRoomGroups[k].isRoomSelectionChecked = false;
      this.selectedRoomGroups[k].isExpand = true;
    }
    this.totalRoomPrice = this.selectedRoomGroups[i].display_fare_summray.total_amount;
    this.selectedRoomGroups[i].rooms.forEach(x => this.hotlName.push(x.name))
    this.selectedRoomGroups[i].isRoomSelectionChecked = true;
    this.selectedRoomGroups[i].isExpand = false;
    this.selectedRoomCount = this.rooms.length;
    this.selectedRoomGroups.forEach(x => x.isDisplayGroup = false);
    this.showGrpOptionButton = true
    this.makkaSelectActivate = false;
    if (this.baseUrl == this.prodUrl) {
      window.analytics.track('grouped hotel selected', {
        poral: "B2B"
      });
    }
  }

  roomCount(i) {
    let totalRoom = 0;
    if (i != 0) {
      for (let j = (i - 1); j >= 0; j--) {
        totalRoom += this.selectedRoomGroups[j].length;
      }
    }
    return totalRoom;
  }

  // changeRoomExpansionState(i,j){
  //   this.hotlName = [];
  //   let p = this.selectedRoomGroups[i];
  //   if (p.length > 0) {
  //     for (let k = 0; k < p[j].rooms.length; k++) {
  //       if (p[j].rooms[k].isRoomSelectionChecked) {
  //         p[j].rooms[k].isRoomSelectionChecked =
  //           !p[j].rooms[k].isRoomSelectionChecked;
  //           if(this.totalRoomPrice > 0){
  //             this.totalRoomPrice = this.totalRoomPrice - (p[j].rooms[k].display_fare_summary.total_amount * p[j].rooms[k].quantity);
  //           }
  //       }
  //     }
  //   }
  //   p[j].rooms.forEach(x=>x.isExpand = false);
  //   p[j].rooms.forEach(x=>x.isDisplay = true)
  //   this.getRoomCount();
  // }

  showAllShrinkedOPtions() {
    this.selectedRoomGroups.forEach(x => x.isDisplayGroup = true);
    this.showGrpOptionButton = false;
  }

  backHotel() {
    this.removePromoCode();
    this.removeSPCode();
    this.hideHotelDetailsPupup();
  }

  /*
   * this method for hide hotel popup
   */
  hideHotelDetailsPupup() {
    this.showHotelDetails = false;
    this.appStore.showHotelDetails = false;
    sessionStorage.setItem('hotelDetailsFlag', 'close')
    this.detailsFlag.emit('hide')
  }

  bookHotel() {
    this.activeBttn = true;
    this.makkahticked = true;
    this.makkahticked = true;
    this.madeendetailshow = true;
    this.showHotelDetailsShimmer = false;
    //this.removePromoCode();
    //this.removeSPCode();
    sessionStorage.setItem('hotelDetailsFlag', 'close')
    this.appStore.showShimmer = !this.appStore.showShimmer;
    if (!this.appStore.isAvailabilityFails) {
      this.appStore.stepperIndex += 1;
    }
    if (!sessionStorage.getItem('custom_trip_id')) {
      if (this.baseUrl == this.prodUrl) {
        window.analytics.track('book hotel clicked', {
          poral: "B2B",
          selectedHotel: this.selectedHotel.name,
          selectedRoom: this.rooms
        });
      }
      this.commonService.saveSelectedHotel(this.createTripAdapter.bookHotelRequest(this.isGrouped, this.selectedRoomGroups, this.selectedHotel, this.hotelInfo, this.numberOfDays), sessionStorage.getItem('userLanguage'),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.activeBttn = true;
        sessionStorage.setItem('custom_trip_id', data.id);
        sessionStorage.setItem('stage', '1')
        this.onNotify();
        window.scroll(0, 0);
      });
    }
    if (sessionStorage.getItem('custom_trip_id')) {
      if (this.baseUrl == this.prodUrl) {
        window.analytics.track('book hotel clicked', {
          poral: "B2B",
          selectedHotel: this.selectedHotel.name,
          selectedRoom: this.rooms
        });
      }
      this.commonService.updateCustomTrip(sessionStorage.getItem('custom_trip_id'), this.createTripAdapter.bookHotelRequest(this.isGrouped, this.selectedRoomGroups, this.selectedHotel, this.hotelInfo, this.numberOfDays), sessionStorage.getItem('userLanguage'),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        if (this.baseUrl == this.prodUrl) {
          window.analytics.track('book hotel clicked', {
            poral: "B2B",
            selectedHotel: this.selectedHotel.name,
            selectedRoom: this.rooms,
            apiStatus: "success"
          });
        }
        this.activeBttn = true;
        var obj = JSON.parse(sessionStorage.getItem('userObject'))
        if (sessionStorage.getItem('service') == "All" && !obj.swapHotel && this.selectedHotel.meta_data.city == "Makkah" || this.selectedHotel.meta_data.city == "مكة المكرمة" || this.selectedHotel.location == "MAKKA") {
          sessionStorage.setItem('stage', '1')
        } else if (sessionStorage.getItem('service') == "All" && obj.swapHotel && this.selectedHotel.meta_data.city == "Madinah" || this.selectedHotel.meta_data.city == "لمدينة المنورة" || this.selectedHotel.location == "MADEENA") {
          sessionStorage.setItem('stage', '1')
        }
        else {
          sessionStorage.setItem('stage', '2')
        }
        this.onNotify();
        window.scroll(0, 0);
      }, (error) => {
        if (this.baseUrl == this.prodUrl) {
          window.analytics.track('book hotel clicked', {
            poral: "B2B",
            selectedHotel: this.selectedHotel.name,
            selectedRoom: this.rooms,
            apiStatus: "failed"
          });
        }
      });
    }
  }

  hotelErrorMsg(){
    this.callB2bLink = true;
    this.isLinkReady = false;
    Swal.fire({
      icon: 'error',
      text: this.translate.instant('Sorry, Not Getting Hotel Availability From Maqam GDS Please try again'),
      confirmButtonText: this.translate.instant('OK'),
    })
  }


  /*
   * this method for show room details popup
   */
  showRoomDetailsPopUp(room) {
    this.selectedRoomInfo = room;
    HotelDetailsPopupComponent.roomMoreDetails = true;
  }

  // changeRoomGrpFalse(i,j,k) {
  //   let p = this.selectedRoomGroups[i];
  //   if (p.length > 0) {
  //     p[j].rooms.forEach(y=>y.isExpand = false);
  //     for (let k = 0; k < p[j].rooms.length; k++) {
  //       if (p[j].rooms[k].isRoomSelectionChecked) {
  //         p[j].rooms[k].isRoomSelectionChecked =
  //           !p[j].rooms[k].isRoomSelectionChecked;
  //           let pr = p[j].rooms[k].display_fare_summary.total_amount * p[j].rooms[k].quantity;
  //           if(this.totalRoomPrice > 0 && this.totalRoomPrice >= pr){
  //             this.totalRoomPrice = this.totalRoomPrice - pr;
  //           }
  //       }
  //     }
  //   }

  //   if (!p[j].rooms[k].isRoomSelectionChecked) {
  //     this.hotlName.push(p[j].rooms[k].name)
  //     p[j].rooms[k].isRoomSelectionChecked = !p[j].rooms[k].isRoomSelectionChecked;
  //     p[j].rooms[k].isExpand = true;
  //     this.totalRoomPrice = this.totalRoomPrice + (p[j].rooms[k].display_fare_summary.total_amount * p[j].rooms[k].quantity);
  //   }
  //   p[j].rooms.forEach(x=>x.isDisplay = false)
  //   this.selectedRoomGroups[i] = p
  //   this.getRoomCount()
  //   if(this.baseUrl  == this.prodUrl){
  //     window.analytics.track('grouped false hotel selected',{
  //       portal:"B2B"
  //     });
  //   }
  // }

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


  /*
   * this method for selecting room if it is grouped
   */
  isGroupedRadioClicked(i, j) {
    this.selectedRoomCount = 0;
    this.totalRoomPrice = 0;
    for (let k = 0; k < this.selectedRoomGroups.length; k++) {
      this.selectedRoomGroups[k].isRoomSelectionChecked = false;
    }
    this.totalRoomPrice = this.selectedRoomGroups[i].amount;
    this.selectedRoomGroups[i].isRoomSelectionChecked = true;
    this.selectedRoomCount = this.rooms.length;
    this.makkaSelectActivate = false;
  }

  /*
   * this method to show all images at room details popup
   */
  viewAllImagePopup() {
    if (this.noOfImages > 0) {
      HotelDetailsPopupComponent.imageView = true;
    }
  }

  currencyConversion(amount) {
    return this.subagentHelper.currencyCalculation(amount)
  }

  ngDoCheck(){
    this.service = sessionStorage.getItem('service');
    this.selectedRoomDetails = HotelDetailsPopupComponent.roomMoreDetails;
    this.roomImageGallery = HotelDetailsPopupComponent.imageView;
    this.currency = HedderComponent.globelCurrency;
    this.loader = HotelDetailsPopupComponent.loadRoomDetails;
  }

  findProdUrlConfig() {
    const parsedUrl = new URL(window.location.href);
    this.baseUrl = parsedUrl.origin;
  }

  // mealOptionRadioBtnChanged(evnt, i, j, grp, k) {
  //   if (this.blinkButton != undefined) {
  //     this.blinkButton.nativeElement.classList.add('blink_me')
  //   }
  //   setTimeout(() => {
  //     if (this.blinkButton != undefined) {
  //       this.blinkButton.nativeElement.classList.remove('blink_me')
  //     }
  //   }, 2000);
  //   grp[0].rooms.forEach(x => { x.priceChange = false; })
  //   grp[0].rooms.forEach(x => { x.isRoomSelectionChecked = false; })
  //   let q = 0;
  //   grp[0].rooms[k].meal_title = evnt.value;
  //   let bsamt = 0;
  //   let tx = 0;
  //   let cmm = 0;
  //   let rmGpObj = '';
  //   let rid = '';
  //   grp[0].rooms[k].insertedMealTitle.forEach(x => x.showMeal = false)
  //   grp[0].rooms[k].insertedMealTitle.forEach(x => {
  //     if (x.mealTitle == evnt.value) {
  //       q = x.amount;
  //       x.showMeal = true;
  //       bsamt = x.baseAmount;
  //       tx = x.tax;
  //       cmm = x.commission;
  //       rmGpObj = x.rmGpObj;
  //       rid = x.rmId
  //     }
  //   })
  //   if (grp[0].rooms.length > 1 && grp[0].rooms[0].name == grp[0].rooms[1].name) {
  //     grp[0].rooms.forEach(x => {
  //       x.display_fare_summary.total_amount = q;
  //       x.display_fare_summary.base_amount = bsamt;
  //       x.display_fare_summary.tax_amount = tx;
  //       x.display_fare_summary.commission_discount = cmm;
  //       x.room_group_obj = rmGpObj;
  //       x.room_id = rid;
  //     })
  //     grp[0].rooms.forEach(x => x.priceChange = true)
  //   }

  //   grp[0].rooms[k].display_fare_summary.total_amount = q;
  //   grp[0].rooms[k].display_fare_summary.base_amount = bsamt;
  //   grp[0].rooms[k].display_fare_summary.tax_amount = tx;
  //   grp[0].rooms[k].display_fare_summary.commission_discount = cmm;
  //   grp[0].rooms[k].room_group_obj = rmGpObj;
  //   grp[0].rooms[k].room_id = rid;
  //   grp[0].rooms[k].priceChange = true;
  //   grp[0].rooms[k].isRoomSelectionChecked = true;
  //   if (this.baseUrl == this.prodUrl) {
  //     window.analytics.track('hotel-details/meal plan selected', {
  //       selectedMealPlan: evnt.value,
  //       portal: "B2B"
  //     });
  //   }
  // }


  makeRoomRefundable(evnt, i, j) {
    let q = 0;
    this.totalRoomPrice = this.totalRoomPrice
      - (this.selectedRoomGroups[i].rooms[j].amount * this.selectedRoomGroups[i].rooms[j].quantity);
    this.selectedRoomGroups[i].rooms[j].insertedMealTitle.forEach(x => { if (x.mealTitle == evnt.value) { q = x.amount } })
    this.selectedRoomGroups[i].rooms[j].amount = q;
    this.totalRoomPrice = this.totalRoomPrice
      + (this.selectedRoomGroups[i].rooms[j].amount * this.selectedRoomGroups[i].rooms[j].quantity);
  }

  onCountryChange(event) {
    this.countryCode = event.dialCode
    this.validateNumber()
  }

  inputValidation(event?) {
    if (event) {
      if (event.target.value.length > 0) {
        this.activateCreateLinkBtn = true;
      }else{
        this.activateCreateLinkBtn = false;
      }
    }
    // let defaultCountryCode: string = "+91"
    // try {
    //   let mobileNumber: string = '';
    //   if (event)
    //     mobileNumber = event.srcElement.value;
    //   else
    //     mobileNumber = this.phoneNumber;
    //   defaultCountryCode = defaultCountryCode.replace(/[^0-9]/g, '');
    //   if (this.getNumberPlaceHolderLength() && mobileNumber.length >= this.getNumberPlaceHolderLength() + defaultCountryCode.length &&
    //     mobileNumber.startsWith(defaultCountryCode)) {
    //     mobileNumber = mobileNumber.slice(defaultCountryCode.length);
    //   }
    //   else if (mobileNumber.startsWith('0'))
    //     mobileNumber = mobileNumber.slice(1);

    //   this.phoneNumber = mobileNumber;
    //   this.validateNumber();
    // } catch (exception) {
    // }
  }

  validateNumber() {
    try {
      if (this.phoneNumber) {
        let mobileNumber = this.phoneNumber;
        if (this.getNumberPlaceHolderLength() && this.getNumberPlaceHolderLength() != mobileNumber.length) {
          this.phone_error = true;
          this.activateCreateLinkBtn = false
        } else {
          this.phone_error = false;
          this.activateCreateLinkBtn = true
        }
      }
    } catch (exception) {
      this.phone_error = false;
      alert(this.translate.instant('Enter mobile number'))
    }
  }

  getNumberPlaceHolderLength(): number {
    try {
      let phoneInput: HTMLElement = document.getElementById("phoneInput");
      if (phoneInput)
        return phoneInput.attributes.getNamedItem("placeholder").value.replace(/[^0-9a-zA-Z]/g, '').length;
    } catch (exception) {
    }
  }

  removePromoCode() {
    this.taskId = null;
    sessionStorage.removeItem('promoCode');
    var usrObj = JSON.parse(sessionStorage.getItem("userObject"))
    usrObj.subPcc_makkah = null;
    usrObj.subPcc_medinah = null;
    sessionStorage.setItem('userObject',JSON.stringify(usrObj))
    this.subPccValue = null;
    this.appliedPromoCode = false;
    HotelDetailsPopupComponent.loadRoomDetails = true;
    MakkaHotelComponent.addSubPcc = false;
    this.fetchSelectedHotelInfoAfterRefresh()
  }


  applaySubPcc() {
    if (this.subPccValue && this.subPccValue != null) {
      this.totalRoomPrice = 0;
      sessionStorage.setItem('promoCode', this.subPccValue);
      var usrObj = JSON.parse(sessionStorage.getItem("userObject"))
      if(sessionStorage.getItem('service') == 'Makkah Hotel'){
        usrObj.subPcc_makkah = this.subPccValue;
      }
      if(sessionStorage.getItem('service') == 'Medina Hotel'){
        usrObj.subPcc_medinah = this.subPccValue;
      }
      sessionStorage.setItem('userObject',JSON.stringify(usrObj))
      this.getSubPccList();
      this.promoCode = [];
      this.loadPromoApply();
      MakkaHotelComponent.addSubPcc = true;
      this.fetchSelectedHotelInfoAfterRefresh()
    } else {
      this.notifyService.showWarning('Please enter your Promo Code')
    }
  }

  removeSPCode() {
    sessionStorage.removeItem('specialCode');
    this.addSPCode = false;
    this.specialCode = null;
  }

  loadPromoApply() {
    HotelDetailsPopupComponent.loadRoomDetails = true;
  }

  selectPromoCode(data) {
    this.subPccValue = data;
    this.applaySubPcc()
  }

  viewSpecialCode() {
    this.viewSpecialCodedata = !this.viewSpecialCodedata;
  }
  appalySPCode() {
    if (this.specialCode && this.specialCode != null) {

    } else {
      this.notifyService.showWarning('Please enter your Special Code')
    }
  }

  onTotalRoomPriceChanged(price) {
    this.getRoomCount();
    this.totalRoomPrice = price;
  }

  onRoomGroupChanged(roomGroup){
    this.selectedRoomGroups = roomGroup;
  }

  onHotelNameAdded(val){
    this.hotlName.push(val);
  }

  onHotelNameClear(){
    this.hotlName = [];
  }

  onSelectedRoomCountChange(val){
    this.selectedRoomCount = val;
  }

  onDisableMakkaSave(){
    this.diasbleMakkaSave = true;
  }

  onMakkaSelectActivate(){
    this.makkaSelectActivate  =true;
  }
  onMakkaSelectDeactivate(){
    this.makkaSelectActivate  =false;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }
}
