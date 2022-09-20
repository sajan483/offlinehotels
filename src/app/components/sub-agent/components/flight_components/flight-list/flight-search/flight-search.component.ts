import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, startWith, debounceTime } from 'rxjs/operators';
import { FlightHelper } from '../../helpers/helpers';
import { environment } from 'src/environments/environment';
import { FlightServices } from '../../services/flight-api-services';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements OnInit, OnDestroy, AfterViewInit {

  arrowairpoet: boolean;
  fromairport: boolean;
  toairport: boolean;
  arrowreturn: boolean;
  filteredStates: Observable<any[]>;
  filteredStatesD: Observable<any[]>;
  selectedLanguage: any = 'en-US';
  statesD: any[] = [];
  private destroy$ = new Subject();
  stateCtrlD = new FormControl();
  stateCtrl = new FormControl();
  baseUrl: string;
  prodUrl: string = environment.prodUrl;
  fromLocation: any = {
    name: "Chhatrapati Shivaji International Airport",
    iata: "BOM",
    city: "Mumbai",
  };
  toLocation: any = {
    name: "King Abdulaziz International Airport",
    iata: "JED",
    city: "Jeddah",
  };
  filteredStatesDs: any[] = [{
    name: "King Abdulaziz International Airport",
    iata: "JED",
    city: "Jeddah",
  },
  {
    name: "Mohammad Bin Abdulaziz",
    iata: "MED",
    city: "Madinah",
  }

  ];
  trvlClasses: any = [
    'Economy',
    "Premium Economy",
    'Business',
    "First Class",
  ];
  countadult: number = 1;
  countchild: number = 0;
  countTraveller: number =1;
  flightclass: string = 'Economy';
  retMin: any;
  retMax: any;
  ddate: any;
  returnDate: any;
  enableSearchBtn: boolean = false;
  displaytravelClass: boolean;
  downarrowtravellersClass: boolean;
  displayTabStartCity: boolean = false;
  prefferedCityArrow: boolean;
  prefferedCityToggle: boolean;
  downarrowtravellers: boolean;
  displayTabtravel: boolean;
  primeShimmer: boolean;
  activeBttn:boolean = false;
  covidBoolean:boolean = true;
  covidWarning:boolean = false;
  disbleSearchBtn:boolean = false;
  disableSkipFlightBtn:boolean = false;
  enableSkip: boolean = false;
  datasent:any = {};
  countinfa: number = 0;
  isProcessing: boolean = false;


  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger, static: false }) selectSourceInput: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger, static: false }) selectDestinationInput: MatAutocompleteTrigger;
  @ViewChild("fromInput", { read: ElementRef, static: false }) fromInput: ElementRef;
  @ViewChild("toInput", { read: ElementRef, static: false }) toInput: ElementRef;
  @ViewChild('returnDatePicker', { read: ElementRef, static: false }) returnDatePicker: ElementRef;
  @ViewChild("menuPopupClassTrvl", { read: ElementRef, static: false }) menuPopupClassTrvl: ElementRef;
  @ViewChild("menuIconClassTrvl", { read: ElementRef, static: false }) menuIconClassTrvl: ElementRef;
  @ViewChild("menuIcon", { read: ElementRef, static: false }) menuIcon: ElementRef;
  @ViewChild("menuPopup", { read: ElementRef, static: false }) menuPopup: ElementRef;
  @ViewChild("completeDiv", { read: ElementRef, static: false }) completeDiv: ElementRef;
  @ViewChild("menuIconClassCity", { read: ElementRef, static: false }) menuIconClassCity: ElementRef;
  @ViewChild("menuPopupStartCity", { read: ElementRef, static: false }) menuPopupStartCity: ElementRef;
  @ViewChild("locationPopup", { read: ElementRef, static: false }) locationPopup: ElementRef;
  @ViewChild("locationClass", { read: ElementRef, static: false }) locationClass: ElementRef;
  @ViewChild("menuPopupTo", { read: ElementRef, static: false }) menuPopupTo: ElementRef;
  @ViewChild("menuIconTo", { read: ElementRef, static: false }) menuIconTo: ElementRef;
  @ViewChild("travellerClass", { read: ElementRef, static: false }) travellerClass: ElementRef;
  @ViewChild("travellerPopup", { read: ElementRef, static: false }) travellerPopup: ElementRef;
  td = new Date();
  today = new Date(this.td.getFullYear(), this.td.getMonth(), this.td.getDate(), 0, 0, 0);
  states: any[] = [];
  sharedFlightDivListener;
  constructor(
    public flightServices: FlightServices,
    private flightHelper: FlightHelper,
    private renderer2: Renderer2,
    private router :Router,
    private activatedRoute: ActivatedRoute,
  ) { }
  ngAfterViewInit(): void {
    // const parsedUrl = new URL(window.location.href);
    // this.baseUrl = parsedUrl.origin;
    this.initialCall()
    this.get_queryparams()
  }
  ngOnDestroy(): void {
    if (this.sharedFlightDivListener) {
      this.sharedFlightDivListener();
    }
  }

  ngOnInit() {
    this.primeShimmer = true;
    if (sessionStorage.getItem('fromLocation') != null) {
      this.fromLocation = JSON.parse(sessionStorage.getItem('fromLocation'));
    }
    if (sessionStorage.getItem('userData') != null) {
    }
   if (this.ddate == null) {
    this.ddate = this.incrementDate(this.today, 15);
    this.returnDate = this.incrementDate(this.ddate, 5);
   }

    this.flightServices.isProcessing.subscribe(data => {
      this.isProcessing=data;
      this.activeBttn = data;
    });


  }

  initialCall() {
    this.selectedLanguage = sessionStorage.getItem("userLanguage");
    this.flightServices.getAirportListD(sessionStorage.getItem('userLanguage')).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.filteredStatesD = data;


      });

    this.sharedFlightDivListener = this.renderer2.listen("window", "click", (e: Event) => {
      let data = this.renderer2.parentNode(e.target);
      let isButton = false;
      if (data != null && data != undefined) {
        if (data.classList != undefined && data.classList != null) {
          isButton = data.classList.contains('getId')
        }
      }
      if (
        (this.menuPopup && this.menuPopup.nativeElement.contains(e.target))
        || (this.menuIcon && this.menuIcon.nativeElement.contains(e.target))
        || (this.completeDiv && this.completeDiv.nativeElement.contains(e.target))
      ) {
        // Clicked inside plus preventing click on icon
      } else {
        this.fromairport = false;
        this.arrowairpoet = false;

      }
      if (
        (this.menuIconClassCity && this.menuIconClassCity.nativeElement.contains(e.target))
        || (this.menuPopupStartCity && this.menuPopupStartCity.nativeElement.contains(e.target))

      ) {
        // Clicked inside plus preventing click on icon
      } else {
        this.displayTabStartCity = false;

      }
      if (
        (this.locationPopup && this.locationPopup.nativeElement.contains(e.target)) ||
        (this.locationClass && this.locationClass.nativeElement.contains(e.target))
      ) {
        // Clicked inside plus preventing click on icon
      } else {
        // Clicked outside
        this.prefferedCityArrow = false;
        this.prefferedCityToggle = false;
      }
      if ((this.menuPopupTo && this.menuPopupTo.nativeElement.contains(e.target)) ||
        (this.menuIconTo && this.menuIconTo.nativeElement.contains(e.target))) {
        // Clicked inside plus preventing click on icon

      } else {
        // Clicked outside
        this.toairport = false;
        this.arrowreturn = false;
      }
      if (
        (this.menuPopupClassTrvl &&
          this.menuPopupClassTrvl.nativeElement.contains(e.target)) ||
        (this.menuIconClassTrvl &&
          this.menuIconClassTrvl.nativeElement.contains(e.target))
      ) {
        // Clicked inside plus preventing click on icon
      } else {
        // Clicked outside
        this.displaytravelClass = false;
        this.downarrowtravellersClass = false;
      }

    });

    this.flightServices.getDestinationAirport(this.selectedLanguage).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.primeShimmer = false;
        for (const d of data as any) {
          this.states.push(d);
        }
      },
      (err) => {
      });

    this.filteredStates = this.stateCtrl.valueChanges.pipe(debounceTime(500),
      startWith(""),
      map((state) => (state && state.length > 2 ? this.flightHelper._filterStates(state, this.selectedLanguage) : this.states.slice()))
    );

    this.filteredStatesD = this.stateCtrlD.valueChanges.pipe(
      startWith(""),
      map((state) =>
        state ? this.flightHelper.airportfilterStatesD(state, this.statesD) : this.statesD.slice()
      )
    );
  }

  showfromairport(evt) {
    this.arrowairpoet = !this.arrowairpoet;
    this.fromairport = !this.fromairport;
    setTimeout(() => {
      if (this.selectSourceInput) {
        evt.stopPropagation();
        this.selectSourceInput.openPanel();
        this.fromInput.nativeElement.focus();
      }
    }, 100);
  }

  showtoairport(evt) {

    this.arrowreturn = !this.arrowreturn;
    this.toairport = !this.toairport;
    console.log("this.toairport", this.toairport);
    setTimeout(() => {
      if (this.selectDestinationInput) {
        evt.stopPropagation();
        this.selectDestinationInput.openPanel();
        this.toInput.nativeElement.focus();
      }
    }, 100);
  }

  settoLocation(event) {
    if (this.baseUrl == this.prodUrl) {
      window.analytics.track('home/To location selected', {
        trackToken: localStorage.getItem("userId"),
        fromLocation: this.fromLocation,
        portal: 'B2B'
      })
    }
    this.toLocation = event;
    this.toairport = !this.toairport;
    this.arrowreturn = !this.arrowreturn;
  }

  setFromLocation(event) {
    if (this.baseUrl == this.prodUrl) {
      window.analytics.track('home/From location selected', {
        trackToken: localStorage.getItem("userId"),
        fromLocation: this.fromLocation,
        portal: 'B2B'
      })
    }
    this.fromLocation = event;
    this.fromairport = !this.fromairport;
    this.arrowairpoet = !this.arrowairpoet;
  }
  setMinMaxRetDate() {
    if (this.ddate) {
      this.retMin = this.incrementDate(this.ddate, 5)
      this.retMax = this.incrementDate(this.ddate, 29)
    }
  }
  incrementDate(date, days) {
    let d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
  dataChangedFromReturnDate($event) {
    this.enableSearchBtn = false;
  }

  dataChangedFromDepartureDate($event) {
    this.returnDatePicker.nativeElement.click();
    this.returnDate = null;
    this.returnDate == null ? this.enableSearchBtn = true : this.enableSearchBtn = false;
    this.setMinMaxRetDate()
  }
  travellerClassClick($evnt) {
    this.downarrowtravellersClass = !this.downarrowtravellersClass;
    this.displaytravelClass = !this.displaytravelClass;

    this.displayTabtravel = false;
    this.downarrowtravellers = false;

  }
  TrvlSetClass(event) {
    this.flightclass=event

  }

  decreaseAdultCount(i){
    if (this.countadult>1){
      this.countadult -= 1;
    }
    this.countTraveller=this.countadult+this.countchild


  }
  increaseAdultCount(i){
    if (this.countadult<9){
      this.countadult += 1;
    }
    this.countTraveller=this.countadult+this.countchild
  }
  decreaseChildCount(i){
    if (this.countchild>0){
      this.countchild -= 1;
    }
    this.countTraveller=this.countadult+this.countchild

  }
  increaseChildCount(i){
    if (this.countchild<9){
      this.countchild += 1;
    }
    this.countTraveller=this.countadult+this.countchild
  }

  searchbttn(){
    if(!this.covidBoolean){
      this.covidWarning = true;
      return;
    }

    sessionStorage.setItem("depDate",this.ddate);
    sessionStorage.setItem("returnDate",this.returnDate)
    sessionStorage.setItem("fromLocation",JSON.stringify(this.fromLocation))
    if(this.flightHelper.hasValidDates(this.ddate,this.returnDate)){
      this.disbleSearchBtn = true;
      this.disableSkipFlightBtn = true;
      this.countTraveller=this.countadult+this.countchild;

      this.datasent = {
        travallersCount : this.countTraveller,
        flightclass : this.flightHelper.get_cabin_class_code(this.flightclass),
        depatureAirport : this.fromLocation.iata,
        fromName:this.fromLocation.name,
        fromCity:this.fromLocation.city,
        returnAirport : this.toLocation.iata,
        toName:this.toLocation.name,
        toCity:this.toLocation.city,
        onwardDate : this.flightHelper.dateFormater(this.ddate),
        returnDate : this.flightHelper.dateFormater(this.returnDate),
        adultCount : this.countadult,
        childCount : this.countchild,
        infantCount : this.countinfa,
        skipEnabled : this.enableSkip ? true : false,
        formatedDepatureDateYMD : this.flightHelper.commonDateFormater(this.ddate,"yyyy-MM-dd"),
        formatedReturnDateYMD : this.flightHelper.commonDateFormater(this.returnDate,"yyyy-MM-dd")
      }

      this.router.navigate(
        ['/subagent/flight'],{
          queryParams: {
          "flightclass": this.datasent.flightclass,
          "travallersCount": this.datasent.travallersCount,
          "from":this.datasent.depatureAirport,
          "to":this.datasent.returnAirport,
          "onwardDate":this.datasent.onwardDate,
          "returnDate":this.datasent.returnDate,
          "fromName":this.datasent.fromName,
          "fromCity":this.datasent.fromCity,
          "toName":this.datasent.toName,
          "toCity":this.datasent.toCity,
          "pax":this.datasent.travallersCount+'_'+this.datasent.adultCount+'_'+this.datasent.childCount+'_'+this.datasent.infantCount,

         }
         });

      sessionStorage.setItem('userData',JSON.stringify(this.datasent))
      }

    }
    get_queryparams(){
      this.activatedRoute.queryParams
      .subscribe(params => {

        if (Object.keys(params).length>0) {
          this.ddate = new Date(params.onwardDate);
          this.returnDate = new Date(params.returnDate);
          this.fromLocation={"iata":params.from,"name":params.fromName,"city":params.fromCity};
          this.toLocation={"iata":params.to,"name":params.toName,"city":params.toCity};
          let pax=params.pax.split("_");
          this.countTraveller=Number(pax[0]);
          this.countadult= Number(pax[1]);
          this.countchild=Number(pax[2]);
          this.countinfa=Number(pax[3]);
          this.flightclass=this.flightHelper.get_cabin_class_name(params.flightclass);

        }



      } );
    }


}
