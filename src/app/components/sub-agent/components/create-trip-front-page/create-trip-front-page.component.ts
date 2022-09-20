import { Component, OnInit, ViewChild, ElementRef, Renderer2, DoCheck, AfterViewInit, OnDestroy, } from "@angular/core";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from "../../../../common/services/notification.service";
import { CreateTripComponent } from "../create-trip/create-trip.component";
import { AppStore } from "../../../../stores/app.store";
import { LooseObject, Room, Travellers } from "src/app/models/visaTypes";
import { listHistory } from "../../../../models/listHistory";
import { HelperService } from "src/app/common/services/helper-service";
import { GeneralHelper } from "../../../../helpers/General/general-helpers";
import { CreateTripHelper } from '../../../../helpers/sub-agent/create-trip-helpers'
import { SubAgentApiService } from "src/app/Services/sub-agent-api-services";
import Swal from 'sweetalert2';
import { environment } from "src/environments/environment";
import { SegmentService } from "ngx-segment-analytics";
import { HedderComponent } from "src/app/common/components/hedder/hedder.component";
import { SubAgentGeneralHelper } from "src/app/helpers/sub-agent/general-helper";
import { Http } from "@angular/http";
import { DateTimeToDateFormat } from "src/app/helpers/date_time/date_pipe";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-create-trip-front-page",
  templateUrl: "./create-trip-front-page.component.html",
  styleUrls: ["./create-trip-front-page.component.scss"]
})

export class CreateTripFrontPageComponent implements OnInit, DoCheck, AfterViewInit ,OnDestroy{
  crTripHelper: CreateTripHelper;
  private destroy$ = new Subject();
  historyList: listHistory[];
  userRooms: Room[] = [];
  routeList = [];
  steps = [];
  today = new Date();
  goButtonEnable: boolean = true;
  activateMakkaSearch: boolean;
  activateMadeenaSearch: boolean;
  activateTransportSearch: boolean;
  activateMakkaPromotion: boolean;
  activateMadeenaPromotion: boolean;
  enableSearchButton: boolean = false;
  transportStartDate: any;
  makkaCheckInDate: any;
  makkaCheckOutDate: any;
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  routeSettings: IDropdownSettings = {};
  countAdult: number = 2;
  countChild: number = 0;
  countInfant: number = 0;
  displayTabtravel: boolean;
  @ViewChild("menuIconClass", { read: ElementRef, static: false })
  menuIconClass: ElementRef;
  @ViewChild("menuPopupClass", { read: ElementRef, static: false })
  menuPopupClass: ElementRef;
  @ViewChild("selectionPopUp", { read: ElementRef, static: false })
  selectionPopUp: ElementRef;
  @ViewChild("serviceDropDown", { read: ElementRef, static: false })
  serviceDropDown: ElementRef;
  @ViewChild('makkaOutDatePicker', { read: ElementRef, static: false })
  makkaOutDatePicker: ElementRef;
  @ViewChild('madeenaInPicker', { read: ElementRef, static: false })
  madeenaInPicker: ElementRef;
  @ViewChild('madeenaOutPicker', { read: ElementRef, static: false })
  madeenaOutPicker: ElementRef;
  enableMakka: boolean;
  enableMadina: boolean;
  enableTransport: boolean;
  activaleAllSearch: boolean;
  madeenmin: any;
  transportmin = new Date(this.today.getTime() - 1000 * 60 * 60 * 24);
  madeenaCheckOutDate: Date;
  madeenaCheckInDate: any;
  madeenamax: Date;
  viewsearchbutton: boolean;
  hidebttn: boolean;
  showhidebttn: boolean = true;
  transportmax: Date;
  makkahmin: Date;
  routeready: boolean;
  roomaloctionpopup: any;
  userObject: {};
  countTravalers: number;
  showSelectionPopUp: boolean;
  service: any = "All";
  subPcc_makkah: any;
  subPcc_medinah: any;
  mint: Date;
  madeenaMin: Date;
  special_code_medinah: any;
  special_code_makkah: any;
  travellers: Travellers;
  showRoomAllocationPopup: boolean = false;
  dataForPopUp: LooseObject = {};
  noOfDaysInMakkah: number;
  noOfDaysInMadeenah: number;
  genHelper: GeneralHelper;
  vehicleTypeList: any;
  routetransport: any = "58";
  vehicleCode: any;
  vehicleMaxCapacity: number;
  madeenaMaxdate: Date;
  madeenaMindate: any;
  vehicleCount: number = 1;
  countArray: number[] = [1];
  setBoolean: boolean = false;
  disableGoBttn: boolean = false;
  subPccList: any;
  medinahSubPccList: any;
  length: number;
  promo_makkah_id: any;
  promo_madeena_id: any;
  swapHotel: boolean = false;
  activeAnimation: boolean = false;
  params: any;
  tripData: any;
  tripMakkahHotel: any;
  hotelMakkahFare: any;
  tripMakkahHotelrating: number;
  tripMadeenaHotel: any;
  hotelMadeenaFare: any;
  tripTransport: any;
  transportFare: any;
  selectedTransport: any;
  tripVisaData: any;
  baseUrl: string = "";
  recentSearch = false;
  prodUrl: string = environment.prodUrl;
  month: number = 0;
  year: number = 2021;
  sales: any;
  currency: string;
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  newsList: any[]=[];

  saleChartData =[];

  view: any[] = [200, 200];

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#00a11b', '#1b416c'],
  };
  paxArray: any;
  allocationBoolean: boolean = false;
  bookingRequests:boolean = false;

  constructor(
    private commonApiService: SubAgentApiService,
    private subAgentApiService: SubAgentApiService,
    private appStore: AppStore,
    private renderer2: Renderer2,
    private router: Router,
    private notifyService: NotificationService,
    private helperService: HelperService,
    private _genHelper: GeneralHelper,
    private translate: TranslateService,
    private common: SubAgentApiService,
    private route: ActivatedRoute,
    private segment: SegmentService,
    private http:Http,
    private dateFormate:DateTimeToDateFormat
  ) {
    this.genHelper = _genHelper;
    this.renderer2.listen("window", "click", (e: Event) => {
      if (
        (this.menuPopupClass &&
          this.menuPopupClass.nativeElement.contains(e.target)) ||
        (this.menuIconClass &&
          this.menuIconClass.nativeElement.contains(e.target))
      ) {
        // Clicked inside plus preventing click on icon
      } else {
        // Clicked outside
        this.displayTabtravel = false;
      }
    });
    this.renderer2.listen("window", "click", (e: Event) => {
      if (
        (this.selectionPopUp &&
          this.selectionPopUp.nativeElement.contains(e.target)) ||
        (this.serviceDropDown &&
          this.serviceDropDown.nativeElement.contains(e.target))
      ) {
        // Clicked inside plus preventing click on icon
      } else {
        // Clicked outside
        this.showSelectionPopUp = false;
      }
    });
  }

  ngOnInit() {
    sessionStorage.setItem("searchActive", "false");
    this.genHelper.checkForAccessToken();
    let x = this.randomKeyGenerator(5) ;
    sessionStorage.setItem("ulogId",x)
    this.setUserDataForSegmentAnalysis()
    if (sessionStorage && sessionStorage.getItem('params')) {
      this.params = JSON.parse(sessionStorage.getItem('params'))
      if (this.params.tripId != "0") {
        sessionStorage.setItem('custom_trip_id', this.params.tripId)
        sessionStorage.setItem('service', 'Recent Booking')
        sessionStorage.setItem('stage', '1');
        sessionStorage.setItem("currentUser", 'SUB')
        sessionStorage.setItem("deepLinkStatus",'1')
        sessionStorage.setItem('steps', JSON.stringify(['1']))
        this.setDeepLinkAndAll()
        if (this.baseUrl == this.prodUrl) {
          window.analytics.track('subagent home page', {
            user: localStorage.getItem("userTypeName"),
            userId: localStorage.getItem("userId"),
            portal: "B2B",
            flow: "Deeplink flow"
          });
        }
      }
    } else {
      sessionStorage.setItem("deepLinkStatus",'0')
      this.findProdUrlConfig()
      this.setMonthAndYear()
      this.getCurrentPost()
      this.fetchCurrentSalesReport(this.month.toString())
      this.normalWay()
    }
    var service = sessionStorage.getItem('service');
    if (service != undefined && service != null && service != '') {
      this.onServiceItemChangeRefresh(service, true);
    } else {
      this.onServiceItemChangeRefresh('Recent Booking', true);
    }
  }

  randomKeyGenerator(length) {
      var key = new Date().getTime().toString();
      var result           = [];var x = "";
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));}
      x = result.join('') + key
    return x;
  }

  fetchCurrentSalesReport(m){
    var body = {"month":m,"year":this.year.toString}
    this.subAgentApiService.getCurrentSalesReport(body).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.sales = data.data;
      this.saleChartData = [
        {
          "value":this.sales.hotel.sales_amount,
          "name":"Hotel"
        },{
          "value":this.sales.transport.sales_amount,
          "name":"Transport"
        }
      ];
    })
  }

  setMonthAndYear(){
    var dateObj = new Date();
    this.month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    this.year = dateObj.getUTCFullYear();
  }

  getCurrentPost(){
    this.http.get("https://www.umrahtrip.com/web/wp-json/wp/v2/posts").map(res => res.json()).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.newsList = data
    })
  }



  findProdUrlConfig() {
    const parsedUrl = new URL(window.location.href);
    this.baseUrl = parsedUrl.origin;
  }

  setUserDataForSegmentAnalysis() {
    if (this.baseUrl == this.prodUrl) {
      window.analytics.page('subagent/home', {
        user: localStorage.getItem("userTypeName"),
        userId: localStorage.getItem("userId"),
        portal: "B2B"
      });
    }
  }

  normalWay() {
    sessionStorage.removeItem('modify')
    this.enableSearchButton = false;
    this.service = "Recent Booking";
    this.activaleAllSearch = true;
    this.enableMakka = true;
    this.enableMadina = true;
    this.enableTransport = true;
    this.goButtonEnable = false;
    this.setDomDataOnRefresh()
    this.setDefaultLangAndCurrency()
    /**
   * This method for checking the availability of the access token
   *
   */
    this.crTripHelper = new CreateTripHelper(this.helperService, this.translate,this.dateFormate);
    this.appStore.adultCount = 1;
    this.appStore.childCount = 0;
    this.appStore.infantCount = 0;
    this.appStore.showHotelDetailsShimmer = false;
    this.afterRefreshDropDown()
  }

  setDeepLinkAndAll() {
    this.getTripData()
  }

  getTripData() {
    this.common.getTrip(this.params.tripId, sessionStorage.getItem('userLanguage'),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.tripData = data;
      if (this.tripData) {
        if (this.tripData.makkah_trip_hotel) {
          var roomCount = 0;
          this.tripMakkahHotel = this.tripData.makkah_trip_hotel;
          this.tripMakkahHotel.room_variations.forEach((data) => {
            roomCount = roomCount + data.total_rooms
          })
          this.tripMakkahHotel.total_room_count = roomCount
          this.hotelMakkahFare = this.tripData.makkah_trip_hotel.room_variations.map(x => x.room.amount).reduce((a, b) => a + b, 0);
          this.tripMakkahHotelrating = this.tripData.makkah_trip_hotel.hotel.user_review / 2;
        }
        if (this.tripData.medinah_trip_hotel) {
          var roomCount = 0;
          this.tripMadeenaHotel = this.tripData.medinah_trip_hotel;
          this.tripMadeenaHotel.room_variations.forEach((data) => {
            roomCount = roomCount + data.total_rooms
          })
          this.tripMadeenaHotel.total_room_count = roomCount
          this.hotelMadeenaFare = this.tripData.medinah_trip_hotel.room_variations.map(x => x.room.amount).reduce((a, b) => a + b, 0);
        }
        if (this.tripData.trip_transportation) {
          this.tripTransport = this.tripData.trip_transportation;
          this.transportFare = this.tripData.trip_transportation.trip_vehicles[0].price_per_vehicle;
          this.selectedTransport = this.tripData.trip_transportation.selected_transportation;
        }

        if (this.tripData.trip_visa) {
          this.tripVisaData = this.tripData.trip_visa;
        }

        let userObject = {
          adults: this.tripData.adults,
          children: this.tripData.children,
          infant: this.tripData.infants,
          madeenaCheckinDate: (this.tripData.medinah_trip_hotel) ? this.tripData.medinah_trip_hotel.check_in_time : null,
          madeenaCheckoutDate: (this.tripData.medinah_trip_hotel) ? this.tripData.medinah_trip_hotel.check_out_time : null,
          makkahCheckinDate: (this.tripData.makkah_trip_hotel) ? this.tripData.makkah_trip_hotel.check_in_time : null,
          makkahCheckoutDate: (this.tripData.makkah_trip_hotel) ? this.tripData.makkah_trip_hotel.check_out_time : null,
          noOfDaysInMakkah: (this.tripData.makkah_trip_hotel) ? this.tripData.makkah_trip_hotel.num_of_days : 0,
          swapHotel: false,
          travallersCount: this.tripData.adults + this.tripData.children + this.tripData.infants,
        }
        sessionStorage.setItem('userObject', JSON.stringify(this.tripData))
        this.createRoomArrayForDeepLink(this.tripData)
        if (this.baseUrl == this.prodUrl) {
          window.analytics.track('subagent home page', {
            user: localStorage.getItem("userTypeName"),
            userId: localStorage.getItem("userId"),
            portal: "B2B",
            flow: "Deeplink flow",
            apiStatus: "Custome trip get success",
            userobject: userObject
          });
        }
        if(this.params.steps.length > 1){
        this.steps = ((this.params.steps || "1,2,3").split(","));
        this.router.navigate(["subagent/createTrip"], {
          queryParams: { steps:this.steps, tripId: this.params.tripId },
        });}
        else{
          this.router.navigate(["subagent/createTrip"], {
            queryParams: { steps:this.params.steps, tripId: this.params.tripId },
          });
        }
        
      }
    }, (error) => {
      if (this.baseUrl == this.prodUrl) {
        window.analytics.track('subagent home page', {
          portal: "B2B",
          user: localStorage.getItem("userTypeName"),
          userId: localStorage.getItem("userId"),
          flow: "Deeplink flow",
          apiStatus: "Custome trip get failed"
        });
      }
      Swal.fire({
        icon: 'error',
        text: this.translate.instant('Sorry,it seems to be a broken link '),
        confirmButtonText: this.translate.instant('Go to Home Page')
      }).then((result) => {
        this.router.navigate(['subagent/home']);
      })
    });
  }

  createRoomArrayForDeepLink(data) {
    this.userRooms = [];
    let adultsPerRoom = 2;
    var adult = data.adults;
    var child = data.children + data.infants;
    let nofrooms = Math.ceil(adult / adultsPerRoom);
    let childrenperroom = 2;
    let extrachildrenroom = child % nofrooms;
    let index = 0;
    while (nofrooms > 0) {
      let tempRoom: Room = {
        id: index,
        children: 0,
        child_ages: [],
        pax_info_str: null,
        seq_no: "",
        adults: 0
      };

      if (adult > 0) {
        if (adult < adultsPerRoom) {
          tempRoom.adults = adult;
        } else {
          tempRoom.adults = adultsPerRoom;
        }
        adult -= adultsPerRoom;
      }

      if (child > 0) {
        if (child < childrenperroom) {
          tempRoom.children = child;
        } else {
          tempRoom.children = childrenperroom;
        }
        child -= childrenperroom;
        if (extrachildrenroom > 0 && extrachildrenroom == nofrooms) {
          extrachildrenroom -= 1;
          child -= 1;
        }
      }

      index += 1;
      nofrooms -= 1;
      this.userRooms.push(tempRoom);
      sessionStorage.setItem('roomData', JSON.stringify(this.userRooms))
    }
  }

  /** this method for atore dropDownValue */
  afterRefreshDropDown() {
    if (sessionStorage.getItem('makkaSubPccDropDown')) this.subPccList = JSON.parse(sessionStorage.getItem('makkaSubPccDropDown'))
    if (sessionStorage.getItem('madinaSubPccDropDown')) this.medinahSubPccList = JSON.parse(sessionStorage.getItem('madinaSubPccDropDown'))
  }

  setDefaultLangAndCurrency() {
    if (sessionStorage && sessionStorage.getItem('userLanguage')) { }
    else {
      sessionStorage.setItem('userLanguage', 'en-US');
    }
  }


  setDomDataOnRefresh() {
    sessionStorage.setItem("searchActive", "false");
    var obj = JSON.parse(sessionStorage.getItem('userObject'))
     if (obj != null) {
      this.noOfDaysInMakkah = obj.noOfDaysInMakkah;
      this.noOfDaysInMadeenah = obj.noOfDaysInMadeenah;
      this.disableGoBttn = true;
      this.enableGoButton()
      this.onServiceItemChangeRefresh(sessionStorage.getItem('service'), false)
      this.goButtonClicked()
      this.countTravalers = obj.travallersCount
      this.countAdult = obj.adults
      this.countChild = obj.children
      this.countInfant = obj.infant
      var ser = sessionStorage.getItem('service')
      if (ser == 'All') {
        this.swapHotel = obj.swapHotel;
        if (this.swapHotel) {
          this.makkaCheckInDate = new Date(obj.madeenaCheckinDate);
          this.makkaCheckOutDate = new Date(obj.madeenaCheckoutDate);
          this.madeenaCheckInDate = new Date(obj.makkahCheckinDate);
          this.madeenaCheckOutDate = new Date(obj.makkahCheckoutDate);
          this.transportStartDate = new Date(obj.transportStartDate);
          this.noOfDaysInMakkah = obj.noOfDaysInMadeenah;
          this.noOfDaysInMadeenah = obj.noOfDaysInMakkah;
          this.subPcc_makkah = obj.subPcc_medinah;
          this.promo_makkah_id = obj.madeena_subpcc_hotel_code;
          this.subPcc_medinah = obj.subPcc_makkah;
          this.promo_madeena_id = obj.makka_subpcc_hotel_code;
          this.special_code_medinah = obj.specialCodeMakkah;
          this.special_code_makkah = obj.specialCodeMedinah;
        } else {
          this.makkaCheckInDate = new Date(obj.makkahCheckinDate),
            this.makkaCheckOutDate = new Date(obj.makkahCheckoutDate),
            this.madeenaCheckInDate = new Date(obj.madeenaCheckinDate),
            this.madeenaCheckOutDate = new Date(obj.madeenaCheckoutDate),
            this.transportStartDate = new Date(obj.transportStartDate),
            this.noOfDaysInMakkah = obj.noOfDaysInMakkah,
            this.noOfDaysInMadeenah = obj.noOfDaysInMadeenah,
            this.subPcc_makkah = obj.subPcc_makkah,
            this.promo_makkah_id = obj.makka_subpcc_hotel_code,
            this.subPcc_medinah = obj.subPcc_medinah,
            this.promo_madeena_id = obj.madeena_subpcc_hotel_code,
            this.special_code_medinah = obj.specialCodeMedinah,
            this.special_code_makkah = obj.specialCodeMakkah
        }
      }
      if (ser == 'Makkah Hotel') {
        this.service = 'Makkah Hotel'
        this.makkaCheckInDate = new Date(obj.makkahCheckinDate),
          this.makkaCheckOutDate = new Date(obj.makkahCheckoutDate),
          this.subPcc_makkah = obj.subPcc_makkah,
          this.promo_makkah_id = obj.makka_subpcc_hotel_code,
          this.special_code_makkah = obj.specialCodeMakkah
      }
      if (ser == 'Medina Hotel') {
        this.service = 'Medina Hotel'
        this.madeenaCheckInDate = new Date(obj.madeenaCheckinDate),
          this.madeenaCheckOutDate = new Date(obj.madeenaCheckoutDate),
        this.subPcc_medinah = obj.subPcc_medinah,
          this.special_code_medinah = obj.specialCodeMedinah,
          this.promo_madeena_id = obj.madeena_subpcc_hotel_code;
      }
      if (ser == 'Transport') {
        this.service = 'Transport'
        this.transportStartDate = new Date(obj.transportStartDate);
        this.vehicleMaxCapacity = obj.vehicleCapacity;
        this.vehicleCount = obj.vehicleCounts;
      }
      this.showSearchbttn();
    }
  }

  ngAfterViewInit() {
    this.getTransportRoutes();
    this.getVehicleType();
    this.listRecentBooking();
  }

  /**
   * This method for fetching transport routes
   *
   */
  getTransportRoutes() {
    this.commonApiService
      .getRoutes(sessionStorage.getItem("userLanguage"))
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any) => {
        this.routeList = data.routes;
      });
  }

  /**
    * This method for fetching vehicle type
    *
    */
  getVehicleType() {
    this.commonApiService
      .getVehicles(sessionStorage.getItem("userLanguage"))
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any) => {
        this.vehicleTypeList = data.vehicle_types;
        this.processVehicleTypeListResponse();
      });
  }

  processVehicleTypeListResponse() {
    if (this.vehicleTypeList && this.vehicleTypeList.length > 0)
      this.vehicleTypeList.forEach(lst => {
        if (this.appStore.totalTravellers <= lst.max_capacity)
          lst.Status = true;
        else
          lst.Status = false;
      });
  }

  getVehicleList() {
    this.processVehicleTypeListResponse();
    if (this.vehicleTypeList && this.vehicleTypeList.length > 0)
      return this.vehicleTypeList.filter(lst => lst.Status && lst.Status == true);
  }

  /**
   * This method for showing traveller popup
   *
   */
  showTravelersPopUp() {
    this.displayTabtravel = !this.displayTabtravel;
  }

  countTotalTravellers() {
    this.appStore.totalTravellers = this.appStore.adultCount + this.appStore.childCount + this.appStore.infantCount;
    this.countTravalers = this.countAdult + this.countChild + this.countInfant;
  }

  /**
   * This method for remove select vehicle type
   *
   */
  removeVehicleType() {
    if (this.setBoolean) {
      this.enableSearchButton = false;
      let elemet = <HTMLSelectElement>document.getElementById("umrahVehicle")
      elemet.selectedIndex = 0;
      this.vehicleCode = "";
      this.vehicleCount = 1;
      this.countArray = [1];
      this.setBoolean = false;
    }

  }

  /**
   * This method for adding adult count at the traveller popup
   *
   */
  addAdult() {
    const pax = JSON.parse(sessionStorage.getItem("paxArray"));
    this.countAdult = this.countAdult + 1;
    pax.adults = this.countAdult;
    sessionStorage.setItem("paxArray", JSON.stringify(pax));
    this.appStore.adultCount = this.countAdult;
    if (this.baseUrl == this.prodUrl) {
      window.analytics.track('adult count added', {
        portal: "B2B",
        user: localStorage.getItem("userTypeName"),
        userId: localStorage.getItem("userId"),
        adults: this.countAdult
      });
    }
    this.countTotalTravellers();
  }

  addAdult2(event) {
    if(event.target.value>0){
    this.countAdult = +event.target.value;
    this.paxArray = {
      travallersCount: this.countAdult + this.countChild,
      adults: this.countAdult,
      children: this.countChild,
      infant: this.countInfant,
      rooms: [{id: 0, children: 0, child_ages: [], pax_info_str: null, seq_no: "", adults: 2}],
      roomType:[{room_type: 2, quantity: 1}]
    };
    this.paxArray.adults = this.countAdult;
    sessionStorage.setItem("paxArray", JSON.stringify(this.paxArray));
    this.countTotalTravellers();
    }
    else{
      this.countAdult = 0;
      this.paxArray = {
        travallersCount: this.countAdult + this.countChild,
        adults: this.countAdult,
        children: this.countChild,
        infant: this.countInfant,
        rooms: [{id: 0, children: 0, child_ages: [], pax_info_str: null, seq_no: "", adults: 2}],
        roomType:[{room_type: 2, quantity: 1}]
      };
      this.paxArray.adults = this.countAdult;
      sessionStorage.setItem("paxArray", JSON.stringify(this.paxArray));
      this.countTotalTravellers();
    }
  }

  addChild2(event){
    if(event.target.value > 0){
    this.countChild = +event.target.value;
    this.paxArray = {
      travallersCount: this.countAdult + this.countChild,
      adults: this.countAdult,
      children: this.countChild,
      infant: this.countInfant,
      rooms: [{id: 0, children: 0, child_ages: [], pax_info_str: null, seq_no: "", adults: 2}],
      roomType:[{room_type: 2, quantity: 1}]
    };
    this.paxArray.children = this.countChild;
    sessionStorage.setItem("paxArray", JSON.stringify(this.paxArray));
    this.countTotalTravellers();}
    else{
      this.countChild = 0;
      this.paxArray = {
        travallersCount: this.countAdult + this.countChild,
        adults: this.countAdult,
        children: this.countChild,
        infant: this.countInfant,
        rooms: [{id: 0, children: 0, child_ages: [], pax_info_str: null, seq_no: "", adults: 2}],
        roomType:[{room_type: 2, quantity: 1}]
      };
      this.paxArray.children = this.countChild;
      sessionStorage.setItem("paxArray", JSON.stringify(this.paxArray));
      this.countTotalTravellers();
    }
  }

  setPaxArray() {
    this.paxArray = {
      travallersCount: this.countAdult + this.countChild,
      adults: this.countAdult,
      children: this.countChild,
      infant: this.countInfant,
      rooms: [{id: 0, children: 0, child_ages: [], pax_info_str: null, seq_no: "", adults: 2}],
      roomType:[{room_type: 2, quantity: 1}]
    };
    sessionStorage.setItem("paxArray", JSON.stringify(this.paxArray));
 }

  /**
   * This method for decreasing adult count at the traveller popup
   *
   */
  minusAdult() {
    if (this.countAdult > 1) {
      const pax = JSON.parse(sessionStorage.getItem("paxArray"));
      this.countAdult = this.countAdult - 1;
      pax.adults = this.countAdult;
      sessionStorage.setItem("paxArray", JSON.stringify(pax));
      this.appStore.adultCount = this.countAdult;
      if (this.baseUrl == this.prodUrl) {
        window.analytics.track('adult count decresed', {
          portal: "B2B",
          user: localStorage.getItem("userTypeName"),
          userId: localStorage.getItem("userId"),
          adults: this.countAdult
        });
      }
      this.countTotalTravellers();
    }
  }

  /**
   * This method for adding child count at the traveller popup
   *
   */
  addChild() {
    this.countChild = this.countChild + 1;
    this.appStore.childCount = this.countChild;
    if (this.baseUrl == this.prodUrl) {
      window.analytics.track('adult count decresed', {
        portal: "B2B",
        user: localStorage.getItem("userTypeName"),
        userId: localStorage.getItem("userId"),
        child: this.countChild
      });
    }
    this.countTotalTravellers();
  }

  /**
   * This method for decreasing child count at the traveller popup
   *
   */
  minusChild() {
    if (this.countChild > 0) {
      this.countChild = this.countChild - 1;
      this.appStore.childCount = this.countChild;
      if (this.baseUrl == this.prodUrl) {
        window.analytics.track('child count decresed', {
          portal: "B2B",
          user: localStorage.getItem("userTypeName"),
          userId: localStorage.getItem("userId"),
          child: this.countChild
        });
      }
      this.countTotalTravellers();
    }
  }

  /**
     * This method for decreasing infant count at the traveller popup
     *
     */
  minusInfant() {
    if (this.countInfant > 0) {
      this.countInfant = this.countInfant - 1;
      this.appStore.infantCount = this.countInfant;
      if (this.baseUrl == this.prodUrl) {
        window.analytics.track('infant count added', {
          portal: "B2B",
          user: localStorage.getItem("userTypeName"),
          userId: localStorage.getItem("userId"),
          child: this.countInfant
        });
      }
      this.countTotalTravellers();
      this.removeVehicleType();
    }
  }

  /**
   * This method for adding infant count at the traveller popup
   *
   */
  addInfant() {
    this.countInfant = this.countInfant + 1;
    this.appStore.infantCount = this.countInfant;
    if (this.baseUrl == this.prodUrl) {
      window.analytics.track('infant count decresed', {
        portal: "B2B",
        user: localStorage.getItem("userTypeName"),
        userId: localStorage.getItem("userId"),
        child: this.countInfant
      });
    }
    this.countTotalTravellers();
    this.removeVehicleType();
  }

  /**
   * This method for enabling the go button
   *
   */
  enableGoButton() {
    this.goButtonEnable = true;
  }

  /**
   * This method for setting traveller count and steps for the create trip page
   *
   */
  goButtonClicked() {
    this.disableGoBttn = true;
    this.showSearchbttn();
    this.resetBooleans();
    try {
      (<HTMLElement>document.getElementById("dateEnterDiv")).style.maxHeight = "456px";
    } catch (ex) {

    }
    this.appStore.adultCount = this.countAdult;
    this.appStore.childCount = this.countChild;
    this.appStore.infantCount = this.countInfant;
    this.countTravalers = this.countAdult + this.countChild + this.countInfant;
    this.appStore.totalTravellers = this.countTravalers;
    this.steps = [];
    this.showhidebttn = true;
    this.goButtonEnable = true;
    var today = new Date();
    this.makkahmin = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    this.madeenaMin = this.makkahmin;
    this.madeenmin = this.makkahmin;
    this.madeenamax = this.makkahmin;
    if (this.enableMakka) {
      this.activateMakkaSearch = true;
      this.steps.push("1");
      this.appStore.stepsArray = this.steps;
    }
    if (this.enableMadina) {
      this.activateMadeenaSearch = true;
      this.steps.push("2");
      this.appStore.stepsArray = this.steps;
    }
    if (this.enableTransport) {
      this.activateTransportSearch = true;
      this.steps.push("3");
      this.appStore.stepsArray = this.steps;
      this.transportmin = new Date(this.today.getTime() - 1000 * 60 * 60 * 24);;
    }
    if (this.activaleAllSearch) {
      this.activateMadeenaSearch = true;
      this.activateMakkaSearch = true;
      this.activateTransportSearch = true;
      this.steps = ["1", "2", "3"];
      this.appStore.stepsArray = this.steps;
    }
    if (this.showhidebttn) {
      this.viewsearchbutton = true;
    }

    this.hidebttn = true;


  }

  /**
   * This method for hide all service items
   *
   */
  hideAllItems() {
    this.activateMadeenaSearch = false;
    this.activateMakkaSearch = false;
    this.activateTransportSearch = false;
    this.makkaCheckInDate = null;
    this.makkaCheckOutDate = null;
    this.madeenaCheckInDate = null;
    this.madeenaCheckOutDate = null;
    this.transportStartDate = null;
    this.viewsearchbutton = false;
    this.activateMakkaPromotion = false;
    this.activateMadeenaPromotion = false;

    if (this.hidebttn) {
      this.selectedItems = [];
      this.enableMakka = false;
      this.enableMadina = false;
      this.enableTransport = false;
      this.activaleAllSearch = false;
      this.hidebttn = false;
      this.routeready = false;
    }
  }

  resetDatesForRefresh() {
    if (this.service == 'All') { this.clearPreviousDataForFreshSearch() }
    if (this.service == 'Makkah Hotel') { this.makkaCheckInDate = null; this.makkaCheckOutDate = null }
    if (this.service == 'Medina Hotel') { this.madeenaCheckInDate = null; this.madeenaCheckOutDate = null }
  }


  /**
   * This method for show serch button when makkah date input changes
   *
   */
  dataChangedFromMakkaDates(event) {
    this.makkaCheckOutDate = null;
    this.madeenaCheckInDate = null;
    this.madeenaCheckOutDate = null;
    this.subPcc_makkah = null;
    this.promo_makkah_id = null;
    if (this.makkaCheckOutDate && this.makkaCheckInDate) {
      this.noOfDaysInMakkah = this.helperService.noOfDaysBetweenTwoDates(this.makkaCheckInDate, this.makkaCheckOutDate)
    }

    this.madeenaMin = this.makkaCheckOutDate;
    this.transportStartDate = this.makkaCheckInDate;
    this.madeenmin = new Date(
      this.makkaCheckInDate.getTime() + 1000 * 60 * 60 * 24
    );
    this.transportmin = this.makkaCheckInDate;
    this.transportmax = this.makkaCheckOutDate;
    this.activateMakkaPromotion = true;
    if (this.madeenaCheckInDate == null) {
      this.makkaOutDatePicker.nativeElement.click();
    }
    this.showSearchbttn();
  }

  /**
   * This method for show serch button when makkah date input changes
   *
   */
  dataChangedFromMakkaOutDates($event) {
    this.madeenaCheckInDate = null;
    this.madeenaCheckOutDate = null;
    this.setNoOfMakkaDays();
    this.madeenaMin = this.makkaCheckOutDate;
    this.madeenaCheckInDate = this.makkaCheckOutDate;
    this.madeenamax = new Date(
      this.madeenaCheckInDate.getTime() + 1000 * 60 * 60 * 24
    );
    this.showSearchbttn();
    if (this.activateMadeenaSearch && this.madeenaCheckOutDate == null) {
      this.madeenaOutPicker.nativeElement.click();
    }
  }

  setNoOfMakkaDays() {
    if (this.makkaCheckOutDate && this.makkaCheckInDate) {
      this.getSubPucc(this.makkaCheckInDate, this.makkaCheckOutDate, 'MAKKA')
      this.noOfDaysInMakkah = this.helperService.noOfDaysBetweenTwoDates(this.makkaCheckInDate, this.makkaCheckOutDate)
      this.appStore.noOfDaysInMakkah = this.noOfDaysInMakkah;
    }
  }

  /**
   * this method returns subPcc List for selected date
   *
   */
  getSubPucc(checkIn, checkOut, event) {
    this.subAgentApiService.getSubPccList(this.helperService.dateFormaterYMd(checkIn), this.helperService.dateFormaterYMd(checkOut),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(res => {
      var listArray: any = []
      listArray = res;
      if (event == 'MAKKA') {
        if (this.swapHotel) {
          this.subPccList = listArray.filter(res => res.location == 'madina')
          sessionStorage.setItem('makkaSubPccDropDown', JSON.stringify(this.subPccList))
        } else {
          this.subPccList = listArray.filter(res => res.location == 'makkah');
          sessionStorage.setItem('makkaSubPccDropDown', JSON.stringify(this.subPccList))
        }
      }
      else {
        if (this.swapHotel) {
          this.medinahSubPccList = listArray.filter(res => res.location == 'makkah')
          sessionStorage.setItem('madinaSubPccDropDown', JSON.stringify(this.medinahSubPccList))
        } else {
          this.medinahSubPccList = listArray.filter(res => res.location == 'madina')
          sessionStorage.setItem('madinaSubPccDropDown', JSON.stringify(this.medinahSubPccList))
        }

      }
    }, (err) => {

    })
  }

  /**
   * This method for show serch button when transport input changes
   *
   */
  dataChangedFromTransportDate($event) {
    this.showSearchbttn();
  }

  /**
  * This method for navigate to create trip page
  *
  */
  searchButtonClicked() {
    this.clearSession()
    sessionStorage.setItem('service', this.service)
    if(this.service == "Transport"){this.setPaxArray()}
    this.setNoOfMadeenaDays();
    this.appStore.showRoomAlPopup = false;
    if(sessionStorage && sessionStorage.getItem('paxArray')){
      this.paxArray = JSON.parse(sessionStorage.getItem('paxArray'));
    }else{
      this.setPaxArray();
    }
    if (this.swapHotel) {
      this.userObject = {
        swapHotel: true,
        travallersCount: this.paxArray.travallersCount?this.paxArray.travallersCount:2,
        adults: this.paxArray.adults,
        children: this.paxArray.children,
        infant: this.paxArray.infant,
        transportStartDate: this.helperService.dateFormaterMdy(this.transportStartDate),
        transportRoute: this.routetransport,
        madeenaCheckinDate: this.helperService.dateFormaterMdy(this.makkaCheckInDate),
        madeenaCheckoutDate: this.helperService.dateFormaterMdy(this.makkaCheckOutDate),
        makkahCheckinDate: this.helperService.dateFormaterMdy(this.madeenaCheckInDate),
        makkahCheckoutDate: this.helperService.dateFormaterMdy(this.madeenaCheckOutDate),
        subPcc_makkah: this.subPcc_medinah,
        subPcc_medinah: this.subPcc_makkah,
        specialCodeMedinah: this.special_code_makkah,
        specialCodeMakkah: this.special_code_medinah,
        vehicleCapacity: this.vehicleMaxCapacity,
        noOfDaysInMadeenah: this.noOfDaysInMadeenah,
        noOfDaysInMakkah: this.noOfDaysInMakkah,
        vehicleCounts: this.vehicleCount,
        makka_subpcc_hotel_code: this.promo_madeena_id,
        madeena_subpcc_hotel_code: this.promo_makkah_id
      };
    } else {
      this.userObject = {
        swapHotel: false,
        travallersCount: this.paxArray?this.paxArray.travallersCount:2,
        adults: this.paxArray.adults,
        children: this.paxArray.children,
        infant: this.paxArray.infant,
        transportStartDate: this.helperService.dateFormaterMdy(this.transportStartDate),
        transportRoute: this.routetransport,
        madeenaCheckinDate: this.helperService.dateFormaterMdy(this.madeenaCheckInDate),
        madeenaCheckoutDate: this.helperService.dateFormaterMdy(this.madeenaCheckOutDate),
        makkahCheckinDate: this.helperService.dateFormaterMdy(this.makkaCheckInDate),
        makkahCheckoutDate: this.helperService.dateFormaterMdy(this.makkaCheckOutDate),
        subPcc_makkah: this.subPcc_makkah,
        subPcc_medinah: this.subPcc_medinah,
        specialCodeMedinah: this.special_code_medinah,
        specialCodeMakkah: this.special_code_makkah,
        vehicleCapacity: this.vehicleMaxCapacity,
        noOfDaysInMadeenah: this.noOfDaysInMadeenah,
        noOfDaysInMakkah: this.noOfDaysInMakkah,
        vehicleCounts: this.vehicleCount,
        makka_subpcc_hotel_code: this.promo_makkah_id,
        madeena_subpcc_hotel_code: this.promo_madeena_id
      };
    }
    CreateTripComponent.UserObjectData = this.userObject;
    sessionStorage.setItem("userObject", JSON.stringify(this.userObject));
    sessionStorage.setItem("roomData", JSON.stringify(this.paxArray.rooms));
    this.router.navigate(["subagent/createTrip"], {
      queryParams: { steps: this.steps.join(","), tripId: 0 },
    });
    this.dataForPopUp.steps = this.steps;
    this.dataForPopUp.user = this.userObject;
  }

  clearSession() {
    sessionStorage.removeItem('specialCode');
    sessionStorage.removeItem('promoCode');
    sessionStorage.removeItem('userObject');
    sessionStorage.setItem('stage', '0');
    sessionStorage.removeItem('hotelDetailsFlag');
    sessionStorage.removeItem('mdSearchId');
    sessionStorage.removeItem('mkSearchId');
    sessionStorage.removeItem('custome_trip_booking_id');
    sessionStorage.removeItem('custom_trip_id');
    sessionStorage.removeItem('roomData');
    sessionStorage.removeItem('hotelData');
    sessionStorage.removeItem('hotelInfo');
    sessionStorage.removeItem('steps');
  }

  /**
  * This method for show serch button when route input changes
  *
  */
  onRouteSelect(item: any) {
    this.routetransport = item;
  }

  /**
   * This method for show/hide search button
   *
   */
  onVehicleSelect(id: any) {
    if (id != null && this.vehicleTypeList && this.vehicleTypeList.length > 0) {
      this.vehicleTypeList.forEach(element => {
        if (element.id == id) {
          this.vehicleCode = element.code;
          this.vehicleMaxCapacity = element.max_capacity;
        }
      });
    }
    this.setBoolean = true;
    var totalTra = this.countAdult + this.countChild;
    var count: number = totalTra / this.vehicleMaxCapacity;
    count = Math.ceil(count);
    if (count <= this.countAdult) {
      this.countArray = Array(this.countAdult - count + 1).fill(count + 1).map((_, idx) => count + idx)
      this.vehicleCount = this.countArray[0];
      this.showSearchbttn();
    } else {
      this.notifyService.showWarning(this.translate.instant("Passenger limit exceeded. Please select heavy vehicle."));
      this.removeVehicleType();
    }
  }

  vehicleCountSelect(value) {
    this.vehicleCount = value;
  }

  /**
   * This method for show/hide search button
   *
   */
  showSearchbttn() {
    if (this.service == 'All') {
      if (
        this.makkaCheckInDate &&
        this.makkaCheckOutDate &&
        this.madeenaCheckInDate &&
        this.madeenaCheckOutDate &&
        this.routetransport &&
        this.transportStartDate
      ) {
        this.enableSearchButton = true;
        return;
      } else {
        this.enableSearchButton = false;
        return;
      }
    }

    if (this.service == 'Makkah Hotel') {
      if (this.makkaCheckInDate && this.makkaCheckOutDate) {
        this.enableSearchButton = true;
        return;
      } else {
        this.enableSearchButton = false;
        return;
      }
    }

    if (this.service == 'Medina Hotel') {
      if (this.madeenaCheckInDate && this.madeenaCheckOutDate) {
        this.enableSearchButton = true;
        return;
      } else {
        this.enableSearchButton = false;
        return;
      }
    }

    if (this.service == 'Transport') {
      if (this.transportStartDate && this.routetransport) {
        this.enableSearchButton = true;
        return;
      } else {
        this.enableSearchButton = false;
        return;
      }
    }
  }

  ngAfterViewChecked() {
    this.translate.use((sessionStorage.getItem('userLanguage') === 'ar-AE') ? "ar-AE" : sessionStorage.getItem('userLanguage'));
    if (sessionStorage.getItem('userLanguage') == "ar-AE" || sessionStorage.getItem('userLanguage') == "ur-UR") {
      (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
    } else {
      (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    }
  }

  showSelectionPopup() {
    this.showSelectionPopUp = !this.showSelectionPopUp;
  }

  /**
  * This method for reset selected values if madeena start date changes
  *
  */

  dataChangedFromMadeenaDates(position: string) {
    this.madeenaMindate = this.madeenaCheckInDate;
    this.madeenaMaxdate = this.madeenaCheckOutDate;
    this.subPcc_medinah = null;
    this.promo_madeena_id = null;
    this.setNoOfMadeenaDays()
    this.madeenamax = new Date(
      this.madeenaCheckInDate.getTime() + 1000 * 60 * 60 * 24
    );
    this.activateMadeenaPromotion = true;
    if (position == "in") {
      this.madeenaCheckOutDate = null;
      if (this.madeenaCheckOutDate == null) {
        this.madeenaOutPicker.nativeElement.click();
      }
    }
    this.showSearchbttn();
  }

  //log
  /**
   * This method for calculate madeena days
   *
   */

  setNoOfMadeenaDays() {
    if (this.madeenaCheckInDate && this.madeenaCheckOutDate) {
      this.getSubPucc(this.madeenaCheckInDate, this.madeenaCheckOutDate, 'MADINA')
      this.noOfDaysInMadeenah = this.helperService.noOfDaysBetweenTwoDates(this.madeenaCheckInDate, this.madeenaCheckOutDate)
      this.appStore.noOfDaysInMadeena = this.noOfDaysInMadeenah;
    }
  }



  /**
   * This method for resetting selected values if service input changes
   *
   */

  onServiceItemChange(value, check: boolean) {
    this.activateMakkaSearch = false;
    this.activateMadeenaSearch = false;
    this.activateTransportSearch = false;
    this.recentSearch = false;
    this.service = value;
    this.clearPreviousDataForFreshSearch();
    sessionStorage.setItem('service', this.service)
    if (value == "All") {
      this.activaleAllSearch = true;
      this.enableMakka = true;
      this.enableMadina = true;
      this.enableTransport = true;
      this.goButtonEnable = false;
      this.bookingRequests = false;
    }
    if (value == "Makkah Hotel") {
      this.enableMakka = true;
      this.enableMadina = false;
      this.enableTransport = false;
      this.goButtonEnable = false;
      this.bookingRequests = false;
    }
    if (value == "Medina Hotel") {
      this.enableMadina = true;
      this.enableMakka = false;
      this.enableTransport = false;
      this.goButtonEnable = false;
      this.bookingRequests = false;
    }
    if (value == "Transport") {
      this.enableTransport = true;
      this.enableMakka = false;
      this.enableMadina = false;
      this.goButtonEnable = false;
      this.bookingRequests = false;
    }
    if (value == "Recent Booking") {
      this.enableTransport = false;
      this.enableMakka = false;
      this.enableMadina = false;
      this.recentSearch = true;
      this.goButtonEnable = false;
      this.bookingRequests = false;
    }
    if (value == "Booking Request") {
      this.enableTransport = false;
      this.enableMakka = false;
      this.enableMadina = false;
      this.recentSearch = false;
      this.goButtonEnable = false;
      this.bookingRequests = true;
    }
    if (check) {
      this.disableGoBttn = false;
    }
    if (value != 'Recent Booking') {
      this.goButtonClicked();
    }
  }
  onServiceItemChangeRefresh(value, check: boolean) {
    this.activateMakkaSearch = false;
    this.activateMadeenaSearch = false;
    this.activateTransportSearch = false;
    this.recentSearch = false;
    this.service = value;
    sessionStorage.setItem('service', this.service)
    if (value == "All") {
      this.activaleAllSearch = true;
      this.enableMakka = true;
      this.enableMadina = true;
      this.enableTransport = true;
      this.goButtonEnable = false;
      this.bookingRequests = false;
    }
    if (value == "Makkah Hotel") {
      this.enableMakka = true;
      this.enableMadina = false;
      this.enableTransport = false;
      this.goButtonEnable = false;
      this.bookingRequests = false;
    }
    if (value == "Medina Hotel") {
      this.enableMadina = true;
      this.enableMakka = false;
      this.enableTransport = false;
      this.goButtonEnable = false;
      this.bookingRequests = false;
    }
    if (value == "Transport") {
      this.enableTransport = true;
      this.enableMakka = false;
      this.enableMadina = false;
      this.goButtonEnable = false;
      this.bookingRequests = false;
    }
    if (value == "Recent Booking") {
      this.enableTransport = false;
      this.enableMakka = false;
      this.enableMadina = false;
      this.recentSearch = true;
      this.goButtonEnable = false;
      this.bookingRequests = false;
    }
    if (value == "Booking Request") {
      this.enableTransport = false;
      this.enableMakka = false;
      this.enableMadina = false;
      this.recentSearch = false;
      this.goButtonEnable = false;
      this.bookingRequests = true;
    }
    if (check) {
      this.disableGoBttn = false;
    }
    if (value != 'Recent Booking') {
      this.goButtonClicked();
    }
  }


  /**
   * This method for clearing booleans
   */

  resetBooleans() {
    if (this.activateMakkaSearch) {
      this.activateMakkaSearch = false;
    }
    if (this.activaleAllSearch) {
      this.activaleAllSearch = false;
    }
    if (this.activateTransportSearch) {
      this.activateTransportSearch = false;
    }
    if (this.activateMadeenaSearch) {
      this.activateMadeenaSearch = false;
    }
  }

  /**
   * This method for clearing prvious data
   */

  clearPreviousDataForFreshSearch() {
    this.makkaCheckInDate = null
    this.makkaCheckOutDate = null;
    this.subPcc_makkah = null;
    this.madeenaCheckInDate = null;
    this.madeenaCheckOutDate = null;
    this.subPcc_medinah = null;
    this.special_code_medinah = null;
    this.special_code_makkah = null;
    this.transportStartDate = null;
    this.appStore.stepperIndex = 0;
    this.appStore.noOfDaysInMadeena = 0;
    this.appStore.noOfDaysInMakkah = 0;
    this.noOfDaysInMakkah = 0;
    this.noOfDaysInMadeenah = 0;
    this.appStore.isAvailabilityFails = false;
  }

  /**
   * this method for listing recent booking
   */

  listRecentBooking() {
    this.subAgentApiService.getPaginatedhistoryList(1, sessionStorage.getItem('userLanguage')).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.historyList = data.results;
      this.length = this.historyList.length
    })
  }

  /**
  * this method for checking model status
  */
  ngDoCheck() {
    this.currency = HedderComponent.globelCurrency;
    if (this.appStore.showRoomAlPopup) {
      this.showRoomAllocationPopup = true;
    } else if (!this.appStore.showRoomAlPopup) {
      this.showRoomAllocationPopup = false;
    }
    if( sessionStorage &&  sessionStorage.getItem("searchActive") && sessionStorage.getItem("searchActive") == "false"){
      this.allocationBoolean = false
    }else{
      this.allocationBoolean = true
    }
    this.checkSearchButtonStatus()
  }

  // checkSearchButtonStatus(){
  //   if(sessionStorage && sessionStorage.getItem("paxArray")){
  //     const pax = JSON.parse(sessionStorage.getItem('paxArray'));
  //     this.countAdult = pax.adults;
  //     this.countChild = pax.children;
  //     this.countInfant = pax.infants;
  //   }
  //   if(this.service == "Transport" && this.vehicleCount >  (this.countAdult + this.countChild + this.countInfant)){
  //     this.enableSearchButton = false
  //   }else if(this.service == "Transport" && this.transportStartDate == undefined){
  //     this.enableSearchButton = false
  //   }
  //   else if(this.service == "Transport" && this.transportStartDate && this.vehicleCount <=  (this.countAdult + this.countChild + this.countInfant)){
  //     this.enableSearchButton = true
  //   }
  //   else if(this.service == "Makkah Hotel" && this.makkaCheckInDate && this.makkaCheckOutDate){
  //     this.enableSearchButton = true
  //   }
  //   else if(this.service == "Medina Hotel" && this.madeenaCheckInDate && this.madeenaCheckOutDate){
  //     this.enableSearchButton = true
  //   }
  //   else if(this.service == "All" && this.madeenaCheckInDate && this.madeenaCheckOutDate && this.makkaCheckInDate && this.makkaCheckOutDate
  //   && this.vehicleCount <=  (this.countAdult + this.countChild + this.countInfant)){
  //     this.enableSearchButton = true
  //   }
  //   else if(this.service == "All"  && this.vehicleCount >  (this.countAdult + this.countChild + this.countInfant) ){
  //     this.enableSearchButton = false
  //   }
  // }

  vehicleCountChanged(event){
    this.vehicleCount = +event.target.value;
  }

  checkSearchButtonStatus(){
    if(sessionStorage && sessionStorage.getItem("paxArray")){
      const pax = JSON.parse(sessionStorage.getItem('paxArray'));
      this.countAdult = pax.adults ? pax.adults : 0;
      this.countChild = pax.children ? pax.children : 0;
      this.countInfant = pax.infants ? pax.infants : 0;
    }
    if(this.countAdult == 0 ){
      this.enableSearchButton = false
    }else{
      if(this.service == "Transport" && this.vehicleCount >  (this.countAdult + this.countChild + this.countInfant)){
        this.enableSearchButton = false
      }else if(this.service == "Transport" && this.transportStartDate == undefined ){
        this.enableSearchButton = false
      }
      else if(this.service == "Transport" && this.vehicleCount == 0){
        this.enableSearchButton = false
      }
      else if(this.service == "Transport" && this.vehicleCount == null){
        this.enableSearchButton = false
      }
      else if(this.service == "All" && this.vehicleCount == null){
        this.enableSearchButton = false;
      }
      else if(this.service == "All" && this.vehicleCount == 0){
        this.enableSearchButton = false;
      }
      else if(this.service == "Transport" && this.transportStartDate && this.vehicleCount == 0){
        this.enableSearchButton = false
      }
      else if(this.service == "Transport" && this.transportStartDate && this.vehicleCount <=  (this.countAdult + this.countChild + this.countInfant)){
        this.enableSearchButton = true
      }
      else if(this.service == "Makkah Hotel" && this.makkaCheckInDate && this.makkaCheckOutDate){
        this.enableSearchButton = true
      }
      else if(this.service == "Medina Hotel" && this.madeenaCheckInDate && this.madeenaCheckOutDate){
        this.enableSearchButton = true
      }
      else if(this.service == "All" && this.madeenaCheckInDate && this.madeenaCheckOutDate && this.makkaCheckInDate && this.makkaCheckOutDate
      && this.vehicleCount != 0 && this.vehicleCount <=  (this.countAdult + this.countChild + this.countInfant)){
        this.enableSearchButton = true
      }
      else if(this.service == "All"  && this.vehicleCount >  (this.countAdult + this.countChild + this.countInfant) ){
        this.enableSearchButton = false
      }
    }
  }
  enableSearchBttn(){
    if(!this.allocationBoolean && this.enableSearchButton){
      return true
    }else{
      return false
    }
    return false;
  }

  /**
  * navigate history page
  */
  navigateHostory() {
    this.router.navigate(["subagent/history"]);
  }

  navigateSubPcc() {
    this.router.navigate(["subagent/SubPccListing"]);
  }

  makkahSubPccSelect(item) {
    this.subPcc_makkah = item.sub_pcc;
    this.promo_makkah_id = item.hotel_code;
  }

  madeenaSubPccSelect(item) {
    this.subPcc_medinah = item.sub_pcc;
    this.promo_madeena_id = item.hotel_code;
  }

  swapHotels() {
    this.getSubPucc(this.makkaCheckInDate, this.makkaCheckOutDate, 'MAKKA')
    this.getSubPucc(this.madeenaCheckInDate, this.madeenaCheckOutDate, 'MADINA')
    this.activeAnimation = true;
    this.swapHotel = !this.swapHotel;
    this.subPcc_makkah = null;
    this.promo_makkah_id = null;
    this.subPcc_medinah = null;
    this.promo_madeena_id = null;
  }

  currencyConversion(amount){
    return this.subagentHelper.currencyCalculation(amount)
  }

  selectMonthForFetchReport(event){
    this.fetchCurrentSalesReport(event.target.value)
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }

}