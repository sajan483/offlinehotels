import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-passenger-details',
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.scss']
})
export class PassengerDetailsComponent implements OnInit {
  @Output('editPax') editPax = new EventEmitter();
  @Input() appForm: FormGroup;
  @Input() paxIndex: number;
  passenger:any;

  constructor() { }

  ngOnInit() {
    this.passenger = this.appForm.controls["Pax"].value[this.paxIndex];
  }


  onEditPax() {
    this.editPax.emit();
  }

}
