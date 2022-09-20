import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { StepperAdapter } from 'src/app/adapters/super-agent/stepper-adapter';
import { AppStore } from 'src/app/stores/app.store';
import { HelperService } from "src/app/common/services/helper-service";
import { StepperComponent } from '../stepper.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';
import { takeUntil } from "rxjs/operators";
import { NotificationService } from 'src/app/common/services/notification.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-other-info',
  templateUrl: './other-info.component.html',
  styleUrls: ['./other-info.component.scss']
})
export class OtherInfoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  otherPackageForm:FormGroup;
  StepperAdapter : StepperAdapter;
  submitted = false;
  itinerary:FormArray;
  urls = [];
  tripImg = [];
  itineraryUrlList = [];
  itineraryFiles = [];
  array: any[] = [];
  imageAddButton:boolean = true;
  otherInfoMin:any;
  otherInfoMax:any;
  travelDays: number;
  bttnactive: boolean = false;
  past_data: any;
  imageCollectionFile:any[]=[];
  imageCollectionUrl:any[] = [];
  masterPackages: any[]=[];
  deleteImageCollection:any[]=[];
  addImageCollectionId:any[]=[];
  heroImageId:any[]=[];

  constructor(private SuperAgentService:SuperAgentApiService,private appStore:AppStore,private helperService:HelperService,
    private notifyService: NotificationService,
    private stepper:StepperComponent,private _formBuilder:FormBuilder) {this.StepperAdapter = new StepperAdapter(this.helperService)}

  /**
   * configuratio settings for rich text editor
   */
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
    this.getMasterPackages();
    this.otherPackageForm = this.StepperAdapter.otherInfoForm();
    this.packageDetails();
  }

  getMasterPackages(){
    this.SuperAgentService.getMasterPackages().pipe(takeUntil(this.destroy$)).pipe(takeUntil(this.destroy$)).subscribe((data:any )=>{
      this.masterPackages = data.results;
    })
  }

  pasteDateFromOtherMaster(data){
    this.imageCollectionFile = [];
    this.imageCollectionUrl = [];
    this.deleteImageCollection = [];
    this.addImageCollectionId = [];
    this.heroImageId = [];
    this.urls = [];
    this.tripImg = [];
    this.itineraryUrlList = [];
    this.itineraryFiles = [];
    this.array = [];
    this.pasteDatas(data);
    this.pastPackageImgDatas(data);
  }

  pastPackageImgDatas(data){
    if(data.images && data.images.file != null){
      this.urls.push(data.images.file);
      this.heroImageId.push(data.images.id)
      this.imageAddButton = false;
    }
    if(data.image_collections.length > 0){
      data.image_collections.forEach(element => {
        this.addImageCollectionId.push(element.id)
        this.imageCollectionUrl.push({file:element.file,id:element.id})
      });
    }
  }

  pasteDatas(data){
    this.otherPackageForm.controls.overview.setValue(data.overview);
    this.otherPackageForm.controls.exclusion.setValue(data.exclusions);
    this.otherPackageForm.controls.inclusion.setValue(data.inclusions);
    this.otherPackageForm.controls.polices.setValue(data.terms);
    this.otherPackageForm.controls.location.setValue(data.location);
    this.otherPackageForm.controls.category.setValue(data.category);
    this.otherPackageForm.controls.title.setValue(data.title);
  }

  packageDetails(){
    this.SuperAgentService.getPackageDetails(sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      if(data.master_package && data.master_package != null){
        this.pasteDatas(data.master_package);
        this.setPackageImgDatas(data.master_package);
      }
      
    })
  }

  setPackageImgDatas(data){
    if(data.images && data.images.file != null){
      this.urls.push(data.images.file);
      this.imageAddButton = false;
    }
    if(data.image_collections.length > 0){
      data.image_collections.forEach(element => {
        this.imageCollectionUrl.push({file:element.file,id:element.id})
      });
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

  deletepackageImages(i,data){
    this.imageCollectionUrl.splice(i,1);
    if(data.id > 0){
      this.deleteImageCollection.push(data.id);
      this.addImageCollectionId.forEach((imgid,i)=>{
        if(imgid == data.id){
          this.addImageCollectionId.splice(i,1)
        }
      })
    }else{
      this.imageCollectionFile.forEach((value,i)=>{
        if(data.set == value){
          this.imageCollectionFile.splice(i,1);
        }
      })
    }
  }

  /**
   * add hero image
   */
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

  /**
   * remove hero image
   */
  deleteTripImg(i:number){
    const index = this.urls.indexOf(i);
    this.urls.splice(index,1);
    this.tripImg.splice(index,1);
    this.heroImageId = [];
    this.imageAddButton = true;
  }

  

  get f() { return this.otherPackageForm.controls }

  

  /**
   * submit otherPackageForm form
   */
  onSubmit(){
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.otherPackageForm.invalid) {
      return;
    }

    if(this.urls.length == 0){
      Swal.fire({
        icon: 'error',
        text: 'Please Upload Marketing Image',
      })
      return;
    }

    if(this.imageCollectionUrl.length < 3){
      Swal.fire({
        icon: 'error',
        text: 'Please Upload atleast 3 Package Images',
      })
      return;
    }

    this.bttnactive = true;
    this.createMasterPackage(this.otherPackageForm.value);
  }

  createMasterPackage(value){
    var searchData = JSON.parse(sessionStorage.getItem('searchData'))
    if(sessionStorage.getItem('masterPackageId') && sessionStorage.getItem('masterPackageId') != null){
      let body = {
        'title': value.title, 
        'overview': value.overview, 
        'exclusions': value.exclusion, 
        'inclusions': value.inclusion,
        'terms':value.polices,
        'currency': sessionStorage.getItem('currency'),
        'location':value.location,
        'category':value.category,
        'no_of_days': searchData.travellersData.packageDays
      }
      this.SuperAgentService.updateMasterPackage(body,sessionStorage.getItem('masterPackageId')).pipe(takeUntil(this.destroy$)).subscribe(data =>{
        this.postTripImg()
      })
    }else{
      let body = {
        'title': value.title, 
        'overview': value.overview, 
        'exclusions': value.exclusion, 
        'inclusions': value.inclusion,
        'terms':value.polices,
        'currency': sessionStorage.getItem('currency'),
        'location':value.location,
        'category':value.category,
        'primary_package':sessionStorage.getItem('packageId'),
        'no_of_days': searchData.travellersData.packageDays
      }
      this.SuperAgentService.createMasterPackage(body).pipe(takeUntil(this.destroy$)).subscribe((data:any) =>{
          sessionStorage.setItem('masterPackageId',data.id);
          this.postTripImg()
      })
    }
  }

  postTripImg(){
    if(this.tripImg.length > 0){
      this.SuperAgentService.uploadTripImage(this.tripImg,sessionStorage.getItem('masterPackageId')).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
        this.postImageCollection()
      })
    }else{
      this.postImageCollection()
    }
  }

  postImageCollection(){
    if(this.imageCollectionFile.length > 0){
      this.SuperAgentService.uploadImageCollection(this.imageCollectionFile,sessionStorage.getItem('masterPackageId')).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
        this.deleteImagesFromCollection()
      })
    }else{
      this.deleteImagesFromCollection()
    }
  }

  deleteImagesFromCollection(){
    if(this.deleteImageCollection.length > 0){
      this.SuperAgentService.removeImageInCollection(this.deleteImageCollection,sessionStorage.getItem('masterPackageId')).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        this.addtripImageById()
      })
    }else{
      this.addtripImageById()
    }
  }

  addtripImageById(){
    if(this.heroImageId.length > 0){
      this.SuperAgentService.uploadTripImageId(this.heroImageId,sessionStorage.getItem('masterPackageId')).pipe(takeUntil(this.destroy$)).subscribe(data =>{
        this.addImageCollectionById()
      })
    }else{
      this.addImageCollectionById()
    }
  }

  addImageCollectionById(){
    if(this.addImageCollectionId.length > 0){
      this.SuperAgentService.uploadImageCollectionById(this.addImageCollectionId,sessionStorage.getItem('masterPackageId')).pipe(takeUntil(this.destroy$)).subscribe(data =>{
        this.goForward();
      })
    }else{
      this.goForward();
    }
  }
  
  goForward(){
    this.bttnactive = false;
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){
      sessionStorage.setItem('selector','preview');
      this.stepper.stepContent('preview','');
      sessionStorage.removeItem('modify');
    }else{
      this.stepper.stepContent('itinerary','')
      sessionStorage.setItem('selector','itinerary')
    }
  }

  back(){
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){

    }else{
      this.stepper.stepContent('payment','')
      sessionStorage.setItem('selector','payment')
    }
    
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }
}