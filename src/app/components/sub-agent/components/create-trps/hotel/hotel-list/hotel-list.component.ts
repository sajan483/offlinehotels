import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { UserStateService } from 'src/app/components/sub-agent/services/User-service';
import { ApiServiceSubAgent } from 'src/app/components/sub-agent/services/api-service-sub-agent';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/common/services/notification.service';
import { HotelListFilter } from 'src/app/components/sub-agent/models/hotelListModel';
import { SubAgentHotelListHelper } from 'src/app/components/sub-agent/helpers/hotel/hotel-list-helper';
import { DatePipe } from '@angular/common';
import { SubAgentCurrencyLangHelper } from 'src/app/components/sub-agent/helpers/currency-lang-helper';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class hotelsListComponent implements OnInit {

  hotelsListSubscription: Subscription;
  hotelSearchSubscription: Subscription;
  selectLangCode:any;
  selectCurrency:any;
  private destroy$ = new Subject();
  hotelsList:any[]=[];
  dummyHotelList:any[]=[];
  searchId:any;
  listShimmer:boolean = true;
  bttnActive:boolean = true;
  hotelListTimer: number = environment.nextApiCallingTime;
  hotelListCounter: number = environment.listApiCallingCount;
  hotelCount:number = 0;
  location:string;
  occupancy: any;
  ulogId:string;
  private hotelFilterhelper : SubAgentHotelListHelper = new SubAgentHotelListHelper();
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  userFilter: any = { name: '' };
  minAmount:number = 0;
  maxAmound:number = 0;
  valuePrice:number = 0;
  filterHotelChainNameList:any[]=[];
  filterAminitiesList:any[]=[];
  starFilter:any[]=[];
  mealPlan:any[]=[];
  filterData:HotelListFilter;
  mobResetFilterBttn:boolean = false;
  isTimeOutActive:any;
  isMobile: boolean = false;
  travellCount: number;
  popupShow: boolean;
  sortingShow: boolean;

  constructor(private service:ApiServiceSubAgent,private activeRoute:ActivatedRoute,private notifyService: NotificationService,
    private translate: TranslateService,private router:Router,private userStateService: UserStateService,private datePipe:DatePipe) { }

  ngOnInit() {
    window.scrollTo(0,0);
    if (window.innerWidth < 992) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.initialValues();
    this.initialFilter();
  }

  initialValues(){
    this.userStateService.globelCurrency.subscribe(t => this.selectCurrency = t);
    this.userStateService.globalLanguage.subscribe(t => this.selectLangCode = t);
  }

  getLanguage(){
    this.activeRoute.params.subscribe(params =>{
      this.currencyLangHelper.changeLanguage(params.lang);
      this.currencyLangHelper.setCurrency(params.currency)
    })
  }

  ngAfterViewInit() {
    this.getLanguage()
  }

  getSearchBody(evt){
    this.location = evt.body.location;
    this.occupancy = evt.occupancy;
    this.travellCount = evt.travellCount;
    this.ulogId = evt.ulogId;
    let body = evt.body;
    this.listShimmer = true;
    this.bttnActive = true;
    clearTimeout(this.isTimeOutActive);
    this.hotelSearchSubscription = this.service.v2_5PilotHotelSearch(body,this.selectLangCode,this.ulogId).pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
      if(data.code == "0"){
        this.hotelsList = [];
        this.hotelsList = data.data.results;
        this.searchId = data.data.search_id;
        if(this.hotelsList.length > 0){
          this.hotelCount = this.hotelsList.length;
          this.listShimmer = false;
          this.bttnActive = false;
          this.hotelCount = this.hotelsList.length;
          this.hotelsList = this.hotelsList.sort((a,b)=>(a.amount) - (b.amount));
          this.hotelsList.forEach(x=>x.fromCache = false)
          this.hotelsList.forEach(x=>x.providers.sort((a,b)=>(a.amount) - (b.amount)));
          this.hotelsList.sort((a, b) => a.favorite === b.favorite ? 0 : (a.favorite ? -1 : 1));
          this.dummyHotelList = this.hotelsList;
          this.setFulterDatas(this.hotelsList);
        }else{
          this.hotelListCounter = environment.listApiCallingCount;
          this.getHotelList();
        }
        
      }else if (data.code == "00400") {
        let msg = ''
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
        Swal.fire({
          icon: 'error',
          text:msg,
          confirmButtonText: this.translate.instant('Search Again')
        })
      }else{
        Swal.fire({
          icon: 'error',
          text: this.translate.instant('Hotels Not Available From Maqam GDS Please Try Again'),
          confirmButtonText: this.translate.instant('Search Again')
        })
      }
    })
  }

  getHotelList(){
    this.hotelsListSubscription = this.service.v2_5GetHotelList(this.searchId,this.selectLangCode,this.ulogId).pipe(takeUntil(this.destroy$)).subscribe(
      (data:any) =>{
        if(data.code == "0"){
          this.hotelsList = [];
          this.hotelsList = data.data;
          if(this.hotelsList.length > 0) {
            this.listShimmer = false;
            this.bttnActive = false;
            this.hotelCount = this.hotelsList.length;
            this.hotelsList = this.hotelsList.sort((a,b)=>(a.amount) - (b.amount));
            this.hotelsList.forEach(x=>x.fromCache = false)
            this.hotelsList.forEach(x=>x.providers.sort((a,b)=>(a.amount) - (b.amount)));
            this.hotelsList.sort((a, b) => a.favorite === b.favorite ? 0 : (a.favorite ? -1 : 1));
            this.dummyHotelList = this.hotelsList;
            this.setFulterDatas(this.hotelsList);
          }
        }else if(data.code == "00123" || data.code == "00111"){
          if(this.hotelListCounter > 0){
            this.hotelListCounter -- ;
            this.isTimeOutActive = setTimeout(() => {
              this.getHotelList()
            }, this.hotelListTimer);
          }else{
            this.noHtlFromMQMGDS()
          } 
        }else if(data.code == "00113" || data.code == "01500" || data.code == "00112"){
          Swal.fire({
            icon: 'error',
            showCancelButton: true,
            text: this.translate.instant("It seems like Maqam-GDS server is busy ."),
            cancelButtonText: this.translate.instant('Back To Home'),
            confirmButtonText: this.translate.instant('Try Again'),
          })
        }
      },(error) =>{
        this.noHtlFromMQMGDS()
      }
    )
  }

  noHtlFromMQMGDS(){
    Swal.fire({
      icon: 'error',
      text: this.translate.instant('Hotels Not Available From Maqam GDS Please Change Date'),
      confirmButtonText: this.translate.instant('Search Again')
    })
  }

  setFulterDatas(data:any){
    let dummyAminities:any[]=[];
    data.forEach((el,i) => {
      if(i == 0){
        this.minAmount = el.amount;
        this.maxAmound = el.amount;
      }else{
        if(el.amount < this.minAmount){ this.minAmount = el.amount + 100 }
        if(el.amount > this.maxAmound){ 
          this.maxAmound = el.amount + 100;
          this.valuePrice = this.maxAmound;
        }
      }
      
      let htlName = {
        check:false,
        name:el.name,
        code:el.umrah_hotel_code
      }
      this.filterHotelChainNameList.push(htlName);

      el.amenities.forEach(data =>{
        if(!dummyAminities.includes(data.name)){
          dummyAminities.push(data.name);
          let aminity = {
            check:false,
            name:data.name
          }
          this.filterAminitiesList.push(aminity)
        }
      })
    });
  }

  addFavHotel(evt:any){
    this.hotelsList.forEach((element:any)=>{
      if(element.umrah_hotel_code==evt){
        this.service.makeFavorite({"hotel":[evt]}).pipe(takeUntil(this.destroy$)).subscribe(data=>{
          element.favorite = !element.favorite;
          if(element.favorite){
            this.notifyService.showSuccess("Hotel added to favorite")
          }else{
            this.notifyService.showSuccess("Hotel removed from favorite")
          }
        })
      }
      
    },
    (error) => {
      
    })
  }

  sortHotelList(evt){
    this.hotelsList = this.hotelFilterhelper.hotelListSort(evt,this.hotelsList);
    this.dummyHotelList = this.hotelFilterhelper.hotelListSort(evt,this.dummyHotelList);
    if(this.isMobile){
      this.closeSorting()
    }
  }

  hotelFilterData(evt){
    this.userFilter.name = evt;
  }

  filterList(evt:HotelListFilter){
    this.mobResetFilterBttn = true;
    if(evt.price > 0){
      this.valuePrice = evt.price;
    }
    this.hotelsList = this.hotelFilterhelper.hotelListFilter(evt,this.dummyHotelList);
    this.hotelCount = this.hotelsList.length;
  }

  initialFilter(){
    this.userFilter.name = '';
    this.starFilter = [
      {star:5,check:false},
      {star:4,check:false},
      {star:3,check:false},
    ];
    this.mealPlan = [
      {check:false,name:'Room Only',meal_provided:false},
      {check:false,name:'With Meals',meal_provided:true}
    ];
    this.filterData = {
      starRating:[],
      price:0,
      aminities:[],
      mealPlan:[],
      hotelChainName:[]
    }
  }

  resetFilter(){
    this.mobResetFilterBttn = false;
    this.filterAminitiesList.forEach(data =>{
      data.check = false;
    })
    this.filterHotelChainNameList.forEach(data =>{
      data.check = false;
    })
    this.hotelsList = this.dummyHotelList;
    this.hotelCount = this.dummyHotelList.length;
    this.initialFilter();
    this.valuePrice = this.maxAmound;
  }

  showFilter(){
    this.popupShow = true;
  }

  closeFilter(){
   this.popupShow = false;
  }

  showSorting(){
    this.sortingShow = true;
  }

  closeSorting(){
    this.sortingShow = false;
  }

  ngOnDestroy(){
    clearTimeout(this.isTimeOutActive);
    this.destroy$.next();
    this.destroy$.complete(); 
  }

}
