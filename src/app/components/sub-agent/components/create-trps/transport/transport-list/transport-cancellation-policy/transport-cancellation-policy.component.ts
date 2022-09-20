import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-transport-cancellation-policy',
  templateUrl: './transport-cancellation-policy.component.html',
  styleUrls: ['./transport-cancellation-policy.component.scss']
})
export class TransportCancellationPolicyComponent implements OnInit {

  @Input() policyData:any;
  @Input() currency:any;
  @Output() closePlolicy = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  close(){
    this.closePlolicy.emit();
  }

}
