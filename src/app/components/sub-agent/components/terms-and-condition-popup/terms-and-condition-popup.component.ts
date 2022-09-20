import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-terms-and-condition-popup',
  templateUrl: './terms-and-condition-popup.component.html',
  styleUrls: ['./terms-and-condition-popup.component.scss']
})
export class TermsAndConditionPopupComponent implements OnInit {

  @Output() closePopUp = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  close(){
    this.closePopUp.emit();
  }

}
