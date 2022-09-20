import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject,Observable } from 'rxjs';
import { takeUntil,map, startWith } from "rxjs/operators";
import { HelperService } from 'src/app/common/services/helper-service';
import {FormControl} from '@angular/forms';
import { ApiServiceSubAgent } from 'src/app/components/sub-agent/services/api-service-sub-agent';

@Component({
  selector: 'app-group-leader-details',
  templateUrl: './group-leader-details.component.html',
  styleUrls: ['./group-leader-details.component.scss']
})
export class GroupLeaderDetailsComponent implements OnInit {

  @Input() travellersForm:FormGroup;
  @Input() submitted:boolean = false;
  @Input() nationalityList: any[] = [];
  @Input() ulogId:string;
  @Input() isDeepLink:boolean = true;
  @Input() linkId:number;
  private destroy$ = new Subject();
  private helperService : HelperService = new HelperService(this.datepipe);
  phoneInputObj: any;
  forBookings:any[] = [];
  stateCtrl = new FormControl();
  filteredStates: Observable<any[]>;

  constructor(private subService:ApiServiceSubAgent,private datepipe:DatePipe,private translate: TranslateService) { 
    
  }

  private _filterStates(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.forBookings.filter(state => state.tag.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    this.travellersForm.controls.passport_expiry_date.patchValue(this.helperService.incrimentmonth(new Date,12));
    this.getProfileDetails();
    this.listForBooking();
  }

  listForBooking(){
    this.subService.getForBooking().pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
      this.forBookings = data;
      this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.forBookings.slice())
    );
    })
  }

  getProfileDetails(){
    this.subService.getStaffDetails().pipe(takeUntil(this.destroy$)).subscribe(res=>{
      this.travellersForm.patchValue({
        nationality:res.agency.country,
        countryOFRecidence:res.agency.country,
        phone_country_code:res.agency.phn_country_code,
        phone_number:res.phone_number,
        title:'MALE',
        first_name:res.name.split(" ")[0],
        last_name:res.name.split(" ")[1],
        email:res.email
      })
      this.fetchIsoCode(res.agency.phn_country_code);
    })
    // if(this.isDeepLink){
    //   this.subService.getShareLinks().subscribe(data =>{
    //     data.data.forEach((res:any) =>{
    //       if(this.linkId == res.trip){
    //         this.travellersForm.patchValue(res.tags[0].travellerForm);
    //       }
    //     })
        
    //   })
    // }else{
      
    // }
    
  }

  fetchIsoCode(code){
    this.nationalityList.forEach(data =>{
      if(code == data.item_code){
        this.travellersForm.controls.phone_country_iso_code.patchValue(data.item_id.toLowerCase());
        this.phoneInputObj.setCountry(data.item_id.toLowerCase());
      }
    })
  }

  omit_special_char(event){
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  allowWhatsapp(e){
    if (e.checked){
      this.travellersForm.controls.whatsappSend.patchValue("1")
    }else{
      this.travellersForm.controls.whatsappSend.patchValue("0")
    }
  }

  get g() { return this.travellersForm.controls; }

  toggleDetails() {
    let panel = document.getElementById('expandeDiv');
    let panel2 = document.getElementById('rotateIcon');
    if (panel2.style.transform) {
      panel2.style.transform = null;
    } else {
      panel2.style.transform = 'rotate(180deg)';
    }
    if (panel.style.maxHeight) {
      panel.style.overflow = 'hidden';
      panel.style.maxHeight = null;
      
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.style.overflow = 'inherit';
    }
  }

  onCountryChange(event) {
    this.validateNumber();
    this.phoneInputObj.setCountry(event.iso2);
    this.travellersForm.controls.phone_country_code.patchValue(event.dialCode);
  }

  validateNumber() {
    try {
      if (this.travellersForm && this.travellersForm.controls['phone_number'].value) {
        let mobileNumber = this.travellersForm.controls['phone_number'].value.trim();
        if (this.phoneInputObj.isValidNumber()) {
          this.travellersForm.controls['phone_number'].setErrors(null);
          this.travellersForm.controls['phone_number'].setValue(mobileNumber)
        } else {
          this.travellersForm.controls['phone_number'].setErrors({ 'pattern': true });
          this.travellersForm.controls['phone_number'].markAsTouched();
        }
      }
    } catch (exception) {
      alert(this.translate.instant('enter mobile number'))
    }
  }

  inputValidation(event?) {

    let defaultCountryCode: string = this.travellersForm.controls.phone_country_code.value;
    try {
      let mobileNumber: string = '';
      if (event)
        mobileNumber = event.srcElement.value;
      else
        mobileNumber = this.travellersForm.controls['phone_number'].value;
      defaultCountryCode = defaultCountryCode.replace(/[^0-9]/g, '');
      if (this.getNumberPlaceHolderLength() && mobileNumber.length >= this.getNumberPlaceHolderLength() + defaultCountryCode.length &&
        mobileNumber.startsWith(defaultCountryCode)) {
        mobileNumber = mobileNumber.slice(defaultCountryCode.length);
      }
      else if (mobileNumber.startsWith('0'))
        mobileNumber = mobileNumber.slice(1);

      this.travellersForm.controls['phone_number'].setValue(mobileNumber);
      this.validateNumber();
    } catch (exception) {
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

  phoneInputObject(obj) {
    this.phoneInputObj = obj;
  }

  forBookingValueAdd(evnt){
    this.travellersForm.controls.for_booking_tag.setValue(evnt.srcElement.value)
  }

  clickOn(){
    (document.getElementsByClassName('cdk-overlay-container')[0] as HTMLElement).style.backgroundColor = "#00000000";
  }

  selectForBooking(value){
    let index = this.nationalityList.findIndex(x => x.item_id === value.country_code);
    if(index != -1){
      this.travellersForm.controls.nationality.setValue(this.nationalityList[index].item_text);
    }
    this.travellersForm.controls.for_booking_tag.setValue(value.tag); 
  }

  ngOnDestroy(){
    // (document.getElementsByClassName('cdk-overlay-container')[0] as HTMLElement).style.backgroundColor = "#0000006b";
    //add
    this.destroy$.next();
    this.destroy$.complete(); 
  }
 
}
