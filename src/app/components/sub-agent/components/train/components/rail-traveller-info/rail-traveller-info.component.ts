import { DatePipe } from '@angular/common';
import { Component,  EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/common/services/notification.service';
import { TrainService } from 'src/app/components/sub-agent/services/train.service';

@Component({
  selector: 'app-rail-traveller-info',
  templateUrl: './rail-traveller-info.component.html',
  styleUrls: ['./rail-traveller-info.component.scss']
})
export class RailTravellerInfoComponent implements OnInit {
  @Input()
  adultCount;
  @Input()
  childCount;
  @Input()
  infantCount;
  nationalityList = [];
  documents = [
    {
      item_text:'National Id',
      item_id:"national_id"
    },
    {
      item_text:'Passport',
      item_id:'passport'
    },
    {
      item_text: 'Iqama',
      item_id:'iqama'
    },
    {
      item_text:'GCC',
      item_id:'gcc'
    }
  ]

  travellerInfo = this.fb.array([]);
  @Output()
  onSave = new EventEmitter();
  @Input()
  bookingId;

  @Input()
  travellers;
  
  
  currentCount = 0;

  constructor(private fb:FormBuilder,
    private notification:NotificationService,private datepipe: DatePipe,private trainService:TrainService) { 
    
  }

  ngOnInit() {
    this.getNationalities();
    if(this.travellers && this.travellers.length>0){
      this.currentCount = this.travellers.length;
      for(var i=0;i<this.travellers.length;i++){
        let travellerType = this.travellers[i].traveller_type;
        
        this.travellerInfo.push(this.fb.group({
          id:new FormControl(this.travellers[i].id),
          gender:new FormControl({value:this.travellers[i].gender,disabled:this.travellers[i].is_verified},[Validators.required]),
          first_name:new FormControl({value:this.travellers[i].first_name,disabled:this.travellers[i].is_verified},[Validators.required]),
          middle_name:new FormControl({value:this.travellers[i].middle_name,disabled:this.travellers[i].is_verified},[]),
          family_name:new FormControl({value:this.travellers[i].family_name,disabled:this.travellers[i].is_verified},[Validators.required]),
          dob:new FormControl({value:this.travellers[i].dob,disabled:this.travellers[i].is_verified},[Validators.required]),
          document_type:new FormControl({value:this.travellers[i].document_type,disabled:this.travellers[i].is_verified},[Validators.required]),
          document_id:new FormControl({value:this.travellers[i].document_id,disabled:this.travellers[i].is_verified},[Validators.required]),
          date_of_expiry:new FormControl({value:this.travellers[i].date_of_expiry,disabled:this.travellers[i].is_verified},[]),
          nationality:new FormControl({value:this.travellers[i].nationality,disabled:this.travellers[i].is_verified},[]),
          traveller_type:new FormControl({value:travellerType,disabled:this.travellers[i].is_verified}),
          booking: new FormControl(this.bookingId),
          is_hidden: new FormControl(false),
          is_verified:new FormControl({value:this.travellers[i].is_verified,disabled:this.travellers[i].is_verified})
        }));
      }
    }else{
      this.currentCount = 1
      // for(var i=0;i<this.adultCount+this.childCount+this.infantCount;i++){
      //   let travellerType = 'adult';
      //   if(i>this.adultCount){
      //     travellerType = 'child';
      //     if(i>this.adultCount+this.childCount){
      //       travellerType = 'infant';
      //     }
      //   }
        this.travellerInfo.push(this.fb.group({
          gender:new FormControl('MALE',[Validators.required]),
          first_name:new FormControl('',[Validators.required]),
          middle_name:new FormControl('',[]),
          family_name:new FormControl('',[Validators.required]),
          dob:new FormControl('',[Validators.required]),
          document_type:new FormControl(null,[Validators.required]),
          document_id:new FormControl('',[Validators.required]),
          date_of_expiry:new FormControl('',[]),
          nationality:new FormControl(null,[]),
          traveller_type:new FormControl('adult'),
          booking: new FormControl(this.bookingId),
          is_hidden: new FormControl(false),
          is_verified: new FormControl(true),
        }));
      }
    // }
  }

  addTraveller(){
    if(this.travellerInfo.at(this.currentCount-1).valid){
      let travellerType = 'adult';
      if(this.currentCount>this.adultCount){
        travellerType = 'child'
        if(this.currentCount>this.adultCount+this.childCount){
          travellerType ='infant';
        }
      }
      for(let i=0;i<this.travellerInfo.length;i++){
        this.travellerInfo.at(i).patchValue({
          is_hidden:true
        })
      }
      if(this.currentCount<=this.adultCount+this.infantCount+this.childCount){
        this.travellerInfo.push(this.fb.group({
          gender:new FormControl('MALE',[Validators.required]),
          first_name:new FormControl('',[Validators.required]),
          middle_name:new FormControl('',[]),
          family_name:new FormControl('',[Validators.required]),
          dob:new FormControl('',[Validators.required]),
          document_type:new FormControl(null,[Validators.required]),
          document_id:new FormControl('',[Validators.required]),
          date_of_expiry:new FormControl('',[]),
          nationality:new FormControl(null,[]),
          traveller_type:new FormControl(travellerType),
          booking: new FormControl(this.bookingId),
          is_hidden: new FormControl(false),
          is_verified: new FormControl(true),
        }));
        this.currentCount++;
      }
    }else{
      Object.keys(this.travellerInfo.at(this.currentCount-1).value).forEach((key)=>{
        if(key!='gender'&&key!='traveller_type'&&key!='booking' && key!='id'&& key!='is_hidden' && document.getElementById(key+'_'+(this.currentCount-1))){
          if(document.getElementById(key+'_'+(this.currentCount-1))!=undefined)
            document.getElementById(key+'_'+(this.currentCount-1)).focus();
        }
      })
    }
  }

  removeTraveller(index){
    this.travellerInfo.removeAt(index);
    this.currentCount--;
  }
  getNationalities(){

    this.trainService.getCountry("", sessionStorage.getItem('userLanguage')).subscribe((data) => {
      this.nationalityList = data.map(x => ({ item_text: x.name, item_id: x.name }));
    });

  }
  save(){
    let isValid = true;
    let data = [];
    for(var i=0;i<this.adultCount+this.childCount+this.infantCount;i++){
      isValid = isValid && this.travellerInfo.at(i).valid;
      let formData = (this.travellerInfo.at(i) as FormGroup).value;
      Object.keys(formData).forEach((key)=>{
        if(key!='gender'&&key!='traveller_type'&&key!='booking' && key!='id'&& key!='is_hidden' && document.getElementById(key+'_'+i)){
          document.getElementById(key+'_'+(i)).focus();
        }
      })
      formData.dob = this.dateFormater2(formData.dob);
      formData.date_of_expiry = this.dateFormater2(formData.date_of_expiry);
      data.push(formData);
    }
    if(!isValid){
      this.notification.showWarning("Please check all fields");
      return; 
    }
    if(this.travellers && this.travellers.length>0){
      this.trainService.updateTravellers(this.bookingId,data).subscribe((data)=>{
        this.notification.showSuccess("Traveller Details updated successfully");
        this.onSave.emit();
      })
    }else{
      this.trainService.saveTravellers(this.bookingId,data).subscribe((data)=>{
        this.notification.showSuccess("Traveller Details submitted successfully");
        this.onSave.emit();
      })
    }
  }

  dateFormater2(date: any) {
    let latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
    return latest_date;
  }

}
