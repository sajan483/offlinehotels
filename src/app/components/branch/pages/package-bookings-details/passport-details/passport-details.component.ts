import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchApiService } from 'src/app/Services/branch-api-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-passport-details',
  templateUrl: './passport-details.component.html',
  styleUrls: ['./passport-details.component.scss']
})
export class PassportDetailsComponent implements OnInit {
  step = 0;
  @Input() travellerData : any;
  travelForm:FormGroup;
  submitted = false;
  bttnactive:boolean = false;
  toDay = new Date();
  minpassportExpDate: any;

  constructor(private apiService:BranchApiService,private fb:FormBuilder,public datepipe:DatePipe) { }

  ngOnInit() {
    this.minpassportExpDate = this.incrimentmonth(new Date(),6)
    this.travelForm = this.fb.group({
      travellers:this.fb.array([])
    })
    this.initialFormArray(this.travellerData.travllers)
  }

  incrimentmonth(date,months){
    var y = new Date(date);
    var z = y.setMonth(y.getMonth() + months)
    return new Date(z);
  }

  initialFormArray(traveller:number){
    for(let i=0;i<traveller;i++){
      this.addTraveller()
    }
    this.getTravelDatas(this.travellerData.id);
  }

  getTravelDatas(id){
    this.apiService.getBookingTravelerDetails(id).subscribe((data:any) =>{
      if(data.code == '0'){
        this.setTravellerValues(data.data.results);
      }
    })
  }

  setTravellerValues(values){
    values.forEach((ele:any,i:number)=>{
      const fg = this.travellerArray().at(i);
      fg.patchValue({
        first_name:ele.first_name,
        last_name:ele.last_name,
        middle_name:ele.middle_name,
        passport_type:ele.passport_type,
        passport_no:ele.passport_no,
        gender:ele.gender,
        dob:ele.dob,
        birth_place:ele.birth_place,
        date_of_issue:ele.date_of_issue,
        passport_expiry_date:ele.passport_expiry_date,
        father_name:ele.father_name,
        mother_name:ele.mother_name,
        husband_name:ele.husband_name,
        address:ele.address,
        city:ele.city,
        nationality:ele.nationality,
        country_of_residence:ele.country_of_residence,
      })
        
    })
  }

  travellerArray():FormArray{
    return this.travelForm.get("travellers") as FormArray
  }

  newTraveller(){
    return this.fb.group({
      first_name:['',Validators.required],
      last_name:['',Validators.required],
      middle_name:[''],
      passport_type:['',Validators.required],
      passport_no:['',Validators.required],
      gender:['MALE',Validators.required],
      dob:['',Validators.required],
      birth_place:['',Validators.required],
      passport_city:['',Validators.required],
      date_of_issue:['',Validators.required],
      passport_expiry_date:['',Validators.required],
      father_name:['',Validators.required],
      mother_name:['',Validators.required],
      husband_name:[''],
      address:['',Validators.required],
      city:['',Validators.required],
      nationality:['',Validators.required],
      country_of_residence:['',Validators.required],
    })
  }

  addTraveller(){
    this.travellerArray().push(this.newTraveller())
  }

  setStep(i){
    this.step = i;
  }

  previousStep(){
    this.step--;
  }

  nextStep(){
    this.step++;
  }

  dateFormater(date: any) {
    let latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
    return latest_date;
  }

  onSubmit(){
    console.log(this.travelForm.value);
    
    if(this.travelForm.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all required fields!',
      })
      return;
    }
    this.setBody(this.travelForm.value)
  }

  setBody(data){
    var travellers = [];
    data.travellers.forEach(data =>{
      var val = {
        first_name:data.first_name,
        last_name:data.last_name,
        middle_name:data.middle_name,
        passport_type:data.passport_type,
        passport_no:data.passport_no,
        gender:data.gender,
        dob:this.dateFormater(data.dob),
        birth_place:data.birth_place,
        passport_city:data.passport_city,
        date_of_issue:this.dateFormater(data.date_of_issue),
        passport_expiry_date:this.dateFormater(data.passport_expiry_date),
        father_name:data.father_name,
        mother_name:data.mother_name,
        husband_name:data.husband_name,
        address:data.address,
        city:data.city,
        nationality:data.nationality,
        country_of_residence:data.country_of_residence,
      }
      travellers.push(val)
    })

    var body = {
      travellers : travellers
    }
    this.bttnactive = true;
    this.apiService.postTravellerPassportDetails(this.travellerData.id,body).subscribe(res =>{
      this.bttnactive = false;
      Swal.fire(
        'success!',
        'Passport Details is Submitted Successfully!',
        'success'
      )
    },(err) =>{
      this.bttnactive = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    })

  }

}
