import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-itinerary-hotel-card',
  templateUrl: './itinerary-hotel-card.component.html',
  styleUrls: ['./itinerary-hotel-card.component.scss']
})
export class ItineraryHotelCardComponent implements OnInit {

  @Input() hotel: any;
  @Input() currency: any;
  paxCount:number;
  roomCount:number;

  constructor() { }

  ngOnInit() {
    this.setInitialValue();
  }

  setInitialValue(){
    this.paxCount = 0;
    this.roomCount = 0;
    this.hotel.trip_hotel.rooms.forEach(room => {
      this.paxCount += room.adults;
      this.paxCount += room.children;
      this.roomCount += 1;
    })
  }

}
