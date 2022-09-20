import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-hotel-card',
  templateUrl: './payment-hotel-card.component.html',
  styleUrls: ['./payment-hotel-card.component.scss']
})
export class PaymentHotelCardComponent implements OnInit {

  @Input() tripData:any;
  @Input() travellers:any;
  @Input() currency:any;

  constructor() { }

  ngOnInit() {
  }

}
