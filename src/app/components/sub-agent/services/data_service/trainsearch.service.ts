import { Injectable } from "@angular/core";

@Injectable()
export class TrainSearchService {

  onward_date: any;
  return_date: any;
  trip_type:any;
  departure:any;
  arrival: any;
  adults: any = 0;
  childs: any = 0;
  infants: any =0;
  seat_class: any;
  search_code:any;

  constructor() { }


  set onwardDate(val){this.onward_date=val;}
  set returnDate(val){this.return_date=val;}
  set tripType(val){this.trip_type=val;}
  set departureCode(val){this.departure=val;}
  set arrivalCode(val){this.arrival=val;}
  set adultCount(val){this.adults=val;}
  set childCount(val){this.childs=val;}
  set infantCount(val){this.infants=val;}
  set seatClass(val){this.seat_class=val;}
  set searchCode(val){this.search_code=val;}


  get onwardDate(){ return this.onward_date};
  get returnDate(){ return this.return_date};
  get tripType(){ return this.trip_type};
  get departureCode(){ return this.departure};
  get arrivalCode(){ return this.arrival};
  get adultCount(){ return this.adults};
  get childCount(){ return this.childs};
  get infantCount(){ return this.infants};
  get seatClass(){ return this.seat_class};
  get searchCode(){ return this.search_code};

}
