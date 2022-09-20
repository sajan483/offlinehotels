import { Component,Input, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith, takeUntil } from "rxjs/operators";
import { Observable, Subject } from 'rxjs';
import { listAirport } from 'src/app/models/listAirport';
import { airlineList } from 'src/app/models/airlineList';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { Router } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { LandingApiService } from 'src/app/components/landing/service/landing-api-services';
import { HelperService } from 'src/app/common/services/helper-service';
import { SuperAgentHelperService } from 'src/app/helpers/super-agent/super-agent-helper';
import { StepperComponent } from '../stepper/stepper.component';

@Component({
  selector: 'app-searching-data',
  templateUrl: './searching-data.component.html',
  styleUrls: ['./searching-data.component.scss']
})
export class SearchingDataComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  @Input() homePage: boolean;
  today = new Date().toJSON().split("T")[0];
  fromLocation:any = {
    iata:"DXB",
    city:"Dubai"
  };
  destLocation:any = {
    iata:"JED",
    city:"Jeddah"
  };
  airlineDetails:any = {
    name:"Emirates",
    code:"EK"
  };
  selectedCurrency = "SAR";
  currency: any;
  todayStamp = new Date();
  searchForm: FormGroup;
  airportListFilteredSrc:Observable<listAirport[]>;
  airportListFilteredDest:Observable<listAirport[]>;
  airlinesFiltered: Observable<airlineList[]>;
  airportsSrc: listAirport[] = [];
  airportsDest: listAirport[] = [];
  airlineList: airlineList[] = [];
  source = new FormControl();
  destination = new FormControl();
  airline = new FormControl();
  pkg_days_err: boolean;
  err_msg: string;
  makkah_dys_err: boolean;
  madeena_dys_err: boolean;
  destError:boolean=false;
  srcError:boolean=false;
  bttnactive: boolean;
  searchData:any;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private helper: HelperService,
    private commonService: SuperAgentApiService,
    private router: Router,
    private common: LandingApiService,
    private appStore:AppStore,
    private superHelper:SuperAgentHelperService
  ) { }

  ngOnInit() {
    this.getCurrency();
    this.todayStamp = this.superHelper.incrementDate(this.todayStamp,-1);
    var afterDate = this.superHelper.incrementDate(this.todayStamp,7);
    this.searchForm = this.fb.group({
      adult:[1, Validators.required],
      package_days:[15, Validators.required],
      makkahDays:[10, Validators.required],
      madeenaDyas:[5, Validators.required],
      date:[afterDate, Validators.required],
    });
    this.getValuesSession();
    this.source.setValue(this.fromLocation.iata)
    this.destination.setValue(this.destLocation.iata)
    this.airline.setValue(this.airlineDetails.name)
    this.getAirportListSrc()
    this.getAirportListDest()
    this.getAirlineList()
  }

  getAirportListSrc(){
    this.airportListFilteredSrc = this.source.valueChanges.pipe(
      startWith(" "),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filterAirportListSrc(name) : this.airportsSrc.slice())
    );
  }
  
  getAirportListDest(){
    this.airportListFilteredDest = this.destination.valueChanges.pipe(
      startWith(" "),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filterAirportListDest(name) : this.airportsDest.slice())
    );
  }

  getAirlineList(){
    this.airlinesFiltered = this.airline.valueChanges.pipe(
      startWith(" "),
      map((state) => (state ? this._filterAirlineList(state) : this.airlineList.slice()))
    );
  }

  private _filterAirportListSrc(value: string): listAirport[] {
    const filterValue = value.toLowerCase();
    this.airportsSrc = [];
    this.commonService.getAirportListSrc(value).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      for (const d of data as any) {
        this.airportsSrc.push(d);
      }
    });
    return this.airportsSrc;
  }

  private _filterAirportListDest(value: string): listAirport[] {
    const filterValue = value.toLowerCase();
    this.airportsDest = [];
    this.commonService.getAirportListSrc(value).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      for (const d of data as any) {
        this.airportsDest.push(d);
      }
    });
    return this.airportsDest;
  }

  private _filterAirlineList(value: string): airlineList[] {
    const filterValue = value.toLowerCase();
    this.airlineList = [];
    this.commonService.getairlineslist(value).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      for (const d of data as any) {
        this.airlineList.push(d);
      }
    });
    return this.airlineList;
  }

  packageDays(value){
    if(value < 4){
      this.pkg_days_err = true;
      this.err_msg = 'minimum 3 days required';
    }else if(value > 40){
      this.pkg_days_err = true;
      this.err_msg = 'maximum 40 days';
    }else{
      this.pkg_days_err = false;
      this.searchForm.controls.makkahDays.setValue(2);
      this.searchForm.controls.madeenaDyas.setValue(1);
    }
  }

  makkhDays(value){
    if(value > this.searchForm.controls.package_days.value){
      this.makkah_dys_err = true;
      this.err_msg = 'maximum '+this.searchForm.controls.package_days.value+ ' days';
      this.searchForm.controls.madeenaDyas.setValue(0);
    }else{
      this.makkah_dys_err = false;
    }
  }

  madeenaDays(value){
    var balance = this.searchForm.controls.package_days.value - this.searchForm.controls.makkahDays.value
    if(value > balance){
      this.madeena_dys_err = true;
      this.err_msg = 'maximum '+balance+ ' days';
    }else{
      this.madeena_dys_err = false;
    }
  }

  setFromLocation(data){
    this.srcError = false
    this.destError = false
    if(this.destLocation.city == data.city){
      this.srcError = true
    }
    else{
      this.fromLocation.city = data.city
      this.fromLocation.iata = data.iata
    }
  }

  setDestLocation(data){
    this.destError = false
    this.srcError = false
    if(this.fromLocation.city == data.city){
      this.destError = true
    }
    else{
      this.destLocation.city = data.city
      this.destLocation.iata = data.iat
    }
  }

  setAirline(data){
    this.airlineDetails = {
      name:data.name,
      code:data.code
    };
  }

  getValuesSession(){
    if(sessionStorage.getItem('searchData') && sessionStorage.getItem('searchData') != undefined && sessionStorage.getItem('searchData') != null){
      var searchDatas = JSON.parse(sessionStorage.getItem('searchData'))
      this.searchForm.patchValue({
        adult:searchDatas.travellersData.adult,
        package_days:searchDatas.travellersData.packageDays,
        makkahDays:searchDatas.mekkahData.makkahDays,
        madeenaDyas:searchDatas.medinaData.madeena,
        date:searchDatas.travellersData.startDate,
      })
      this.fromLocation = {
        iata:searchDatas.flightData.source,
        city:searchDatas.flightData.sourceName
      };
      this.destLocation = {
        iata:searchDatas.flightData.destination,
        city:searchDatas.flightData.destinationName
      }
      this.airlineDetails = {
        name:searchDatas.flightData.airlineName,
        code:searchDatas.flightData.airline
      };
    }
  }

  getCurrency(){
    if(sessionStorage.getItem('currencySelect')){
      var value = JSON.parse(sessionStorage.getItem('currencySelect'))
      this.selectedCurrency = value.currency;
      sessionStorage.setItem('currency',value.currency)
    }else{
      var data = {currency: 'SAR', rate: 1, precision: 2};
      sessionStorage.setItem('currencySelect',JSON.stringify(data));
      sessionStorage.setItem('currency',data.currency);
    }
    this.common.getCurrencies().pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      this.currency = data.rates;
    })
  }

  get form() { return this.searchForm.controls; }

  get submit() {
    if(this.searchForm.valid && !this.destError && !this.srcError){
      return true
    }
    else{
      return false
    }
  }

  selectCurrency(data){
    sessionStorage.setItem('currencySelect',JSON.stringify(data));
    sessionStorage.setItem('currency',data.currency);
  }

  submitData(){
    var dateData =  this.superHelper.setCreatePackageList(this.form.package_days.value,this.form.makkahDays.value,this.form.madeenaDyas.value,this.form.date.value)
    this.bttnactive = true;
    this.searchData = {
      travellersData : {
        adult: this.form.adult.value,
        startDate:this.helper.dateFormaterYMd(dateData.start_date),
        endDate:this.helper.dateFormaterYMd(dateData.end_date),
        packageDays: this.form.package_days.value,
      },
      flightData:{
        source:this.source.value,
        sourceName:this.fromLocation.city,
        destination:this.destination.value,
        destinationName:this.destLocation.city,
        departureDate:this.helper.dateFormaterYMd(dateData.flight_start),
        returnDate:this.helper.dateFormaterYMd(dateData.flight_end),
        airline:this.airlineDetails.code,
        airlineName:this.airlineDetails.name
      },
      mekkahData:{
        checkIn:this.helper.dateFormaterYMd(dateData.mk_start),
        checkOut:this.helper.dateFormaterYMd(dateData.mk_end),
        makkahDays:this.form.makkahDays.value,
      },
      medinaData:{
        checkIn:this.helper.dateFormaterYMd(dateData.md_start),
        checkOut:this.helper.dateFormaterYMd(dateData.md_end),
        madeena:this.form.madeenaDyas.value,
      },
      transport:{
        depDate:this.helper.dateFormaterYMd(dateData.start_date),
        returnDate:this.helper.dateFormaterYMd(dateData.end_date),
      }
    };

    sessionStorage.setItem('searchData',JSON.stringify(this.searchData))
    StepperComponent.searchData = this.searchData;
    this.appStore.dataFromFrontPage  = this.searchData;
    this.notifyParent.emit(this.searchData)
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
  } 

}
