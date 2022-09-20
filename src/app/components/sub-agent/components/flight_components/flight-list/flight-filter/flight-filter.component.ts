import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlightListFilter, FlightListFilterData } from '../../models/flight';


@Component({
  selector: 'app-flight-filter',
  templateUrl: './flight-filter.component.html',
  styleUrls: ['./flight-filter.component.scss'],
  animations: [
    trigger('expand', [
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('0.5s', style({ height: 0, opacity: 0 }))
      ]),
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.5s', style({ height: '*', opacity: 1 }))
      ])
    ]),
  ]
})
export class FlightFilterComponent implements OnInit {

  public showAirlineList: boolean[] = [] as boolean[];
  public showFilterPriceRange: boolean = true;
  public showFilterAirlines: boolean = true;
  public showMoreAirlines: boolean = true;
  public showMoreAircrafts: boolean = true;
  showMoreAirlinesOption: boolean = false;

  @Input() filteringData:FlightListFilterData;
  @Input() flightName:any;
  @Input() currency:any;
  @Input() valuePrice:number = 20000;
  @Input() aircraft:[];

  @Output() filterData:any = new EventEmitter();
  @Output() filterLists = new EventEmitter();
  @Output() resetFilter = new EventEmitter();

  airlines:any[] = []
  noOfItemsToShow: number = 4;

  constructor() { }

  ngOnInit() {
    this.airlines = this.filteringData.airlines;
    if (this.airlines.length > this.noOfItemsToShow) {
    this.showMoreAirlinesOption = true;
    } else {
    this.showMoreAirlinesOption = false;
    }

  }

  toggleFilterSections(section: string) {
    if (section == 'priceRange'){
      this.showFilterPriceRange = !this.showFilterPriceRange;

    }
    if (section == 'airlines'){
      this.showFilterAirlines = !this.showFilterAirlines;

    }

  }
  changePrice(){
    this.filterData.price = this.valuePrice;
    this.emitData();
  }
  selectAirline(){
    this.filteringData.airlines = this.airlines;
    this.emitData();
  }
  emitData() {
    this.filterData.emit(this.filterData)
  }

  moreAirlines() {
    this.showMoreAirlines = !this.showMoreAirlines;
  }

  moreAircrafts() {
    this.showMoreAircrafts = !this.showMoreAircrafts;
  }

  resetFilterDatas() {
    this.resetFilter.emit(this.resetFilter)
  }


  addAirLine(item, j) {

    if (this.airlines.length > 0) {

      this.airlines.forEach((el, idx) => {
          if (el == el  && idx == j) {
            el.touched= !el.touched;
          }

      })
    }
    this.filterData.airlines=this.airlines
    this.filterData.airlines.forEach(eachflight=>{console.log(eachflight.touched,eachflight.name);})
    this.emitData();

    // this.showResetButton();
  }







}
