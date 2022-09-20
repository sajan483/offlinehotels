import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { StepperAdapter } from 'src/app/adapters/super-agent/stepper-adapter';
import { AppStore } from 'src/app/stores/app.store';
import { StepperComponent } from '../stepper.component';
import { HelperService } from 'src/app/common/services/helper-service';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';
@Component({
  selector: 'app-other-service',
  templateUrl: './other-service.component.html',
  styleUrls: ['./other-service.component.scss']
})
export class OtherServiceComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  myForm: FormGroup;
  arr: FormArray;
  submitted = false;
  serviceCategoryList: any;
  countryList: any;
  visaService: any;
  StepperAdapter : StepperAdapter;
  addButton: boolean = true;
  serviceBox: boolean = false;
  serviceShimmer : boolean = true;
  visaShimmer: boolean = true;
  bttnactive :boolean = false;
  currency: string;
  restaurantList: any;
  viewreRestaurant: boolean;
  foodCategorie: any;
  foodDiv: boolean;
  serviceData: any;
  visaType: any;

  constructor(private helper:HelperService,private SuperAgentService:SuperAgentApiService,private appStore:AppStore,private stepper:StepperComponent,private _formBuilder:FormBuilder) { 
    this.StepperAdapter = new StepperAdapter(null);
  }

  ngOnInit() {
    this.currency = sessionStorage.getItem('currency');
    this.apiCalles();
    this.myForm = this.StepperAdapter.otherServiceBookingForm();
    this.packageDetails();
    this.getCtegories();
  }

  getCtegories(){
    this.SuperAgentService.getServiceCategory().pipe(takeUntil(this.destroy$)).subscribe(data =>{
      this.serviceData = data;
    });
  }
  
  packageDetails(){
    this.SuperAgentService.getPackageDetails(sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      var visaDetails = data.visa_details[0];
      if(data.visa_details.length > 0) {
        this.myForm.controls.visaservice.setValue(visaDetails.visa_code)
        this.myForm.controls.adultpricevisa.setValue(visaDetails.visas[0].adult_price)
        this.myForm.controls.childpricevisa.setValue(visaDetails.visas[0].child_price)
        this.visaType = visaDetails.visa_type;
      }
    })
  }
 
  /**
   * service array remove
   */
  removeItem(i){
    if(i==0){
      this.addButton = true;
      this.serviceBox = false;
    }else{
      this.arr.removeAt(i);
    }
  }

  /**
   * add new service array
   */
  addItem() {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.StepperAdapter.createItem());
  }

  get f() { return this.myForm.controls; }

  /**
   * get form array Controls
   */
  getControls() {
    return (this.myForm.get('arr') as FormArray).controls;
  }

  /**
   * submit myform group
   */
  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.myForm.invalid) {
        return;
    }
    this.bttnactive = true;
    
    this.addOtherService();
    (this.myForm.controls);
    
  }

  /**
   * api calls for categories list,country list & visa type list
   */
  apiCalles(){
    this.SuperAgentService.getPackageCategories(this.appStore.langCode).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.serviceCategoryList = data.categories.map(x => ( {item_text: x.name, item_id: x.id } ));
      this.serviceShimmer = false;
    })
    this.SuperAgentService.getVisaType().pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.visaService = data.results.map(x => ( {item_text:x.title, item_id:x.id, item_price:x.price}))
      this.visaShimmer = false;
    })
  }

  getVisa(id){
    this.visaService.forEach(element => {
      if(element.item_id == id){
        this.visaType = element.item_text;
        this.myForm.controls.adultpricevisa.setValue(this.helper.priceConversion(element.item_price));
        this.myForm.controls.childpricevisa.setValue(this.helper.priceConversion(element.item_price))
      }
    });
  }

  /**
   * update other service in package api
   */
  addOtherService(){
    // var body1 = this.StepperAdapter.visaServiceBody(this.myForm.value,this.currency);
    var body1 = {
      visa_detail:{
        visa_type:this.visaType,
        visa_code:this.myForm.controls.visaservice.value,
        currency:this.currency
      }
    }
    this.SuperAgentService.updatePackageAPI(body1,sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.availabilityVisa(data,this.myForm.value)
    })
  }

  availabilityVisa(data,form){
    // var body = this.StepperAdapter.otherServiceBookingBody(this.f.arr.value,this.myForm.value,this.appStore.currencyCode);
    var body = {
      package:data.id,
      package_details:data.visa_details[0].id,
      adult_price:+form.adultpricevisa,
      child_price:+form.childpricevisa
    }
    this.SuperAgentService.visa_availability_add(body).pipe(takeUntil(this.destroy$)).subscribe(data =>{
      this.navigate();
    })
  }

  

  navigate(){
    this.bttnactive = false;
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){
      sessionStorage.setItem('selector','preview');
      this.stepper.stepContent('preview','');
      sessionStorage.removeItem('modify');
    }else{
      sessionStorage.setItem('selector','payment')
      this.stepper.stepContent('payment','');
    }
  }

  back(){
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){

    }else{
      this.stepper.stepContent('transport','')
      sessionStorage.setItem('selector','transport')   
    }
    
  }

  addService(){
    this.addButton = false;
    this.serviceBox = true;
  }
  
  addFoodService(){
    this.serviceData = this.serviceData;
    this.addButton = false
    this.foodDiv = true;
  }

  removeFood(){
    this.addButton = true
    this.foodDiv = false;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }
}