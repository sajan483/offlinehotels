import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { VisaAdapter } from 'src/app/adapters/visa/visaAdapter';
import { VisaBodyAdapter } from 'src/app/adapters/visa/visaBodyAdapter';
import { BranchApiService } from 'src/app/Services/branch-api-service';
import { CommonApiService } from 'src/app/Services/common-api-services';
import { VisaStateService } from 'src/app/Services/visa-service/visa-state-service';
import Swal from 'sweetalert2';
import { PassengerDetailsComponent } from './passenger-details/passenger-details.component';

@Component({
  selector: 'app-visa-details',
  templateUrl: './visa-details.component.html',
  styleUrls: ['./visa-details.component.scss']
})
export class VisaDetailsComponent implements OnInit {
  @Input() paxCount:number;
  @Input() bookingId:number;
  @Input() travellerArray:any[];
  visaApplicationFormGroup: FormGroup = new FormGroup({});
  tabArray = [];
  tab = { headOpen: true, contentOpen: false };
  private visaAdapter: VisaAdapter = new VisaAdapter(this.fb, this.visaState);
  currentOpenPaxDiv:number;
  @ViewChildren('headDiv') headDiv!: QueryList<PassengerDetailsComponent>;
  @ViewChildren('contentDiv') contentDiv!: QueryList<ElementRef>;
  submit:boolean = false;
  private visaBodyAdapter: VisaBodyAdapter = new VisaBodyAdapter(this.datepipe);
  bttnActive: boolean;
  lastFormValue: FormGroup = new FormGroup({});
  requestVisaActveBttn: boolean = false;
  disableBttnVisa:boolean = true;
  tcChecked:boolean = false;
  nationalities = [];

  constructor(private visaState:VisaStateService,private fb: FormBuilder,public datepipe:DatePipe,private service:BranchApiService,
    private route:Router,private commonService:CommonApiService) { }

  ngOnInit() {
    this.getNationalities();
    this.visaAdapter.visaItineray()
    this.visaApplicationFormGroup = this.visaState.visaItinerayForm;
    
    
    this.setDataForm()
  }

  paxArrayForm(){
    return this.visaApplicationFormGroup.get("Pax") as FormArray
  }

  addPax(){
    for(let i=0;i<this.paxCount;i++){
      if(i == this.travellerArray.length){
        this.currentOpenPaxDiv = i;
        var tab = { headOpen: false, contentOpen: true };
        this.tabArray.push(tab);
      }else{
        this.tabArray.push(this.tab);
      }
      this.paxArrayForm().push(this.visaAdapter.viasPaxDetails(this.nationalities))
    }
    if(this.paxCount == this.travellerArray.length){
      this.disableBttnVisa = false;
    }
  }

  editPax(id: any) {
    this.tabArray[id] = { headOpen: false, contentOpen: true };
    setTimeout(() => {
      this.smoothScroll(this.contentDiv['_results'][id].nativeElement);
      setTimeout(() => {
        this.tabArray[this.currentOpenPaxDiv] = {
          headOpen: true,
          contentOpen: false,
        };
        this.currentOpenPaxDiv = id;
      }, 1000);
    }, 250);
    this.refreshData(id)
  }

  refreshData(crntId){
    for(let i=0;i<this.paxCount;i++){
      if(i != crntId){
        this.tabArray[i] = { headOpen: true, contentOpen: false };
      }
    }
  }

  smoothScroll(eID: any) {
    let startY = this.currentYPosition();
    let stopY = this.elmYPosition(eID);
    let distance = stopY > startY ? stopY - startY : startY - stopY;
    let speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    let step = Math.round(distance / 25);
    let leapY = stopY > startY ? startY + step : startY - step;
    let timer = 0;
    if (stopY > startY) {
      for (let i = startY; i < stopY; i += step) {
        setTimeout('window.scrollTo(0, ' + leapY + ')', timer * 35);
        leapY += step;
        if (leapY > stopY) leapY = stopY;
        timer++;
      }
      return;
    }
    stopY -= 100;
    for (let i = startY; i > stopY; i -= step) {
      setTimeout('window.scrollTo(0, ' + leapY + ')', timer * 35);
      leapY -= step;
      if (leapY < stopY) leapY = stopY;
      timer++;
    }
    return false;
  }

  currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
      return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
  }

  elmYPosition(eID: any) {
    let elm = eID;
    let y = elm.offsetTop;
    let node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
      node = node.offsetParent as HTMLElement;
      y += node.offsetTop;
    }
    return y;
  }

  setDataForm(){
    for(let i=0;i<this.paxCount;i++){
      if(this.travellerArray.length > i){
        let formPax = <FormGroup>(<FormArray>this.visaApplicationFormGroup.controls["Pax"]).controls[i];
        this.setValueDataSet(formPax,this.travellerArray[i])
      }
    }
  }

  setValueDataSet(form,data){
    form.patchValue({
      filled:true,
      PassengerID:data.id,
      passportFrontUrl:data.passport_front,
      PassportType:data.passport_type,
      PassportNo:data.passport_no,
      FirstName:data.first_name,
      MiddleName:data.middle_name,
      LastName:data.last_name,
      Nationality:data.nationality,
      Gender:data.gender,
      DOB:new Date(data.dob),
      POB:data.birth_place,
      PIP:data.passport_city,
      DOI:new Date(data.date_of_issue),
      DOE:new Date(data.passport_expiry_date),
      passportBackUrl:data.passport_back,
      FatherName:data.father_name,
      MotherName:data.mother_name,
      HusbandName:data.husband_name,
      Address:data.address,
      City:data.city,
      Country:data.country_of_residence,
      PersonalPhotoUrl:data.passport_photo,
      FirstNameArabic:data.first_name_ar,
      MiddleNameArabic:data.middle_name_ar,
      LastNameArabic:data.last_name_ar,
      POBArabic:data.birth_place_ar,
      PIPArabic:data.passport_city_ar,
      FatherNameArabic:data.father_name_ar,
      MotherNameArabic:data.mother_name_ar,
      HusbandNameArabic:data.husband_name_ar,
    })
    if(data.documents && data.documents.length > 0){
      form.patchValue({
        vaccinationCertificate:data.documents[0].file,
      })
    }
  }

  saveAndNext(id:any){
    let formPax = <FormGroup>(<FormArray>this.visaApplicationFormGroup.controls["Pax"]).controls[id];
  
    this.submit = true;

    if(formPax.invalid){
      return
    }
    
    this.bttnActive = true;

    this.postData(formPax,id)
    
  }


  postData(formPax,id){
    this.service.postTravellerPassportDetails(this.bookingId,this.visaBodyAdapter.travellerDetailsBody(formPax.value)).subscribe(data=>{
      if(data.code == '0400'){
        Swal.fire({
          text: 'error',
          icon: "warning",
          confirmButtonText: '0k',
        });
      }else{
        if(formPax.controls.passportFrontFile.value != '' || formPax.controls.passportBackFile.value != '' || formPax.controls.PersonalPhotoFile.value != ''){
          this.passportImagePost(data.data.travellers[id].id,id,formPax)
        }else if(formPax.controls.vaccinationCertificateFile.value != ''){
          this.vaccinationImage(data.data.travellers[id].id,id,formPax)
        }else{
          this.afterApiCall(formPax,id,data.data.travellers[id].id)
        }
        
      }
    })
  }

  passportImagePost(travellerId,id,formPax){
    this.service.postImageTravellersPassport(travellerId,this.visaBodyAdapter.passportImgUploadBody(formPax.value)).subscribe(data2 =>{
      if(formPax.controls.vaccinationCertificateFile.value != ''){
        this.vaccinationImage(travellerId,id,formPax)
      }else{
        this.afterApiCall(formPax,id,travellerId)
      }
    })
  }

  vaccinationImage(travellerId,id,formPax){
    this.service.postDocumentTravellersPassport(travellerId,this.visaBodyAdapter.documentUpload(formPax.value)).subscribe(data3 =>{
      this.afterApiCall(formPax,id,travellerId)
    })
  }

  afterApiCall(formPax,id,travellerId){
    formPax.patchValue({
      filled:true,
      PassengerID:travellerId
    })
    if(this.paxCount == id+1){
      this.disableBttnVisa = false;
    }
    this.submit = false;
    this.bttnActive = false;
    this.nextOpen(id+1);
  }

  nextOpen(id: any) {
    if(id < this.paxCount){
      this.tabArray[id] = { headOpen: false, contentOpen: true };
    }
    setTimeout(() => {
      if(id < this.paxCount){
        this.smoothScroll(this.contentDiv['_results'][id].nativeElement);
      }
      setTimeout(() => {
        this.tabArray[this.currentOpenPaxDiv] = {
          headOpen: true,
          contentOpen: false,
        };
        this.currentOpenPaxDiv = id;
      }, 1000);
    }, 250);
  }

  requestVisa(){
    if(this.visaApplicationFormGroup.invalid){
      return
    }
    if(!this.tcChecked){
      Swal.fire({
        text: 'Please Accept Terms & Conditions',
        icon: "warning",
        confirmButtonText: '0k',
      });
      return
    }
    this.requestVisaActveBttn = true;
    this.service.visaRequestSend(this.bookingId).subscribe(data =>{
      this.requestVisaActveBttn = false;
      Swal.fire(
        'Success!',
        'Passport is submitted!',
        'success'
      ).then((result) => {
        this.route.navigate(["/branch/packages/bookings/"+this.bookingId+"/details"]);
      })
    })
  }

  getNationalities(){
    this.commonService.getNationality("","en-US").subscribe((data)=>{
      this.nationalities = data;
      this.addPax();
    });
  }

}
