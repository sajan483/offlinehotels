import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HotelNameList } from 'src/app/models/hotels';
import { Observable, Subject} from "rxjs";
import { SubAgentApiService } from 'src/app/Services/sub-agent-api-services';
import { map, startWith, takeUntil } from "rxjs/operators";
import Swal from 'sweetalert2';
import { GeneralHelper } from 'src/app/helpers/General/general-helpers';
import { HelperService } from 'src/app/common/services/helper-service';
import { SegmentService } from 'ngx-segment-analytics';
import { environment } from 'src/environments/environment';
import { SubAgentCurrencyLangHelper } from '../../helpers/currency-lang-helper';
import { UserStateService } from '../../services/User-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subpcc-update',
  templateUrl: './subpcc-update.component.html',
  styleUrls: ['./subpcc-update.component.scss']
})
export class SubpccUpdateComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  hotelLocation:any;
  subpccForm: FormGroup;
  submitted = false;
  filteredStates: Observable<any[]>;
  stateCtrl = new FormControl();
  states : HotelNameList[] = [];
  hotelName: any;
  hotelCode: any;
  errMsg: boolean;
  @ViewChild('endDatePicker', { read: ElementRef, static: false })
  endDatePicker: ElementRef;
  endDateValue:Date;
  startDateValue:Date;
  myDate :any;
  subPccList: any;
  shimmer:boolean = true;
  patchId: any;
  patchSubPcc: boolean = false;
  dateNavigation: boolean = false;
  pageNumber: any = 1;
  pageSize: any;
  bttnActive: boolean;
  baseUrl: string = "";
  prodUrl: string = environment.prodUrl;
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  selectLangCode:any;
  selectCurrency:any;

  constructor(private translate: TranslateService,private helperService: HelperService, private fb:FormBuilder,private subAgent: SubAgentApiService,
    private genHelper: GeneralHelper,private segment :SegmentService,private userStateService: UserStateService,private activeRoute:ActivatedRoute) { 
    this.subpccForm = this.fb.group({
      subPccCode:['',Validators.required],
      startDate:['',Validators.required],
      endDate:['',Validators.required]
    })
    
  }

  ngOnInit() {
    this.getLanguage();
    this.listSubPcc();
    var today = new Date();
    this.myDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(""),
      map((state) => (state ? this._filterStates(state) : this.states.slice()))
    );
  }

  getLanguage(){
    this.activeRoute.params.subscribe(params =>{
      this.currencyLangHelper.changeLanguage(params.lang);
      this.currencyLangHelper.setCurrency(params.currency);
    })
    this.initialValues();
  }

  initialValues(){
    this.userStateService.globelCurrency.subscribe(t => this.selectCurrency = t);
    this.userStateService.globalLanguage.subscribe(t => this.selectLangCode = t);
    this.listHotelName();
    this.genHelper.checkForAccessToken();
    this.findProdUrlConfig()
    this.setUserDataForSegmentAnalysis();
  }

  setUserDataForSegmentAnalysis(){
    if(this.baseUrl  == this.prodUrl){
       window.analytics.page('subagent/subbpcc',{
        user:localStorage.getItem("userTypeName"),
        userId:localStorage.getItem("userId"),
        portal:"B2B"
      });
    }
  }

findProdUrlConfig(){
    const parsedUrl = new URL(window.location.href);
       this.baseUrl = parsedUrl.origin;
  }

  listHotelName(){
    
  }

  private _filterStates(value: string): HotelNameList[] {
    const filterValue = value.toLowerCase();
    this.states = [];
    this.subAgent.getHotelNameList(value).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
      for (const d of data as any) {
        this.states.push(d);
      }
      },
      (err) => {
      });

    return this.states;
  }

  setHotelName(data){
    this.hotelName = data.name;
    this.hotelCode = data.umrah_hotel_code;
    this.hotelLocation = data.location;
  }

  get f() { return this.subpccForm.controls; }
  
  submitSubPcc(){
    this.submitted = true;

    if(this.hotelCode == null){
      this.errMsg = true;
      return;
    }
    
    this.bttnActive = true;

    if (this.subpccForm.invalid) {
        return;
    }

    var body = {
      hotel_code:this.hotelCode,
      sub_pcc:this.subpccForm.controls.subPccCode.value,
      location:this.hotelLocation,
      from_date:this.helperService.dateFormaterYMd(this.subpccForm.controls.startDate.value),
      to_date:this.helperService.dateFormaterYMd(this.subpccForm.controls.endDate.value)
    }
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('subpcc submitted',{
      user:localStorage.getItem("userTypeName"),
      userId:localStorage.getItem("userId"),
      portal:"B2B",
      body:body
     });
    }
 
    if(this.patchSubPcc){
      this.subAgent.patchSubPcc(body,this.patchId,sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(data=>{
        this.resetDatas();
        this.patchSubPcc = false;
        this.bttnActive = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Successfully Updated SubPcc',
          showConfirmButton: false,
          timer: 1500
        })
        if(this.baseUrl  == this.prodUrl){
          window.analytics.track('subpcc updated',{
          portal:"B2B",
          user:localStorage.getItem("userTypeName"),
          userId:localStorage.getItem("userId"),
          status:"success"
         });
        }
      },(err)=>{
        this.bttnActive = false;
      })
    }else{
      this.subAgent.postSubPcc(body,sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(data=>{
        this.resetDatas();
        this.bttnActive = false;
        if(this.baseUrl  == this.prodUrl){
          window.analytics.track('subpcc added',{
          portal:"B2B",
          user:localStorage.getItem("userTypeName"),
          userId:localStorage.getItem("userId"),
          status:"success"
         });
        }
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Successfully Added SubPcc',
          showConfirmButton: false,
          timer: 1500
        })
      },(err)=>{
        this.bttnActive = false;
      })
    }

  }

  resetDatas(){
    this.shimmer = true;
    this.listSubPcc();
    this.submitted = false;
    this.subpccForm.reset();
    this.hotelName = null;
    this.hotelCode = null;
  }

  listSubPcc(){
    this.shimmer = true;
    this.subAgent.getSubPcc(sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(data =>{
      this.subPccList = data;
      this.shimmer = false;
    })
  }

  startDatePick(evnt){
    if(evnt != null && !this.dateNavigation){
      this.endDatePicker.nativeElement.click();
    }
    this.endDateValue = null;
  }

  endDatePick(evnt){

  }

  delete(id){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subAgent.deleteSubPcc(id,sessionStorage.getItem('ulogId')).pipe(takeUntil(this.destroy$)).subscribe(res=>{
          if(this.baseUrl  == this.prodUrl){
            window.analytics.track('subpcc removed',{
            user:localStorage.getItem("userTypeName"),
            userId:localStorage.getItem("userId"),
            portal:"B2B",
            status:"success"
           });
          }
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          this.listSubPcc();
        }, (error)=>{
          
        })
        
      }
    })
  }

  update(data){
    this.patchSubPcc = true;
    this.dateNavigation = true;
    this.patchId = data.id;
    this.hotelName = data.name;
    this.hotelCode = data.hotel_code;
    this.subpccForm.patchValue( {'subPccCode':data.sub_pcc} );
    this.subpccForm.patchValue( {'startDate':data.from_date} );
    this.subpccForm.patchValue( {'endDate':data.to_date} );
    this.dateNavigation = false;
    this.hotelLocation = data.location;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  }
 
}
