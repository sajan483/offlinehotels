import { Component, OnInit } from '@angular/core';
import { CreateTripComponent } from '../create-trip/create-trip.component';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.scss']
})
export class TermsAndConditionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  close(){
    CreateTripComponent.termsCondtion = false;
  }
}
