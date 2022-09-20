import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { timer } from 'rxjs';
import Swal from 'sweetalert2';
import { SubAgentCurrencyLangHelper } from '../../../helpers/currency-lang-helper';
import { TrainSearchService } from '../../../services/data_service/trainsearch.service';
import { TrainService } from '../../../services/train.service';
import { UserStateService } from '../../../services/User-service';

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {
  fromStation = '';
  toStation = ''
  fromDate = '';
  returnDate = '';
  isOnward = false;
  isReturn = false;
  adultCount = 11;
  infantCount = 0;
  childCount = 0;
  isSearchCompleted = false;
  searchCount = 0;
  trainListTimer: any;
  trainList: any;
  showFare = false;
  showModifyModal = false;
  selectedLanguage: any = 'en-US';
  currency='SAR';
  searchData:any;
  searchId:any;
  private currencyLangHelper : SubAgentCurrencyLangHelper = new SubAgentCurrencyLangHelper(this.userStateService,this.translate);
  
  constructor(private trainSearch:TrainSearchService,private trainService: TrainService,private activeRoute:ActivatedRoute,
    private translate: TranslateService,private router:Router,private userStateService:UserStateService) { }

  ngOnInit() {
    this.getLanguage();
  }

  getLanguage(){
    this.activeRoute.params.subscribe(params =>{
      this.currencyLangHelper.changeLanguage(params.lang);
      this.currencyLangHelper.setCurrency(params.currency);
    })
    this.initialValues();
  }

  initialValues(){
    this.userStateService.globelCurrency.subscribe(t => this.currency = t);
    this.userStateService.globalLanguage.subscribe(t => this.selectedLanguage = t);
  }

  search(event){
    this.getTrains(event);
  }

  getTrains(data){
    this.isSearchCompleted = false;
    if(data.trip_type == 'ROUND_TRIP'){
      this.isReturn = true;
    }else{
      this.isReturn = false;
    }
    let body = { 
      "onward_date": data.onward_date,
      "return_date": data.return_date,
      "trip_type": data.trip_type,
      "departure_code": data.departure_code,
      "arrival_code": data.arrival_code,
      "adults": data.adults,
      "infants": data.infants,
      "children": data.children,
      "seat_class": data.seat_class,
      "departure_station": data.departure_station,
      "arrival_station": data.arrival_station,
    }

    this.searchData = body;

    this.router.navigate(
      ['subagent/train/'+this.selectedLanguage+'/'+this.currency],
      { queryParams: { 
        "onward_date": data.onward_date,
        "return_date": data.return_date,
        "trip_type": data.trip_type,
        "departure_code": data.departure_code,
        "arrival_code": data.arrival_code,
        "adults": data.adults,
        "infants": data.infants,
        "children": data.children,
        "seat_class": data.seat_class,
        "departure_station": data.departure_station,
        "arrival_station": data.arrival_station,
        "ulogId":data.ulogId
      }}
    );
    this.trainService.search(body).subscribe((res: any) => {
      this.searchId = res.search_id;
      if(res && res.result && res.result != {} && res.result.config && res.result.onward.length > 0){
        this.showFare = res.result.config.is_price_show;
        this.isSearchCompleted = true;
        this.trainList = res.result;
        this.trainList.onward.forEach(element => {
          element.disable = false;
        });
        this.trainList.return.forEach(element => {
          element.disable = false;
        });
      }else{
        this.searchTrains(res.search_id);
      }
      
    }, (error) => {
      Swal.fire({
        text: this.translate.instant('Sorry,we couldn\'t get any result'),
        icon: "warning",
        confirmButtonText: this.translate.instant('Back To Home Page'),
      }).then((willDelete) => {
        if (willDelete.value) {
          this.router.navigate(['subagent/dashboard/'+this.selectedLanguage+'/'+this.currency])
        }
      });

    })
  }


  searchTrains(id) {
    this.trainService.searchTrains(id).subscribe((response) => {

      this.searchCount++;
      if (response.status == 202) {
        if (this.searchCount <= 10) {
          this.trainListTimer = timer(2000).subscribe(x => this.searchTrains(id));
        }else{
          Swal.fire({
            text: this.translate.instant('Sorry,we couldn\'t get any result'),
            icon: "warning",
            confirmButtonText: this.translate.instant('Back To Home Page'),
          }).then((willDelete) => {
            if (willDelete.value) {
              this.router.navigate(['subagent/dashboard/'+this.selectedLanguage+'/'+this.currency])
            }
          });
        }
      } else if (response.status == 200) {
        this.showFare = response.body['result'].config.is_price_show;
        this.isSearchCompleted = true;
        this.trainList = response.body['result'];
        this.trainList.onward.forEach(element => {
          element.disable = false;
        });
        this.trainList.return.forEach(element => {
          element.disable = false;
        });
      }
    })
  }

  
}
