import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-itinerary-transport-card',
  templateUrl: './itinerary-transport-card.component.html',
  styleUrls: ['./itinerary-transport-card.component.scss']
})
export class ItineraryTransportCardComponent implements OnInit {

  @Input() tripTransport: any;
  @Input() currency: any;
  selectedTransport:any;

  constructor() { }

  ngOnInit() {
    console.log(this.tripTransport);
    
    this.selectedTransport = this.tripTransport.trip_transportation.selected_transportation;
  }

}
