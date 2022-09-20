import { Component, OnInit } from '@angular/core';
import { CreateTripComponent } from '../create-trip/create-trip.component';

@Component({
  selector: 'app-terms-condition-arabic',
  templateUrl: './terms-condition-arabic.component.html',
  styleUrls: ['./terms-condition-arabic.component.scss']
})
export class TermsConditionArabicComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  close(){
    CreateTripComponent.termsConditionArabic = false;
  }

}