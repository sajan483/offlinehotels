import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { HotelListFilter } from 'src/app/components/sub-agent/models/hotelListModel';


@Component({
  selector: 'app-hotel-filter-web',
  templateUrl: './hotel-filter-web.component.html',
  styleUrls: ['./hotel-filter-web.component.scss'],
  animations: [
    trigger('expand', [
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('0.5s', style({ height: 0, opacity: 0 }))
      ]),
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.5s', style({ height: '*', opacity: 1 }))
      ])
    ]),
  ],
})
export class HotelFilterWebComponent implements OnInit {
  public showHotelNameList: boolean[] = [] as boolean[];
  public showFilterHotelName: boolean = true; public showFilterStarRating: boolean = true; public showFilterPriceRange: boolean = true;
  public showFilterReview: boolean = true; public showFilterAmenities: boolean = true; public showFilterPaymentType: boolean = true;
  public showFilterChainProperties: boolean = true; public showFilterPropertyType: boolean = true; public showFilterDistanceFromCity: boolean = true;
  public showFilterPopularLocation: boolean = true; public showFilterLocality: boolean = true; public showFilterTripAdvisor: boolean = true; showFilterLocations: boolean = true;
  public DisabledAnimation: boolean = true;
  @ViewChild('componentToAnimate', { read: ElementRef, static: false }) componentToAnimate;
  @ViewChild('filterWrapper', { read: ElementRef, static: false }) filterWrapper;
  @ViewChild('filterHeight', { read: ElementRef, static: false }) filterHeight;
  @ViewChild('skelton', { read: ElementRef, static: false }) skelton;
  public viewAll: boolean = true; public showLess: boolean = false; public viewAllcp: boolean = true; public showLesscp: boolean = false;
  public viewAllpt: boolean = true; public showLesspt: boolean = false; public viewAllpl: boolean = true; public showLesspl: boolean = false;
  public viewAllbd: boolean = true; public showLessbd: boolean = false;
  public viewAllLoc: boolean = true; public showLessLoc: boolean = false;


  toggleFilterSections(section: string) {
    try {
      this.DisabledAnimation = false;
      if (section == 'hotelName')
        this.showFilterHotelName = !this.showFilterHotelName;
      else if (section == 'starRating')
        this.showFilterStarRating = !this.showFilterStarRating;
      else if (section == 'priceRange')
        this.showFilterPriceRange = !this.showFilterPriceRange;
      else if (section == 'review')
        this.showFilterReview = !this.showFilterReview;
      else if (section == 'amenities')
        this.showFilterAmenities = !this.showFilterAmenities;
      else if (section == 'paymentType')
        this.showFilterPaymentType = !this.showFilterPaymentType;
      else if (section == 'chainProperties')
        this.showFilterChainProperties = !this.showFilterChainProperties;
      else if (section == 'propertyType')
        this.showFilterPropertyType = !this.showFilterPropertyType;
      else if (section == 'distanceFromCity')
        this.showFilterDistanceFromCity = !this.showFilterDistanceFromCity;
      else if (section == 'popularLocation')
        this.showFilterPopularLocation = !this.showFilterPopularLocation;
      else if (section == 'locality')
        this.showFilterLocality = !this.showFilterLocality;
      else if (section == 'tripAdvisor')
        this.showFilterTripAdvisor = !this.showFilterTripAdvisor;
      else if (section == 'locations')
        this.showFilterLocations = !this.showFilterLocations;

      this.scrollFilterToTop();
    }
    catch (exception) {
      
    }
  }
  setVieworShow(type: string) {
    try {
      this.DisabledAnimation = false;
      if (type == "amenties") {
        this.viewAll = !this.viewAll;
        this.showLess = !this.showLess;
      }
      else if (type == "chainproperty") {
        this.viewAllcp = !this.viewAllcp;
        this.showLesscp = !this.showLesscp;
      }
      else if (type == "propertytype") {
        this.viewAllpt = !this.viewAllpt;
        this.showLesspt = !this.showLesspt;
      }
      else if (type == "popular") {
        this.viewAllpl = !this.viewAllpl;
        this.showLesspl = !this.showLesspl;
      }
      else if (type == "business") {
        this.viewAllbd = !this.viewAllbd;
        this.showLessbd = !this.showLessbd;
      } else if (type == "locations") {
        this.viewAllLoc = !this.viewAllLoc;
        this.showLessLoc = !this.showLessLoc;
      }
      this.scrollFilterToTop();
    }
    catch (exception) {
      
    }
  }
  scrollFilterToTop() {
    setTimeout(() => {
      if ((this.componentToAnimate.nativeElement.offsetHeight + window.pageYOffset) > document.documentElement.scrollHeight) {
        if (this.filterWrapper.nativeElement.scrollTop > this.componentToAnimate.nativeElement.offsetHeight / 3) {
          this.renderer.addClass(this.filterWrapper.nativeElement, 'smooth-scroll');
          this.filterWrapper.nativeElement.scrollTop = 100000000;
          this.renderer.removeClass(this.filterWrapper.nativeElement, 'smooth-scroll');
        }
      }
    }, 700);
  }


  @Input() shimmer:boolean = true;
  @Input() hoteName:any;
  @Input() starFilter:any[]=[];
  @Input() minPrice:number = 1000;
  @Input() maxPrice:number = 20000;
  @Input() valuePrice:number = 20000;
  @Input() aminitiesList:any[]=[];
  @Input() mealPlan:any[]=[];
  @Input() hotelChainNameList:any[]=[];
  @Input() currency:any;
  @Input() filterData:HotelListFilter;
  @Input() isMobile:boolean = false;

  @Output() hoteNameFilter = new EventEmitter();
  @Output() filterLists = new EventEmitter();
  @Output() resetFilter = new EventEmitter();

  constructor( private renderer: Renderer2){}

  ngOnInit(){
    
  }

  nameFilter(evt){
    this.hoteNameFilter.emit(this.hoteName);
  }

  filterStarRating(evt,i){
    if(evt.checked){
      this.starFilter[i].check = true;
    }else{
      this.starFilter[i].check = false;
    }
    let filter = [];
    this.starFilter.forEach(data=>{
      if(data.check){
        filter.push(data.star)
      }
    })
    this.filterData.starRating = filter;
    this.emitData();
  }

  filterAminities(evt,i){
    if(evt.checked){
      this.aminitiesList[i].check = true;
    }else{
      this.aminitiesList[i].check = false;
    }
    let filter = [];
    this.aminitiesList.forEach(data=>{
      if(data.check){
        filter.push(data.name)
      }
    })
    this.filterData.aminities = filter;
    this.emitData();
  }

  filterMealType(evt,i){
    if(evt.checked){
      this.mealPlan[i].check = true;
    }else{
      this.mealPlan[i].check = false;
    }
    let filter = [];
    this.mealPlan.forEach(data=>{
      if(data.check){
        filter.push(data.meal_provided)
      }
    })
    this.filterData.mealPlan = filter;
    this.emitData();
  }

  filterHotelName(evt,i){
    if(evt.checked){
      this.hotelChainNameList[i].check = true;
    }else{
      this.hotelChainNameList[i].check = false;
    }
    let filter = [];
    this.hotelChainNameList.forEach(data=>{
      if(data.check){
        filter.push(data.code)
      }
    })
    this.filterData.hotelChainName = filter;
    this.emitData();
  }

  changePrice(){
    this.filterData.price = this.valuePrice;
    this.emitData();
  }

  emitData(){
    this.filterLists.emit(this.filterData)
  }

  resetFilterDatas(){
    this.resetFilter.emit();
  }
}
