import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup,FormArray,Validators, FormBuilder } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { StepperAdapter } from 'src/app/adapters/super-agent/stepper-adapter';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { StepperComponent } from '../stepper.component';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit,OnDestroy {
  itineraryForm:FormGroup;
  itinerary: FormArray;
  bttnactive:boolean = false;
  imageCollection:any[]=[{'url':null}];
  submitted = false;
  StepperAdapter : StepperAdapter;
  travelDays: number;
  travelesData: any;
  private destroy$ = new Subject();

  constructor(private fb:FormBuilder,private SuperAgentService:SuperAgentApiService,private stepper:StepperComponent) { }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '7rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  }

  ngOnInit() {
    this.itineraryForm = this.fb.group({
      'itinerary': this.fb.array([]) ,
    });
    this.travelesData = JSON.parse(sessionStorage.getItem('searchData'))
    this.travelDays = +this.travelesData.travellersData.packageDays;
    this.getPackageDetails()
  }

  getPackageDetails(){
    this.SuperAgentService.getPackageDetails(sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
      if(data.master_package && data.master_package != null && data.master_package.package_itineraries.length > 0){
        this.setItinararyValues(data.master_package.package_itineraries)
      }else{
        this.setDaysItinerary(data)
      }
    })
  }

  setItinararyValues(data){
    data.forEach(element => {
      this.imageCollection.push({'url':null})
      this.itinerary = this.itineraryForm.get("itinerary") as FormArray
      var value = this.fb.group({
        'days': [element.day_number, Validators.required],
        'itinerary_title': [element.title, Validators.required],
        'itinerary_overview': [element.details, Validators.required],
        'urlList': [''],
      })
      this.itinerary.push(value);
    });
  }

  setDaysItinerary(data){
    for(let i=0;i< this.travelDays;i++){
      this.imageCollection.push({'url':null})
      this.itinerary = this.itineraryForm.get("itinerary") as FormArray
      if(i == 0 && data.flight_details.length > 0){
        var value = this.fb.group({
          'days': [i+1, Validators.required],
          'itinerary_title': ['Arrival jeddah to Makkah', Validators.required],
          'itinerary_overview': ['Arrival at jeddah , our representive pick you and will drop at Hotel in makkah , ziyarat of Historical Place Makka and over night stay at hotel', Validators.required],
          'urlList': [''],
        })
      }else if(i == (this.travelDays - 1)){
        var value = this.fb.group({
          'days': [i+1, Validators.required],
          'itinerary_title': ['Departure Day', Validators.required],
          'itinerary_overview': ['Departure Day', Validators.required],
          'urlList': [''],
        })
      }else if(data.hotel_details.length > 0){
        if(i < this.travelesData.mekkahData.makkahDays){
          var value = this.fb.group({
            'days': [i+1, Validators.required],
            'itinerary_title': ['Makkah', Validators.required],
            'itinerary_overview': ['Ziyarat of Historical Place Makka and over night stay at hotel', Validators.required],
            'urlList': [''],
          })
        }else{
          var value = this.fb.group({
            'days': [i+1, Validators.required],
            'itinerary_title': ['Madinah', Validators.required],
            'itinerary_overview': ['Ziyarat of Historical Place Madinah and over night stay at hotel', Validators.required],
            'urlList': [''],
          })
        }
      }else{
        var value = this.fb.group({
          'days': [i+1, Validators.required],
          'itinerary_title': ['', Validators.required],
          'itinerary_overview': ['', Validators.required],
          'urlList': [''],
        })
      }
      this.itinerary.push(value);
    }
  }


  itineraryArray(){
    return this.fb.group({
      'days': ['', Validators.required],
      'itinerary_title': ['', Validators.required],
      'itinerary_overview': ['', Validators.required],
      'urlList': [''],
    })
  }

  getItenirary(): FormArray{
    return this.itineraryForm.get("itinerary") as FormArray;
  }

  addItinerary(){
    this.imageCollection.push({'url':null})
    this.itinerary = this.itineraryForm.get("itinerary") as FormArray
    this.itinerary.push(this.itineraryArray());
  }

  removeItinerary(i:number){
    const index = this.imageCollection.indexOf(i);
    this.imageCollection.splice(index,1);
    this.itinerary.removeAt(i);
  }

  get f() { return this.itineraryForm.controls }

  getValidity(i,value){
    return ((<FormArray>this.itineraryForm.controls['itinerary']).at(i) as FormArray).controls[value].invalid
  }

  onSelectDescriptionFile(event,j){
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
              const reader = new FileReader();
              reader.onload = (event:any) => {
                 this.imageCollection[j].url = event.target.result;
              }
          this.itineraryForm.get("itinerary").value[j].urlList = event.target.files[i]
          reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  onSubmit(){
    this.submitted = true;

    if (this.itineraryForm.invalid) {
      return;
    }
    this.bttnactive = true;
    var value = this.f.itinerary.value
    let param =[]
    for(let i = 0; i < value.length ; i++){
      let body ={
        'title': value[i].itinerary_title,
        'noOfDays': value[i].days,
        'details': value[i].itinerary_overview,
        'attachments': value[i].urlList,
      }
      param.push(body);
    }
    
    this.SuperAgentService.forItinerarySetAPI(param,sessionStorage.getItem('masterPackageId')).pipe(takeUntil(this.destroy$)).subscribe(Data =>{
      this.updateMasterPackage()
    })
  }

  updateMasterPackage(){
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){
      this.bttnactive = false;
      this.goForward()
    }else{
      let body ={
        master_package:sessionStorage.getItem('masterPackageId')
      }
      this.SuperAgentService.updatePackageAPI(body,sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe(data=>{
        this.bttnactive = false;
        this.goForward()
      })
    }
  }

  goForward(){
    sessionStorage.setItem('selector','preview');
      this.stepper.stepContent('preview','');
      sessionStorage.removeItem('modify');
  }

  back(){
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){

    }else{
      this.stepper.stepContent('otherInfo','')
      sessionStorage.setItem('selector','otherInfo')
    }
    
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }
}