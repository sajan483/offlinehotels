import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-itinerary-fare-summary',
  templateUrl: './itinerary-fare-summary.component.html',
  styleUrls: ['./itinerary-fare-summary.component.scss']
})
export class ItineraryFareSummaryComponent implements OnInit {

  @Input() tripData: any;
  @Input() currency: any;

  constructor() { }

  ngOnInit() {
  }

}
