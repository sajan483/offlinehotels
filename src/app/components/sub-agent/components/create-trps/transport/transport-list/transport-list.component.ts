import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiServiceSubAgent } from 'src/app/components/sub-agent/services/api-service-sub-agent';
import { UserStateService } from 'src/app/components/sub-agent/services/User-service';
import { takeUntil } from "rxjs/operators";
import { Subject, Subscription } from 'rxjs';
import { RouteList, TransportFilterData, TransportFilterPostData } from 'src/app/components/sub-agent/models/transportListModel';
import { DatePipe } from '@angular/common';
import { SubAgentDateTimeHelper } from 'src/app/components/sub-agent/helpers/date-time-helpers';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SubAgentTransportListHelper } from 'src/app/components/sub-agent/helpers/transport/transport-helpers';
import { NotificationService } from 'src/app/common/services/notification.service';
import { SubAgentTransportAdapter } from 'src/app/components/sub-agent/adapters/transport/transport-adapter';
import { SubAgentCurrencyLangHelper } from 'src/app/components/sub-agent/helpers/currency-lang-helper';

@Component({
  selector: 'app-transport-list',
  templateUrl: './transport-list.component.html',
  styleUrls: ['./transport-list.component.scss']
})
export class TransportListComponent implements OnInit {

  selectLangCode:any;
  selectCurrency:any;
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  private destroy$ = new Subject();
  searchDataParams:any;
  routeList:RouteList[] = [];
  vehicleList:any[]=[];
  private DateTimeHelper : SubAgentDateTimeHelper = new SubAgentDateTimeHelper(this.datepipe);
  startDate:any;
  vehicleCount:number = 1;
  travelCount:number = 1;
  routeId:string;
  transportList:any[]=[];
  dummyTransportList:any[]=[];
  nextApiCallingTime:number = environment.nextApiCallingTime;
  listApiCallingCount:number;
  listShimmer:boolean = true;
  filterShimmer:boolean = true;
  aditionalService: any = {};
  private transportListHelper : SubAgentTransportListHelper = new SubAgentTransportListHelper();
  filterData:TransportFilterData;
  listCount:number = 0;
  cancellationPopUp:boolean = false;
  policyData: any;
  searchId: number;
  private transportAdapter : SubAgentTransportAdapter = new SubAgentTransportAdapter();
  isMobile: boolean = false;
  bttnActive:boolean = false;
  isTimeOutActive:any;

  constructor(private service:ApiServiceSubAgent,private activeRoute:ActivatedRoute,
    private userStateService: UserStateService,private translate: TranslateService,
    private datepipe:DatePipe,private route:Router,private notifyService: NotificationService) { }

  ngOnInit() {
    if (window.innerWidth < 992) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.getLanguage();
    this.initialFilterData();
  }

  getLanguage(){
    this.activeRoute.params.subscribe(params =>{
      this.currencyLangHelper.changeLanguage(params.lang);
      this.currencyLangHelper.setCurrency(params.currency);
    })
    this.initialValues();
  }

  initialValues(){
    this.userStateService.globelCurrency.subscribe(t => this.selectCurrency = t);
    this.userStateService.globalLanguage.subscribe(t => this.selectLangCode = t);
    this.startDate = this.DateTimeHelper.incrementDate(new Date(),3);
    this.getRouteList();
    this.getVehicleList()
  }

  getVehicleList(){
    this.service.getVehicles(this.selectLangCode).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.vehicleList = data.vehicle_types;
    })
  }

  getRouteList(){
    this.service.getRoutes(this.selectLangCode).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.routeList = data.routes.map(x => ( {item_text: x.name, item_id: x.code } ));
      this.routeId = this.routeList[0].item_id;
      this.getQueryParams()
    })
  }

  getQueryParams(){
    this.searchDataParams = this.activeRoute.snapshot.queryParams;
    if(this.searchDataParams.pax !== undefined &&
      this.searchDataParams.date !== undefined &&
      this.searchDataParams.route !== undefined &&
      this.searchDataParams.count !== undefined){
        this.routeId = this.searchDataParams.route;
        this.startDate = new Date(this.searchDataParams.date);
        this.vehicleCount = +this.searchDataParams.count;
        this.travelCount = +this.searchDataParams.pax;
        let evt = {
          routeId:this.searchDataParams.route,
          travelDate:this.searchDataParams.date,
          quantity:this.searchDataParams.count,
          pax:this.searchDataParams.pax
        }
        this.searchTransport(evt);
      }else{
        let evt = {
          routeId:this.routeId,
          travelDate:this.startDate,
          quantity:this.vehicleCount,
          pax:this.travelCount
        }
        this.searchTransport(evt);
      }
  }

  searchTransport(evt:any){
    clearTimeout(this.isTimeOutActive);
    let body = {
      lang:this.selectLangCode,
      no_of_travellers:evt.pax*evt.quantity,
      quantity:evt.quantity,
      route:evt.routeId,
      travel_date: this.DateTimeHelper.dateFormaterYMd(evt.travelDate)
    }

    this.vehicleCount = +evt.quantity;
    this.travelCount = +evt.pax;
    
    this.route.navigate(
      ['subagent/transport-list/'+this.selectLangCode+'/'+this.selectCurrency],
      { queryParams: { 
          pax:evt.pax,
          count:evt.quantity,
          date:this.DateTimeHelper.dateFormaterYMd(evt.travelDate),
          route:evt.routeId,
          ulogId:this.searchDataParams.ulogId
        }
      }
    );
    this.searchDataParams = {
      pax:evt.pax,
      count:evt.quantity,
      date:this.DateTimeHelper.dateFormaterYMd(evt.travelDate),
      route:evt.routeId,
      ulogId:this.searchDataParams.ulogId
    };

    this.listShimmer = true;
    this.filterShimmer = true;
    this.bttnActive = true;

    this.service.searchTransport(body,this.selectLangCode,this.searchDataParams.ulogId).pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
      this.searchId = data.search_id;
      if(data.results && data.results.length > 0 && (data.results.filter(x => x.vehicle_types.length > 0)).length > 0){
        this.listShimmer = false;
        this.transportList = this.transportListHelper.setDatasForList(data.results,true);
        this.listCount = this.transportList.length;
      }
      this.listApiCallingCount = environment.listApiCallingCount;
      this.getTransportList(data.search_id)
    })
    
  }

  getTransportList(id:number){
    this.service.searchTransportList(id,this.selectLangCode,this.searchDataParams.ulogId).pipe(takeUntil(this.destroy$)).subscribe((response:any) =>{
      if((response && response.transportations && response.transportations.length == 0) || 
      (response && response.transportations && response.transportations.filter(x => x.vehicle_types.length > 0) == 0 || 
      response && response.status_code == 202)){
        if(this.listApiCallingCount > 0){
          this.listApiCallingCount--;
          this.isTimeOutActive = setTimeout(() => {
            this.getTransportList(id);
          },this.nextApiCallingTime)
        }else{
          this.bttnActive = false;
          Swal.fire({
            text: this.translate.instant('Sorry, Transport Service not available on this date'),
            icon: "warning",
            confirmButtonText: this.translate.instant('Please, Change Date and try again'),
          });
        }
      }else{
        this.bttnActive = false;
        this.transportList = this.transportListHelper.setDatasForList(response.transportations,false);
        this.dummyTransportList = this.transportList;
        this.filterData = this.transportListHelper.initialDataForFilterTransport(this.transportList,this.vehicleList);
        this.listCount = this.transportList.length;
        this.filterShimmer = false;
        this.listShimmer = false;
      }
    })
  }

  clickAdditionalService(evt:any){
    let x = this.transportListHelper.addAdditionalService(evt,this.aditionalService,this.transportList)
    this.aditionalService = x.aditionalService;
    this.transportList = x.transportList;
  }

  ngOnDestroy(){
    clearTimeout(this.isTimeOutActive);
    this.destroy$.next();
    this.destroy$.complete(); 
  }

  // filter section

  userFilter: any = { company_name: '' };
  filterPostData:TransportFilterPostData;

  searchCompanyName(evt){
    this.userFilter.company_name = evt;
  }

  initialFilterData(){
    this.filterPostData = {
      category_id:[],
      vehicle_type_id:[],
      vehicle_model:[],
      additional_service_id:[]
    }
  }

  resetFilterAll(){
    this.filterData = this.transportListHelper.initialDataForFilterTransport(this.dummyTransportList,this.vehicleList);
    this.userFilter.company_name = '';
    this.initialFilterData();
    this.transportList = this.dummyTransportList;
    this.listCount = this.dummyTransportList.length;
  }

  filterTransportList(evt:TransportFilterPostData){
    this.transportList = this.transportListHelper.transportListFilter(this.dummyTransportList,evt);
    this.listCount = this.transportList.length;
  }

  sortTransportList(evt){
    this.transportList = this.transportListHelper.sortTransportList(evt,this.transportList);
    this.dummyTransportList = this.transportListHelper.sortTransportList(evt,this.dummyTransportList)
  }

  addFavorite(evt:any){
    this.transportList.forEach(ele =>{
      if(ele.company_code == evt.company_code && ele.vehicle_type_code == evt.vehicle_code && ele.categories[0].category_code == evt.category_code){
        let body={
          "transport": [
            {
              company_code:evt.company_code,
              vehicle_code:evt.vehicle_code,
              category_code:evt.category_code
            }
          ]
        }
        this.service.makeFavorite(body).pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
          ele.categories[0].is_favorited = !ele.categories[0].is_favorited;
          if (ele.categories[0].is_favorited) {
            this.notifyService.showSuccess(this.translate.instant("Transport added to favorite"))
          } else {
            this.notifyService.showSuccess(this.translate.instant("Transport removed from favorite"))
          }
        })
      }
    })
  }

  showPolicy(evt:any){
    this.cancellationPopUp = true;
    this.policyData = evt;
  }

  closePolicy(){
    this.cancellationPopUp = false;
  }

  saveService(evt:any){
    let x = this.transportAdapter.postTransport(evt,this.aditionalService,this.searchDataParams,this.searchId,this.selectLangCode);
    this.service.createCustomTrip(x,this.selectLangCode,this.searchDataParams.ulogId).pipe(takeUntil(this.destroy$)).subscribe(data=>{

      if(this.isMobile){
        this.route.navigate(
          ['/subagent/booking/'+this.selectLangCode+'/'+this.selectCurrency],
          { queryParams: { 
            type:'transport',
            tripId:data.id,
            ulogId:this.searchDataParams.ulogId
          } }
        )
      }else{
        const url = this.route.serializeUrl(
          this.route.createUrlTree(
            ["/subagent/booking/"+this.selectLangCode+"/"+this.selectCurrency],
            { queryParams: { 
              type:'transport',
              tripId:data.id,
              ulogId:this.searchDataParams.ulogId
            } }
          )
        );
        window.open(url, '_blank');
      }
    })
  }
}
