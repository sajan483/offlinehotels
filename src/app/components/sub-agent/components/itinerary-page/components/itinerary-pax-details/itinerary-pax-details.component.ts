import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-itinerary-pax-details',
  templateUrl: './itinerary-pax-details.component.html',
  styleUrls: ['./itinerary-pax-details.component.scss']
})
export class ItineraryPaxDetailsComponent implements OnInit {

  @Input() tripTravellers:any;

  constructor() { }

  ngOnInit() {
  }

}
