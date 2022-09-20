import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from 'src/app/Services/common-api-services';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { StepperAdapter } from 'src/app/adapters/super-agent/stepper-adapter';
import { HelperService } from "src/app/common/services/helper-service";
import { AppStore } from 'src/app/stores/app.store';
import { StepperComponent } from '../stepper.component';
import Swal from 'sweetalert2';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  transportSelection : FormGroup;
  submitted = false;
  commonApiService : CommonApiService;
  SuperAgentApiService:SuperAgentApiService;
  companyList:any;
  vehicleTypeList:any;
  routeList:any;
  StepperAdapter : StepperAdapter;
  transportMin:any;
  transportMax:any;
  companyShimmer: boolean = true;
  vehicleTypeshimmer: boolean = true;
  routeShimmer: boolean = true;
  bttnactive: boolean =false;
  currency: string;
  searchData: any;
  selectCompany: any;
  selectvehicle: any;
  selectedRoute: any;
  TransportList: any[];
  shimmer:boolean = false;
  searchDiv:boolean = false;
  constructor(private formBuilder: FormBuilder,private _commonApiService:CommonApiService,private stepper:StepperComponent,
    private _SuperAgentService:SuperAgentApiService,private helperService:HelperService,private appStore:AppStore) {
    this.commonApiService = this._commonApiService;
    this.SuperAgentApiService=this._SuperAgentService;
    this.StepperAdapter = new StepperAdapter(helperService);
   }

  ngOnInit() {
    this.searchData = JSON.parse(sessionStorage.getItem('searchData'))
    this.currency = sessionStorage.getItem('currency');
    this.callListApi();
    this.transportSelection = this.StepperAdapter.transportBookingForm();
  }

  callPackageData(){
    this.SuperAgentApiService.getPackageDetails(sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      if(data.transport_details.length > 0){
        this.setTransportValue(data.transport_details[0])
      }
    })
  }

  setTransportValue(data){
    this.transportSelection.patchValue({
      cabtype: data.vehicle_code,
      route: data.route_code,
    })
    this.selectCompany = data.company_name;
    this.selectvehicle = data.vehicle_type;
    this.selectedRoute = data.route_name;
    this.onSubmit()

  }

  /**
   * calling company api,vehicle types api and route api
   */
  callListApi(){
    this.commonApiService.getCompanies(this.appStore.langCode).pipe(takeUntil(this.destroy$)).subscribe((data:any) => {
      this.companyList = data.companies.map(x => ( {item_text: x.name, item_id: x.code } ));
      this.companyShimmer = false;

      this.commonApiService.getVehicles(this.appStore.langCode).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
        this.vehicleTypeList = data.vehicle_types.map(x => ( {item_text: x.name, item_id: x.code} ));
        this.vehicleTypeshimmer = false;

        this.commonApiService.getRoutes(this.appStore.langCode).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
          this.routeList = data.routes.map(x => ( {item_text: x.name, item_id: x.code } ));
          this.routeShimmer = false;
          this.callPackageData();
        })

      })

    });
    
  }

  get f(){return this.transportSelection.controls}

  /**
   * this method for submit transportSelection form group
   */
  // onSubmit() {
  //   this.submitted = true;
  //   // stop here if form is invalid
  //   if (this.transportSelection.invalid) {
  //       return;
  //   }
  //   this.bttnactive = true;
  //   this.saveTransport();
  // }

  onSubmit(){
    this.submitted = true;
    
    if (this.transportSelection.invalid) {
        return;
    }

    this.shimmer = true;
    this.searchDiv = true;

    var body ={
      "route": this.transportSelection.controls.route.value,
      "vehicle_type": this.transportSelection.controls.cabtype.value,
      "travel_date": this.searchData.transport.depDate
    }
    
    this.SuperAgentApiService.searchTransportList(body).pipe(takeUntil(this.destroy$)).subscribe((data:any )=>{
      this.TransportList = [];
      data.transportations.forEach(x=> x.vehicle_types.forEach(y=>{
        y.company_code = x.company_code,
        y.company_name = x.company_name,
        y.policies = x.policies,
        y.cancellation_policy = x.cancellation_policy,
        y.price = y.categories[0].fare_summary[2].amount
      }))
      let q = data.transportations.map(x=>x.vehicle_types)
      this.TransportList = q.concat.apply([],q).sort((a,b) =>(a.price) - (b.price));
      this.shimmer = false;
      console.log(this.TransportList);
      
    })
  }

  getCompany(id){
    this.companyList.forEach(element => {
      if(element.item_id == id){
        this.selectCompany = element.item_text;
        return;
      }
    });
  }

  getVehicleName(id){
    this.vehicleTypeList.forEach(element => {
      if(element.item_id == id){
        this.selectvehicle = element.item_text;
        return;
      }
    });
  }

  getRoute(id){
    this.routeList.forEach(element => {
      if(element.item_id == id){
        this.selectedRoute = element.item_text;
        return;
      }
    });
  }
  
  /**
   * this method for update transport to create trip
   */
  saveTransport(value){
    let body = this.StepperAdapter.transportBookingBody(value,this.transportSelection.value,this.selectedRoute);
    this.SuperAgentApiService.updatePackageAPI(body,sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.transportAvailability(data,value);
    })
  }

  transportAvailability(data,value){
    let body = {
      package:data.id,
      package_details:data.transport_details[0].id,
      price_per_pax:value.price / data.max_passengers,
      pax_per_vehicle:value.categories[0].available_quantity,
      start_date_timestamp:Math.floor(new Date(this.searchData.transport.depDate).getTime()/1000)
    }
    this.SuperAgentApiService.transport_availability_add(body).pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
      this.skiptransport();
    })
  }

  back(){
    this.stepper.stepContent('hotel','MADEENA')
    sessionStorage.setItem('selector','hotelMadeena')   
  }

  skiptransport(){
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){
      sessionStorage.setItem('selector','preview');
      this.stepper.stepContent('preview','');
      sessionStorage.removeItem('modify');
    }else{
      if(sessionStorage.getItem('packageId') && sessionStorage.getItem('packageId') != null){
        sessionStorage.setItem('selector','otherServices')
        this.stepper.stepContent('otherServices','');
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'please select at least one Service',
        })
      }
    }
    this.bttnactive = false;
    
  }

  currencyConversion(amount){
    return this.helperService.priceConversion(amount);
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }

}
