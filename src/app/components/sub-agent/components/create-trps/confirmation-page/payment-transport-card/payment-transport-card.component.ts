import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-transport-card',
  templateUrl: './payment-transport-card.component.html',
  styleUrls: ['./payment-transport-card.component.scss']
})
export class PaymentTransportCardComponent implements OnInit {

  @Input() tripData:any;
  @Input() travellers:any;
  @Input() currency:any;

  constructor() { }

  ngOnInit() {
  }

}
