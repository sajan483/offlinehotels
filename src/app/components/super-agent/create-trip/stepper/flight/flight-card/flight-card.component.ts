import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HelperService } from 'src/app/common/services/helper-service';
import { FlightComponent } from '../flight.component';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss']
})

export class FlightCardComponent implements OnInit {
  currency: string;



  constructor(private flight:FlightComponent,private helper:HelperService) { }

  @Output() footerFlagEmitter = new EventEmitter();
  @Output() footerDataEmitter = new EventEmitter();
  @Input() searchResult:any;
  footerFlag:string='false';
  footerData={
    depFlight:'',
    retFlight:''
  }


  ngOnInit() {
    this.currency = sessionStorage.getItem('currency')
  }

  currencyConversion(amount){
    return this.helper.priceConversion(amount);
  }

  setDepFlight(item, i){
    this.footerFlag='true'
    this.searchResult.departureFlights.forEach((element,j) => {(j == i) ? element.isTouched = true:element.isTouched = false});
    this.searchResult.departureFlights.forEach((element,h) => {document.getElementById('depCard'+h).style.background="#ffffff"});
    this.searchResult.departureFlights.forEach((element) => {if(element.isTouched) {document.getElementById('depCard'+i).style.background="#ddedfd"}});
    this.footerFlagEmitter.emit(this.footerFlag);
    this.footerData.depFlight = item;
    this.footerDataEmitter.emit(this.footerData);
  }
  
  setArrFlight(item, i){
    this.footerFlag='true'
    this.searchResult.returnFlights.forEach((element,j) => {(j == i) ? element.isTouched = true:element.isTouched = false});
    this.searchResult.returnFlights.forEach((element,h) => {document.getElementById('arrCard'+h).style.background="#ffffff"});
    this.searchResult.returnFlights.forEach((element) => {if(element.isTouched) {document.getElementById('arrCard'+i).style.background="#ddedfd"}});
    this.footerFlagEmitter.emit(this.footerFlag);
    this.footerData.retFlight = item;
    this.footerDataEmitter.emit(this.footerData);
  }

  toggleDetails(item, event, e) {
    var element = event.target;
    element.classList.toggle("active");
    if(item.isActive) {
      item.isActive = false;
    } else {
      item.isActive = true;
    }      
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

}
