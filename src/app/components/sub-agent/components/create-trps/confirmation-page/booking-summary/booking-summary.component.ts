import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss']
})
export class BookingSummaryComponent implements OnInit {

  @Input() tripData:any;
  @Input() currency:any;
  @Input() travellers:any;

  constructor() { }

  ngOnInit() {
  }

}
