import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/common/services/notification.service';
import { FlightHelper } from '../helpers/helpers';
import { FlightServices } from '../services/flight-api-services';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FlightListFilter, FlightListFilterData, FlightObject } from '../models/flight';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { id } from '@swimlane/ngx-charts';
import { FlightFilterHelper } from '../helpers/flight_filter';
import { UserStateService } from '../../../services/User-service';
import { FlightAdapter } from '../adapters/flight-adapter';


@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss']
})
export class FlightListComponent implements OnInit,OnChanges {

  tripId: any;
  userObject: any;
  selectedLanguage: any = 'en-US';
  statesD: any[] = [];
  onwardReturn = <any>[];
  response;
  dummyresponse;
  selectedOnwardFlight;
  selectedReturnFlight;
  isLoading: boolean = false;
  isRoundTripSearchEnabled: boolean = true;
  IsHidden = true;
  ddate: any;
  rdate: any;
  flightSearchFooter = false;
  searchBtnEnable = false;
  isMultiCitySearchEnabled = false;
  search_id: any;
  multiCity1Date: any;
  fareType: string = "round_trip";
  selectedCurrency: string;
  fromname: string;
  fromcity: string;
  toname: string;
  tocity: string;
  fromLocation :any ={};
  toLocation :any ={};
  multiCity2Date: any;
  countadult: number = 1;
  countchild: number = 0;
  countinfa: number = 0;
  flightclass: any;
  private destroy$ = new Subject();
  cnt: number = 0;
  isProcessing: boolean = false;

  filterData:FlightListFilter;
  filteringData:FlightListFilterData;
  minAmount:number = 0;
  maxAmount:number = 0;
  valuePrice:number = 0;
  airlines:any[] = [];
  aircraft:any[] = [];
  isairlinefiltered:boolean = false;
  flightAdapter: FlightAdapter;


  constructor(
    private activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private translate: TranslateService,
    private flightService: FlightServices,
    private flightHelper: FlightHelper,
    private spinner: NgxSpinnerService,
    private router: Router,
    private flightFilterhelper: FlightFilterHelper,
    private userState:UserStateService,


    ) {
      this.flightAdapter = new FlightAdapter();
    }

  ngOnInit() {
    this.activatedRoute.queryParams
    .subscribe(params => {
      if (Object.keys(params).length>0){
        this.ddate = params.onwardDate;
        this.rdate = params.returnDate;

        this.fromLocation={"iata":params.from}
        this.toLocation={"iata":params.to}
        let pax=params.pax.split("_");

        this.countadult= pax[1];
        this.countchild=pax[2];
        this.countinfa=pax[3];
        this.flightclass=params.flightclass;
      }

      this.isLoading = true;

      if (this.hasValidDates()) {
        this.flightSearch();
      }

    } );

    this.flightService.isProcessing.subscribe(data => {this.isProcessing = data});
    this.initialFilter();
  }
 ngOnChanges() {
  this.userObject = JSON.parse(sessionStorage.getItem('userData'))
 }

  initialFilter() {
    this.filterData = {
      price:0,
      stops:0,
      airlines:[],
    }
  }

  resetFilter(){
    this.onwardReturn=this.dummyresponse;
    // this.initialFilter();
  }

  groupFlights() {
    let onwardFlights = <any>[];
    this.response.flights[0].forEach(onwardFlight => {
      let or = [];
      or.push(onwardFlight);
      this.response.flights[0].forEach(onwardFlight1 => {
        if (onwardFlight.id != onwardFlight1.id) {
          if (onwardFlight.ReturnIdentifier == onwardFlight1.ReturnIdentifier && onwardFlight.VAC == onwardFlight1.VAC && onwardFlight.provider == onwardFlight1.provider) {
            or.push(onwardFlight1);
          }
        }
      });

      onwardFlights.push(or);
    });

    let returnFlights = <any>[];
    this.response.flights[1].forEach(returnFlight => {
      let or = [];

      or.push(returnFlight);
      this.response.flights[1].forEach(returnFlight1 => {
        if (returnFlight.id != returnFlight1.id) {
          if (returnFlight.ReturnIdentifier == returnFlight1.ReturnIdentifier && returnFlight.VAC == returnFlight1.VAC && returnFlight.provider == returnFlight1.provider) {
            or.push(returnFlight1);
          }
        }
      });

      returnFlights.push(or);
    });

    let combinedFlights = <any>[];
    onwardFlights.forEach((e) => {
      let combinedFlight = {
        onwardFlights: e,
        returnFlights: []
      };
      returnFlights.forEach(e1 => {
        if (e[0].VAC == e1[0].VAC && e[0].provider == e1[0].provider) {
          combinedFlight.returnFlights.push(...e1);
        }
      });
      combinedFlights.push(combinedFlight);
    })

    let mergedFlights = <any>[];
    combinedFlights.forEach(e => {

      e.onwardFlights.forEach(e1 => {
        let mergedFlight = {
          onwardFlight: e1,
          returnFlights: []
        };
        e.returnFlights.forEach(e2 => {
          if (e1.ReturnIdentifier == e2.ReturnIdentifier && e1.VAC == e2.VAC && e1.provider == e2.provider) {
            mergedFlight.returnFlights.push(e2);
          }
        });
        mergedFlights.push(mergedFlight);
      });

    });

    let groupedFlights = [];
    let selectedReturnArray = [];
    mergedFlights.forEach(e => {
      let groupedFlight = {
        onwardFlight: e.onwardFlight,
        returnFlights: []
      };
      selectedReturnArray = [];
      if (e.returnFlights.length > 0) {
        let basePrice = e.onwardFlight.NetFare + e.returnFlights[0].NetFare;
        e.returnFlights.forEach(e1 => {
          if (!selectedReturnArray.includes(e1.id)) {
            if (basePrice == e.onwardFlight.NetFare + e1.NetFare) {
              groupedFlight.returnFlights.push(e1);
              selectedReturnArray.push(e1.id);
            }
          }
        });
        groupedFlights.push(groupedFlight);
      }
    });

    let samePriceFlights = [];
    let selectedPriceArray = [];
    groupedFlights.forEach((e) => {
      let data = [];
      let basePrice = e.onwardFlight.NetFare + e.returnFlights[0].NetFare;
      if (!selectedPriceArray.includes(basePrice)) {
        groupedFlights.forEach((e1) => {
          if (basePrice == e1.onwardFlight.NetFare + e1.returnFlights[0].NetFare) {
            data.push(e1);
            selectedPriceArray.push(basePrice);
          }
        })
        samePriceFlights.push(data);
      }
    })

    this.onwardReturn = [];
    let idArray = [];
    samePriceFlights.forEach((e) => {
      let selectedArrray = [];
      idArray = [];
      e.forEach((e1) => {

        if (!idArray.includes(e1.onwardFlight.id)) {

          selectedArrray.push(e1);
          idArray.push(e1.onwardFlight.id);
        }
      });
      this.onwardReturn.push(selectedArrray);
    })
    return this.onwardReturn;
  }
  hasValidDates() {
    if (typeof (this.ddate) == 'undefined') {
      this.notifyService.showWarning(this.translate.instant('Departure date required'))
      return false;
    }
    if (typeof (this.rdate) == 'undefined') {
      this.notifyService.showWarning(this.translate.instant('Return date required'))
      return false;
    }

    return true;
  }

  flightSearch() {
    this.flightService.isProcessing.next(true);
    this.flightSearchFooter = false;
    this.searchBtnEnable = false;
    this.cnt = 0;
    this.flightService.searchFlights(this.isMultiCitySearchEnabled
      ? this.setDataForMultiCitySearch()
      : this.setDataForRoundTripSearch(), localStorage.getItem("user"), 'SAR'
    )
      .subscribe(
        (data) => {
          this.search_id = data.search_id;
          sessionStorage.setItem('searchId', this.search_id)
          if (this.search_id && this.search_id != 'undefined') {
            this.getFlightList();
          }
        }, error => {
          if (error.error.detail=='Invalid authentication. Could not decode token.'){
            this.isLoading = false;
            this.backToLoginPage();
          }
          else{
            this.spinner.hide();
            this.backToHomePage()
          }
        });

  }


  setDataForMultiCitySearch() {
    let multiCitySearchParams = {
      fare_type: "multi_city",
      // trips: [
      //   {
      //     onward_date: this.flightHelper.incrementDate(this.multiCity1Date, 1)
      //       .toJSON()
      //       .split("T")[0],
      //     from: this.fromLocation.iata,
      //     to: this.toLocation.iata,
      //   },
      //   {
      //     onward_date: this.flightHelper.incrementDate(this.multiCity2Date, 1)
      //       .toJSON()
      //       .split("T")[0],
      //     from: this.fromLocation2.iata,
      //     to: this.multiCity2To,
      //   },
      // ],
      // adults: this.countadult,
      // infants: 0,
      // children: this.countchild,
    };
    return multiCitySearchParams;
  }

  setDataForRoundTripSearch() {

    let roundTripFlightSearchParams = {
      fare_type: this.fareType,
      search_id: this.search_id,
      trips: [
        {
          onward_date: this.flightHelper.dateFormater2(this.ddate),
          return_date: this.flightHelper.dateFormater2(this.rdate),
          from: this.fromLocation.iata,
          to: this.toLocation.iata,
        },
      ],
      adults: this.countadult,
      infants: this.countinfa,
      children: this.countchild,
      cabin: this.flightclass
    };
    return roundTripFlightSearchParams;
  }
  getFlightList() {
    this.flightService.getFlights(this.search_id, localStorage.getItem("user"), this.selectedCurrency).pipe(takeUntil(this.destroy$)).subscribe((data) => {

      if ((data.message && data.message == "Request is processing" || data.message == "Request will be processed soon") && (this.cnt < 10)) {
        this.setTimerForFlightList();
        this.cnt += 1;

      }else{
        if ((data.message && data.message == "Request is processing" || data.message == "Request will be processed soon")) {
          this.spinner.hide();
          Swal.fire({
            text: this.translate.instant('Sorry, We Could Not Find Any Flight For This Route'),
            icon: "warning",
            confirmButtonText: this.translate.instant('Modify Search And Try Again'),
          });
        }
        else {
          this.response = data;
          this.spinner.hide();
          this.IsHidden = false;
          if (this.isMultiCitySearchEnabled) {
            let multiCityResponse: FlightObject;
            multiCityResponse = data;
            this.setDataForMultiCityUi(multiCityResponse);
            this.isMultiCitySearchEnabled = false;
          }
          if (this.isRoundTripSearchEnabled) {

            if (this.response) {
              if (this.response.flights[0].length == 0) {
                Swal.fire({
                  text: this.translate.instant('Sorry, We Could Not Find Any Onward Flight For This Route'),
                  icon: "warning",
                  confirmButtonText: this.translate.instant('Modify Search And Try Again'),
                });
              }

              if (this.response.flights[1].length == 0) {
                Swal.fire({
                  text: this.translate.instant('Sorry, We Could Not Find Any Flights For This Route'),
                  icon: "warning",
                  confirmButtonText: this.translate.instant('Modify Search And Try Again'),
                });
                this.response.flights[0] = [];
              }

              this.onwardReturn = this.groupFlights();
              this.dummyresponse = this.onwardReturn ;
              this.setFilterDatas(this.onwardReturn);

              if (this.onwardReturn && this.onwardReturn.length > 0) {
                this.isLoading = false;
                // this.filterTriptypeFlightList()

              } else {
                // this.isLoading = false;
                Swal.fire({
                  text: this.translate.instant('Sorry, We Could Not Find Flights For This Dates'),
                  icon: "warning",
                  confirmButtonText: this.translate.instant('Modify Search And Try Again'),
                });
              }

            }
            localStorage.setItem("triptoken", data.tui);

          }
          this.flightService.isProcessing.next(false);
        }
      }

    },
    (error) => {
      this.spinner.hide();
      this.backToHomePage()
      this.flightService.isProcessing.next(false);
    });

  }

  backToHomePage() {
    this.isLoading = false;
    Swal.fire({
      text: this.translate.instant('Sorry , no Flights available for this dates'),
      icon: "warning",
      confirmButtonText: this.translate.instant('Back To Home Page'),
    }).then((route) => {
      if (route.value) {
        this.router.navigate(['/subagent/flight']);
      }
    });
  }
  backToLoginPage() {
    this.isLoading = false;
    Swal.fire({
      text: this.translate.instant('Please Login to Continue'),
      icon: "warning",
      confirmButtonText: this.translate.instant('Back To Login Page'),
    }).then((route) => {
        this.router.navigate(['login']);

    });
  }

  setTimerForFlightList() {
    timer(10000).subscribe(x => this.getFlightList());
  }

  setDataForMultiCityUi(data: FlightObject) {
    if (data && data.flights.length > 0) {
    }
  }

  setFilterDatas(data:any){
    data.forEach((el,i) => {

      let min_price=el[0].onwardFlight.o_net_fare+el[0].returnFlights[0].o_net_fare;
      if (min_price < this.minAmount || this.minAmount == 0) {
        this.minAmount = min_price;
      }

      let max_price=el[0].onwardFlight.o_net_fare+el[0].returnFlights[0].o_net_fare;
      if (max_price > this.maxAmount) {
        this.maxAmount = max_price;
      }

      this.airlines.push({name:el[0].onwardFlight.AirlineName,touched:false});
      this.aircraft.push({name:el[0].onwardFlight.AirCraft,touched:false});

      this.filteringData={minPrice : this.minAmount,
        maxPrice : this.maxAmount,
        airlines : this.airlines,
        aircraft : this.aircraft,
        isairlinefiltered:this.isairlinefiltered,
      }

    }
    );
    this.airlines = this.airlines.filter((item, i, ar) => ar.findIndex(t => t.name.split('|')[0] === item.name.split('|')[0]) === i);
    this.aircraft = this.aircraft.filter((item, i, ar) => ar.findIndex(t => t.name === item.name) === i);
  }

  filterList(evt:FlightListFilter){

    this.onwardReturn = this.flightFilterhelper.flightListFiltered(evt,this.dummyresponse);

    if (evt.airlines.length > 0) {
      evt.airlines.forEach(eachairline => {
        if (eachairline.touched) {
        this.isairlinefiltered = true;
        this.filteringData.isairlinefiltered = this.isairlinefiltered;
        }
      })

    }
    else{
      this.isairlinefiltered = false;
      this.filteringData.isairlinefiltered = this.isairlinefiltered;
    }



  }

  onSelectFlight(evt) {

    let famount=evt.total;
    this.selectedOnwardFlight = evt.onwardFlight;
    this.selectedReturnFlight = evt.returnFlight;
    sessionStorage.setItem('flightAmount', JSON.stringify(famount))
    if (typeof (this.selectedReturnFlight) != 'undefined' && typeof (this.selectedReturnFlight.ArrivalTime) != 'undefined') {
      sessionStorage.setItem('onwardData', JSON.stringify(this.selectedOnwardFlight))
      sessionStorage.setItem('returnData', JSON.stringify(this.selectedReturnFlight))
      let hedderData = {
        startDate: this.selectedOnwardFlight.DepartureTime,
        endDate: this.selectedReturnFlight.DepartureTime,
        mac: this.selectedOnwardFlight.MAC
      }
      sessionStorage.setItem('HedderData', JSON.stringify(hedderData))
      this.userState.isFlightHdrActive.next(true)
      let x;
      this.userState.isFlightHdrActive.subscribe(t=>x = t)
      sessionStorage.setItem('isFlightHdrActive',JSON.stringify(x))
      this.createTrip()
      this.userState.selector.next('Makka')
      sessionStorage.setItem('selector','Makka')

    } else {
      this.notifyService.showWarning("Please Select Return Flight")
    }
  }

  createTrip() {
    this.userObject = JSON.parse(sessionStorage.getItem('userData'))
    if (this.flightAdapter.setDataForTrip(this.selectedOnwardFlight, this.selectedReturnFlight, this.ddate, this.rdate, this.userObject, this.search_id)) {

      this.flightService.createTripFlightB2B(this.flightAdapter.setDataForTrip(this.selectedOnwardFlight, this.selectedReturnFlight, this.ddate, this.rdate, this.userObject, this.search_id), localStorage.getItem("user"), "SAR").subscribe((data) => {
        this.tripId = data.id;
        sessionStorage.setItem('custome_trip_id', data.id)
        this.router.navigate(['/subagent/flight/details']);

      });
    }
  }
}
