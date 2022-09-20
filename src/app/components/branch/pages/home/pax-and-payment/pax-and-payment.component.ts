import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { subBranchAdapter } from 'src/app/adapters/branch/SubBranchAdapter';
import { BranchApiService } from 'src/app/Services/branch-api-service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-pax-and-payment',
  templateUrl: './pax-and-payment.component.html',
  styleUrls: ['./pax-and-payment.component.scss']
})
export class PaxAndPaymentComponent implements OnInit {
  totalAmount: number;
  advanceAmount: number;
  advancePct:number;
  id:any;
  countAdult: number = 0;
  countChildWithBed: number = 0;
  countChildWithoutBed: number = 0;
  packageDetails: any;
  contactInfoForm:FormGroup;
  branchAdapter:subBranchAdapter;
  submitted = false;
  packageId: any;
  bttnactv:boolean = false;
  countrycode2: any;
  pricingData:any = " ";
  @ViewChild('phoneInput', { read: ElementRef, static: false })
  phoneInput: ElementRef;
  masterPkg: any = "";
  totalPax: number;
  priceCurrency: any;
  showAmound: boolean = false;
  priceValue: any;
  commsionAmunt: number;
  shimmer:boolean = true;
  netPayment: number;
  availabilityCount: number;

  transportList:any[]=[
    {id:0,text:"Choose transport",price:0,discount:0},
    {id:1,text:"Bus (14 - 50 Pax) : SAR 4620",price:4620,discount:120},
    {id:2,text:"Van (8 - 13 Pax) : SAR 2420",price:2420,discount:120},
    {id:3,text:"SUV Car (5 - 7 Pax) : SAR 2750",price:2750,discount:120},
    {id:4,text:"Car (1 - 4 Pax) : SAR 1500",price:1500,discount:120},
  ];

  hotelList:any[] = [
    {id:1,text:"2 star Hotel With in 800mtr (Quad): SAR 120 Per Room",price:120,pax:4},
    {id:2,text:"3 star Hotel With in 600mtr (Quad): SAR 150 Per Room",price:150,pax:4},
    {id:3,text:"4 star Hotel With in 500mtr (Double): SAR 350 Per Room",price:350,pax:2},
    {id:4,text:"5 star Hotel With in 300mtr (Double): SAR 700 Per Room",price:700,pax:2}
  ];

  foodList:any[] = [
    {id:1,text:"As Per the Hotel",price:0},
    {id:2,text:"South Indian : SAR 32 per Pax",price:32},
    {id:3,text:"North Indian : SAR 32 per Pax",price:32},
    {id:4,text:"Indonesian : SAR 32 per Pax",price:32},
  ];

  totalTraveller:number=1;
  visaInsure:number = 0;
  transport:number = 0;
  makkahHotel:number = 0;
  madeenaHotel:number = 0;
  food:number = 0;
  discountAmount: number = 0;
  VisaAmount: number = 0;
  isVisaOnly: boolean = false;

  constructor(private route:Router,private fb: FormBuilder, private branchService: BranchApiService,private activeRouter:ActivatedRoute,
    private datePipe:DatePipe) {
      this.branchAdapter = new subBranchAdapter(this.datePipe);
     }

  ngOnInit() {
    window.scroll(0,0);
    this.contactInfoForm = this.branchAdapter.bookPackageForm();
    this.getDetails()
    this.contactInfoForm.controls.phn_country_code.setValue(91)
  }

  getDetails(){
    this.shimmer = true;
    this.activeRouter.params.subscribe(data=>{
      this.branchService.getPackageDetails(data.id).subscribe((data)=>{
        this.shimmer = false;
        this.packageDetails = data;
        this.masterPkg = data.master_package;
        this.packageId = data.id;  
        this.priceCurrency=data.master_package.currency;   
        this.availabilityCount = data.max_passengers - data.booked_count;
        this.visaInsure = this.packageDetails.adult_price;
        this.VisaAmount = this.packageDetails.adult_price;
        this.calculateAmount(this.packageDetails.adult_price);
        if(!this.packageDetails.services.flight && !this.packageDetails.services.hotel && !this.packageDetails.services.transport && this.packageDetails.services.visa){
          this.isVisaOnly = true;
        }
      }) 
    })
  }

  calculateAmount(tot){
    this.totalAmount = tot;
    this.commsionAmunt = (+this.packageDetails.b2b_pct/100)*this.totalAmount;
    this.netPayment = this.totalAmount - this.commsionAmunt;
  }

  get f(){return this.contactInfoForm.controls}

  onSubmit(){
    console.log(this.contactInfoForm.value);
    
    this.submitted = true;
    if (this.contactInfoForm.invalid) {
      return;
    }
    this.bttnactv = true;
    var body= {
      "package": sessionStorage.getItem("packageId"),
      "adults": this.totalPax,
      "children_with_bed": this.countChildWithBed,
      "children_without_bed": this.countChildWithoutBed,
         "contactinfo": {
        "title": "Mr",
        "first_name": this.contactInfoForm.controls['fname'].value,
        "last_name": this.contactInfoForm.controls['lname'].value,
        "phone_number":this.contactInfoForm.controls['phone'].value,
        "email": this.contactInfoForm.controls['email'].value,
        "phn_country_code": 91,
        // "address": this.contactInfoForm.controls['adress'].value,
        "is_guest": true
      }
    }
    this.branchService.bookPackage(body).subscribe((data)=>{
      sessionStorage.setItem("bookingId",data.id);
      this.branchService.packagePayment(data.id).subscribe(data=>{
        this.bttnactv = false;
        let form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", data.payment_info.payment_url);
        for (let key in data.payment_info.post_params) {
          if (data.payment_info.post_params.hasOwnProperty(key)) {
            let hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", data.payment_info.post_params[key]);
            form.appendChild(hiddenField);
          }
        }
        document.body.appendChild(form);
        form.submit();
      })
      // this.route.navigate(["/branch/packages/bookings/"+data.id+"/details"]);
    })
  }

  onCountryChange(event) {
    this.validateNumber();
    this.countrycode2 = event.dialCode;
    this.contactInfoForm.controls.phn_country_code.setValue(event.dialCode)
  }

  validateNumber() {
    try {
    } catch (exception) {
      alert('enter mobile number')
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

  inputValidation(event?) {
    let defaultCountryCode: string = "+91"
    try {
      
    } catch (exception) {
    }
  }

  hideAndView(){
    this.showAmound = !this.showAmound;
  }


  navigateBack(){
    let id = JSON.parse(sessionStorage.getItem("masterPkgData")).id;
    this.route.navigate(["/branch/packages/"+id+"/details"]);
  }

  adultChange(evnt) {
    if(this.checkAvailability(this.contactInfoForm.value)){
      this.calculatePaxAmound(this.contactInfoForm.value);
      this.calculatePaxCount(this.contactInfoForm.value);
    }else{
      this.contactInfoForm.controls.adult.patchValue(1)
      this.calculatePaxAmound(this.contactInfoForm.value);
      this.calculatePaxCount(this.contactInfoForm.value);
    }
    this.resetValues();
  }

  childWithOutBedChange(event) {
    if(this.checkAvailability(this.contactInfoForm.value)){
      this.calculatePaxAmound(this.contactInfoForm.value);
      this.calculatePaxCount(this.contactInfoForm.value);
    }else{
      this.contactInfoForm.controls.ChildWithoutBed.patchValue(0)
      this.calculatePaxAmound(this.contactInfoForm.value);
      this.calculatePaxCount(this.contactInfoForm.value);
    }
    this.resetValues();
  }

  childWithBedChange(event) {
    if(this.checkAvailability(this.contactInfoForm.value)){
      this.calculatePaxAmound(this.contactInfoForm.value);
      this.calculatePaxCount(this.contactInfoForm.value);
    }else{
      this.contactInfoForm.controls.childWithBed.patchValue(0);
      this.calculatePaxAmound(this.contactInfoForm.value);
      this.calculatePaxCount(this.contactInfoForm.value);
    }
    this.resetValues();
  }

  calculatePaxCount(value){
    this.totalTraveller = (+value.adult) + (+value.childWithBed) + (+value.ChildWithoutBed);
  }

  calculatePaxAmound(value){
    let total = (+value.adult*this.packageDetails.adult_price) + (+value.childWithBed*this.packageDetails.child_with_bed_price) + (+value.ChildWithoutBed*this.packageDetails.child_without_bed_price);
    this.calculateAmount(total);
    this.visaInsure = total;
    this.VisaAmount = total;
  }

  checkAvailability(value){
    let total = (+value.adult) + (+value.childWithBed) + (+value.ChildWithoutBed);
    if(total <= this.availabilityCount){
      return true;
    }else{
      Swal.fire({
        text: total + ' slot not Available',
        icon: "warning",
        confirmButtonText: '0k',
      });
      return false;
    }
  }

  resetValues(){
    this.contactInfoForm.patchValue({
      transportSelect:0,
      makkahSelect:0,
      makkahDays:0,
      makkahRooms:0,
      makkahPrice:0,
      madeenaSelect:0,
      madeenaDays:0,
      madeenaRooms:0,
      madeenaPrice:0,
      foodSelect:1,
      foodDays:0,
      foodPrice:0,
    });
    this.transport = 0;
    this.makkahHotel = 0;
    this.madeenaHotel = 0;
    this.food = 0;
    this.discountAmount = 0;
  }

  calculateTotalAmount(){
    let total = this.visaInsure+this.transport+this.makkahHotel+this.madeenaHotel+this.food;
    this.calculateAmount(total)
  }

  tranportSelect(id){
    this.transportList.forEach(data=>{
      if(data.id == id){
        this.transport = data.price;
        this.discountAmount = data.discount*this.totalTraveller;
        this.visaInsure = this.VisaAmount - this.discountAmount;
        this.calculateTotalAmount();
      }
    })
  }

  makkahHotelSelect(id){
    if(+id == 0){
      this.contactInfoForm.controls.makkahDays.setValue(0);
      this.contactInfoForm.controls.makkahRooms.setValue(0);
      this.contactInfoForm.controls.makkahPrice.setValue(0);
      this.makkahHotel = 0;
    }else{
      this.contactInfoForm.controls.makkahDays.setValue(1);
      this.makkahHotelValuesSet(id);
    }
  }

  makkahHotelValuesSet(id){
    this.hotelList.forEach(data=>{
      if(data.id == id){
        let traveller = (+this.contactInfoForm.controls.adult.value) + (+this.contactInfoForm.controls.childWithBed.value)
        let rooms = Math.ceil(traveller/data.pax);
        this.contactInfoForm.controls.makkahRooms.setValue(rooms);
        this.contactInfoForm.controls.makkahPrice.setValue(data.price);
        let days = this.contactInfoForm.controls.makkahDays.value;
        this.makkahHotel = data.price*rooms*days;
        this.calculateTotalAmount();
      }
    })
  }

  makkahDaysSet(){
    this.makkahHotelValuesSet(this.contactInfoForm.controls.makkahSelect.value)
  }

  madeenaHotelSelect(id){
    if(+id == 0){
      this.contactInfoForm.controls.madeenaDays.setValue(0);
      this.contactInfoForm.controls.madeenaRooms.setValue(0);
      this.contactInfoForm.controls.madeenaPrice.setValue(0);
      this.makkahHotel = 0;
    }else{
      this.contactInfoForm.controls.madeenaDays.setValue(1);
      this.madeenaHotelValuesSet(id);
    }
  }

  madeenaHotelValuesSet(id){
    this.hotelList.forEach(data=>{
      if(data.id == id){
        let traveller = (+this.contactInfoForm.controls.adult.value) + (+this.contactInfoForm.controls.childWithBed.value)
        let rooms = Math.ceil(traveller/data.pax);
        this.contactInfoForm.controls.madeenaRooms.setValue(rooms);
        this.contactInfoForm.controls.madeenaPrice.setValue(data.price);
        let days = this.contactInfoForm.controls.madeenaDays.value;
        this.madeenaHotel = data.price*rooms*days;
        this.calculateTotalAmount();
      }
    })
  }

  madeenaDaysSet(){
    this.madeenaHotelValuesSet(this.contactInfoForm.controls.madeenaSelect.value)
  }

  foodSelect(id){
    let days = (+this.contactInfoForm.controls.makkahDays.value)+(+this.contactInfoForm.controls.madeenaDays.value)+2
    this.contactInfoForm.controls.foodDays.setValue(days);
    this.foodValueSet(id);
  }

  foodValueSet(id){
    this.foodList.forEach(data=>{
      if(data.id == id){
        let days = this.contactInfoForm.controls.foodDays.value;
        this.contactInfoForm.controls.foodPrice.setValue(data.price);
        this.food = data.price*this.totalTraveller*days;
        this.calculateTotalAmount();
      }
    })
  }

  foodDaySet(){
    this.foodValueSet(this.contactInfoForm.controls.foodSelect.value)
  }
}
