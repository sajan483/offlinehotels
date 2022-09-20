import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { Annotation, Annotations, CalendarComponent } from 'bi-datepicker';
import { takeUntil } from "rxjs/operators";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup} from '@angular/forms';
import { StepperAdapter } from 'src/app/adapters/super-agent/stepper-adapter';
import { HelperService } from "src/app/common/services/helper-service";
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/common/services/notification.service';
import { Subject } from 'rxjs';
import { LandingApiService } from 'src/app/components/landing/service/landing-api-services';

@Component({
  selector: 'app-package-edit',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.scss']
})
export class PackageEditComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  StepperAdapter : StepperAdapter;
  masterDatasForm:FormGroup;
  shimmer: boolean;
  id: any;
  currency: any[]=[];
  selectedCurrency:any;
  masterPackage: any;
  primaryPackage: any;
  packages: any;
  @ViewChild('dualCalendar', { static: false }) datePicker: CalendarComponent;
  @ViewChild('popupDatePicker', { static: false }) popUpDatePicker!: CalendarComponent;
  selectedPackage:any;
  availabilityCount:any;
  packageTempDate: any;
  submitted = false;
  bttnactive:boolean = false;
  urls = [];
  tripImg = [];
  imageAddButton:boolean = true;
  imageCollectionUrl:any[] = [];
  imageCollectionFile:any[]=[];
  deleteImageId:any[]=[];
  packageDays: number;

  constructor(public datepipe:DatePipe,private route:Router,private helperService:HelperService,private notifyService: NotificationService,
    private apiService:SuperAgentApiService,private activeRouter:ActivatedRoute,private common:LandingApiService) {
    this.StepperAdapter = new StepperAdapter(this.helperService)
   }

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
    window.scrollTo(0,0);
    this.getCurrency();
    this.getMasterDetails();
    this.masterDatasForm = this.StepperAdapter.masterEditForm();
  }

  getCurrency(){
    this.common.getCurrencies().pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
      this.currency = data.rates;
    })
  }

  changeCurrency(evnt){
    this.selectedCurrency = evnt;
    sessionStorage.setItem('currency',evnt);
    if(this.currency.length > 0){
      this.currency.forEach(data=>{
        if(data.currency == evnt){
          sessionStorage.setItem('currencySelect',JSON.stringify(data))
        }
      })
    }
  }

  getMasterDetails(){
    this.shimmer =true;
    this.id = this.activeRouter.params.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.id = data['id'];
      this.apiService.getMasterPackageById(this.id).pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
        this.shimmer = false;
        this.masterPackage = data;
        this.packageDays = data.no_of_days;
        this.primaryPackage = data.primary_package;
        if(data.images && data.images.file != null){
          this.urls.push(data.images.file);
          this.imageAddButton = false;
        }
        this.changeCurrency(data.currency);
        this.pasteDatas(data);
        this.getimageCollection(data);
      })
    })
  }

  getimageCollection(data){
    if(data.image_collections.length > 0){
      data.image_collections.forEach(element => {
        this.imageCollectionUrl.push({file:element.file,id:element.id});
      });
    }
    
  }

  pasteDatas(data){
    this.masterDatasForm.controls.overview.setValue(data.overview);
    this.masterDatasForm.controls.exclusion.setValue(data.exclusions);
    this.masterDatasForm.controls.inclusion.setValue(data.inclusions);
    this.masterDatasForm.controls.polices.setValue(data.terms);
    this.masterDatasForm.controls.location.setValue(data.location);
    this.masterDatasForm.controls.category.setValue(data.category);
    this.masterDatasForm.controls.title.setValue(data.title);
    this.masterDatasForm.controls.maxPax.setValue(data.max_passengers);
    this.masterDatasForm.controls.selectCurrency.setValue(data.currency);
  }



  get f() { return this.masterDatasForm.controls }

  saveMsPackage(){
    this.submitted = true;

    if (this.masterDatasForm.invalid) {
      return;
    }

    this.bttnactive = true;
    this.createMasterPackage(this.masterDatasForm.value);
  }

  createMasterPackage(value){
    let body = {
      'title': value.title, 
      'overview': value.overview, 
      'exclusions': value.exclusion, 
      'inclusions': value.inclusion,
      'terms':value.polices,
      'currency': this.selectedCurrency,
      'location':value.location,
      'category':value.category,
    }
    this.apiService.updateMasterPackage(body,this.masterPackage.id).pipe(takeUntil(this.destroy$)).subscribe(data =>{
      var pBody ={
        'max_passengers':value.maxPax,
      }
      this.apiService.updatePackageAPI(pBody,this.masterPackage.primary_package).pipe(takeUntil(this.destroy$)).subscribe(value =>{
        this.bttnactive = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Update succesfully',
          showConfirmButton: false,
          timer: 1500
        })
      })
      
    })
  }

  deleteTripImg(i:number){
    const index = this.urls.indexOf(i);
    this.urls.splice(index,1);
    this.tripImg.splice(index,1);
    this.imageAddButton = true;
  }

  addTripImages(event) {
    if (event.target.files && event.target.files[0]) {
      if(event.target.files[0].size < 2097152){
        const filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
                const reader = new FileReader();
                reader.onload = (event:any) => {
                   this.urls.push(event.target.result);
                   this.imageAddButton = false;
                }
            this.tripImg.push({'file':event.target.files[i]})
            reader.readAsDataURL(event.target.files[i]);
        }
      }else{
        this.notifyService.showWarning('Maximum image upload size is 2 MB')
      }
        
    }
  }

  deletepackageImages(i,data){
    this.imageCollectionUrl.splice(i,1);
    if(data.id > 0){
      this.deleteImageId.push(data.id)
    }else{
      this.imageCollectionFile.forEach((value,indx)=>{
        if(data.set == value){
          this.imageCollectionFile.splice(indx,1);
        }
      })
    }
  }

  addpackageImages(event){
    if (event.target.files && event.target.files[0]) {
      if(event.target.files[0].size < 2097152){
        const filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          const itineraryReader = new FileReader();
          itineraryReader.onload = (data:any) => {  
            this.imageCollectionUrl.push({file:data.target.result,id:0,set:event.target.files[i]});
          }
          this.imageCollectionFile.push(event.target.files[i])
          itineraryReader.readAsDataURL(event.target.files[i]);
        }
      }else{
        this.notifyService.showWarning('Maximum image upload size is 2 MB')
      }
      
    }
  }

  saveImages(){
    this.bttnactive = true;
    if(this.tripImg.length > 0){
      this.apiService.uploadTripImage(this.tripImg,this.masterPackage.id).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
        this.postImageCollection()
      })
    }else{
      this.postImageCollection()
    }
  }

  postImageCollection(){
    if(this.imageCollectionUrl.length >= 3){
      if(this.imageCollectionFile.length > 0){
        this.apiService.uploadImageCollection(this.imageCollectionFile,this.masterPackage.id).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
          this.setImageCollectionById()
        })
      }else{
        this.setImageCollectionById()
      }
    }else{
      this.bttnactive = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: ' Please Upload atleast 3 Package Images',
      })
    }
  }

  setImageCollectionById(){
    if(this.deleteImageId.length > 0){
      this.apiService.removeImageInCollection(this.deleteImageId,this.masterPackage.id).pipe(takeUntil(this.destroy$)).subscribe(data =>{
        this.bttnactive = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Update succesfully',
          showConfirmButton: false,
          timer: 1500
        })
      })
    }else{
      this.bttnactive = false;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Update succesfully',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }


  moreEdit(){
    sessionStorage.setItem('masterPackageId',this.masterPackage.id);
    sessionStorage.setItem('packageId',this.masterPackage.primary_package);
    sessionStorage.setItem('selector','preview');
    sessionStorage.setItem('packageEdit','true');
    sessionStorage.removeItem('searchData')
    sessionStorage.removeItem('published')
    this.route.navigateByUrl('superagent/stepper');
  }

  manuallyEdit(){
    sessionStorage.setItem('masterPackageId',this.masterPackage.id);
    sessionStorage.setItem('packageId',this.masterPackage.primary_package);
    this.route.navigateByUrl('superagent/package/'+this.masterPackage.primary_package+'/edit/services');
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }

  savePackage(){
    this.bttnactive = true;
    let body = {
      no_of_days:this.packageDays
    }
    this.apiService.updatePackageAPI(body,this.primaryPackage).subscribe(data=>{
      this.bttnactive = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Update succesfully',
          showConfirmButton: false,
          timer: 1500
        })
    },(err)=>{
      this.bttnactive = false;
    })
  }
 
}
