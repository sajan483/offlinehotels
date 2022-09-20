import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-refund-policy-bar',
  templateUrl: './refund-policy-bar.component.html',
  styleUrls: ['./refund-policy-bar.component.scss']
})
export class RefundPolicyBarComponent implements OnInit {

  @Input() barData = [];
  @Input() currency:any;
  @Input() isHotel:boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
