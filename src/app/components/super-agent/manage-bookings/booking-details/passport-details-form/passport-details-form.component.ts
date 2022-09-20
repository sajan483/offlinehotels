import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, Output,EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/common/services/helper-service';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import Swal from 'sweetalert2';
import {CroppedEvent} from 'ngx-photo-editor';
import { Observable, Observer, Subject } from 'rxjs';
import { isNumber } from 'util';
import { NgxSpinnerService } from "ngx-spinner";
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FlightServices } from 'src/app/components/sub-agent/components/flight_components/services/flight-api-services';
import { CommonApiService } from 'src/app/Services/common-api-services';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';
import { MY_CUSTOM_FORMATS } from 'src/app/components/branch/pages/passport-upload/visa-details/visa-front-page/visa-front-page.component';

@Component({
  selector: 'app-passport-details-form',
  templateUrl: './passport-details-form.component.html',
  styleUrls: ['./passport-details-form.component.scss'],
  providers:[
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},

    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
  ]
})
export class PassportDetailsFormComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  step = 0;
  @Input() travellerData : any;
  travelForm:FormGroup;
  submitted = false;
  bttnactive:boolean = false;
  toDay = new Date();
  minpassportExpDate: any;
  imageChangedEventFrond: any;
  fronPageImg: any = null;
  imageChangedEventBack: any;
  backPageImg: any = null;
  imageShowBig: boolean;
  showimage: any;
  formDetails: any;
  index: number;
  imageFiles:any[]=[];
  imageFile:any;
  generatedImage:any;
  frontPageUpload:boolean;
  updateOption:boolean;
  isSubmitVisaActive:boolean = false;
  nationalities:any[] = [ ];
  filteredNationalities: Observable<any[]>[] = [];

  countries:any[] = [ ];
  filteredCountries: Observable<any[]>[] = [];
  @Output()
  onTravellers: EventEmitter<any> = new EventEmitter<any>()

  constructor(private apiService:SuperAgentApiService,private fb:FormBuilder,public datepipe:DatePipe,
    private helper:HelperService,private spinner: NgxSpinnerService,private commonServices:CommonApiService) { }

  ngOnInit() {
    
    this.getNationalities();
    this.getCountries();
    this.minpassportExpDate = this.helper.incrimentmonth(new Date(),6)
    this.travelForm = this.fb.group({
      travellers:this.fb.array([])
    })
    this.initialFormArray(this.travellerData.travllers)
  }

  getNationalities(){
    this.commonServices.getNationality("","en-US").subscribe((data)=>{
      this.nationalities = data;
      let formA = this.travelForm.get('travellers') as FormArray;
      for(let i=0;i<formA.length;i++){
        this.filterNationalities(i);
      }
    });
  }

  getCountries(){
    this.commonServices.getCountries().subscribe((data)=>{
      this.countries = data;
      let formA = this.travelForm.get('travellers') as FormArray;
      for(let i=0;i<formA.length;i++){
        this.filterCountries(i);
      }
    });
  }

  filterNationalities( index:number){
    let formA = this.travelForm.get('travellers') as FormArray;
    this.filteredNationalities[index] = (formA.at(index) as FormGroup).controls['nationalitySearch'].valueChanges.pipe(startWith(''),map((value)=>{
      return this.nationalities.filter((e)=>{
        return e.name.toLowerCase().includes(value.toLowerCase());
      });
    }));
  }

  filterCountries( index:number){
    let formA = this.travelForm.get('travellers') as FormArray;
    this.filteredCountries[index] = (formA.at(index) as FormGroup).controls['country_of_residence'].valueChanges.pipe(startWith(''),map((value)=>{
      return this.countries.filter((e)=>{
        return e.name.toLowerCase().includes(value.toLowerCase());
      });
    }));
  }
  initialFormArray(traveller:number){
    for(let i=0;i<traveller;i++){
      this.addTraveller();
      var fileData = {
        frond:'',
        back:'',
        id:''
      }
      this.imageFiles.push(fileData)
      this.filterNationalities(i);
      this.filterCountries(i);
    }
    this.getTravelDatas(this.travellerData.id);
  }

  getTravelDatas(id){
    this.apiService.getBookingTravelerDetails(id).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      if(data.code == '0'){
        this.updateOption = true;
        this.onTravellers.emit(data.data.results);
        this.setTravellerValues(data.data.results);
      }else{
        this.updateOption = false;
      }
    })
  }

  setTravellerValues(values){
    values.forEach((ele:any,i:number)=>{
      const fg = this.travellerArray().at(i);
      fg.patchValue({
        traveler_id:ele.id,
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
        passport_city:ele.passport_city,
        passport_frond:ele.passport_front,
        passport_back:ele.passport_back
      })
    })
    this.formDetails = this.travelForm.value;
  }

  travellerArray():FormArray{
    return this.travelForm.get("travellers") as FormArray
  }

  newTraveller(){
    return this.fb.group({
      traveler_id:[''],
      passport_type:['',Validators.required],
      passport_no:['',Validators.required],
      first_name:['',Validators.required],
      middle_name:[''],
      last_name:['',Validators.required],
      gender:['MALE',Validators.required],
      dob:['',Validators.required],
      birth_place:['',Validators.required],
      passport_city:['',Validators.required],
      date_of_issue:['',Validators.required],
      passport_expiry_date:['',Validators.required],
      father_name:[''],
      mother_name:[''],
      husband_name:[''],
      address:[''],
      city:[''],
      nationality:['',Validators.required],
      country_of_residence:[''],
      passport_frond:['',Validators.required],
      passport_back:['',Validators.required],
      passport_front_file:[''],
      passport_back_file:[''],
      nationalitySearch:['']
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
    if(this.travelForm.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all required fields!',
      })
      return;
    }
    if(this.updateOption){
      this.setBodyUpdate(this.travelForm.value)
    }else{
      this.setBodyCreate(this.travelForm.value)
    }
  }

  setBodyUpdate(data){
    var travellers = [];
    data.travellers.forEach(data =>{
      var val = {
        id:data.traveler_id,
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
    this.postTravellDetails(body);
  }

  setBodyCreate(data){
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
    this.postTravellDetails(body);
  }

  postTravellDetails(body){
    this.bttnactive = true;
    this.apiService.postTravellerPassportDetails(this.travellerData.id,body).pipe(takeUntil(this.destroy$)).subscribe((res:any) =>{
      if(this.updateOption){
        this.passportPost(this.travelForm.value)
      }else{
        this.setIdFormGroup(res.travellers,this.travelForm.value)
      }
      this.isSubmitVisaActive = !this.isSubmitVisaActive;
    },(err) =>{
      this.bttnactive = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    })
  }

  setIdFormGroup(res,frm){
    res.forEach(ele => {
      frm.travellers.forEach((value:any,i:number)=>{
        if(ele.passport_no == value.passport_no){
          const fg = this.travellerArray().at(i);
          fg.patchValue({
            traveler_id:ele.id
          })
        }
      })
    });
    this.passportPost(this.travelForm.value)
  }

  passportPost(data){
    var indx = 0;
    this.postPassportApiCall(data.travellers,indx)
  }

  postPassportApiCall(data,indx:number){
    if(data[indx].passport_front_file != "" || data[indx].passport_back_file != ""){
      this.apiService.postPassportImage(data[indx].passport_front_file,data[indx].passport_back_file,data[indx].traveler_id).subscribe(res =>{
        if(indx+1 < data.length){
          this.postPassportApiCall(data,indx+1)
        }else{
          this.bttnactive = false;
          Swal.fire(
            'success!',
            'Passport Details is Submitted Successfully!',
            'success'
          )
        }
      })
    }else{
      if(indx+1 < data.length){
        this.postPassportApiCall(data,indx+1)
      }else{
        this.bttnactive = false;
        Swal.fire(
          'success!',
          'Passport Details is Submitted Successfully!',
          'success'
        )
      }
    }
  }

  fileChangeEventFrond(event: any,i) {
    this.index = +i;
    this.frontPageUpload = true;
    this.passportApiCall(event.target.files[0])
    this.imageChangedEventFrond = event;
  }

  fileChangeEventBack(event: any,i) {
    this.index = +i;
    this.frontPageUpload = false;
    this.passportApiCall(event.target.files[0])
    this.imageChangedEventBack = event;
  }

  imageCroppedFrond(event: CroppedEvent) {
    const fg = this.travellerArray().at(this.index);
    fg.patchValue({
      passport_frond:event.base64
    })
    this.formDetails = this.travelForm.value;
    this.passportAutomation(event,true,event.file)
  }

  imageCroppedBack(event: CroppedEvent) {
    const fg = this.travellerArray().at(this.index);
    fg.patchValue({
      passport_back:event.base64
    })
    this.formDetails = this.travelForm.value;
    this.passportAutomation(event,false,event.file)
  }

  erasePassImagFrond(i){
    const fg = this.travellerArray().at(i);
    fg.patchValue({
      passport_frond:''
    })
    this.formDetails = this.travelForm.value;
  }

  erasePassImagBack(i){
    const fg = this.travellerArray().at(i);
    fg.patchValue({
      passport_back:''
    })
    this.formDetails = this.travelForm.value;
  }

  ViewBttn(img){
    this.showimage = img;
    this.imageShowBig = true;
  }

  closeViewImage(){
    this.showimage = null;
    this.imageShowBig = false;
  }

  passportAutomation(data,pos,imgevt){
    this.getBase64ImageFromURL(data.base64).pipe(takeUntil(this.destroy$)).subscribe((base64Data: string) => {
      this.imageFile = base64Data;
      this.dataURItoBlob(pos,imgevt);
    });
  }
  
  dataURItoBlob(pos,imgevt) {
      this.dataURItoBlob1(this.imageFile).pipe(takeUntil(this.destroy$)).subscribe((blob: Blob) => {
        const imageBlob: Blob = blob;
        const imageName: string = imgevt.name;
        const imageFile: File = new File([imageBlob], imageName, {
          type: imgevt.type
        });
        this.generatedImage = window.URL.createObjectURL(imageFile);
        const fg = this.travellerArray().at(this.index);
        if(pos){
          fg.patchValue({
            passport_front_file:imageFile
          })
        }else{
          fg.patchValue({
            passport_back_file:imageFile
          })
        }
        this.spinner.show();
        this.passportApiCall(imageFile)
      });
  }

  dataURItoBlob1(dataURI: string): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: "image/jpeg" });
      observer.next(blob);
      observer.complete();
    });
  }

  getBase64ImageFromURL(url: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement): string {
    // We create a HTML canvas object that will create a 2d image
    var canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    let dataURL: string = canvas.toDataURL("image/png");
    // this.base64DefaultURL = dataURL;
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  passportApiCall(file){
    if(this.frontPageUpload){
      this.apiService.getPassportFrontAutomation(file).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
        this.spinner.hide();
        if(data.status == 'success'){
          this.pasteDateFilledFront(data.passport_data.result)
        }
      },err=>{
        this.spinner.hide();
      })
    }else{
      this.apiService.getPassportBackAutomation(file).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
        this.spinner.hide();
        if(data.status == 'success'){
          this.pasteDataFilledBack(data.passport_data)
        }
      },err=>{
        this.spinner.hide();
      })
    }
    
  }

  pasteDataFilledBack(data){
    const fg = this.travellerArray().at(this.index);
    fg.patchValue({
      father_name:data.father,
      mother_name:data.mother,
      address:this.replaceSpecialChar(data.address)
    })
  }

  replaceSpecialChar(data){
    return data.replaceAll('\n','').replaceAll('\f','')
  }

  pasteDateFilledFront(data){
    const fg = this.travellerArray().at(this.index);
    fg.patchValue({
      passport_type:'P',
      passport_no: data.passport_number,
      first_name:data.given_name,
      last_name:data.surname,
      birth_place:data.pob,
      passport_city:data.poi,
      nationality:data.nationality,
      country_of_residence:data.country
    })
    if(this.checkDateFormat(data.dob)){
      var date = this.convertDateFormat(data.dob)
      fg.patchValue({
        dob:this.dateFormater(new Date(date)),
      })
    }
    if(this.checkDateFormat(data.doi)){
      var date = this.convertDateFormat(data.doi)
      fg.patchValue({
        date_of_issue:this.dateFormater(new Date(date)),
      })
    }
    if(this.checkDateFormat(data.doe)){
      var date = this.convertDateFormat(data.doe)
      fg.patchValue({
        passport_expiry_date:this.dateFormater(new Date(date)),
      })
    }
    if(data.sex == 'F'){
      fg.patchValue({
        gender:'FEMALE',
      })
    }else if(data.sex == 'M'){
      fg.patchValue({
        gender:'MALE',
      })
    }else{
      fg.patchValue({
        gender:'MALE',
      })
    }
  }

  convertDateFormat(date){
    var dd = date.split('/')[0];
    var mm = date.split('/')[1];
    var yy = date.split('/')[2];
    return mm+'/'+dd+'/'+yy
  }

  checkDateFormat(date){
    if(date.split('/').length == 3){
      var dd = date.split('/')[0];
      var mm = date.split('/')[1];
      var yy = date.split('/')[2];
      if(isNaN(+dd) || !isNumber(+dd) || dd > 31){
        return false
      }else if(isNaN(+mm) || !isNumber(+mm) || mm > 12){
        return false
      }else if(isNaN(+yy) || !isNumber(+yy)){
        return false
      }else{
        return true
      }
    }else{
      return false;
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }
  
  submitVisa(){
    Swal.fire({
      icon: 'success',
      title: 'Success...',
      text: 'Passports submitted for visa!',
    })   
  }
}