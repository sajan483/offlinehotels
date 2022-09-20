import { Injectable } from "@angular/core";
import { SubAgentModule } from "../../../module/sub-agent.module";
import { FlightListFilter } from "../models/flight";

@Injectable({
  providedIn: SubAgentModule
})
export class FlightFilterHelper {

  constructor() {}

  flightListFiltered(filterData:FlightListFilter,flightList:any):any[]{

    let flightChainFilter = [];
    let startFilter:any[] = [];
    let priceFilter = [];
    let airlineFilter = [];

    flightChainFilter = flightList
    if(filterData.price > 0){
      airlineFilter=flightList.filter(flight=>(flight[0].onwardFlight.o_net_fare+flight[0].onwardFlight.o_net_fare)<filterData.price)
      airlineFilter.forEach(eachflight=>{startFilter.push(eachflight);})
      flightList = startFilter;
    }

    if (filterData.airlines.length > 0) {
      filterData.airlines.forEach((el, idx) => {
        if (el.touched==true) {
          airlineFilter=flightList.filter(flight=>flight[0].onwardFlight.AirlineName.toLowerCase().split('|')[0].includes(el.name.toLowerCase().split('|')[0]));
          airlineFilter.forEach(eachflight=>{startFilter.push(eachflight);})
        }
      });
    }
    if (startFilter.length > 0) {
      flightChainFilter=startFilter
    }

    return flightChainFilter

  }

}
