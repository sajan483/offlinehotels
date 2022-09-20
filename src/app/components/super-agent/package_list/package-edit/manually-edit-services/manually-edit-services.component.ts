import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperAgentApiService } from 'src/app/Services/super-agent-api-services';
import Swal from 'sweetalert2';
import { listAirport } from 'src/app/models/listAirport';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from "rxjs/operators";
import { airlineList } from 'src/app/models/airlineList';
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-manually-edit-services',
  templateUrl: './manually-edit-services.component.html',
  styleUrls: ['./manually-edit-services.component.scss']
})
export class ManuallyEditServicesComponent implements OnInit,OnDestroy {
  shimmer: boolean = false;
  private destroy$ = new Subject();
  id: any;
  flightDataForm:FormGroup;
  submittedFlight = false;
  flightDetasils: any;
  bttnactive: boolean;
  airportListFilteredSrc:Observable<listAirport[]>;
  airportListFilteredDest:Observable<listAirport[]>;
  airlinesFiltered: Observable<airlineList[]>;
  airportsSrc: listAirport[] = [];
  airportsDest: listAirport[] = [];
  airlineList: airlineList[] = [];
  source = new FormControl();
  destination = new FormControl();
  airline = new FormControl();
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

  constructor(private route:Router,private activeRouter:ActivatedRoute,private apiService:SuperAgentApiService,
    private fb:FormBuilder) { }

  ngOnInit() {
    this.flightDataForm = this.fb.group({
      onwardAirline:['',Validators.required],
      onwardMac:['',Validators.required],
      onwardFlightNo:['',Validators.required],
      onwardDepatureTime:['',Validators.required],
      onwardArrivalTime:['',Validators.required],
      onwardDuration:['',Validators.required],
      returnAirline:['',Validators.required],
      returnMac:['',Validators.required],
      returnFlightNo:['',Validators.required],
      returnDepatureTime:['',Validators.required],
      returnArrivalTime:['',Validators.required],
      returnDuration:['',Validators.required],
      startingAirportItata:['',Validators.required],
      startingAirportName:['',Validators.required],
      returnAirportItata:['',Validators.required],
      returnAirportName:['',Validators.required]
    })
    this.getData();
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
    this.apiService.getAirportListSrc(value).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      for (const d of data as any) {
        this.airportsSrc.push(d);
      }
    });
    return this.airportsSrc;
  }

  private _filterAirportListDest(value: string): listAirport[] {
    const filterValue = value.toLowerCase();
    this.airportsDest = [];
    this.apiService.getAirportListSrc(value).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      for (const d of data as any) {
        this.airportsDest.push(d);
      }
    });
    return this.airportsDest;
  }

  private _filterAirlineList(value: string): airlineList[] {
    const filterValue = value.toLowerCase();
    this.airlineList = [];
    this.apiService.getairlineslist(value).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      for (const d of data as any) {
        this.airlineList.push(d);
      }
    });
    return this.airlineList;
  }

  getData(){
    this.shimmer =true;
    this.id = this.activeRouter.params.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.id = data['id'];
      this.apiService.getPackageDetails(this.id).pipe(takeUntil(this.destroy$)).subscribe((data:any )=>{
        if(data.flight_details.length > 0 && data.flight_details[0].flights.length > 0){
          this.flightDetasils = data.flight_details[0];
          this.pachValueFlight(data.flight_details[0])
        }
      })
    })
  }

  pachValueFlight(data){
    this.flightDataForm.patchValue({
      onwardAirline:data.onward_flight_airline.split('|')[0],
      onwardMac:data.onward_mac,
      onwardFlightNo:data.onward_flight_number,
      onwardDepatureTime:data.flights[0].onward_flight_departure_date,
      onwardArrivalTime:data.flights[0].onward_flight_arrival_date,
      onwardDuration:data.onward_duration,
      returnAirline:data.return_flight_airline.split('|')[0],
      returnMac:data.return_mac,
      returnFlightNo:data.return_flight_number,
      returnDepatureTime:data.flights[0].return_flight_departure_date,
      returnArrivalTime:data.flights[0].return_flight_arrival_date,
      returnDuration:data.return_duration,
      startingAirportItata:data.onward_flight_departure_airport,
      startingAirportName:data.onward_dep_airport_name,
      returnAirportItata:data.return_flight_departure_airport,
      returnAirportName:data.return_dep_airport_name,
    });
    this.fromLocation = {
      iata:data.onward_flight_departure_airport,
      city:data.onward_dep_airport_name.split('|')[1]
    };
    this.destLocation = {
      iata:data.return_flight_departure_airport,
      city:data.return_dep_airport_name.split('|')[1]
    };
    this.airlineDetails = {
      name:data.onward_flight_airline.split('|')[0],
      code:data.onward_mac
    };
    this.source.setValue(this.fromLocation.iata)
    this.destination.setValue(this.destLocation.iata)
    this.airline.setValue(this.airlineDetails.name)
  }

  setFromLocation(data){
    this.fromLocation = {
      iata:data.iata,
      city:data.city
    };
    this.flightDataForm.patchValue({
      startingAirportItata:data.iata,
      startingAirportName:data.name+"|"+data.city,
    })
  }

  setDestLocation(data){
    this.fromLocation = {
      iata:data.iata,
      city:data.city
    };
    this.flightDataForm.patchValue({
      returnAirportItata:data.iata,
      returnAirportName:data.name+"|"+data.city,
    })
  }

  setAirline(data){
    this.airlineDetails = {
      name:data.name,
      code:data.code
    };
    this.flightDataForm.patchValue({
      onwardAirline:data.name,
      onwardMac:data.code,
      returnAirline:data.name,
      returnMac:data.code,
    })
  }

  get f() { return this.flightDataForm.controls; }

  navigateEdit(){
    this.route.navigateByUrl('superagent/package/'+sessionStorage.getItem('masterPackageId')+'/edit');
  }

  navigatePkg(){
    this.route.navigateByUrl('superagent/view_package');
  }

  saveFlight(){
    this.submittedFlight = true;
    if(this.flightDataForm.invalid){
      return
    }
    this.bttnactive = true;
    this.postData(this.flightDataForm.value)
  }


  postData(data){
    let flight_value = {
      'onward_flight_number': data.onwardFlightNo,
      'onward_flight_class': this.flightDetasils.onward_flight_class,
      'onward_flight_airline':data.onwardAirline+'|'+data.onwardAirline+'|'+data.onwardAirline,
      'onward_flight_departure_airport':data.startingAirportItata,
      'onward_flight_arrival_airport': data.returnAirportItata,
      'onward_duration': data.onwardDuration,
      'onward_mac': data.onwardMac,
      'onward_refundable':this.flightDetasils.onward_refundable,
      'onward_connections':this.flightDetasils.onward_connections,
      'onward_dep_airport_name':data.startingAirportName,
      'onward_arr_airport_name':data.returnAirportName,

      'return_dep_airport_name':data.returnAirportName,
      'return_arr_airport_name':data.startingAirportName,
      'return_flight_number': data.returnFlightNo,
      'return_flight_airline': data.returnAirline+'|'+data.returnAirline+'|'+data.returnAirline,
      'return_flight_class': this.flightDetasils.return_flight_class,
      'return_flight_departure_airport': data.returnAirportItata,
      'return_flight_arrival_airport':data.startingAirportItata,
      'return_duration': data.returnDuration,
      'return_mac': data.returnMac,
      'return_refundable': this.flightDetasils.return_refundable,
      'return_connections':this.flightDetasils.return_connections
    }

    var body ={
      "flight_detail": flight_value
    }

    this.id = this.activeRouter.params.pipe(takeUntil(this.destroy$)).subscribe(val=>{
      this.id = val['id'];
      this.apiService.updatePackageAPI(body,this.id).pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
        this.packageAvailability(data,res)
      })
    })
  }

  packageAvailability(data,res){
    let flight_availability = {
      "onward_flight_departure_timestamp": Math.floor(new Date(data.onwardDepatureTime).getTime()/1000),
      "onward_flight_arrival_timestamp": Math.floor(new Date(data.onwardArrivalTime).getTime()/1000),
      "return_flight_departure_timestamp": Math.floor(new Date(data.returnDepatureTime).getTime()/1000),
      "return_flight_arrival_timestamp": Math.floor(new Date(data.returnArrivalTime).getTime()/1000),
	    "package": res.id,
      "package_details":res.flight_details[0].id,
	    "adult_price":this.flightDetasils.flights[0].adult_price,
      "child_price":this.flightDetasils.flights[0].child_price,
    }

    this.apiService.flight_availability_add(flight_availability).pipe(takeUntil(this.destroy$)).subscribe((val:any)=>{
      this.bttnactive = false;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Update succesfully',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete(); 
   }
}
