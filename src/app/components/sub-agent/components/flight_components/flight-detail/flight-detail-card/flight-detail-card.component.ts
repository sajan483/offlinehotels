import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-detail-card',
  templateUrl: './flight-detail-card.component.html',
  styleUrls: ['./flight-detail-card.component.scss']
})
export class FlightDetailCardComponent implements OnInit {
  tripFlights: any = {"tripFlights": []};
  onwardflight: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
