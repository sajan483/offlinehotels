import { DatePipe } from "@angular/common";
import Swal from 'sweetalert2';
import { DoCheck, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { Component, OnInit, Pipe, PipeTransform } from "@angular/core";
import { Router } from "@angular/router";
import { CreateTripAdapter } from "src/app/adapters/sub-agent/create-trip-adapter";
import { HelperService } from "src/app/common/services/helper-service";
import { CreateTripHelper } from "src/app/helpers/sub-agent/create-trip-helpers";
import { NotificationService } from "src/app/common/services/notification.service";
import { AppStore } from "src/app/stores/app.store";
import { GeneralHelper } from "src/app/helpers/General/general-helpers";
import { SubAgentApiService } from "src/app/Services/sub-agent-api-services";
import { TranslateService } from '@ngx-translate/core';
import { SubAgentStateService } from '../../../../../../Services/sub-agent-state.service';
import { HotelFilterModel, HotelFilterModelStarRating, HotelFilterModelAmenities } from '../../../../../../models/hotel_filter_model';
import { SubAgentGeneralHelper } from '../../../../../../helpers/sub-agent/general-helper';
import { Subject, Subscription,timer} from "rxjs";
import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { environment } from "src/environments/environment";
import { SegmentService } from "ngx-segment-analytics";
import { HotelDetailsPopupComponent } from "../hotel-details-popup/hotel-details-popup.component";
import { DateTimeToDateFormat } from "src/app/helpers/date_time/date_pipe";
import { LabelType, Options } from "@angular-slider/ngx-slider";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "app-makka-hotel",
  templateUrl: "./makka-hotel.component.html",
  styleUrls: ["./makka-hotel.component.scss"],
})

export class MakkaHotelComponent implements OnInit, DoCheck, OnDestroy {
  static addSubPcc: boolean = false;
  private destroy$ = new Subject();
  rooms: any;
  userDetails: any;
  selectedCurrency: any = this.appStore.currencyCode;
  selectedLanguage: any;
  isHotelsSortedByPrice: boolean = false;
  isHotelSortedByFav:boolean = false;
  isHotelListSortedByHaramDistance: boolean = false;
  selectedRoomCount: number;
  selectedTravellersCount: number;
  totalRoomPrice: number;
  userFilter: any = { name: '' };
  selectedHotel: any;
  selectedRoomGroups: any[];
  makkaHotelName: any;
  makkaCheckInTime: any;
  makkaCheckOutTime: any;
  hotelPics: any[];
  hotelPics1: any[];
  hotelPics2: any[];
  moreimages: boolean;
  readonly = true;
  formatLabel: any;
  imageshow: number;
  isGroupedMakka: boolean;
  showHotelDetails: boolean;
  makkaSelectActivate: boolean;
  hotelInfo: any;
  showShimmer: boolean;
  showHotelDetailsShimmer: boolean;
  private createTripAdapter: CreateTripAdapter = new CreateTripAdapter(this.helperService, this.dateForm);
  private createTripSupport: CreateTripHelper = new CreateTripHelper(this.helperService, this.translate,this.dateForm);
  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(this.subagentState);

  search: string = "";
  hotelData: any;
  showDetailsShimmer: boolean;
  generalHelper: GeneralHelper;
  stage: number;
  steps: any[];
  moreFilterArrow: boolean = false;
  uncheckAmenities = false;
  amenitiesList = [];
  filterAmenities = [];
  hotelPriceRange: number = 10000;
  dummyHotellist: any[] = [];
  hotelDetailSubscription: Subscription;
  currency: any;
  subPcc_hotel_code: any;
  fromCache: boolean = true;
  baseUrl: string = "";
  prodUrl: string = environment.prodUrl;
  favLoader: string = "";
  bookContinue: boolean;
  showHotelFilterDiv: boolean = false;
  pendingApiTimer = environment.pendingApiTime;
  selectedHotelResponse: boolean = false;
  options: Options = {
    floor: 0,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min Price :</b> ' + value;
        case LabelType.High:
          return '<b>Max Price :</b> ' + value;
        default:
          return '' + value;
      }
    }
    // ceil: 100,
    // step: 5
  };
  minPriceRange = 0;
  maxPriceRange = 0;
  selectedHotelItem: any ;
  taskId: any = "";
  disableInfoTimer: boolean = false;

  constructor(
    private commonService: SubAgentApiService,
    private notifyService: NotificationService,
    private appStore: AppStore,
    private datepipe: DatePipe,
    private router: Router,
    private helperService: HelperService,
    private genHelper: GeneralHelper,
    private translate: TranslateService,
    private subagentState: SubAgentStateService,
    private segment: SegmentService,
    private dateForm:DateTimeToDateFormat
  ) {
    this.generalHelper = genHelper;
  }

  @Input() hotelsList: any[];
  @Output() notifyGrandparent = new EventEmitter();
  @Output() notifyCreateTripForChange = new EventEmitter();

  childEvent(event) {
    this.notifyGrandparent.emit('event')
  }

  childEventForChangeItinerary(event) {
    this.notifyCreateTripForChange.emit('event')
  }

  ngOnInit() {
    this.setInitialValues();
    if (this.baseUrl == this.prodUrl) {
      window.analytics.page('subagent/hotel', {
        user: localStorage.getItem("userTypeName"),
        userId: localStorage.getItem("userId"),
        portal: "B2B"
      });
    }
    if (sessionStorage.getItem('service') == 'All') {
      if (this.hotelsList[0].city == "Makkah") {
        this.stage = 0
        sessionStorage.setItem('stage', JSON.stringify(this.stage))
      }
      else {
        this.stage = 1
        sessionStorage.setItem('stage', JSON.stringify(this.stage))
      }
    } else {
      this.stage = 0
      sessionStorage.setItem('stage', JSON.stringify(this.stage))
    }
    this.checkDetailsOpen()
    this.processHotelListResponse();
  }

  setInitialValues() {
    if (this.hotelsList && this.hotelsList.length > 0) {
      if (this.hotelsList[0].city == "Makkah") {
        this.subPcc_hotel_code = JSON.parse(sessionStorage.getItem('userObject')).makka_subpcc_hotel_code;
      } else {
        this.subPcc_hotel_code = JSON.parse(sessionStorage.getItem('userObject')).madeena_subpcc_hotel_code;
      }
    }

    this.subagentState.FilterModel = {} as HotelFilterModel;
    this.subagentState.FilterModel.Amenities = [];
    this.subagentState.FilterModel.StarRating = [];
  }


  checkDetailsOpen() {
    var flag = sessionStorage.getItem('hotelDetailsFlag')
    if (flag == 'open') {
      this.appStore.showHotelDetails = false;
      sessionStorage.setItem('hotelDetailsFlag', 'close');
      this.showHotelDetailsPopUp(JSON.parse(sessionStorage.getItem('hotelInfo')));
    }
  }

  /*
* this method for showing hotelDetails PopUp
*/
  showHotelDetailsPopUp(item) {
    this.showDetailsShimmer = true;
    sessionStorage.setItem('hotelInfo', JSON.stringify(item))
    this.appStore.showHotelDetailsShimmer = true;
    this.showHotelDetailsShimmer = true;
    this.selectedRoomCount = 0;
    this.selectedTravellersCount = 0;
    this.totalRoomPrice = 0;
    this.fetchSelectedHotelInfo(item);
  }


  ngAfterViewChecked() {
    this.translate.use((sessionStorage.getItem('userLanguage') === 'ar-AE') ? "ar-AE" : sessionStorage.getItem('userLanguage'));
    if (sessionStorage.getItem('userLanguage') == "ar-AE" || sessionStorage.getItem('userLanguage') == "ur-UR") {
      (<HTMLInputElement>document.getElementById("body")).classList.add('mirror_css');
    } else {
      (<HTMLInputElement>document.getElementById("body")).classList.remove('mirror_css');
    }
  }

  /*
   * this method for setting lang and currency
   */
  setDefaultLangAndCurrency() {
    if (typeof this.selectedCurrency == "undefined") {
      this.selectedCurrency = this.appStore.currencyCode;
    }
    if (typeof this.selectedLanguage == "undefined") {
      var lang: any = this.selectedLanguage = "en-US";
    }
  }

  /*
   * this method for fetching selected hotel details
   */

  fetchSelectedHotelInfo(item) {
    this.selectedHotelItem = item;
    sessionStorage.setItem('selectedHotelInfo', JSON.stringify(item));
    this.setDefaultLangAndCurrency();
    this.selectedLanguage = sessionStorage.getItem('userLanguage')
    if(!this.disableInfoTimer){
    this.setTimerForSelectedHotelApiIsPendingForMorethan30Seconds(item);}
    this.selectedHotelResponse = false;
    this.hotelDetailSubscription = this.commonService.getSelectedHotelInfoV2_5(this.createTripAdapter.selectedHotelInfoRequest(this.selectedLanguage, item, this.search), this.selectedLanguage,sessionStorage.getItem('ulogId'),this.taskId).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
       if(data.code == "0"){
        this.taskId = "";
        this.disableInfoTimer = false;
        this.selectedHotelResponse = true;
        this.hotelData = data.data;
        this.hotelData.insertedCity = item.insertedCity
        this.showDetailsShimmer = false;
        this.showHotelDetails = true;
        HotelDetailsPopupComponent.loadRoomDetails = false;
        var flag = sessionStorage.getItem('stage');
        if (flag === '0' || flag === '1') {
          sessionStorage.setItem('hotelDetailsFlag', 'open')
        }
        window.scroll(0, 0);
       }else if(data.code == "00111"){
        this.disableInfoTimer = true;
         this.taskId = data.task_id;
         this.fetchSelectedHotelInfo(item);
       }
       else if(data.code == "00123"){
        this.disableInfoTimer = true;
        this.fetchSelectedHotelInfo(item);
       }
      },
      (error) => {
        this.selectedHotelResponse = true;
        this.showDetailsShimmer = false;
        this.disableInfoTimer = false;
        Swal.fire({
          icon: 'error',
          text: this.translate.instant('Sorry this hotel not available from Maqam GDS ,Please select another one'),
          confirmButtonText: this.translate.instant('Change Hotel')
        })
      }
    );
  }

  setTimerForSelectedHotelApiIsPendingForMorethan30Seconds(item){
    timer(this.pendingApiTimer).pipe(takeUntil(this.destroy$)).subscribe(x => {
        if(!this.selectedHotelResponse){
          if(this.hotelDetailSubscription != undefined && this.hotelDetailSubscription != null){
            this.hotelDetailSubscription.unsubscribe();
          }
          Swal.fire({
            icon: 'error',
            showCancelButton: true,
            text: this.translate.instant("It seems like server busy from Maqam-GDS."),
            cancelButtonText:'Cancel',
            confirmButtonText: this.translate.instant('Try Again'),
          }).then((result) => {
            if (result.isConfirmed){
              this.disableInfoTimer = false;
              this.fetchSelectedHotelInfo(item) 
            }else{
              this.disableInfoTimer = false;
            }
          })
       }
    });
  }

  /*
  * this method for navigate to first page
  */
  backToHomePage() {
    this.router.navigate(["/firstpage"]);
  }

  /**
  * this method for checking model status
  */
  ngDoCheck() {
    this.currency = HedderComponent.globelCurrency;
    this.generalHelper.checkForAccessToken();
    if (this.appStore.showHotelDetailsShimmer) {
      this.showHotelDetailsShimmer = true;
    }
    if (!this.appStore.showHotelDetailsShimmer) {
      this.showHotelDetailsShimmer = false;
    }

    if (this.hotelsList && this.hotelsList.length > 0) {
      this.appStore.showShimmer = false;
    }

    if (MakkaHotelComponent.addSubPcc) {
      this.showHotelDetailsPopUp(JSON.parse(sessionStorage.getItem('hotelInfo')));
      MakkaHotelComponent.addSubPcc = false;
    }
  }

  currencyConversion(amount) {
    return this.subagentHelper.currencyCalculation(amount)
  }

  readMore(event, i) {
    (<HTMLElement>document.getElementById("readLessBttn" + i)).style.display = "inline-block";
    (<HTMLElement>document.getElementById("readMoreBttn" + i)).style.display = "none";
    event.target.previousElementSibling.style.maxHeight = event.target.previousElementSibling.scrollHeight + "px";
  }

  readLess(event, i) {
    (<HTMLElement>document.getElementById("readLessBttn" + i)).style.display = "none";
    (<HTMLElement>document.getElementById("readMoreBttn" + i)).style.display = "inline-block";
    event.target.previousElementSibling.previousElementSibling.style.maxHeight = null;
  }
  moreFilter() {
    this.moreFilterArrow = !this.moreFilterArrow;
    this.showHotelFilterDiv = !this.showHotelFilterDiv;
  }

  /*
* this method for sorting hotel list according to price,haram distance
*/
  priceHotelFilter() {

    if (!this.isHotelsSortedByPrice == false) {
      this.sortByPrice(true);
      // this.hotelsList.sort((a, b) => (a.amount) - (b.amount));
      this.isHotelsSortedByPrice = false;
    } else {

      this.sortByPrice(false);
      // this.hotelsList.reverse();
      this.isHotelsSortedByPrice = true;
    }
  }

  sortByPrice(asc){
    for (let i = 0; i < this.hotelsList.length; i++)
    {
        // Find the minimum element in unsorted array
        let min_idx = i;
        for (let j = i + 1; j < this.hotelsList.length; j++){
            if(!asc){
              if (this.hotelsList[j].amount < this.hotelsList[min_idx].amount){
                min_idx = j;
            }
            }else{
              if (this.hotelsList[j].amount > this.hotelsList[min_idx].amount){
                min_idx = j;
            }
            }
          }
        // Swap the found minimum element with the first
        // element
        let temp = this.hotelsList[min_idx];
        this.hotelsList[min_idx] = this.hotelsList[i];
        this.hotelsList[i] = temp;
    }
  }

  haramdistancefilterUp() {
    if (this.hotelsList[0].city == "Makkah") {
      var nullList = this.hotelsList.filter(x => x.haram_distance == null)
      this.hotelsList = this.hotelsList.filter(x => x.haram_distance)
      this.hotelsList.sort((a, b) => (a.haram_distance) - (b.haram_distance));
      this.hotelsList = this.hotelsList.concat(nullList);
      this.isHotelListSortedByHaramDistance = !this.isHotelListSortedByHaramDistance;
    } else {
      var nullList = this.hotelsList.filter(x => x.nabawi_distance == null)
      this.hotelsList = this.hotelsList.filter(x => x.nabawi_distance)
      this.hotelsList.sort((a, b) => (a.nabawi_distance) - (b.nabawi_distance));
      this.hotelsList = this.hotelsList.concat(nullList);
      this.isHotelListSortedByHaramDistance = !this.isHotelListSortedByHaramDistance;

    }
  }

  haramdistancefilterDown() {
    if (this.hotelsList[0].city == "Makkah") {
      var nullList = this.hotelsList.filter(x => x.haram_distance == null)
      this.hotelsList = this.hotelsList.filter(x => x.haram_distance)
      this.hotelsList.sort((a, b) => (b.haram_distance) - (a.haram_distance));
      this.hotelsList = this.hotelsList.concat(nullList);
      this.isHotelListSortedByHaramDistance = !this.isHotelListSortedByHaramDistance;
    } else {
      var nullList = this.hotelsList.filter(x => x.nabawi_distance == null)
      this.hotelsList = this.hotelsList.filter(x => x.nabawi_distance)
      this.hotelsList.sort((a, b) => (b.nabawi_distance) - (a.nabawi_distance));
      this.hotelsList = this.hotelsList.concat(nullList);
      this.isHotelListSortedByHaramDistance = !this.isHotelListSortedByHaramDistance;
    }
  }

  resetAllFilter() {
    this.subagentHelper.resetFilterModel();
    this.resetHotelList();
    this.userFilter.name = ''
    this.hotelsList = JSON.parse(sessionStorage.getItem('htlList'))
  }

  getDetailsPopupFlag($event) {
    if ($event == 'hide') {
      this.showHotelDetails = false
      sessionStorage.removeItem('hotelData')
    }
  }

  /**
  * function to process the HotelLisr Response
  *  1. setting FilterStatus;
  *  2. setting Amenities in subagent state variable
  *  3. setting StarRating in subagent state variable
  */
  processHotelListResponse() {
    if (this.hotelsList && this.hotelsList.length > 0) {
      this.minPriceRange = Math.floor(this.hotelsList[0].amount);
      this.hotelsList.forEach(list => {
        if(list.amount<this.minPriceRange){
          this.minPriceRange = Math.floor(list.amount);
        }
        if(list.amount>this.maxPriceRange){
          this.maxPriceRange = Math.ceil(list.amount);
        }
        this.options.floor = this.minPriceRange;
        this.options.ceil = this.maxPriceRange;
        list.FilterStatus = true;
        if (list.amenities && list.amenities.length > 0) {
          list.amenities.forEach(amenities => {
            if (this.subagentState && this.subagentState.FilterModel && this.subagentState.FilterModel.Amenities && this.subagentState.FilterModel.Amenities.length > 0) {
              if ((this.subagentState.FilterModel.Amenities.filter(am => am.Name == amenities.name)).length == 0) {
                let obj = {} as HotelFilterModelAmenities;
                obj.Name = amenities.name;
                obj.Tounched = false;
                this.subagentState.FilterModel.Amenities.push(obj);
              }
            }
            else {
              let obj = {} as HotelFilterModelAmenities;
              obj.Name = amenities.name;
              obj.Tounched = false;
              this.subagentState.FilterModel.Amenities.push(obj);
            }
          });
        }

        let obj2 = {} as HotelFilterModelStarRating;
        if (list.rating) {
          if (this.subagentState && this.subagentState.FilterModel && this.subagentState.FilterModel.StarRating && this.subagentState.FilterModel.StarRating.length > 0) {
            if ((this.subagentState.FilterModel.StarRating.filter(ele => ele.Type == list.rating)).length == 0) {
              obj2.Type = list.rating;
              obj2.Tounched = false;
              this.subagentState.FilterModel.StarRating.push(obj2);
            }
          }
          else {
            obj2.Type = list.rating;
            obj2.Tounched = false;
            this.subagentState.FilterModel.StarRating.push(obj2);
          }
          if (this.subagentState && this.subagentState.FilterModel && this.subagentState.FilterModel.StarRating && this.subagentState.FilterModel.StarRating.length > 0) {
            this.subagentState.FilterModel.StarRating.sort((a, b) => b.Type - a.Type);
          }
        }
      });
      this.sortHotelListFavorites()
    }
  }

  fetchHotelList() {
    if (this.subPcc_hotel_code && this.subPcc_hotel_code.length > 0) {
      var temb;
      for (let i = 0; i < this.hotelsList.length; i++) {
        if (this.subPcc_hotel_code == this.hotelsList[i].umrah_hotel_code) {
          temb = this.hotelsList[i];
          break;
        }
      }
      if (temb != undefined) {
        this.hotelsList = [temb].concat(this.hotelsList);
        this.hotelsList = this.hotelsList.filter(
          (item, index, inputArray) => inputArray.indexOf(item) == index);
      }
    }
    return this.hotelsList.filter(lst => lst.FilterStatus && lst.FilterStatus == true);
  }

  /**
   * function to fetch all hotelList with FilterStatus true
   * @returns HotelList
   */
  getAllActiveHotelList() {
    //Resetting hotelList when no filter is applied
    if (this.subagentState && this.subagentState.FilterModel) {
      if (!this.subagentState.FilterModel.FilterApplied) {
        this.resetHotelList();
      }
    }

    if (this.hotelsList && this.hotelsList.length > 0) {
      // return this.hotelsList.filter(lst => lst.FilterStatus && lst.FilterStatus == true);
      return this.fetchHotelList()
    }
  }

  /**
   * function to fetch all amenities
   * @returns Amenities
   */
  getAllAmenities() {
    if (this.subagentState && this.subagentState.FilterModel && this.subagentState.FilterModel.Amenities && this.subagentState.FilterModel.Amenities.length > 0)
      return this.subagentState.FilterModel.Amenities;
  }

  /**
   * function to fetch all ratings
   * @returns StarRatings
   */
  getAllRatings() {
    if (this.subagentState && this.subagentState.FilterModel && this.subagentState.FilterModel.StarRating && this.subagentState.FilterModel.StarRating.length > 0)
      return this.subagentState.FilterModel.StarRating;
  }

  /**
   * function to set amenities & starrating tounched
   * @param item indicated the amenity & starRating
   * @param flag to indicate whether it is amenity or starrating
   * @param event to indicate whether checked or unchecked event
   */
  addFilterModel(item: any, flag: string, event) {
    if (this.subagentState && this.subagentState.FilterModel) {
      if (flag == "amenities") {
        if (this.subagentState.FilterModel.Amenities && this.subagentState.FilterModel.Amenities.length > 0) {
          this.subagentState.FilterModel.Amenities.forEach(amenities => {
            if (amenities.Name == item) {
              if (event.checked)
                amenities.Tounched = true;
              else
                amenities.Tounched = false;
            }

          });
        }
      }
      if (flag = "starRating") {
        if (this.subagentState.FilterModel.StarRating && this.subagentState.FilterModel.StarRating.length > 0) {
          this.subagentState.FilterModel.StarRating.forEach(rating => {
            if (rating.Type == item) {
              if (event.checked)
                rating.Tounched = true;
              else
                rating.Tounched = false;
            }
          });
        }

      }
    }

  }

  /**
   * function to process filter
   */
  applyFilter() {
    this.bookContinue = true;
    this.resetHotelList();
    this.hotelsList = this.subagentHelper.processHotelFilter(this.hotelsList);
    this.bookContinue = false;
    this.moreFilter()
  }

  /**
   * function to close Filter PopUp
   */
  closeFilterPoup() {
    this.minPriceRange = Math.floor(this.hotelsList[0].amount);
    this.hotelsList.forEach((e)=>{
      if(e.amount > this.maxPriceRange){
        this.maxPriceRange = Math.ceil(e.amount);
      }
      if(e.amount<this.minPriceRange){
        this.minPriceRange = Math.floor(e.amount);
      }
    })
    this.subagentHelper.resetFilterModel();
    this.resetHotelList();
    this.moreFilter();
  }

  /**
   * function to set all FilterStatus true for HotelList
   */
  resetHotelList() {
    if (this.hotelsList && this.hotelsList.length > 0) {
      this.hotelsList.forEach(list => {
        list.FilterStatus = true;
      });
    }
  }

  /**
   * function to filter priceRange
   */
  onInputPriceRangeFilter(event) {
    this.subagentState.FilterModel.FilterApplied = true;
    this.subagentState.FilterModel.MinPrice = this.minPriceRange;
    this.subagentState.FilterModel.MaxPrice = this.maxPriceRange;
    this.hotelsList = this.subagentHelper.filterHotelListWithPriceRange(this.hotelsList);
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }
  toggleFavourite(hotelCode) {
    this.favLoader = hotelCode;
    this.hotelsList.forEach((element)=>{
      if(element.umrah_hotel_code==hotelCode){

          this.commonService.makeFavorite({ "hotel": [hotelCode] }).pipe(takeUntil(this.destroy$)).subscribe(
            (data) => {
              this.favLoader = "";
              element.favorited = !element.favorited;
              if(element.favorited){
                this.notifyService.showSuccess("Hotel added to favorite")
              }else{
                this.notifyService.showSuccess("Hotel removed from favorite")
              }
              // this.sortHotelListFavorites();
            },
            (error) => {
              this.favLoader = "";
            }
          );
      }
    });
  }

  toggleFavSort(){
    if(this.hotelsList.filter(e=>e.favorited).length>0){
      this.sortHotelListFavorites()
    }else{
      this.isHotelSortedByFav  =!this.isHotelSortedByFav;
    }
  }
  favSortCount = 0;
  sortHotelListFavorites() {
    this.favSortCount = this.favSortCount + 1;
    let tempHotels = this.hotelsList;
    let tempHotels1 = this.hotelsList;
    let newHotelList= [];
    let favHotels = tempHotels.filter(e=>e.favorited);
    let nFavHotels = tempHotels1.filter(e=>!e.favorited);
    if(!this.isHotelSortedByFav){
      favHotels.forEach(element => {
        newHotelList.push(element);
      });
      nFavHotels.forEach((e)=>{
        newHotelList.push(e);
      })
      this.isHotelSortedByFav = true;
    }else{
      nFavHotels.forEach((e)=>{
        newHotelList.push(e);
      })
      favHotels.forEach(element => {
        newHotelList.push(element);
      });
      this.isHotelSortedByFav = false;
    }
    this.hotelsList = newHotelList;
  }
}
