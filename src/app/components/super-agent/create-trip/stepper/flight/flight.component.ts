import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from "rxjs/operators";
import { Observable, Subject } from 'rxjs';
import { listAirport } from 'src/app/models/listAirport';
import { airlineList } from 'src/app/models/airlineList';
import { StepperComponent } from '../stepper.component';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import { AppStore } from 'src/app/stores/app.store';
import { HelperService } from 'src/app/common/services/helper-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit,OnDestroy {
  private destroy$ = new Subject();
  freeArray = ["1","2","3","4","","","","","","","",""];
  loader:boolean=true;
  available:boolean=true;
  modifyButton:boolean=true;
  today = new Date();
  searchForm: FormGroup;
  fareForm: FormGroup;
  returnMin:Date;
  airportListFilteredSrc:Observable<listAirport[]>;
  airportListFilteredDest:Observable<listAirport[]>;
  airlinesFiltered: Observable<airlineList[]>;
  airportsSrc: listAirport[] = [];
  airportsDest: listAirport[] = [];
  airlineList: airlineList[] = [];
  source = new FormControl();
  destination = new FormControl();
  airline = new FormControl();
  flightListingFlag:boolean=false;
  srcError:boolean = false;
  destError:boolean = false;
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
  searchData;
  flightSearchData;
  searchResult={
    destLocation:{
      iata:'',
      city:''
    },
    fromLocation:{
      iata:'',
      city:''
    },
    departureFlights:'',
    returnFlights:''
  };
  footerFlag:string='false';
  footerData;
  fareSelection:boolean=false;
  searchError:boolean=false;
  listBody
  currency: string;
  unSubscribe:any;
  bttnactive: boolean;
  startDate: any;
  returnDate: any;

  constructor(
    private fb: FormBuilder,private helper:HelperService,
    private commonService: SuperAgentApiService, private stepper: StepperComponent, private appStore: AppStore, private helperService : HelperService, private router : Router) { }

  ngOnInit() {
    this.currency = sessionStorage.getItem('currency');
    this.searchData = JSON.parse(sessionStorage.getItem('searchData'));
    this.startDate = this.searchData.flightData.departureDate;
    this.returnDate = this.searchData.flightData.returnDate;
    this.flightSearchData = this.searchData.flightData
    this.fromLocation = {
      iata:this.flightSearchData.source,
      city:this.flightSearchData.sourceName
    };
    this.destLocation = {
      iata:this.flightSearchData.destination,
      city:this.flightSearchData.destinationName
    };
    this.airlineDetails = {
      name:this.flightSearchData.airlineName,
      code:this.flightSearchData.airline
    };
    this.searchForm = this.fb.group({
			departDate: ['', Validators.required],
			returnDate: ['', Validators.required],
    });
    this.fareForm = this.fb.group({
			adult: ['', Validators.required],
			child: ['',Validators.required],
			infant: [0]
    });
    this.searchResult.destLocation=this.destLocation
    this.searchResult.fromLocation=this.fromLocation
    this.listBody = {
      boarding_airport:this.flightSearchData.source,
      destination_airport:this.flightSearchData.destination,
      airlines:this.flightSearchData.airline,
      onward_date: this.flightSearchData.departureDate,
      return_date: this.flightSearchData.returnDate,
    };
    this.listFlights(this.listBody)
  }
  
  get form() { return this.searchForm.controls; }
  get fare() { return this.fareForm.controls}

  get submit() {
    if(this.source.value != null && this.source.value != '' && this.destination.value != null && this.destination.value != '' && this.airline.value != null && this.airline.value != '' && this.searchForm.valid && !this.destError && !this.srcError){
      return true
    }
    else{
      return false
    }
  }

  get continue(){
    if(this.fareForm.valid){
      return false
    }
    else{
      return true
    }
  }

  getfooterFlag(event){
    this.footerFlag = event
  }

  getfooterData(event){
    this.footerData=event
  }

  modifySearch(){
    this.source.setValue(this.flightSearchData.source)
    this.destination.setValue(this.flightSearchData.destination)
    this.airline.setValue(this.flightSearchData.airlineName)
    this.searchForm.controls.departDate.setValue(this.flightSearchData.departureDate);
    this.searchForm.controls.returnDate.setValue(this.flightSearchData.returnDate);
    this.getAirportListSrc()
    this.getAirportListDest()
    this.getAirlineList()
    this.modifyButton=false;
  }

  setReturnMinDate(){
   this.returnMin = this.form.departDate.value
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

  setFromLocation(data){
    this.srcError = false
    this.destError = false
    if(this.destLocation.city == data.city){
      this.srcError = true
    }
    else{
      this.fromLocation.city = data.city
      this.fromLocation.iata = data.iata
      this.searchResult.fromLocation.city = data.city
    }
  }

  setDestLocation(data){
    this.destError = false
    this.srcError=false
    if(this.fromLocation.city == data.city){
      this.destError = true
    }
    else{
      this.destLocation.city = data.city
      this.destLocation.iata = data.iata
      this.searchResult.destLocation.city = data.city
    }
  }

  setAirline(data){
    this.airlineDetails.code = data.code
    this.airlineDetails.name = data.name
    this.airline.setValue(this.airlineDetails.name)
  }

  searchFlights(){
    let ddate = this.searchData.flightData.departureDate;
    let rdate = this.searchData.flightData.returnDate;
    var searchBody = {
      boarding_airport:this.source.value,
      destination_airport:this.destination.value,
      airlines:this.airlineDetails.code,
      onward_date: ddate,
      return_date: rdate,
    };
    if(JSON.stringify(this.listBody)===JSON.stringify(searchBody)){
      this.searchError=true
    }
    else {
      this.searchError=false;
      this.listBody=searchBody
      this.footerFlag='false'
      if(this.submit){
        this.loader=true
        this.flightListingFlag=false
        this.listFlights(searchBody);
      }
    }
  }

  searchAgainError(){
    this.startDate = this.helper.dateFormaterYMd(this.helper.incrementDate(this.startDate,1));
    this.returnDate = this.helper.dateFormaterYMd(this.helper.incrementDate(this.returnDate,1));
    var searchBody = {
      boarding_airport:this.searchData.flightData.source,
      destination_airport:this.searchData.flightData.destination,
      airlines:this.searchData.flightData.airline,
      onward_date: this.startDate,
      return_date: this.returnDate,
    };
    this.listBody=searchBody
    this.footerFlag='false';
    this.loader=true
    this.flightListingFlag=false
    this.listFlights(searchBody);
  }

  searchAgain(){
    this.listFlights(this.listBody);
  }

  swalfire(){
    Swal.fire({
      icon: 'error',
      text: 'No Flights Available in this Date',
      showCancelButton: true,
      confirmButtonText: 'Search Next Date',
      cancelButtonText:'Skip Flight'
    }).then((result) => {
      if(result.isConfirmed){
        this.searchAgainError();
      }else{
        this.destroy$.next();
        this.destroy$.complete();
        this.skipflight()
      }
    })
  }

  listFlights(body){
    this.unSubscribe = this.commonService.searchFlights(body).pipe(takeUntil(this.destroy$)).subscribe((data:any) => {
      if(data.flights[0].length > 0 && data.flights[1].length > 0){
        this.searchResult.departureFlights = data.flights[0].sort((a, b) => (a.GrossFare) - (b.GrossFare));
        this.searchResult.returnFlights = data.flights[1].sort((a, b) => (a.GrossFare) - (b.GrossFare));
        this.loader=false;
        this.flightListingFlag = true;
        this.available=true;
        this.appStore.tui = data.tui;
      }
      else{
        this.swalfire();
      }
    }, error => {
      this.swalfire();
    })
  }

  navigateFareSelection(){
    console.log(this.footerData);
    var tot = this.footerData.depFlight.NetFare + this.footerData.retFlight.NetFare;
    tot = this.helper.priceConversion(tot);
    this.fareForm.controls.adult.setValue(tot);
    this.fareForm.controls.child.setValue(tot)
    this.fareSelection = true
  }

  navigateHotel(component, id){
    this.bttnactive = true;
    this.saveFlight()
  }

  skipflight(){
    this.unSubscribe.unsubscribe();
    if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){
      sessionStorage.setItem('selector','preview');
      this.stepper.stepContent('preview','');
      sessionStorage.removeItem('modify');
    }else{
      this.stepper.stepContent('hotel','MAKKA')
      sessionStorage.setItem('selector','hotelMakkah')
    }
  }

  saveFlight(){
    this.searchData.transport.depDate = this.helper.dateFormaterYMd(this.footerData.depFlight.ArrivalTime);
    sessionStorage.setItem('searchData',JSON.stringify(this.searchData))
    var Omac = this.footerData.depFlight.MAC;
    var Rmac = this.footerData.retFlight.MAC;
    let flight_value = {
      'onward_flight_number': this.footerData.depFlight.FlightNo,
      'onward_flight_class': this.footerData.depFlight.Cabin,
      'onward_flight_airline':this.footerData.depFlight.AirlineName,
      'onward_flight_departure_airport':this.footerData.depFlight.From,
      'onward_flight_arrival_airport': this.footerData.depFlight.To,
      'onward_duration': this.footerData.depFlight.Duration,
      'onward_mac': Omac,
      'onward_refundable':this.footerData.depFlight.Refundable,
      'onward_connections':this.footerData.depFlight.Connections,
      'onward_dep_airport_name':this.footerData.depFlight.FromName,
      'onward_arr_airport_name':this.footerData.depFlight.ToName,

      'return_dep_airport_name':this.footerData.retFlight.FromName,
      'return_arr_airport_name':this.footerData.retFlight.ToName,
      'return_flight_number': this.footerData.retFlight.FlightNo,
      'return_flight_airline': this.footerData.retFlight.AirlineName,
      'return_flight_class': this.footerData.retFlight.Cabin,
      'return_flight_departure_airport': this.footerData.retFlight.From,
      'return_flight_arrival_airport':this.footerData.retFlight.To,
      'return_duration': this.footerData.retFlight.Duration,
      'return_mac': Rmac,
      'return_refundable': this.footerData.retFlight.Refundable,
      'return_connections':this.footerData.retFlight.Connections
    }
    var lang = this.appStore.langCode
    let data = {
      "flight_detail": flight_value
    }
    this.commonService.updatePackageAPI(data,sessionStorage.getItem('packageId')).pipe(takeUntil(this.destroy$)).subscribe((value) => { 
      this.packageFlightAvailability(value);
    })
    
  }

  packageFlightAvailability(data){
    let flight_availability = {
      "onward_flight_departure_timestamp": Math.floor(new Date(this.footerData.depFlight.DepartureTime).getTime()/1000),
      "onward_flight_arrival_timestamp": Math.floor(new Date(this.footerData.depFlight.ArrivalTime).getTime()/1000),
      "return_flight_departure_timestamp": Math.floor(new Date(this.footerData.retFlight.DepartureTime).getTime()/1000),
      "return_flight_arrival_timestamp": Math.floor(new Date(this.footerData.retFlight.ArrivalTime).getTime()/1000),
	    "package": data.id,
      "package_details":data.flight_details[0].id,
	    "adult_price":this.fareForm.controls.adult.value,
      "child_price":this.fareForm.controls.child.value,
    }
    this.commonService.flight_availability_add(flight_availability).pipe(takeUntil(this.destroy$)).subscribe(value =>{
      this.bttnactive = false;
      if(sessionStorage.getItem('modify') && sessionStorage.getItem('modify') == 'true'){
        sessionStorage.setItem('selector','preview');
        this.stepper.stepContent('preview','');
        sessionStorage.removeItem('modify');
      }else{
        this.stepper.stepContent('hotel','MAKKA')
        sessionStorage.setItem('selector','hotelMakkah');
      }
    })
  }

  back(){
    this.fareSelection = false;
  }

  ngOnDestroy(){
   this.destroy$.next();
   this.destroy$.complete(); 
  }
}