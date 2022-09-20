import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HelperService } from 'src/app/common/services/helper-service';
import { CommonApiService } from 'src/app/Services/common-api-services';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';

@Component({
  selector: 'app-main-traveller-details',
  templateUrl: './main-traveller-details.component.html',
  styleUrls: ['./main-traveller-details.component.scss']
})
export class MainTravellerDetailsComponent implements OnInit {

  @Input() travellersForm:FormGroup;
  @Input() submitted:boolean = false;
  @Input() paramTripId:string;
  phoneInputObj: any;
  private destroy$ = new Subject();
  nationalityList: any[] = [];

  constructor(private fb:FormBuilder,private helperService: HelperService,private subService:SubAgentApiService,
    private translate: TranslateService,private commonApiService:CommonApiService) { }

  ngOnInit() {
    this.fetchNationality()
    this.travellersForm.controls.passport_expiry_date.patchValue(this.helperService.incrimentmonth(new Date,12));
  }

  fetchNationality(){
    this.commonApiService.getCountry("",sessionStorage.getItem('userLanguage')).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.nationalityList = data.map(x => ({ item_text: x.name, item_id: x.short_iso_code, item_code:x.code }));
      this.getProfileDetails()
    });
  }

  getProfileDetails(){
    this.subService.getStaffDetails(sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      this.travellersForm.patchValue({
        nationality:res.agency.country,
        countryOFRecidence:res.agency.country,
        phone_country_code:res.agency.phn_country_code,
        phone_number:res.phone_number,
        title:'MALE',
        first_name:res.user_name,
        email:res.email
      })
      this.fetchIsoCode(res.agency.phn_country_code);
      this.getDeepLinkDatas()
    })
  }

  getDeepLinkDatas(){
    if(this.paramTripId != "0"){
      this.subService.getShareLinks().subscribe(data =>{
        this.setDeepLinkFormDatasPass(data.data)
      })
    }
  }

  setDeepLinkFormDatasPass(data:any[]){
    var id = this.paramTripId.substring(1);
    data.forEach(val =>{
      if(val.trip == +id){
        if(val.tags.length > 0 && val.tags[0].travellerForm != undefined && val.tags[0].travellerForm != null){
          this.travellersForm.patchValue(val.tags[0].travellerForm)
        }
        if(val.tags.length > 0 && val.tags[0].rooms != undefined && val.tags[0].rooms.length > 0){
          sessionStorage.setItem('roomData',JSON.stringify(val.tags[0].rooms))
        }
      }
    })
  }

  omit_special_char(event){
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
   }

  fetchIsoCode(code){
    this.nationalityList.forEach(data =>{
      if(code == data.item_code){
        this.travellersForm.controls.phone_country_iso_code.patchValue(data.item_id.toLowerCase());
        this.phoneInputObj.setCountry(data.item_id.toLowerCase());
      }
    })
  }

  allowWhatsapp(e){
    if (e.target.checked){
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

}
