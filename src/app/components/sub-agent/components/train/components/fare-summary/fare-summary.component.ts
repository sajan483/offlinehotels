import { Component, Input, OnInit } from '@angular/core';
import { TrainSearchService } from 'src/app/components/sub-agent/services/data_service/trainsearch.service';
// import { UserStateService } from 'src/app/Services/user-service';

@Component({
  selector: 'app-fare-summary',
  templateUrl: './fare-summary.component.html',
  styleUrls: ['./fare-summary.component.scss']
})
export class FareSummaryComponent implements OnInit {
  @Input()
  totalFare:any;
  totalPassengers:number = 0;
  @Input() currency:any;
  //ToDo: enable userstate
  // ,private userState: UserStateService
  constructor(private trainSearch:TrainSearchService) { }

  ngOnInit() {
    this.totalPassengers = this.trainSearch.adultCount + this.trainSearch.childCount + this.trainSearch.infantCount;
    // this.userState.globelCurrency.subscribe(data=>{this.currency = data})
  }

}
