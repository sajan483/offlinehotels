import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewChecked, ElementRef, Renderer2, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, SelectControlValueAccessor, } from "@angular/forms";
import { MAT_STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Room } from "../../../../models/visaTypes";
import { MatStepper } from "@angular/material/stepper";
import { Router, ActivatedRoute } from "@angular/router";
import { AppStore } from '../../../../stores/app.store';
import { NgxSpinnerService } from "ngx-spinner";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { NotificationService } from "../../../../common/services/notification.service";
import { HttpClient } from '@angular/common/http';
import { DoCheck } from "@angular/core";
import { HelperService } from "src/app/common/services/helper-service";
import { MakkaHotelComponent } from "./components/makka-hotel/makka-hotel.component";
import { CreateTripAdapter } from "src/app/adapters/sub-agent/create-trip-adapter";
import { CreateTripHelper } from "src/app/helpers/sub-agent/create-trip-helpers";
import { GeneralHelper } from "src/app/helpers/General/general-helpers";
import { SubAgentApiService } from "src/app/Services/sub-agent-api-services";
import { CommonApiService } from "src/app/Services/common-api-services";
import { environment } from "src/environments/environment";
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { Subject, Subscription, timer } from "rxjs";
import { SegmentService } from "ngx-segment-analytics";
import { DomSanitizer } from "@angular/platform-browser";
import { HedderComponent } from "src/app/common/components/hedder/hedder.component";
import { DateTimeToDateFormat } from "src/app/helpers/date_time/date_pipe";
import { takeUntil } from "rxjs/operators";
import { SubAgentFrmAdapter } from "src/app/adapters/sub-agent/sub-agent-form-adapter";
import { SubAgentFormService } from "src/app/Services/sub-agent-form/sub-agent-form-service";

@Component({
  selector: "app-create-trip",
  templateUrl: "./create-trip.component.html",
  styleUrls: ["./create-trip.component.scss"],
  providers: [
    {
      provide: MAT_STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    }
  ],
  encapsulation: ViewEncapsulation.None,
})

export class CreateTripComponent implements OnInit, AfterViewChecked, DoCheck,OnDestroy {
  readonly:boolean = true;
  disableModifyTransportBttn:boolean;
  static termsCondtion: boolean;
  static termsConditionArabic: boolean;
  policy:boolean = false;
  countryCodeReq:any = '966';
  showtransportsearch: boolean = true;
  static UserObjectData: any;
  static RoomData: any;
  userDetails: any;
  roomDetails: any;
  roomdetails: boolean = false;
  paymentForm: FormGroup;
  step = 0;
  imageshow: number = 0;
  time = { hour: 13, minute: 30 };
  meridian = true;
  tripData: any;
  selectedTransport: any;
  makkatransport: boolean = false;
  grountService: boolean = false;
  totalRoomPrice: number = 0;
  selectedTravellersCount: number = 0;
  selectedRoomCount: number = 0;
  tripMakkahHotel: any;
  tripMakkahHotelrating: any;
  tripService: any;
  tripVisaData: any;
  tripMadeenaHotel: any;
  tripTransport: any;
  selectedRoomGroups: any[];
  isGrouped: any;
  noOfDaysInMadeena: number = 0;
  makkahticked: boolean = false;
  madeendetailshow: boolean = false;
  searchTransport: boolean;
  mdate: any;
  stage
  searchServiceButtonActive: boolean;
  bookingId: any;
  setDataForAddServiceCountPopUP: any = {};
  addSrvCount: number = 0;
  totalTravellers: any;
  acc_no: any;
  isSameDate:boolean = false;
  accNo: any;
  authCode: any;
  phoneCode: any;
  reference_no: any;
  makka: boolean = true;
  medinah: boolean = true;
  trnsprt: boolean = true;
  city: string = "";
  private destroy$ = new Subject();
  hotelsList: any;
  makkahCheckInDate: any;
  makkahCheckOutDate: any;
  madeenaCheckInDate: any;
  madeenaCheckOutDate: any;
  transportStartDate: any;
  companylistall: any;
  isTransportResponseEmpty: boolean = false;
  cityFirst: string = "";
  citySecond: string = "";
  transportFailed: string = "";
  bookContinue: boolean;
  minpassportExpDate: any;
  showIbanPopup: boolean = false;
  disablePayBttn: boolean = true;
  transportCount: number = 0;
  modifySearchTransportPopup: boolean;
  vehicleTypes: any;
  ibanValidation: boolean = false;
  ibanMessge: string;
  transportRepeater: any;
  hotelListSubscription: Subscription;
  hotelSearchSubscription: Subscription;
  transportSearchSubscription: Subscription;
  showShimmerTransport: boolean = false;
  policyArabic: boolean;
  userData: any;
  showTransportOptionCard: boolean;
  transportOptions: any[];
  userOption: string = "";
  swapHotel: boolean;
  params: any;
  baseUrl: string="";
  prodUrl: string = environment.prodUrl;
  showLinkPopup: boolean = false;
  callB2bLink:boolean = true;
  activateCreateLinkBtn:boolean = false;
  phoneNumber: string = "";
  b2bLink: any;
  tagName: any[]=[];
  isLinkReady: boolean;
  mobileNumber:string = "";
  phone_error: boolean = false;
  b2bWhtLnk: string;
  b2bUrl: any;
  shareLinkBtnActiv:boolean = false;
  lengthAuthCode: boolean;
  paymentPopupValue: any;
  currency: any;
  paymentPopupDetailsPolicyShow: boolean;
  paymentHotelData: any;
  paymentTransportData: any;
  ibanNumberList: any[] = [];
  timeToCallApi: number;
  ibanTagName: any;
  saveBttnActive: boolean;
  moreOptionView: boolean = false;
  deepLinkStatus: string = "";
  hotelListTimer: number = 3000;
  hotelListCounter: number = 40;
  currentCity: string = "";
  searchId: any = "";
  hotelSearchCounter: number = 40;
  pendingApiTimer = environment.pendingApiTime;
  hotelSearchResponse: boolean = false;
  hotelListResponse: boolean = false;
  transportResponse: boolean;
  getTripResponse: boolean;
  getTripSubscription: Subscription;
  getTripDeepResponse: boolean;
  deepSubScription: Subscription;
  hotelSearchRepeater: any;
  hotelListRepeater: any;
  agencyNumberList: any[]=[];
  serviceList: any[] = [];
  disableShareBtn: boolean;
  disableTimerFunction: any;
  hotelSearchtimer: boolean = false;
  disableHotelListTimer: boolean;
  trnStartDate: number;
  currentDate: number;


  toggleMeridian() {
    this.meridian = !this.meridian;
  }
  showElement: boolean = true;
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + "k";
    }
    return value;
  }
  private createTripAdapter: CreateTripAdapter = new CreateTripAdapter(this.helperService, this.dateForm);
  returnDate: any;
  private createTripHelper: CreateTripHelper = new CreateTripHelper(this.helperService,this.translate,this.dateForm);
  private helper: HelperService = new HelperService(null);
  retDate: any;
  routeId: any;
  categoryId: any;
  hotelMakkahFare: any;
  hotelMadeenaFare: any;
  transportFare: any;
  additionlserviceId: any;
  additionl_serviceId: any;
  vehicleId: any;
  vehicleMax: any;
  nationalityCode: any;
  diffDays: any;
  searchTransportId: any;
  selectedCurrency: any;
  selectedLanguage: any;
  dropdownList = [];
  dropdownSettings: IDropdownSettings = {};
  vehicleTypeList = [];
  vehicleTypeItems = [];
  routeList = [];
  companyList = [];
  countryList = [];
  nationalityList = [];
  categoryIds = [];
  selectedHotel: any;
  selectedCountry: any;
  selectedNationality: any;
  transportList: any[] = [];
  transportReserveList: any[] = [];
  toggle = [];
  disableBtn: boolean = false;
  count: number = 1;
  showAddButton: boolean = true;
  showMadenaTransportVehicleList: boolean = false;
  displayTab: boolean;
  changeButton: boolean;
  submitted = false;
  vehicleCount: number;
  today = new Date().toJSON().split("T")[0];
  roomCount: number = 0;
  countadult: number = 1;
  countchild: number = 0;
  countinfa: number = 0;
  displayTabtravel: boolean;
  @ViewChild("menuIconClass", { read: ElementRef, static: false })
  menuIconClass: ElementRef;
  @ViewChild("menuPopupClass", { read: ElementRef, static: false })
  menuPopupClass: ElementRef;
  rooms: any[] = [];
  phoneCodeList: any;
  @ViewChild("menuIcon", { read: ElementRef, static: false })
  menuIcon: ElementRef;
  @ViewChild("menuPopup", { read: ElementRef, static: false })
  menuPopup: ElementRef;
  @ViewChild("menuIconTo", { read: ElementRef, static: false })
  menuIconTo: ElementRef;
  @ViewChild("menuPopupTo", { read: ElementRef, static: false })
  menuPopupTo: ElementRef;
  tripId: any;
  travellersCount: number;
  infantCount: number = 0;
  adultCount: number = 1;
  childCount: number = 0;
  steps = [];
  timeLeft: number = 30;
  interval;
  showShimmer: boolean;
  noOfDaysInMakkah: number;
  generalHelper: GeneralHelper;
  commonApiService: CommonApiService;
  travellersForm: FormGroup  = new FormGroup({});
  private formAdapter:SubAgentFrmAdapter = new SubAgentFrmAdapter(this.fb)
  @ViewChild('phoneInput', { read: ElementRef, static: false })
  phoneInput: ElementRef;
  showTransportShimmer:boolean = true;
  freeArray = ["1","2","3","4"];
  countArray:number[] = [1];
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  private transportListSubScription : Subscription;
  userOptionBtn : boolean = false;
  roomCollection:any[] = [];
  transportListResponse: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer2: Renderer2,
    private common: SubAgentApiService,
    private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private http: HttpClient,
    private appStore: AppStore,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private notifyService: NotificationService,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private genHelper: GeneralHelper,
    private _commonApiService: CommonApiService,
    private translate: TranslateService,
    private segment:SegmentService,
    private dom :DomSanitizer,
    private dateForm:DateTimeToDateFormat,
    private formService:SubAgentFormService
  ) {
    this.generalHelper = genHelper;
    this.commonApiService = _commonApiService;
    this.renderer2.listen("window", "click", (e: Event) => {
      if (
        (this.menuPopup && this.menuPopup.nativeElement.contains(e.target)) ||
        (this.menuIcon && this.menuIcon.nativeElement.contains(e.target))
      ) {
        // Clicked inside plus preventing click on icon
      } else {
        // Clicked  outside
      }
    });
    this.renderer2.listen("window", "click", (e: Event) => {
      if (
        (this.menuPopupTo &&
          this.menuPopupTo.nativeElement.contains(e.target)) ||
        (this.menuIconTo && this.menuIconTo.nativeElement.contains(e.target))
      ) {
        // Clicked inside plus preventing click on icon
      } else {
        // Clicked outside
      }
    });
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
    this.paymentForm = this.formBuilder.group({
      roomAdultsArray: this.formBuilder.array([]),
      roomChildrenArray: this.formBuilder.array([])
    });
  }

  @ViewChild("stepper", { static: true })
  stepper: MatStepper;
  move(index: number) { this.stepper.selectedIndex = index; }
  @ViewChild(MakkaHotelComponent, { static: false }) child: MakkaHotelComponent;

  userFilter: any = { name: '' };

  /**
   * Method to minify makka card at payment review page
   */
  toggleMakkaUp() {
    (<HTMLElement>document.getElementById("makka")).style.display = "none";
    this.makka = !this.makka;
  }

  /**
   * Method to expand makka card at payment review page
   */
  toggleMakkaDown() {
    (<HTMLElement>document.getElementById("makka")).style.display = "block";
    this.makka = !this.makka;
  }

  /**
  * Method to expand medinah card at payment review page
  */
  toggleMedinahDown() {
    (<HTMLElement>document.getElementById("medinah")).style.display = "block";
    this.medinah = !this.medinah;
  }

  /**
  * Method to minify medinah card at payment review page
  */
  toggleMedinahUp() {
    (<HTMLElement>document.getElementById("medinah")).style.display = "none";
    this.medinah = !this.medinah;
  }

  /**
  * Method to minify transport card at payment review page
  */
  toggleTransportUp() {
    (<HTMLElement>document.getElementById("transport")).style.display = "none";
    (<HTMLElement>document.getElementById("transportRate")).style.display = "none";
    (<HTMLElement>document.getElementById("transportPolicy")).style.display = "none";
    (<HTMLElement>document.getElementById("trnsptNormal")).style.display = "none";
    this.trnsprt = !this.trnsprt;
  }

  /**
  * Method to expand transport card at payment review page
  */
  toggleTransportDown() {
    (<HTMLElement>document.getElementById("transport")).style.display = "block";
    (<HTMLElement>document.getElementById("transportPolicy")).style.display = "block";
    (<HTMLElement>document.getElementById("transportRate")).style.display = "block";
    (<HTMLElement>document.getElementById("trnsptNormal")).style.display = "block";
    this.trnsprt = !this.trnsprt;
  }

  ngAfterViewChecked() {
    this.selectedCurrency = this.appStore.currencyCode;
    this.selectedLanguage = this.appStore.langCode;
    this.translate.use((sessionStorage.getItem('userLanguage') === 'ar-AE') ? "ar-AE" : sessionStorage.getItem('userLanguage'));
    if (sessionStorage.getItem('userLanguage') == "ar-AE" || sessionStorage.getItem('userLanguage') == "ur-UR") {
      (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
    } else {
      (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    }
    if (this.selectedCountry) {
      let selectedResidenceText = (document.getElementById("cor").getElementsByClassName("mat-select-value-text")[0].getElementsByClassName("ng-star-inserted")[0]).innerHTML;
      this.phoneCode = this.phoneCodeList.filter(x => x.item_text == selectedResidenceText)[0].item_id;
    }

  }

  modfyTransportSearch(){
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('transport modify search clicked',{
        user:localStorage.getItem("userTypeName"),
        userId:localStorage.getItem("userId"),
       portal:"B2B"
     });
    }
    this.modifySearchTransportPopup = false;
    this.transportRepeater ? this.transportRepeater.unsubscribe() : null;
    this.transportListSubScription ? this.transportListSubScription.unsubscribe() : null;
    this.transportSearchSubscription ? this.transportSearchSubscription.unsubscribe() : null;
    this.transportSearch();
  }

  transportSearchPop(){
    this.modifySearchTransportPopup = true;
  }
  /**
 * Method to fetch transport list
 */
  transportSearch() {
    this.submitted = true;
    this.showTransportOptionCard = false;
    this.showShimmerTransport = true;
    this.transportList = [];
    this.transportReserveList = [];
    this.transportSearchDatas();
    var obj = JSON.parse(sessionStorage.getItem("userObject"));
    obj.vehicleCounts = this.vehicleCount
    sessionStorage.setItem("userObject",JSON.stringify(obj))
    this.travellersCount = obj.adults + obj.children;
    this.setTimerForTransportSearchApiIsPendingForMorethan30Seconds()
    this.transportResponse = false;
    const date = this.helperService.dateFormaterMdy(this.userDetails.transportStartDate);
    const filrerData = {
      "search_id": this.searchTransportId,
      "lang": sessionStorage.getItem('userLanguage'),
      "route": this.routeId,
      "category": this.categoryId,
      "no_of_travellers": this.travellersCount,
      "quantity": this.vehicleCount,
      "travel_date": date.split("/")[2] + "-" + date.split("/")[0] + "-" + date.split("/")[1]
    }
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('transport searching',{
        user:localStorage.getItem("userTypeName"),
        userId:localStorage.getItem("userId"),
       portal:"B2B",
       body:filrerData
     });
    }
    this.transportSearchSubscription = this.common.searchTransport(filrerData,sessionStorage.getItem('userLanguage'),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.transportResponse = true;
      this.searchTransportId = data.search_id;
      if (data.results && data.results.length > 0){
        if(this.baseUrl  == this.prodUrl){
          window.analytics.track('transport searching',{
            user:localStorage.getItem("userTypeName"),
            userId:localStorage.getItem("userId"),
           portal:"B2B",
           apiStatus:"transport cache avilable"
         });
        }
         this.transportList = data.results;
         this.transportList.forEach(x=>x.fromCache = true)
         if (data.results.length > 0 && data.results.filter(x => x.vehicle_types.length > 0).length > 0){
          this.showShimmerTransport = false;
        }
         if(this.transportList && this.transportList[0].vehicle_types){
          data.results.forEach(x=> x.vehicle_types.forEach(y=>{
            y.company_code = x.company_code,y.company_name = x.company_name,
            y.policies = x.policies,y.cancellation_policy = x.cancellation_policy,
            y.price = y.categories[0].fare_summary[2].amount
          }))
         let q = data.results.map(x=>x.vehicle_types)
         this.transportList = q.concat.apply([],q).sort((a,b) =>(a.price) - (b.price))
          this.transportList.forEach(x=>{x.active = true,x.fromCache = true})
         }
      }
      this.steps = JSON.parse(sessionStorage.getItem('steps'))
      if (this.steps && this.steps.length > 2) { this.stage = 2 }
      sessionStorage.setItem("transportSearchId", data.search_id);
      this.callTransportList()
    }, error => {
      this.transportResponse = true;
      if(this.baseUrl  == this.prodUrl){
        window.analytics.track('transport searching',{
          user:localStorage.getItem("userTypeName"),
          userId:localStorage.getItem("userId"),
         portal:"B2B",
         apiStatus:"failed"
       });
      }
      this.showShimmerTransport = false;
      Swal.fire({
        text: this.translate.instant('Sorry,we could not find transport service from Maqam GDS'),
        icon: "warning",
        confirmButtonText: this.translate.instant('Modify Search'),
        showCloseButton: true,
      }).then((willDelete) => {
        if(willDelete.isConfirmed){
          this.modifySearchTransportPopup = true;
        }
    });
    }
    );
  }

  setTimerForTransportSearchApiIsPendingForMorethan30Seconds(){
    timer(this.pendingApiTimer).pipe(takeUntil(this.destroy$)).subscribe(x => {
        if(!this.transportResponse){
        if(this.transportSearchSubscription != null && !this.transportSearchSubscription != undefined){
           this.transportSearchSubscription.unsubscribe();
      }
        Swal.fire({
          icon: 'error',
          text: this.translate.instant("It seems like server busy from Maqam-GDS."),
          confirmButtonText: this.translate.instant('Try Again')
        }).then((result) => {
          this.transportSearch()
        })
      }
    });
  }

  tcount:any = 0;
  callTransportList(){
    this.setTimerForTransportListApiIsPendingForMorethan30Seconds();
    this.transportListResponse = false;
    this.transportListSubScription = this.common.searchTransportList(this.searchTransportId, this.selectedCurrency,sessionStorage.getItem('userLanguage'),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.transportListResponse = true;
      if ((response && response.transportations && response.transportations.length == 0)
        || (response && response.transportations && response.transportations.filter(x => x.vehicle_types.length > 0) == 0
        || response && response.status_code == 202)) {
          this.transportListResponse = true;
           if(response && response.transportations && response.transportations.length == 0){
             if(this.tcount < 2){
               this.setTimerForTransportSearch();this.tcount++
             }
             else {
              Swal.fire({
                text: this.translate.instant('Sorry, Transport Service not available on this date'),
                  icon: "warning",
                  confirmButtonText: this.translate.instant('Please, Change Date and try again'),
                }).then((result) => {
                  if(result.isConfirmed) this.router.navigate(['/subagent/home'])
              });
             }
           }
          if(response.transportations[0].available_vehicle_types.length >0){
            this.transportListResponse = true;
            this.showShimmerTransport = false;
            this.negotiateTransport(response)
          }else{
            this.isTransportResponseEmpty = true;
            if(this.transportCount < 5){
              this.setTimerForTransportSearch()
              this.transportCount = this.transportCount + 1
            }else{
              this.showShimmerTransport = false;
              Swal.fire({
                text: this.translate.instant('Sorry,we could not find transport service from Maqam GDS'),
                icon: "warning",
                confirmButtonText: this.translate.instant('Modify Search'),
                showCloseButton: true,
              }).then((willDelete) => {
                if(willDelete.isConfirmed){
                  this.modifySearchTransportPopup = true;
                }
            });
            }
          }

      } else {
        this.setBaseTransport(response.transportations)
      }
      // for (let i = 0; i < this.transportList.length; i++) {
      //   for (let j = 0; j < this.transportList[i].vehicle_types.length; j++) {
      //     this.transportList[i].vehicle_types[j].toggle = false;
      //     this.transportList[i].vehicle_types[j].count = 1;
      //     this.transportList[i].totalCount = 1;
      //     this.transportList[i].vehicle_types[j].transport_amount = 0;
      //     this.transportList[i].vehicle_types[j].vehicleCapacityCount = Math.ceil((this.countadult + this.countchild) / this.transportList[i].vehicle_types[j].categories[0].capacity)
      //     this.transportList[i].vehicle_types[j].vehiclePaxCount = Math.ceil((this.countadult + this.countchild) / (Math.ceil((this.countadult + this.countchild) / this.transportList[i].vehicle_types[j].categories[0].capacity)))
      //   }
      // }
      // for (let i = 0; i < this.transportList.length; i++) {
      //   for (let j = 0; j < this.transportList[i].vehicle_types.length; j++) {
      //     const totalCount = this.countadult + this.countchild + this.countinfa;
      //     const vehicle = this.transportList[i].vehicle_types[j].vehicle_type_code[0];
      //     this.transportList[i].vehicle_types[j].toggle_vehicle = false;
      //     this.transportList[i].totalCount = 1;
      //   }
      // }
    },(error)=>{
      this.transportListResponse = true;
      this.showShimmerTransport = false;
      if(this.baseUrl  == this.prodUrl){
        window.analytics.track('transport searching',{
         portal:"B2B",
         user:localStorage.getItem("userTypeName"),
         userId:localStorage.getItem("userId"),
         apiStatus:"transport data not avilable"
       });
      }
      Swal.fire({
        text: this.translate.instant("Sorry,we could not find transport service from Maqam GDS"),
        icon: "warning",
        confirmButtonText: this.translate.instant('Back To Search'),
      }).then((willDelete) => {
        if(willDelete.value){
          this.router.navigate(['subagent/home']);
        }
    });
    });
  }

  setTimerForTransportListApiIsPendingForMorethan30Seconds(){
    timer(this.pendingApiTimer).pipe(takeUntil(this.destroy$)).subscribe(x => {
        if(!this.transportResponse){
        if(this.transportListSubScription != null && !this.transportListSubScription != undefined){
           this.transportListSubScription.unsubscribe();
      }
        Swal.fire({
          icon: 'error',
          text: this.translate.instant("It seems like server busy from Maqam-GDS."),
          confirmButtonText: this.translate.instant('Try Again')
        }).then((result) => {
          this.callTransportList();
        })
      }
    });
  }

  negotiateTransport(data){
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('transport searching',{
       portal:"B2B",
       user:localStorage.getItem("userTypeName"),
       userId:localStorage.getItem("userId"),
       apiStatus:"transport data avilable"
     });
    }
    this.showShimmerTransport = false;
    this.makeAvailableVehicleList(data)
    this.showTransportOptionCard = true
  }

  makeAvailableVehicleList(data){
    this.transportOptions = []
    let x = data.available_vehicle_types.map(y=>y.vehicle_type_name)
    let y = x.filter( function( item, index, inputArray ) {return inputArray.indexOf(item) == index;});
    this.transportOptions = y;
    this.byPassTransport(data.transportations)
  }

  setBaseTransport(data){
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('transport searching',{
       portal:"B2B",
       user:localStorage.getItem("userTypeName"),
       userId:localStorage.getItem("userId"),
       apiStatus:"transport data avilable"
     });
    }
    this.showShimmerTransport = false;
    this.makeTransportList(data)
    this.transportList.forEach((ct)=>{ct.categories.forEach((fs)=>{fs.fare_summary.forEach((amt)=>{if(amt.is_total) {amt.display_price = amt.amount; ct.display_price=amt.amount; ct.category_name = fs.category_name}})})})
    this.transportList.forEach(x=>x.fromCache = false)
  }

  makeTransportList(data){
    this.transportList = []
    data.forEach(x=> x.vehicle_types.forEach(y=>{
      y.company_code = x.company_code,
      y.company_name = x.company_name,
      y.policies = x.policies,
      y.cancellation_policy = x.cancellation_policy,
      y.price = y.categories[0].fare_summary[2].amount
    }))
   let q = data.map(x=>x.vehicle_types)
   this.transportList = q.concat.apply([],q).sort((a,b) =>(a.price) - (b.price))
  }

  byPassTransport(data){
    this.showShimmerTransport = false;
    this.transportList = [];
    data.forEach((vt)=>{vt.available_vehicle_types.forEach((ct)=>{ct.categories.forEach((fs)=>{fs.fare_summary.forEach((amt)=>{if(amt.is_total) {amt.display_price = amt.amount;}})})})})
    this.transportReserveList = data;
  }

  setTimerForTransportSearch() {
    this.transportRepeater = timer(5000).pipe(takeUntil(this.destroy$)).subscribe(x => this.callTransportList());
  }

  // filterTransportList(){
  //   this.showTransportOptionCard = false;
  //   this.transportReserveList.forEach(x=>x.available_vehicle_types.forEach(y=>y.active = false))
  //   if(this.userOption != ""){
  //     this.transportReserveList.forEach(x=>x.available_vehicle_types.forEach(y=>{if(y.vehicle_type_name = this.userOption ){y.active = true }}))
  //     this.transportReserveList.forEach(x=> x.available_vehicle_types.forEach(y=>{
  //       y.company_code = x.company_code,y.company_name = x.company_name,
  //       y.policies = x.policies,y.cancellation_policy = x.cancellation_policy,
  //       y.price = y.categories[0].fare_summary[2].amount
  //       y.categories.forEach((ct)=>{ct.fare_summary.forEach((amt)=>{if(amt.is_total) {y.display_price=amt.amount; console.log(y.display_price)}})})
  //     }))
  //    let q = this.transportReserveList.map(x=>x.available_vehicle_types)
  //    this.transportReserveList = q.concat.apply([],q).sort((a,b) =>(a.price) - (b.price))
  //   }
  //   this.transportList = this.transportReserveList;
  //   this.transportList.forEach(x=>x.fromCache = false)
  // }

  setUserOptionForTrasport(evnt){
    this.userOption = evnt.value
    this.userOptionBtn = true;
  }

  /**
 * Method to set main traveller
 */
  mainTraveller(i) {
    this.rooms.forEach(value => {
      for (let j = 0; j < value.adults; j++) {
        this.mainTraveller[j] = false;
      }
    });
    this.mainTraveller[i] = true;
  }

  /**
 * Method to fetch saved itinerary
 */
  getTripData() {
    if(sessionStorage && sessionStorage.getItem("custom_trip_id") && sessionStorage.getItem("custom_trip_id") !="" && sessionStorage.getItem("userLanguage") != ""){
    this.setTimerForGetTripApiIsPendingForMorethan30Seconds()
    this.getTripResponse = false;
    var serviceObj={"service":"","name":"","price":"","start_date":""}
    this.getTripSubscription = this.common.getTrip(sessionStorage.getItem('custom_trip_id'),sessionStorage.getItem('userLanguage'),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.getTripResponse = true;
      this.tripData = data;
      if (this.tripData) {
        if(this.tripData.adults > 0){
          sessionStorage.setItem("transportPassingers",this.tripData.adults+ this.tripData.children+this.tripData.infants)
        }
        if (this.tripData.makkah_trip_hotel) {
          var roomCount = 0;
          this.tripMakkahHotel = this.tripData.makkah_trip_hotel;
          this.tripMakkahHotel.room_variations.forEach((data)=>{
               roomCount = roomCount + data.total_rooms
          })
          serviceObj={"service":"","name":"","price":"","start_date":""}
          serviceObj.service = "makkah_hotel";
          serviceObj.name = this.tripData.makkah_trip_hotel.hotel.name;
          serviceObj.price = this.tripData.makkah_trip_hotel.prices_summary.total_price;
          serviceObj.start_date = this.tripData.makkah_trip_hotel.check_in_time;
          this.serviceList.push(serviceObj)
          this.tripMakkahHotel.total_room_count = roomCount
          this.hotelMakkahFare = this.tripData.makkah_trip_hotel.room_variations.map(x => x.room.amount).reduce((a, b) => a + b, 0);
          this.tripMakkahHotelrating = this.tripData.makkah_trip_hotel.hotel.user_review / 2;
        }
        if (this.tripData.medinah_trip_hotel) {
          var roomCount = 0;
          this.tripMadeenaHotel = this.tripData.medinah_trip_hotel;
          this.tripMadeenaHotel.room_variations.forEach((data)=>{
            roomCount = roomCount + data.total_rooms
       })
       this.tripMadeenaHotel.total_room_count = roomCount
          this.hotelMadeenaFare = this.tripData.medinah_trip_hotel.room_variations.map(x => x.room.amount).reduce((a, b) => a + b, 0);
          serviceObj={"service":"","name":"","price":"","start_date":""}
          serviceObj.service = "medinah_hotel";
          serviceObj.name = this.tripData.medinah_trip_hotel.hotel.name;
          serviceObj.price = this.tripData.medinah_trip_hotel.prices_summary.total_price;
          serviceObj.start_date = this.tripData.medinah_trip_hotel.check_in_time;
          this.serviceList.push(serviceObj)
        }
        
        if (this.tripData.trip_transportation) {
          this.tripTransport = this.tripData.trip_transportation;
          this.transportFare = this.tripData.trip_transportation.trip_vehicles[0].price_per_vehicle;
          this.selectedTransport = this.tripData.trip_transportation.selected_transportation;
          serviceObj={"service":"","name":"","price":"","start_date":""}
          serviceObj.service = "transportation";
          serviceObj.name = this.tripData.trip_transportation.company.name;
          serviceObj.price = this.tripData.trip_transportation.prices_summary.total_price;
          serviceObj.start_date = this.tripData.start_date;
          this.serviceList.push(serviceObj)
          this.setTimeStamp(this.tripData.trip_transportation);
        }

        if (this.tripData.trip_visa) {
          this.tripVisaData = this.tripData.trip_visa;
        }
      }
    },(error)=>{
      this.getTripResponse = true;
      if(sessionStorage && sessionStorage.getItem('deepLinkStatus') && sessionStorage.getItem('deepLinkStatus') == "1"){
        Swal.fire({
          icon: 'error',
          text: this.translate.instant('Sorry,it seems to be a broken link'),
          confirmButtonText: this.translate.instant('Go to Home Page')
        }).then((result) => {
          this.router.navigate(['subagent/home']);
        })
      }else{
          Swal.fire({
            icon: 'error',
            text: this.translate.instant('GDS-Maqam server busy,please try later'),
            confirmButtonText: this.translate.instant('ok')
          })
        }
      });
    }
  }

  setTimerForGetTripApiIsPendingForMorethan30Seconds(){
    timer(this.pendingApiTimer).pipe(takeUntil(this.destroy$)).subscribe(x => {
        if(!this.getTripResponse){
          if(this.getTripSubscription != undefined && this.getTripSubscription != null){
            this.getTripSubscription.unsubscribe();
          }
        Swal.fire({
          icon: 'error',
          text: this.translate.instant("It seems like server busy from Maqam-GDS."),
          confirmButtonText: this.translate.instant('Try Again')
        }).then((result) => {
          this.getTripData();
        })
      }
    });
  }

  setPaymentPageAfterItineraryModified() {
    this.cityFirst = "";
    this.citySecond = "";
    this.transportFailed = "";
    (<HTMLInputElement>document.getElementById("continueBooking")).style.display = "block";
  }

  get g() { return this.travellersForm.controls; }

  //Mobile Validation

  onCountryChangeDeep(event) {
    this.validateNumberDeep();
    this.countryCodeReq = event.dialCode
  }


  getNumberPlaceHolderLengthDeep(): number {
    try {
      let phoneInput: HTMLElement = document.getElementById("mobInput");
      if (phoneInput)
        return phoneInput.attributes.getNamedItem("placeholder").value.replace(/[^0-9a-zA-Z]/g, '').length;
    } catch (exception) {
    }
  }


  inputValidationDeep(event?) {
    if (event) {
      if (event.target.value.length > 0) {
        this.shareLinkBtnActiv = true;
      }else{
        this.shareLinkBtnActiv = false;
      }
    }
    // let defaultCountryCode: string = "+91"
    // try {
    //   let mobileNumber: string = '';
    //   if (event)
    //     mobileNumber = event.srcElement.value;
    //   else
    //     mobileNumber = this.mobileNumber;
    //   defaultCountryCode = defaultCountryCode.replace(/[^0-9]/g, '');
    //   if (this.getNumberPlaceHolderLengthDeep() && mobileNumber.length >= this.getNumberPlaceHolderLengthDeep() + defaultCountryCode.length &&
    //     mobileNumber.startsWith(defaultCountryCode)) {
    //     mobileNumber = mobileNumber.slice(defaultCountryCode.length);
    //   }
    //   else if (mobileNumber.startsWith('0'))
    //     mobileNumber = mobileNumber.slice(1);

    //   this.mobileNumber = mobileNumber;
    //   this.validateNumberDeep();
    // } catch (exception) {
    // }
  }

  validateNumberDeep() {
    try {
      if (this.mobileNumber) {
        let mobileNumber = this.mobileNumber;
        if (this.getNumberPlaceHolderLengthDeep() && this.getNumberPlaceHolderLengthDeep() != mobileNumber.length) {
          this.phone_error = true;
          this.shareLinkBtnActiv = false
        }else{
          this.phone_error = false;
          this.shareLinkBtnActiv = true
        }
      }
    } catch (exception) {
      this.phone_error = false;
      alert(this.translate.instant('Enter mobile number'))
    }
  }

  findProdUrlConfig(){
    const parsedUrl = new URL(window.location.href);
       this.baseUrl = parsedUrl.origin;
  }

  setUserDataForSegmentAnalysis(){
    if(this.baseUrl  == this.prodUrl){
       window.analytics.page('subagent home page',{
        user:localStorage.getItem("userTypeName"),
       userId:localStorage.getItem("userId"),
        portal:"B2B"
      });
    }
  }

  bookTrip() {
    if(this.baseUrl  == this.prodUrl){
      window.analytics.page('Visa & payment page',{
        user:localStorage.getItem("userTypeName"),
       userId:localStorage.getItem("userId"),
       portal:"B2B"
     });
    }
    this.submitted = true;
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('booking clicked',{
       portal:"B2B",
       user:localStorage.getItem("userTypeName"),
       userId:localStorage.getItem("userId"),
     });
    }
    if (this.travellersForm.invalid) { return }
    this.bookContinue = true;
    this.disablePayBttn = true;
    this.travellersForm.disable();
    this.rooms = JSON.parse(sessionStorage.getItem("roomData"));
    let roomRef = 0 + "_" + this.rooms[0].adults + "ADT_" + this.rooms[0].children + "CHD_" + this.rooms[0].child_ages.sort().join("_") + "";
    let travellers = [];
    if(roomRef != "" && roomRef != undefined && roomRef != null ){
    travellers.push(this.createTripAdapter.createTripBookingRequest(this.travellersForm.value, roomRef))
    const body = {"travellers": travellers,"tag":this.travellersForm.controls.tag.value }
    sessionStorage.setItem('bookingData', JSON.stringify(body))
    this.common.bookTrip(body, sessionStorage.getItem('custom_trip_id'),sessionStorage.getItem('userLanguage'),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.bookingId = data.id;
      sessionStorage.setItem("reference_no", data.reference_no)
      if(data.id){
        if(this.baseUrl  == this.prodUrl){
          window.analytics.track('updatecustometrip',{
            user:localStorage.getItem("userTypeName"),
            userId:localStorage.getItem("userId"),
            portal:"B2B",
            apiStatus:"success"
          });
        }

        this.common.checkAvailability(data.id,sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((response) => {
          this.appStore.isAvailabilityFails = false;
          if (response.makkah_trip_hotel) {
            this.cityFirst = "";
            if (response.makkah_trip_hotel.success == false) {
              this.cityFirst = "makkah";
              this.appStore.isAvailabilityFails = true;
              this.bookContinue = false;
              this.disablePayBttn = false;
              this.travellersForm.enable()
              if(this.baseUrl  == this.prodUrl){
                window.analytics.track('check availability makka hotel',{
                portal:"B2B",
                user:localStorage.getItem("userTypeName"),
                userId:localStorage.getItem("userId"),
                apiStatus:"failed"
              });
              }
            }
          }
          if (response.medinah_trip_hotel) {
            this.citySecond = "";
            if (response.medinah_trip_hotel.success == false) {
              this.citySecond = "madinah";
              this.appStore.isAvailabilityFails = true;
              this.bookContinue = false;
              this.disablePayBttn = false;
              this.travellersForm.enable()
              if(this.baseUrl  == this.prodUrl){
                window.analytics.track('check availability madeena hotel',{
                portal:"B2B",
                user:localStorage.getItem("userTypeName"),
                userId:localStorage.getItem("userId"),
                apiStatus:"failed"
              });
              }
            }
          }
          if (response.trip_transportation) {
            this.transportFailed = "";
            if (response.trip_transportation.success == false) {
              this.transportFailed = "transportFailed";
              this.appStore.isAvailabilityFails = true;
              this.bookContinue = false;
              this.disablePayBttn = false;
              this.travellersForm.enable()
              if(this.baseUrl  == this.prodUrl){
                window.analytics.track('check availability transport',{
                portal:"B2B",
                user:localStorage.getItem("userTypeName"),
                userId:localStorage.getItem("userId"),
                apiStatus:"failed"
              });
              }
            }
          }
          if (response.refetch_trip == true) {
            if(this.baseUrl  == this.prodUrl){
              window.analytics.track('check availability calling',{
              portal:"B2B",
              user:localStorage.getItem("userTypeName"),
              userId:localStorage.getItem("userId"),
              apiStatus:"failed"
              });
            }
            (<HTMLInputElement>document.getElementById("continueBooking")).style.display = "block";
            this.createTripHelper.showSweetAlert("It's seem like server busy from Maqam-GDS", "warning", 'Try Again')
            this.getTripData();
            this.bookContinue = false;
            this.disablePayBttn = false;
            this.travellersForm.enable()
          }
          else {
            if(sessionStorage && sessionStorage.getItem('userLanguage') 
               && sessionStorage.getItem('userLanguage') != "")
              this.common.getPaymentDetails(data.id,sessionStorage.getItem('userLanguage'),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(value =>{
                if(value != null && value != undefined && value != ""){
                 this.fetchIbanBookingPopupData(value);
                 sessionStorage.setItem('dummy',JSON.stringify(value))
                }
              },(error)=>{
                  this.bookContinue = false;
                  this.disablePayBttn = false;
                  this.travellersForm.enable()
                  Swal.fire({
                    icon: 'error',
                    text: this.translate.instant('GDS-Maqam server busy,please try later'),
                    confirmButtonText: this.translate.instant('ok')
                  })
              })
              if(this.baseUrl  == this.prodUrl){
                window.analytics.track('check availability calling',{
                portal:"B2B",
                user:localStorage.getItem("userTypeName"),
                userId:localStorage.getItem("userId"),
                apiStatus:"success"
              });
              }
          }
          this.bookContinue = false;
        },(error)=>{
            this.bookContinue = false;
            this.disablePayBttn = false;
            this.travellersForm.enable()
            Swal.fire({
              icon: 'error',
              text: this.translate.instant('GDS-Maqam server busy,please try later'),
              confirmButtonText: this.translate.instant('ok')
            })
        });
      }
    },(error)=>{
      if(this.baseUrl  == this.prodUrl){
        window.analytics.track('updating custom trip',{
          portal:"B2B",
          user:localStorage.getItem("userTypeName"),
          userId:localStorage.getItem("userId"),
          apiStatus:"failed"
        });
      }
      if(error.status == "400"){
        this.bookContinue = false;
        this.disablePayBttn = false;
        this.travellersForm.enable()
      }
      else{
        this.bookContinue = false;
        this.disablePayBttn = false;
        this.travellersForm.enable()
        Swal.fire({
          icon: 'error',
          text: this.translate.instant('GDS-Maqam server busy,please try later'),
          confirmButtonText: this.translate.instant('ok')
        })
      }
    });}
  }

  fetchIbanBookingPopupData(respValue){
    this.showIbanPopup = true;
    this.paymentHotelData = null;
    this.paymentTransportData = null;
    this.paymentPopupValue = respValue;
    if(this.steps.length == 1){
      this.paymentPopupDetailsPolicyShow = true;
      if(this.paymentPopupValue.madina_hotel_booking && this.paymentPopupValue.madina_hotel_booking != null){
        this.paymentHotelData = this.paymentPopupValue.madina_hotel_booking;
        this.roomCollectionArray(this.paymentHotelData);
      }
      if(this.paymentPopupValue.makka_hotel_booking && this.paymentPopupValue.makka_hotel_booking != null){
        this.paymentHotelData = this.paymentPopupValue.makka_hotel_booking;
        this.roomCollectionArray(this.paymentHotelData);
      }
      if(this.paymentPopupValue.transport_booking && this.paymentPopupValue.transport_booking.total_price != null){
        this.paymentTransportData = this.paymentPopupValue.transport_booking.trip_transportation;
        this.setTimeStamp(this.paymentTransportData);
      }
    }else{
      this.paymentPopupDetailsPolicyShow = false;
    }
  }
  
  setTimeStamp(data){
    if(data.selected_transportation && data.selected_transportation.cancellation_policy && data.selected_transportation.cancellation_policy.rules && data.selected_transportation.cancellation_policy.rules.length > 0){
      this.currentDate = new Date().getTime()/1000;
      data.selected_transportation.currentDateTimeStamp = new Date().getTime()/1000;
      data.selected_transportation.start_time_stamp = new Date(data.selected_transportation.start_date).getTime()/1000;
      data.selected_transportation.cancellation_policy.rules.forEach(element => {
        element.start_timer = new Date(element.from_date_time).getTime()/1000;
        element.end_timer = new Date(element.to_date_time).getTime()/1000;
      });
    }    
  }

  decrementDateByOne(date){
    let date1 = new Date(date);
    date1.setDate(date1.getDate() - 1);
    return date1;
  }


  roomCollectionArray(hotel){
    this.roomCollection = [];
    hotel.trip_hotel.room_variations.forEach(element => {
      element.room.forEach(room => {
        this.roomCollection.push(room);
      });
    });
  }



  /**
   * Method to close payment popup after 30 sec
   */
  // setTimerForIbanPopup() {
  //   this.interval = setInterval(() => {
  //     if (this.timeLeft > 0) {
  //       this.timeLeft--;
  //     }
  //     else if (this.timeLeft == 0) {
  //       if((<HTMLInputElement>document.getElementById("ibanClose")) != null) {
  //         (<HTMLInputElement>document.getElementById("ibanClose")).click();
  //       }
  //       this.timeLeft = 30;
  //       clearInterval(this.interval);
  //     }
  //   }, 1000)
  // }

  /**
  * Method to navigate payment success page
  */
  onSubmitButtonClicked() {
    if(this.accNo == null){
      this.ibanValidation = true;
      return
    }

    this.saveIbanNumberToList(this.accNo)

    if(this.ibanValidation){
      return;
    }
    if(this.authCode != null && this.authCode.length == 6){

    }else{
      this.lengthAuthCode = true;
      return;
    }

    var w = {
      "booking_id": this.bookingId,
      "account_no": this.accNo,
      "auth_code": this.authCode,
      "is_whatsapp_msg_sended":this.travellersForm.controls.whatsappSend.value
    }
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('iban booking calling',{
        user:localStorage.getItem("userTypeName"),
        userId:localStorage.getItem("userId"),
       portal:"B2B",
       credentials:w
     });
    }
    this.spinner.show();
    if (this.accNo && this.authCode) {
      this.common.bookingPayment(w,sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((response) => {
        if (response.status == "Success") {
          if(this.baseUrl  == this.prodUrl){
            window.analytics.track('redirecting to Success page',{
              user:localStorage.getItem("userTypeName"),
              userId:localStorage.getItem("userId"),
             portal:"B2B"
           });
          }

          this.timeToCallApi = 0;

          this.callBookingStatusApi();

        }
        else {
          if(this.baseUrl  == this.prodUrl){
            window.analytics.track('iban booking calling',{
              user:localStorage.getItem("userTypeName"),
              userId:localStorage.getItem("userId"),
             portal:"B2B",
             status:"payment failed"
           });
          }
          this.spinner.hide();
          this.travellersForm.enable()
          this.createTripHelper.titleSweetAlert("error",'Payment Failed', "please try again","ok");
        }
      }, error => {
        this.spinner.hide();
        this.travellersForm.enable()
        if(this.baseUrl  == this.prodUrl){
          window.analytics.track('iban booking calling',{
           portal:"B2B",
           user:localStorage.getItem("userTypeName"),
           userId:localStorage.getItem("userId"),
           sttus:"iban credentials are not valid"
         });
        }
        this.createTripHelper.showSweetAlert('Account Does Not Exist', "error", 'ok');
      });
    } else {
    }
  }

  callBookingStatusApi(){
    this.common.bookingStatus(this.bookingId,sessionStorage.getItem('userLanguage'),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(value =>{
        this.checkResponseStatus(value);
    },error => {
      this.spinner.hide();
      this.showIbanPopup = false;
      this.travellersForm.enable()
      this.createTripHelper.titleSweetAlert("error",'Payment Failed', "please try again","ok");
    })
  }

  checkResponseStatus(value){
    if(value.code == '0'){
      this.spinner.hide();
      this.showIbanPopup = false;
      this.router.navigate(['subagent/payment/' + this.bookingId + '/success']);
      sessionStorage.setItem("timerStatus","start");
    }else if(value.code == '00111' || value.code == '00112'){
      if(this.timeToCallApi <= 8){
        this.timeToCallApi = this.timeToCallApi + 1;
        setTimeout(() => {
          this.callBookingStatusApi();
        }, 5000);
      }else{
        this.spinner.hide();
        this.showIbanPopup = false;
        this.disablePayBttn = false;
        Swal.fire({
          icon: 'error',
          text: this.translate.instant('This process will take some time in GDS-Maqam end. We will send you the confirmation on mail.'),
          confirmButtonText: this.translate.instant('ok')
        })
      }
    }else if(value.code == '01101'){
      this.spinner.hide();
      this.showIbanPopup = false;
      this.disablePayBttn = false;
      Swal.fire({
          icon: 'error',
          text: value.message[0],
          confirmButtonText: this.translate.instant('ok')
      })
    }else if(value.code == '00400'){
      this.spinner.hide();
      this.showIbanPopup = false;
      this.disablePayBttn = false;
      this.travellersForm.enable()
      Swal.fire({
        icon: 'error',
        text: this.translate.instant('Some Technical Problem from GDS-Maqam,Please Try Later'),
        confirmButtonText: this.translate.instant('ok')
      })
    }
  }

  @ViewChild("multiSelect", { static: true }) multiSelect;
  public form: FormGroup;
  public loadContent: boolean = false;
  public data = [];

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  setIbanNumberList(){
    this.common.getIbanList().pipe(takeUntil(this.destroy$)).subscribe(data =>{
      this.ibanNumberList = data.data;
    })
  }

  ngOnInit() {
    //form group of group leader information
    this.formService.groupLeaderForm = this.formAdapter.leaderForm()
    this.travellersForm = this.formService.groupLeaderForm;

    this.getSteps();
    this.setIbanNumberList()
    this.deepLinkStatus = sessionStorage.getItem("deepLinkStatus")
    sessionStorage.setItem("params",JSON.stringify(this.params))
    window.scroll(0,0);
    this.showShimmer = true;
    if(sessionStorage && sessionStorage.getItem('params')){
      this.params = JSON.parse(sessionStorage.getItem('params'))
      let type = sessionStorage.getItem('currentUser')
      if(this.params.tripId != "0"){
        this.genHelper.checkForAccessTokenForDeepLink();
        sessionStorage.setItem('custom_trip_id',this.params.tripId)
        sessionStorage.setItem("currentUser",'SUB')
        sessionStorage.setItem("deepLinkStatus",'1')
        this.setForm();
        if(sessionStorage && sessionStorage.getItem('accesstoken') &&  sessionStorage.getItem('accesstoken') != 'null'){
          this.getDeepTripData()
        }
      }
      else{
        this.normalWay()
      }
    }
  }

  getSteps(){
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.params = params
      if(params.steps.length > 1){
      this.steps = ((params.steps || "1,2,3").split(","));
      sessionStorage.setItem('steps',JSON.stringify(this.steps))
      }else{
        let step = []
        this.steps = params.steps;
        step.push(this.steps)
        sessionStorage.setItem('steps',JSON.stringify(step))
      }
    });
  }

  checkTheDeepLinkDateValid(){
    let userObject = JSON.parse(sessionStorage.getItem('userObject'))
    let startDate = Date.parse(userObject.start_date)
    var today = new Date().toString();
    let current = Date.parse(today)
    if((startDate-current)> - 86400000){
      this.setDeepLinkAndAll()
    }else{
      sessionStorage.removeItem('params')
      Swal.fire({
        icon: 'error',
        text: this.translate.instant('Sorry,it seems to be a past dated link'),
        confirmButtonText: this.translate.instant('Go to Home Page')
      }).then((result) => {
        this.router.navigate(['login']);
      })
    }
  }

  normalWay(){
    this.calculatePed();
    sessionStorage.setItem("deepLinkStatus",'0')
    sessionStorage.setItem('steps', JSON.stringify(this.steps))
    this.stage = sessionStorage.getItem('stage')
    this.moveStep()
    this.generalHelper.checkForAccessToken();
    if (!this.appStore.showShimmer) {this.appStore.showShimmer = true, this.showShimmer = true}
    this.setUserDetails()
    this.setDefaultLangAndCurrency()
    this.travellersCount = JSON.parse(sessionStorage.getItem("userObject")).travallersCount;
    this.rooms = JSON.parse(sessionStorage.getItem('roomData'))
    this.selectedCurrency = "SAR";
    this.multiSelectDropDownSettings()
    this.setForm();
    this.callCorrespongingSteppers();
    this.setdataForUserDetailsAtLastPage();
    this.fetchNessoryApisForPaymentPage();
     this.transportCategoryDropdown()
  }

  setDeepLinkAndAll(){
    sessionStorage.setItem('stage', '1');
    localStorage.setItem("currentUser","SUB")
    sessionStorage.setItem('service','All')
    this.setUserDetails()
    this.setDefaultLangAndCurrency()
    this.selectedCurrency = "SAR";
    this.multiSelectDropDownSettings()
    this.fetchNessoryApisForPaymentPage()
    this.moveToVisaPaymentPageFromDeepLink()
  }

  getDeepTripData() {
    this.setTimerForGetTripDeepApiIsPendingForMorethan30Seconds()
    this.getTripDeepResponse = false;
    this.deepSubScription = this.common.getTrip(this.params.tripId,sessionStorage.getItem('userLanguage'),sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.getTripDeepResponse = true;
      this.tripData = data;
      if (this.tripData) {
        if (this.tripData.makkah_trip_hotel) {
          var roomCount = 0;
          this.tripMakkahHotel = this.tripData.makkah_trip_hotel;
          this.tripMakkahHotel.room_variations.forEach((data)=>{
               roomCount = roomCount + data.total_rooms
          })
          this.rooms = this.tripData.makkah_trip_hotel.rooms
          this.tripMakkahHotel.total_room_count = roomCount
          this.hotelMakkahFare = this.tripData.makkah_trip_hotel.room_variations.map(x => x.room.amount).reduce((a, b) => a + b, 0);
          this.tripMakkahHotelrating = this.tripData.makkah_trip_hotel.hotel.user_review / 2;
        }
        if (this.tripData.medinah_trip_hotel) {
          var roomCount = 0;
          this.tripMadeenaHotel = this.tripData.medinah_trip_hotel;
          this.tripMadeenaHotel.room_variations.forEach((data)=>{
            roomCount = roomCount + data.total_rooms
          })
          this.rooms = this.tripData.medinah_trip_hotel.rooms
          this.tripMadeenaHotel.total_room_count = roomCount
          this.hotelMadeenaFare = this.tripData.medinah_trip_hotel.room_variations.map(x => x.room.amount).reduce((a, b) => a + b, 0);
        }
        if (this.tripData.trip_transportation) {
          if(this.rooms && this.rooms.length == 0){
            this.rooms = [{ adults: 1, children: 0, child_ages: ["0"], seq_no: "0", id: 1, pax_info_str: "1" }]
          }
          this.tripTransport = this.tripData.trip_transportation;
          this.transportFare = this.tripData.trip_transportation.trip_vehicles[0].price_per_vehicle;
          this.selectedTransport = this.tripData.trip_transportation.selected_transportation;
        }

        if (this.tripData.trip_visa) {
          this.tripVisaData = this.tripData.trip_visa;
        }

        const userObject = {
          adults: this.tripData.adults,
          children: this.tripData.children,
          infant: this.tripData.infants,
          start_date:this.tripData.start_date,
          madeenaCheckinDate: (this.tripData.medinah_trip_hotel)?this.tripData.medinah_trip_hotel.check_in_time:null,
          madeenaCheckoutDate:(this.tripData.medinah_trip_hotel)?this.tripData.medinah_trip_hotel.check_out_time:null,
          makkahCheckinDate: (this.tripData.makkah_trip_hotel)?this.tripData.makkah_trip_hotel.check_in_time:null,
          makkahCheckoutDate: (this.tripData.makkah_trip_hotel)?this.tripData.makkah_trip_hotel.check_out_time:null,
          noOfDaysInMakkah: (this.tripData.makkah_trip_hotel)?this.tripData.makkah_trip_hotel.num_of_days:0,
          noOfDaysInMadinah: (this.tripData.medinah_trip_hotel)?this.tripData.medinah_trip_hotel.num_of_days:0,
          swapHotel: false,
          travallersCount: this.tripData.adults+this.tripData.children+this.tripData.infants,
        }
        sessionStorage.setItem('userObject',JSON.stringify(userObject))
        if(this.baseUrl  == this.prodUrl){
          window.analytics.track('subagent home page',{
           user:localStorage.getItem("userTypeName"),
           userId:localStorage.getItem("userId"),
           portal:"B2B",
           flow:"Deeplink flow",
           apiStatus:"Custome trip get success",
           userobject:userObject
         });
        }
        this.checkTheDeepLinkDateValid()
      }
      this.rooms = JSON.parse(sessionStorage.getItem('roomData'))
    },(error)=>{
      this.getTripDeepResponse = true;
      if(this.baseUrl  == this.prodUrl){
        window.analytics.track('subagent home page',{
         portal:"B2B",
         user:localStorage.getItem("userTypeName"),
         userId:localStorage.getItem("userId"),
         flow:"Deeplink flow",
         apiStatus:"Custome trip get failed"
       });
      }
      Swal.fire({
        icon: 'error',
        text: this.translate.instant(error.error.detail),
        confirmButtonText: this.translate.instant('Go to Login Page')
      }).then((result) => {
        this.router.navigate(['login']);
      })
    });
  }

  setTimerForGetTripDeepApiIsPendingForMorethan30Seconds(){
    timer(this.pendingApiTimer).pipe(takeUntil(this.destroy$)).subscribe(x => {
        if(!this.getTripDeepResponse){
          if(this.deepSubScription != undefined && this.deepSubScription != null){
            this.deepSubScription.unsubscribe();
          }
        Swal.fire({
          icon: 'error',
          text: this.translate.instant("It seems like server busy from Maqam-GDS."),
          confirmButtonText: this.translate.instant('Try Again')
        }).then((result) => {
          this.getDeepTripData()
        })
      }
    });
  }

  moveToVisaPaymentPageFromDeepLink(){
    var stage = sessionStorage.getItem('stage')
    var steps = sessionStorage.getItem('steps')
    if (stage == '1') {
      if(steps.length > 5){
        this.move(3)
      }else{
        this.move(1)
      }
      this.getTripData()
    }else{
      this.callCorrespongingSteppers()
    }
  }

  transportCategoryDropdown(){
    if(sessionStorage.getItem('dropdownList')){
      this.dropdownList = JSON.parse(sessionStorage.getItem('dropdownList'))
     }else{
      this.common.getCategories(this.selectedLanguage).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.dropdownList = data.categories.map(x => ({ item_text: x.name, item_id: x.code }));
        sessionStorage.setItem('dropdownList', JSON.stringify(this.dropdownList));
      });
     }
  }
  calculatePed(){
    if(sessionStorage.getItem('service') == 'All'){
      var tripStartDate = JSON.parse(sessionStorage.getItem('userObject')).makkahCheckinDate;
      var tripendDate = JSON.parse(sessionStorage.getItem('userObject')).madeenaCheckoutDate;
      this.minpassportExpDate = this.helper.incrimentmonth(tripStartDate,6);
      var noOfDays = this.helper.daysofTwoDate(tripStartDate,tripendDate);
      sessionStorage.setItem("noOfTripDays",noOfDays.toString())
    }
    if(sessionStorage.getItem('service') == 'Makkah Hotel'){
      var tripStartDate = JSON.parse(sessionStorage.getItem('userObject')).makkahCheckinDate;
      var tripendDate = JSON.parse(sessionStorage.getItem('userObject')).makkahCheckoutDate;
      this.minpassportExpDate = this.helper.incrimentmonth(tripStartDate,6);
      var noOfDays = this.helper.daysofTwoDate(tripStartDate,tripendDate);
      sessionStorage.setItem("noOfTripDays",noOfDays.toString())
    }
    if(sessionStorage.getItem('service') == 'Medina Hotel'){
      var tripStartDate = JSON.parse(sessionStorage.getItem('userObject')).madeenaCheckinDate;
      var tripendDate = JSON.parse(sessionStorage.getItem('userObject')).madeenaCheckoutDate;
      this.minpassportExpDate = this.helper.incrimentmonth(tripStartDate,6);
      var noOfDays = this.helper.daysofTwoDate(tripStartDate,tripendDate);
      sessionStorage.setItem("noOfTripDays",noOfDays.toString())
    }
    if(sessionStorage.getItem('service') == 'Transport'){
      var tripStartDate = JSON.parse(sessionStorage.getItem('userObject')).transportStartDate;
      this.minpassportExpDate = this.helper.incrimentmonth(tripStartDate,6);
    }
  }

  moveStep() {
    this.move(this.stage)
  }

  setUserDetails() {
    this.userDetails = JSON.parse(sessionStorage.getItem('userObject'));
    if (typeof (this.userDetails) == 'undefined') { this.router.navigate(['subagent/home']) }
    if (this.userDetails) {
      this.swapHotel = this.userDetails.swapHotel;
      this.totalTravellers = this.userDetails.travallersCount;
      this.noOfDaysInMakkah = this.userDetails.noOfDaysInMakkah;
      this.makkahCheckInDate = this.userDetails.makkahCheckinDate;
      this.makkahCheckOutDate = this.userDetails.makkahCheckoutDate;
      this.transportStartDate = this.userDetails.transportStartDate;
      this.vehicleId = this.userDetails.vehicleType;
      this.vehicleMax = this.userDetails.vehicleCapacity;
      this.routeId = this.userDetails.transportRoute;
      this.vehicleCount = this.userDetails.vehicleCounts;
    }
  }

  multiSelectDropDownSettings() {
    this.dropdownSettings = {
      singleSelection: true,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }

  /**
   * Method to set pax info and room allocation at the payment preview page
   */
  setdataForUserDetailsAtLastPage() {
    this.roomAdultsArray.clear();
    this.roomChildrenArray.clear();
    this.rooms = [];
    if (this.roomDetails && this.roomDetails.length > 0) {
      this.rooms = this.roomDetails;
    } else {
      var transportRoom: Room[] = [{ adults: 1, children: 0, child_ages: ["0"], seq_no: "0", id: 1, pax_info_str: "1" }]
      this.rooms = transportRoom
    }
    for (let index = 0; index < 1; index++) {
      this.roomAdultsArray.push(this.addroomAdult(0));
      this.mainTraveller[0] = true;
    }
  }

  setDefaultLangAndCurrency(){
    if(sessionStorage && sessionStorage.getItem('userLanguage')){}
    else{
      sessionStorage.setItem('userLanguage','en-US');
    }
  }

  /**
   * Method to call all the apis for Payment page
   */
  fetchNessoryApisForPaymentPage() {
    this.commonApiService.getCountry("",sessionStorage.getItem('userLanguage')).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.nationalityList = data.map(x => ({ item_text: x.name, item_id: x.short_iso_code }));
    });
    this.commonApiService.getNationality("",sessionStorage.getItem('userLanguage')).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.phoneCodeList = data.map(x => ({ item_text: x.name, item_id: x.code }));
    });
  }

  /**
   * Method to call all the apis for transport search
   */
  fetchNessoryApisForTransport() {
    this.selectedLanguage = sessionStorage.getItem('userLanguage')
    if(sessionStorage.getItem('vehicleTypeList')){
      this.vehicleTypeList = JSON.parse(sessionStorage.getItem('vehicleTypeList'))
    }else{
      this.common.getVehicles(this.selectedLanguage).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.vehicleTypeList = data.vehicle_types.map(x => ({ item_text: x.name, item_id: x.code }));
        sessionStorage.setItem('vehicleTypeList', JSON.stringify(this.vehicleTypeList));
      });
    }

    if(sessionStorage.getItem('routeList')){
      this.routeList = JSON.parse(sessionStorage.getItem('routeList'))
    }else{
      this.common.getRoutes(this.selectedLanguage).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.routeList = data.routes.map(x => ({ item_text: x.name, item_id: x.code }));
      sessionStorage.setItem('routeList', JSON.stringify(this.routeList));
    });
   }

   if(sessionStorage.getItem('dropdownList')){
    this.dropdownList = JSON.parse(sessionStorage.getItem('dropdownList'))
   }else{
    this.common.getCategories(this.selectedLanguage).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.dropdownList = data.categories.map(x => ({ item_text: x.name, item_id: x.code }));
      sessionStorage.setItem('dropdownList', JSON.stringify(this.dropdownList));
    });
   }
    if(sessionStorage.getItem('additionalServiceData')){
      this.data = JSON.parse(sessionStorage.getItem('additionalServiceData'))
    }else{
      this.common.getAdditionalServices(this.selectedLanguage).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.data = data.additional_services.map(x => ({ item_text: x.name, item_id: x.code }));
        sessionStorage.setItem('additionalServiceData', JSON.stringify(this.data));
      });
    }

   if(sessionStorage.getItem('companyList')){
    let data = JSON.parse(sessionStorage.getItem('companyList'))
    this.companyList = data.companies.map(x => ({ item_text: x.name, item_id: x.code }));
    this.companylistall = data.companies;
   }else{
    this.commonApiService.getCompanies(this.selectedLanguage).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.companyList = data.companies.map(x => ({ item_text: x.name, item_id: x.code }));
      this.companylistall = data.companies;
      sessionStorage.setItem('companyList', JSON.stringify(data));
    });
   }

  }

  transportSearchDatas(){
    this.selectedLanguage = sessionStorage.getItem('userLanguage');
    this.common.getVehicles(this.selectedLanguage).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.vehicleTypeList = data.vehicle_types.map(x => ({ item_text: x.name, item_id: x.code }));
      this.vehicleTypes = data.vehicle_types;
    });
    this.common.getRoutes(this.selectedLanguage).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.routeList = data.routes.map(x => ({ item_text: x.name, item_id: x.code }));
    });
  }

  onVehicleSelectArray(id: any){
    var obj = JSON.parse(sessionStorage.getItem("userObject"));
    this.travellersCount = obj.adults + obj.children;
    var vehicleMaxCapacity;
    var vehicleCode;
    if (id != null && this.vehicleTypes && this.vehicleTypes.length > 0) {
      this.vehicleTypes.forEach(element => {
        if (element.code == id) {
          vehicleCode = element.code;
          vehicleMaxCapacity = element.max_capacity;
        }
      });
    }
    var totalTra = this.travellersCount;
    var count:number = totalTra / vehicleMaxCapacity;

    count = Math.ceil(count);
    if(count <= obj.adults){
      this.countArray = Array(obj.adults - count + 1).fill(count + 1).map((_, idx) => count + idx);
    }else{
      this.notifyService.showWarning(this.translate.instant("Passenger limit exceeded. Please select heavy vehicle."));
    }
  }

  /**
   * Method to call corresponding steppers according to user selection
   */
  callCorrespongingSteppers() {
    let stepLength = JSON.parse(sessionStorage.getItem('steps')).length
    if (stepLength > 1) {
      var flag = sessionStorage.getItem('stage')
      var details = sessionStorage.getItem('hotelDetailsFlag')
      if(this.swapHotel){
        if (flag == '1') {
          this.hotelSearch("MAKKA");
        }
        if (flag == '0') {
          this.hotelSearch("MADEENA");
        }
      }else{
        if (flag == '0') {
          this.hotelSearch("MAKKA");
        }
        if (flag == '1') {
          this.hotelSearch("MADEENA");
        }
      }

      if (flag == '2') {
        this.transportSearch()
      }
      if (flag == '3') {
        this.getTripData()
      }
    } else {
      var flag = sessionStorage.getItem('stage')
      var step = JSON.parse(sessionStorage.getItem('steps'))[0]
      var details = sessionStorage.getItem('hotelDetailsFlag')
      if (step == '1') {
        this.hotelSearch("MAKKA");
      }
      if (step == '2') {
        this.hotelSearch("MADEENA");
      }
      if (step == '3') {
        this.transportSearch()
      }
      if (flag == '1') {
        this.move(1)
        this.getTripData()
      }
    }

  }

  get roomAdultsArray(): FormArray {
    return this.paymentForm.get("roomAdultsArray") as FormArray
  }

  get roomChildrenArray(): FormArray {
    return this.paymentForm.get("roomChildrenArray") as FormArray
  }

  addroomAdult(id): FormGroup {
    return this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      passportNo: ['', Validators.required],
      ped: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      Nationality: ['', Validators.required],
      Residence: ['', Validators.required],
      room_id: id
    })
  }

  addroomChild(id): FormGroup {
    return this.formBuilder.group({
      firstNameChild: ['', Validators.required],
      lastNameChild: ['', Validators.required],
      childGender: ['', Validators.required],
      childDob: ['', Validators.required],
      childPassportNo: ['', Validators.required],
      childPed: ['', Validators.required],
      room_id: id
    })
  }

  public setForm() {
    this.form = new FormGroup({
      name: new FormControl(this.data, Validators.required),
    });
    this.loadContent = true;
  }

  get f() { return this.form.controls; }

  /**
   * Method to set route id from drop down
   * @param item
   */
  onRouteSelect(item: any) {
    this.routeId = item.item_id;
    this.disableBtn = true;
  }

  /*
 * this method for setting vehicle id and vehicle pax capacity
 */
  onVehicleSelect(item: any) {
    this.vehicleId = item.item_id;
    if (this.vehicleId == 1) { this.vehicleMax = 4; }
    if (this.vehicleId == 2) { this.vehicleMax = 7; }
    if (this.vehicleId == 3) { this.vehicleMax = 60; }
    this.disableBtn = true;
  }

  /*
 * this method for call back from hotel-details-popup component
 */
  createTripHandle(event) {
    let stepLength = JSON.parse(sessionStorage.getItem('steps')).length
    if (stepLength > 1) {
      if (sessionStorage.getItem('modify') == null) {
        this.move(JSON.parse(sessionStorage.getItem('stage')))
        let stage = JSON.parse(sessionStorage.getItem('stage'))
        if (stage == 2) {
          this.transportSearch()
        }
        if (stage == 3) {
          this.getTripData()
        }
        if (stage == 1) {
          if(this.swapHotel){
            this.hotelSearch("MAKKA");
          }else{
            this.hotelSearch("MADEENA");
          }

        }
      }
      else {
        this.move(3)
        this.getTripData()
      }
    } else {
      this.move(1)
      this.getTripData()
    }
  }

  /*
 * this method to move to corresponding page after check availability fails
 */
  moveToCorrespondingPage(cityName) {
    if (cityName == 'makkah') {
      this.move(0)
    }
    if (cityName == "madinah" && this.steps.includes("2") && !this.steps.includes("1")) { this.move(0); }
    if (cityName == "madinah" && this.steps.includes("2") && this.steps.includes("1")) { this.move(1) }
  }

  moveToTransportPage() {
    this.showShimmerTransport = false;
    this.transportSearch()
    let stepLength = JSON.parse(sessionStorage.getItem('steps')).length
    if (stepLength > 1) {
       this.move(2)
    }
    else { this.move(0) }
  }

  filterTransportList(){}

  /*
 * this method to move to payment page after itinerary re selected
 */
  moveToPaymentPage() {
    this.getTripData();
    if (sessionStorage.getItem('custom_trip_id') && this.steps.length > 2) {
      this.move(3)
    } else {
      this.move(1)
    }
  }

  /*
 * this method for fetching hotel list
 */
  hotelSearch(city: string) {
    this.hotelsList = [];
    if (!this.appStore.showShimmer) {
      this.appStore.showShimmer = true;
      this.showShimmer = true;
    }
    if(!this.hotelSearchtimer){
    this.setTimerForHotelSearchApiIsPendingForMorethan30Seconds(city);
    }
    this.hotelSearchResponse = false
    this.hotelSearchSubscription = this.common.v2_5PilotHotelSearch(this.createTripAdapter.hotelSearchRequest(city, this.userDetails), sessionStorage.getItem('userLanguage'),sessionStorage.getItem("ulogId")).pipe(takeUntil(this.destroy$)).subscribe(
      (data:any) => {
        this.hotelSearchResponse = true
        this.currentCity = city;
        this.searchId = data.data.search_id;
        if (data.code == "0") {
          this.hotelSearchtimer = true;
          this.hotelsList = []
          this.hotelsList = data.data.results;
          if(this.hotelsList.length > 0){this.hotelsList.sort((a,b)=>(a.amount) - (b.amount))}
          if(this.hotelsList.length > 0) {sessionStorage.setItem('htlList',JSON.stringify(this.hotelsList))
           this.hotelsList.forEach(x=>x.fromCache = true)}
          if (city === "MAKKA") { sessionStorage.setItem('mkSearchId', data.data.search_id)};
          if (city === "MADEENA") {
            this.madeenaCheckInDate = JSON.parse(sessionStorage.getItem('userObject')).madeenaCheckinDate;
            this.madeenaCheckOutDate = JSON.parse(sessionStorage.getItem('userObject')).madeenaCheckoutDate
            this.noOfDaysInMadeena = this.helperService.noOfDaysBetweenTwoDates(this.madeenaCheckOutDate, this.madeenaCheckInDate)
            sessionStorage.setItem('mdSearchId', data.data.search_id);
          }
          if(data.data.results === undefined || Object.keys(data.data.results).length === 0 || data.data.results.length === 0 ){
            this.getHotelsList(data.data.search_id,city)
          }
        }
        else if (data.code == "00400") {
          this.hotelSearchResponse = true
          var msg = ""
          if(data && data.message && data.message.location){
            msg = msg.concat("Location field is empty ")
          }
          if(data && data.message && data.message.rooms){
            msg = msg.concat("Room selection is empty ")
          }
          if(data && data.message && data.message.rooms){
            msg = msg.concat("Room selection is empty ")
          }
          if(data && data.message && data.message.check_in_date){
            msg = msg.concat("Check in date is empty ")
          }
          if(data && data.message && data.message.check_out_date){
            msg = msg.concat("Check out date is empty ")
          }
          this.showShimmer = false;
          this.hotelSearchtimer = false;
          Swal.fire({
            icon: 'error',
            text:msg,
            confirmButtonText: this.translate.instant('Search Again')
          }).then((result) => {
            this.router.navigate(['subagent/home']);
          })
        }
        else{
          this.hotelSearchResponse = true
          this.showShimmer = false;
          this.hotelSearchtimer = false;
          Swal.fire({
            icon: 'error',
            text: this.translate.instant('Hotels Not Available From Maqam GDS Please Try Again'),
            confirmButtonText: this.translate.instant('Search Again')
          }).then((result) => {
            this.router.navigate(['subagent/home']);
          })
        }
      }),
      (error) => {
        this.hotelSearchResponse = true
        this.hotelSearchtimer = false;
        Swal.fire({
          icon: 'error',
          text: this.translate.instant('Hotels Not Available From Maqam GDS Please Try Again'),
          confirmButtonText: this.translate.instant('Search Again')
        }).then((result) => {
          this.router.navigate(['subagent/home']);
        })
      };
  }

  setTimerForHotelSearchApiIsPendingForMorethan30Seconds(city){
    timer(this.pendingApiTimer).pipe(takeUntil(this.destroy$)).subscribe(x => {
        if(!this.hotelSearchResponse){
        if(this.hotelSearchSubscription != null && !this.hotelSearchSubscription != undefined){
           this.hotelSearchSubscription.unsubscribe();
      }
      Swal.fire({
        icon: 'error',
        showCancelButton: true,
        text: this.translate.instant("It seems like server busy from Maqam-GDS."),
        cancelButtonText:'Back To Home',
        confirmButtonText: this.translate.instant('Try Again'),
      }).then((result) => {
        this.hotelSearchtimer = false;
        if (result.isConfirmed){
          this.hotelSearch(city)
        }else{
          this.router.navigate(['subagent/home']);
        }
      })}
    });
  }

  getHotelsList(id,city){
    if(!this.disableHotelListTimer){
    this.setTimerForHotelListApiIsPendingForMorethan30Seconds(id,city)}
    this.hotelListResponse = false;
    this.hotelListSubscription = this.common.v2_5GetHotelList(id,sessionStorage.getItem('userLanguage'),localStorage.getItem("ulogId")).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
          this.hotelListResponse = true;
          this.disableHotelListTimer = false;
          if(data.code == "0"){
          this.hotelListCounter = 40
          this.hotelSearchCounter = 40
          this.hotelsList = data.data;
          if (this.hotelsList.length == 0) {
            this.noHtlFromMQMGDS()
          }
          if(this.hotelsList.length > 0) {
            this.hotelsList = this.hotelsList.sort((a,b)=>(a.amount) - (b.amount));
            this.hotelsList.forEach(x=>x.fromCache = false)
            this.hotelsList.forEach(x=>x.insertedCity = city)
            this.hotelsList.forEach(x=>x.providers.sort((a,b)=>(a.amount) - (b.amount)))
            this.hotelsList.sort((a, b) => a.favorited === b.favorited ? 0 : (a.favorited ? -1 : 1));
          }
      }
      else if(data.code == "00123" || data.code == "00111"){
        this.disableHotelListTimer = true;
        if(this.hotelListCounter > 0){
          this.hotelListCounter--;
          this.hotelListRepeater = timer(this.hotelListTimer).pipe(takeUntil(this.destroy$)).subscribe(x => this.getHotelsList(this.searchId,this.currentCity));
        }else{
          this.hotelListResponse = true;
          this.noHtlFromMQMGDS()
        }
      }
      else if(data.code == "00113" || data.code == "01500" || data.code == "00112"){
        this.hotelListResponse = true;
        this.disableHotelListTimer = true;
        Swal.fire({
          icon: 'error',
          showCancelButton: true,
          text: this.translate.instant("It seems like server busy from Maqam-GDS."),
          cancelButtonText:'Back To Home',
          confirmButtonText: this.translate.instant('Try Again'),
        }).then((result) => {
          if (result.isConfirmed){
            this.hotelSearch(city)
          }else{
            this.router.navigate(['subagent/home']);
          }
        })
        this.hotelListResponse = true;        
      }
    },
      (error) => {
        this.disableHotelListTimer = false;
        this.hotelListResponse = true;
        this.noHtlFromMQMGDS()
      }
    );
  }

  setTimerForHotelListApiIsPendingForMorethan30Seconds(id,city){
    timer(this.pendingApiTimer).pipe(takeUntil(this.destroy$)).subscribe(x => {
        if(!this.hotelListResponse){
          if(this.hotelListSubscription != null &&  this.hotelListSubscription != undefined){
          this.hotelListSubscription.unsubscribe();}
          Swal.fire({
            icon: 'error',
            showCancelButton: true,
            text: this.translate.instant("It seems like server busy from Maqam-GDS."),
            cancelButtonText:'Back To Home',
            confirmButtonText: this.translate.instant('Try Again'),
          }).then((result) => {
            this.disableHotelListTimer = false;
            if(result.isConfirmed){
              this.getHotelsList(id,city)
            }else{
              this.router.navigate(['subagent/home']);
            }
          })
      }
    });
  }

  noHtlFromMQMGDS(){
    this.showShimmer = false;
    Swal.fire({
      icon: 'error',
      text: this.translate.instant('Hotels Not Available From Maqam GDS Please Change Dates'),
      confirmButtonText: this.translate.instant('Search Again')
    }).then((result) => {
      this.router.navigate(['subagent/home']);
    })
  }


  /*
 * this method for polling loader status
 */
  ngDoCheck() {
    this.currency = HedderComponent.globelCurrency;
    this.policy = CreateTripComponent.termsCondtion;
    this.policyArabic = CreateTripComponent.termsConditionArabic;
    this.generalHelper.checkForAccessToken();
    if (!this.appStore.showShimmer) { this.showShimmer = false; }
    var obj = JSON.parse(sessionStorage.getItem('userObject'));
    if(obj && obj.travallersCount && this.vehicleCount > obj.travallersCount){
      this.disableModifyTransportBttn = true
    }else if(this.vehicleCount == 0){
      this.disableModifyTransportBttn = true
    }
    else{
      this.disableModifyTransportBttn = false
    }
    if(sessionStorage.getItem('disableShareBtn') == 'true'){
      this.disableShareBtn = true;
    }else{
      this.disableShareBtn = false;
    }
  }


  /**
   * Method for navigate to home page
   */
  backToHomePage() {
    this.router.navigate(['subagent/home']);
    this.clearAppStore();
    sessionStorage.removeItem('params');
  }

  /**
   * Method for clearing appstore
   */
  clearAppStore() {
    this.appStore.isAvailabilityFails = false;
  }

  closeIbanPopUp(){
    this.showIbanPopup = false;
    this.bookContinue = false;
    this.disablePayBttn = false;
    this.travellersForm.enable()
  }

  omit_special_char(event){
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
   }

   termsandcondition(){
     if(sessionStorage.getItem('userLanguage') == 'ar-AE'){
      CreateTripComponent.termsConditionArabic = true;
     }else{
      CreateTripComponent.termsCondtion = true;
     }
   }

   policyCheck(e){
    if (e.target.checked){
      this.disablePayBttn = false;
    }else{
      this.disablePayBttn = true;
    }
   }

   closemodifySearchTransportPopup(){
     this.modifySearchTransportPopup = false;
   }

   ngOnDestroy(){
     this.pendingApiTimer = 0;
    this.hotelListResponse = true;
    this.hotelSearchResponse = true;
    this.destroy$.next();
    this.destroy$.complete(); 
   }

   iBanNumberValidation(event){
    this.accNo = event;
    var test = this.subagentHelper.ibanTextValidation(this.accNo);
    if(test != 'true'){
      this.ibanValidation = true;
      this.ibanMessge = test;
      this.spinner.hide();
      return;
    }else{ this.ibanValidation = false;}
   }

   createLink(){
    this.isLinkReady = true;
    this.common.bookingRequestAgencyList().subscribe((data:any) =>{
      this.isLinkReady = false;
      this.agencyNumberList = data.data;
      this.showLinkPopup = true
    })
   }
   closeLinkPoupup(){
    this.showLinkPopup = false
   }

  generateShareLink(){
    let lnk="whatsapp://send?phone="
    let p = this.mobileNumber
      this.b2bWhtLnk = lnk+this.travellersForm.controls.phone_country_code.value+p+"&text="+this.b2bLink
      this.b2bUrl = this.dom.bypassSecurityTrustUrl(this.b2bWhtLnk);
      this.showLinkPopup = false;
      this.isLinkReady = false;
      this.notifyService.showSuccess(this.translate.instant("Sent successfully"));
  }

  copyLinkB2b(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notifyService.showSuccess(this.translate.instant("Copied successfully"));
  }

  makeShortenUrlB2b(url){
    this.common.getShortenUrl({"url":url},sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.b2bLink = data.short_url
      this.generateShareLink()
    },(error)=>{
      this.callB2bLink = true;
    })
  }
  callLinkCreator(){
    this.isLinkReady = true;
    this.createSharelink()
  }

  createSharelink(){
    var service;
    var step:number;
    if(this.steps.length == 3){
      service = 'All in One';
      step = 0;
    }else if(this.steps[0]=='1'){
      service = 'Makkah Hotel';
      step = 1;
    }else if(this.steps[0]=='2'){
      service = 'Madinah Hotel';
      step = 2;
    }else if(this.steps[0]=='3'){
      service = 'Transport';
      step = 3;
    }
    var tagData = {
      services:this.serviceList,
      step:step,
      request_date:this.today,
      start_date:this.tripData.start_date,
      travellerForm:this.travellersForm.value,
      rooms:this.rooms,
      room_count:+sessionStorage.getItem('roomCount')?+sessionStorage.getItem('roomCount'):1,
      total_travelers:this.totalTravellers,
      vehicle_count:this.vehicleCount,
    }
    this.tagName.push(tagData);
    let body = {"contry_code":this.countryCodeReq,"phone_number":this.mobileNumber,"custome_trip_id":sessionStorage.getItem('custom_trip_id'),"tag":this.tagName}
    this.common.generateShareLink(sessionStorage.getItem('custom_trip_id'),body,sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.showLinkPopup = false;
      this.isLinkReady = false;
      this.notifyService.showSuccess(this.translate.instant("Sent successfully"));
    },(error)=>{
      this.callB2bLink = true;
    })
  }

  onOtpChange(evt){
    this.authCode = evt;
    if(this.authCode.length == 6){
      this.lengthAuthCode = false;
    }

  }

  currencyConversion(amount){
    return this.subagentHelper.currencyCalculation(amount)
  }

  selectIbanNumber(iban){
    this.accNo = iban.iban;
    this.ibanTagName = iban.tag;
    this.iBanNumberValidation(iban.iban);
  }

  saveIbanNumberToList(iban){
    this.ibanNumberList.push(iban);
    this.ibanNumberList = this.ibanNumberList.filter((element, i) => i === this.ibanNumberList.indexOf(element));
    localStorage.setItem('ibanNumbers',JSON.stringify(this.ibanNumberList))
  }
  toggleMoreOption(){
    this.moreOptionView = !this.moreOptionView
  }

  SaveIbanDat(){
    if(this.accNo && this.accNo != null){
      if(!this.ibanValidation){
        this.saveBttnActive = true;
        var body = {
          iban : this.accNo,
          tag : this.ibanTagName
        }
        this.common.addIbanNumber(body).pipe(takeUntil(this.destroy$)).subscribe(data =>{
          this.notifyService.showSuccess('saved');
          this.saveBttnActive = false;
          this.setIbanNumberList();
        })
      }

    }

  }

  addAgencyNumberForBookingRequest(data){
    this.countryCodeReq = data.phn_country_code;
  }

  getVehicleCount(evet){
    this.vehicleCount = +evet.target.value;
  }
}