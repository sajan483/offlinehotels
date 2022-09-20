import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubAgentDateTimeHelper } from 'src/app/components/sub-agent/helpers/date-time-helpers';
import { RouteList } from 'src/app/components/sub-agent/models/transportListModel';

@Component({
  selector: 'app-transport-search-window',
  templateUrl: './transport-search-window.component.html',
  styleUrls: ['./transport-search-window.component.scss']
})
export class TransportSearchWindowComponent implements OnInit {

  @Input() routeId:string;
  @Input() routeList:RouteList[] = [];
  minDate = new Date();
  @Input() startDate:any;
  @Input() vehicleCount:number;
  @Input() travelCount:number;
  @Output() postSearchData = new EventEmitter();
  @Input() bttnActive:boolean = false;

  constructor() { }

  ngOnInit() {
  }

  searchData(){
    let evt = {
      routeId:this.routeId,
      travelDate:this.startDate,
      quantity:this.vehicleCount,
      pax:this.travelCount
    }

    this.postSearchData.emit(evt);
  }

}
